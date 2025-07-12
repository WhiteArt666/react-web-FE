import Groq from 'groq-sdk';

// Khởi tạo Groq client với API key
const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ_API_KEY as string,
  dangerouslyAllowBrowser: true // Chỉ dùng cho demo, không nên dùng trong production
});

export interface UserBehavior {
  viewedCourses: string[];
  favoriteCourses: string[];
  completedCourses: string[];
  searchHistory: string[];
  preferences: string[];
}

export interface AICourseSuggestion {
  courseId: string;
  title: string;
  category: string;
  level: string;
  reason: string;
  confidence: number;
  tags: string[];
}

export const groqService = {
  // Tạo prompt cho AI dựa trên hành vi người dùng
  generateUserContext: (behavior: UserBehavior, availableCourses: any[]) => {
    const coursesContext = availableCourses.map(course => ({
      id: course.id,
      title: course.title,
      category: course.category,
      level: course.level,
      tags: course.tags,
      rating: course.rating,
      reviewCount: course.reviewCount,
      description: course.description,
      isPopular: course.isPopular
    }));

    const userProfile = `
Thông tin người dùng:
- Khóa học đã xem: ${behavior.viewedCourses.length > 0 ? behavior.viewedCourses.join(', ') : 'Chưa xem khóa học nào'}
- Khóa học yêu thích: ${behavior.favoriteCourses.length > 0 ? behavior.favoriteCourses.join(', ') : 'Chưa có yêu thích'}
- Khóa học đã hoàn thành: ${behavior.completedCourses.length > 0 ? behavior.completedCourses.join(', ') : 'Chưa hoàn thành khóa học nào'}
- Lịch sử tìm kiếm: ${behavior.searchHistory.length > 0 ? behavior.searchHistory.join(', ') : 'Chưa có tìm kiếm'}
- Sở thích: ${behavior.preferences.join(', ')}
`;

    const instructions = behavior.viewedCourses.length === 0 && behavior.favoriteCourses.length === 0 
      ? `
Đây là người dùng mới. Hãy gợi ý 5 khóa học phổ biến và đa dạng từ các lĩnh vực khác nhau để giúp họ khám phá.
Ưu tiên các khóa học có rating cao, review nhiều, và phù hợp cho người mới bắt đầu.
Giải thích tại sao nên học khóa học đó và lợi ích mang lại.`
      : `
Dựa trên hành vi học tập của người dùng, hãy gợi ý 5 khóa học phù hợp nhất.
Ưu tiên các khóa học liên quan đến sở thích và lĩnh vực đã quan tâm.
Giải thích cụ thể tại sao khóa học phù hợp và giúp phát triển kỹ năng như thế nào.`;

    return `
${userProfile}

${instructions}

Danh sách khóa học có sẵn:
${JSON.stringify(coursesContext, null, 2)}

YÊU CẦU QUAN TRỌNG:
1. CHỈ sử dụng courseId từ danh sách khóa học có sẵn ở trên (id field)
2. Trả về chính xác 5 khóa học từ danh sách
3. Mỗi lý do gợi ý phải chi tiết, thuyết phục, giải thích lợi ích cụ thể
4. Đa dạng về lĩnh vực và cấp độ
5. Ưu tiên khóa học có rating và review tốt
6. CHỈ trả về JSON array, KHÔNG thêm text giải thích

Trả về kết quả dưới dạng JSON array với format chính xác:
[
  {
    "courseId": "id_chính_xác_từ_danh_sách_trên",
    "title": "tên khóa học",
    "category": "danh mục",
    "level": "cấp độ",
    "reason": "Lý do chi tiết tại sao nên học khóa học này, lợi ích mang lại, và phù hợp như thế nào",
    "confidence": 0.9,
    "tags": ["tag1", "tag2"]
  }
]
`;
  },

  // Gọi Groq AI để lấy gợi ý
  getAICourseSuggestions: async (behavior: UserBehavior, availableCourses: any[]): Promise<AICourseSuggestion[]> => {
    try {
      const prompt = groqService.generateUserContext(behavior, availableCourses);
      
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Bạn là một AI chuyên gia giáo dục, giúp gợi ý khóa học phù hợp cho người học. QUAN TRỌNG: Chỉ trả về JSON array hợp lệ, không thêm bất kỳ text giải thích nào. Response phải bắt đầu bằng [ và kết thúc bằng ]."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 1500
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        console.log('Không nhận được phản hồi từ AI, sử dụng fallback');
        return groqService.getFallbackSuggestions(behavior, availableCourses);
      }

      console.log('🤖 Raw AI Response:', response);

      try {
        // Extract JSON từ response (có thể có text thêm)
        let jsonStr = response;
        
        // Tìm JSON array trong response
        const jsonStart = response.indexOf('[');
        const jsonEnd = response.lastIndexOf(']');
        
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          jsonStr = response.substring(jsonStart, jsonEnd + 1);
          console.log('📋 Extracted JSON:', jsonStr);
        }
        
        // Thử parse JSON response
        const suggestions = JSON.parse(jsonStr);
        
        // Validate format và kiểm tra course IDs có tồn tại
        if (Array.isArray(suggestions) && suggestions.length > 0) {
          const availableCourseIds = availableCourses.map(c => c.id);
          
          const validSuggestions = suggestions
            .filter(s => s.courseId && s.title && s.reason)
            .map(s => {
              // Kiểm tra courseId có tồn tại trong availableCourses không
              const courseExists = availableCourseIds.includes(s.courseId);
              if (!courseExists) {
                console.log(`⚠️ Course ID ${s.courseId} không tồn tại, tìm course tương tự...`);
                // Tìm course tương tự based on title hoặc category
                const similarCourse = availableCourses.find(c => 
                  c.title.toLowerCase().includes(s.title.toLowerCase().split(' ')[0]) ||
                  c.category.toLowerCase() === s.category.toLowerCase()
                );
                if (similarCourse) {
                  console.log(`✅ Mapped to existing course: ${similarCourse.id}`);
                  return {
                    courseId: similarCourse.id,
                    title: similarCourse.title,
                    category: similarCourse.category,
                    level: similarCourse.level,
                    reason: s.reason,
                    confidence: s.confidence || 0.8,
                    tags: s.tags || []
                  };
                }
                return null; // Skip invalid course
              }
              
              return {
                courseId: s.courseId,
                title: s.title,
                category: s.category,
                level: s.level,
                reason: s.reason,
                confidence: s.confidence || 0.8,
                tags: s.tags || []
              };
            })
            .filter((item): item is AICourseSuggestion => item !== null) // Remove null entries and fix typing
            .slice(0, 5);
          
          if (validSuggestions.length > 0) {
            console.log('✅ Valid AI suggestions:', validSuggestions.length);
            return validSuggestions;
          }
        }
        
        console.log('⚠️ AI response format không hợp lệ, sử dụng fallback');
        return groqService.getFallbackSuggestions(behavior, availableCourses);
        
      } catch (parseError) {
        console.log('❌ Lỗi parse JSON từ AI:', parseError);
        console.log('🔍 AI Response sample:', response.substring(0, 500));
        return groqService.getFallbackSuggestions(behavior, availableCourses);
      }
      
    } catch (error) {
      console.error('Lỗi khi gọi Groq AI:', error);
      // Fallback với gợi ý mặc định
      return groqService.getFallbackSuggestions(behavior, availableCourses);
    }
  },

  // Gợi ý dự phòng khi AI không hoạt động
  getFallbackSuggestions: (behavior: UserBehavior, availableCourses: any[]): AICourseSuggestion[] => {
    const suggestions: AICourseSuggestion[] = [];
    
    console.log('🔄 Generating fallback suggestions...');
    console.log('User behavior summary:', {
      viewed: behavior.viewedCourses.length,
      favorites: behavior.favoriteCourses.length,
      searches: behavior.searchHistory.length
    });
    
    // Nếu người dùng mới (chưa có hành vi), gợi ý khóa học phổ biến
    if (behavior.viewedCourses.length === 0 && behavior.favoriteCourses.length === 0) {
      console.log('New user detected, recommending popular courses');
      // Gợi ý khóa học phổ biến và đa dạng category
      const popularCourses = availableCourses
        .filter(course => course.isPopular || course.rating >= 4.5)
        .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
        .slice(0, 5);
      
      return popularCourses.map((course, index) => ({
        courseId: course.id,
        title: course.title,
        category: course.category,
        level: course.level,
        reason: `Khóa học ${course.category} phổ biến với ${course.reviewCount} đánh giá tích cực (${course.rating}★). Hoàn hảo để bắt đầu hành trình học tập!`,
        confidence: 0.85 - (index * 0.05),
        tags: course.tags
      }));
    }
    
    // Logic gợi ý dựa trên hành vi
    availableCourses.forEach(course => {
      let confidence = 0.4; // Giảm ngưỡng cơ bản
      let reason = "Khóa học chất lượng cao";

      // Tăng confidence nếu có liên quan đến sở thích
      if (behavior.preferences.some(pref => 
        course.category.toLowerCase().includes(pref.toLowerCase()) ||
        course.tags.some((tag: string) => tag.toLowerCase().includes(pref.toLowerCase()))
      )) {
        confidence += 0.3;
        reason = `Phù hợp với sở thích ${behavior.preferences.join(', ')} của bạn`;
      }

      // Tăng confidence nếu cùng category với khóa học yêu thích
      if (behavior.favoriteCourses.length > 0) {
        const favoriteCategories = behavior.favoriteCourses.map(id => 
          availableCourses.find(c => c.id === id)?.category
        ).filter(Boolean);
        
        if (favoriteCategories.includes(course.category)) {
          confidence += 0.3;
          reason = `Cùng lĩnh vực ${course.category} với khóa học bạn yêu thích. Sẽ giúp bạn mở rộng kiến thức!`;
        }
      }

      // Tăng confidence nếu cùng category với khóa học đã xem
      if (behavior.viewedCourses.length > 0) {
        const viewedCategories = behavior.viewedCourses.map(id => 
          availableCourses.find(c => c.id === id)?.category
        ).filter(Boolean);
        
        if (viewedCategories.includes(course.category)) {
          confidence += 0.2;
          reason = `Dựa trên lịch sử xem khóa học ${course.category}, đây là bước tiếp theo hoàn hảo!`;
        }
      }

      // Ưu tiên khóa học phổ biến
      if (course.isPopular) {
        confidence += 0.1;
      }

      // Ưu tiên khóa học có rating cao
      if (course.rating >= 4.7) {
        confidence += 0.1;
      }

      // Thêm tất cả khóa học có confidence >= 0.4 (thay vì 0.6)
      if (confidence >= 0.4) {
        suggestions.push({
          courseId: course.id,
          title: course.title,
          category: course.category,
          level: course.level,
          reason,
          confidence,
          tags: course.tags
        });
      }
    });

    // Nếu vẫn không có gợi ý nào, lấy top 5 khóa học phổ biến
    if (suggestions.length === 0) {
      const topCourses = availableCourses
        .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
        .slice(0, 5);
      
      return topCourses.map(course => ({
        courseId: course.id,
        title: course.title,
        category: course.category,
        level: course.level,
        reason: `Khóa học ${course.category} được đánh giá cao với ${course.rating}★. Hoàn hảo để khám phá lĩnh vực mới!`,
        confidence: 0.7,
        tags: course.tags
      }));
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  },

  // Chat completion cho chatbot
  chatCompletion: async (prompt: string): Promise<string> => {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Bạn là một AI assistant chuyên tư vấn khóa học trực tuyến. Hãy trả lời một cách thân thiện, chuyên nghiệp và hữu ích."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 500
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error in chat completion:', error);
      throw error;
    }
  }
};
