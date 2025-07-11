import { useState, useCallback } from 'react';
import { groqService, UserBehavior, AICourseSuggestion } from '../services/groqService';
import { AIRecommendation } from '../types';
import { useCourses } from './useCourses';

// Helper function để lấy hành vi người dùng
const getUserBehavior = (userId: string): UserBehavior => {
  const key = `user_behavior_${userId}`;
  const stored = localStorage.getItem(key);
  
  if (stored) {
    const behavior = JSON.parse(stored);
    console.log('🔍 User behavior data found:', behavior);
    return behavior;
  }
  
  console.log('⚠️ No user behavior data found, using defaults');
  // Hành vi mặc định
  return {
    viewedCourses: [],
    favoriteCourses: [],
    completedCourses: [],
    searchHistory: [],
    preferences: ['Programming', 'Design'], // Mặc định
  };
};

// Helper function để tạo gợi ý nâng cao khi AI không hoạt động
const getEnhancedFallbackRecommendations = (userBehavior: UserBehavior, courses: any[]): AIRecommendation[] => {
  console.log('🔄 Creating enhanced fallback recommendations');
  console.log('📚 Available courses:', courses.length);
  console.log('👤 User behavior:', {
    favorites: userBehavior.favoriteCourses,
    viewed: userBehavior.viewedCourses
  });
  
  // Nếu người dùng có dữ liệu hành vi, ưu tiên dựa vào đó
  if (userBehavior.favoriteCourses.length > 0 || userBehavior.viewedCourses.length > 0) {
    const userCourseIds = [...userBehavior.favoriteCourses, ...userBehavior.viewedCourses];
    const userCategories = userCourseIds
      .map(id => {
        const course = courses.find(c => c.id === id);
        console.log(`Looking for course ID ${id}:`, course?.title, course?.category);
        return course?.category;
      })
      .filter(Boolean);
    
    console.log('📂 User interested categories:', userCategories);
    
    // Lấy khóa học cùng category với những gì user đã quan tâm
    const relatedCourses = courses.filter(course => {
      const isRelated = userCategories.includes(course.category);
      const notAlreadyViewed = !userCourseIds.includes(course.id);
      const goodRating = course.rating >= 4.0;
      
      if (isRelated && notAlreadyViewed && goodRating) {
        console.log(`✅ Found related course: ${course.title} (${course.category})`);
      }
      
      return isRelated && notAlreadyViewed && goodRating;
    });
    
    console.log('🔗 Related courses found:', relatedCourses.length);
    
    if (relatedCourses.length >= 1) { // Giảm từ 3 xuống 1
      const recommendations = relatedCourses.slice(0, 5).map((course, index) => ({
        courseId: course.id,
        score: 0.85 - (index * 0.05),
        reason: `Dựa trên sở thích ${course.category} của bạn, khóa học "${course.title}" sẽ giúp mở rộng kiến thức với ${course.rating}★ từ ${course.reviewCount} đánh giá. Đây là bước tiếp theo hoàn hảo trong hành trình học tập!`,
        tags: course.tags,
      }));
      
      // Nếu chưa đủ 5, bổ sung thêm từ popular courses
      if (recommendations.length < 5) {
        const popularCourses = courses
          .filter(c => (c.isPopular || c.rating >= 4.5) && !recommendations.some(r => r.courseId === c.id))
          .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
          .slice(0, 5 - recommendations.length);
        
        const additionalRecs = popularCourses.map((course, index) => ({
          courseId: course.id,
          score: 0.75 - (index * 0.05),
          reason: `Khóa học "${course.title}" được đánh giá cao với ${course.rating}★ từ ${course.reviewCount} học viên. Khóa học chất lượng cao để mở rộng kiến thức của bạn!`,
          tags: course.tags,
        }));
        
        recommendations.push(...additionalRecs);
      }
      
      console.log('📝 Created hybrid recommendations:', recommendations.length);
      return recommendations;
    }
  }
  
  // Fallback với khóa học phổ biến
  console.log('🌟 Using popular courses fallback');
  let popularCourses = courses
    .filter(c => c.isPopular || c.rating >= 4.5);
  
  // Nếu không đủ khóa học với tiêu chí cao, giảm tiêu chí
  if (popularCourses.length < 5) {
    console.log('📉 Not enough high-rated courses, lowering criteria');
    popularCourses = courses
      .filter(c => c.isPopular || c.rating >= 4.0);
  }
  
  // Nếu vẫn không đủ, lấy tất cả
  if (popularCourses.length < 5) {
    console.log('📉 Still not enough, taking all available courses');
    popularCourses = courses.slice(0, 10); // Lấy 10 khóa học đầu tiên
  }
  
  popularCourses = popularCourses
    .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
    .slice(0, 5);
  
  console.log('🏆 Selected popular courses:', popularCourses.map(c => `${c.title} (${c.rating}★)`));
  
  const recommendations = popularCourses.map((course, index) => ({
    courseId: course.id,
    score: 0.8 - (index * 0.05),
    reason: `Khóa học "${course.title}" trong lĩnh vực ${course.category} được đánh giá cao với ${course.rating}★ từ ${course.reviewCount} học viên. ${course.isPopular ? 'Đây là khóa học phổ biến nhất' : 'Khóa học chất lượng cao'} và là lựa chọn tuyệt vời để bắt đầu hành trình học tập!`,
    tags: course.tags,
  }));
  
  console.log('✨ Final recommendations created:', recommendations.length);
  return recommendations;
};

export const useAIRecommendations = (userId: string) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { courses } = useCourses();

  const fetchRecommendations = useCallback(async () => {
    if (!userId) {
      setError('Cần đăng nhập để nhận gợi ý');
      return;
    }

    console.log('🚀 Fetching AI recommendations for user:', userId);
    setLoading(true);
    setError(null);

    try {
      // Lấy hành vi người dùng
      const userBehavior = getUserBehavior(userId);
      console.log('📊 User behavior summary:', {
        viewedCount: userBehavior.viewedCourses.length,
        favoriteCount: userBehavior.favoriteCourses.length,
        searchCount: userBehavior.searchHistory.length,
        preferences: userBehavior.preferences
      });
      
      // Gọi Groq AI để lấy gợi ý
      const aiSuggestions = await groqService.getAICourseSuggestions(userBehavior, courses);
      
      // Chuyển đổi sang format AIRecommendation
      const formattedRecommendations: AIRecommendation[] = aiSuggestions.map(suggestion => ({
        courseId: suggestion.courseId,
        score: suggestion.confidence,
        reason: suggestion.reason,
        tags: suggestion.tags,
      }));
      
      console.log('✅ AI suggestions received:', formattedRecommendations.length);
      
      // Đảm bảo luôn có ít nhất 1 gợi ý
      if (formattedRecommendations.length === 0) {
        console.log('📈 Using enhanced fallback recommendations');
        // Fallback: lấy top khóa học phổ biến với logic thông minh hơn
        const enhancedRecommendations = getEnhancedFallbackRecommendations(userBehavior, courses);
        setRecommendations(enhancedRecommendations);
      } else {
        console.log('🎯 Using AI recommendations:', formattedRecommendations.length);
        setRecommendations(formattedRecommendations);
      }
      
    } catch (err) {
      console.error('Lỗi khi lấy gợi ý AI:', err);
      setError('Đã có lỗi xảy ra, nhưng vẫn có thể xem gợi ý dự phòng bên dưới.');
      
      // Lấy lại user behavior để tạo fallback recommendations
      const fallbackUserBehavior = getUserBehavior(userId);
      const enhancedRecommendations = getEnhancedFallbackRecommendations(fallbackUserBehavior, courses);
      setRecommendations(enhancedRecommendations);
    } finally {
      setLoading(false);
    }
  }, [userId, courses]);

  const refetch = useCallback(() => {
    return fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    recommendations,
    loading,
    error,
    refetch
  };
};