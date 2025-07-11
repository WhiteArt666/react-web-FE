import { resolve } from 'path';
import { Course, SearchFilters, ApiResponse, AIRecommendation } from '../types';
import { groqService, UserBehavior } from './groqService';


// API_BASE_URL for future use when connecting to real backend
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Mock data cho demo
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React và TypeScript từ cơ bản đến nâng cao',
    description: 'Học React và TypeScript từ những khái niệm cơ bản đến các kỹ thuật nâng cao',
    instructor: 'Nguyễn Văn A',
    duration: 1200,
    level: 'intermediate',
    category: 'Programming',
    price: 599000,
    originalPrice: 999000,
    rating: 4.8,
    reviewCount: 1250,
    thumbnail: '/images/courses/20250212_BWEjSujucS.jpeg',
    isPopular: true,
    isFavorite: false,
    tags: ['React', 'TypeScript', 'Frontend', 'JavaScript'],
    createdAt: '2024-01-15',
    updatedAt: '2024-06-20',
  },
  {
    id: '2',
    title: 'Machine Learning cho người mới bắt đầu',
    description: 'Khóa học Machine Learning dành cho người mới bắt đầu với Python',
    instructor: 'Trần Thị B',
    duration: 1800,
    level: 'beginner',
    category: 'Data Science',
    price: 799000,
    originalPrice: 1299000,
    rating: 4.9,
    reviewCount: 890,
    thumbnail: '/images/courses/20250212_BWEjSujucS.jpeg',
    isPopular: true,
    isFavorite: false,
    tags: ['Machine Learning', 'Python', 'AI', 'Data Science'],
    createdAt: '2024-02-10',
    updatedAt: '2024-06-15',
  },
  {
    id: '3',
    title: 'UI/UX Design với Figma',
    description: 'Thiết kế giao diện người dùng chuyên nghiệp với Figma',
    instructor: 'Lê Văn C',
    duration: 900,
    level: 'beginner',
    category: 'Design',
    price: 449000,
    originalPrice: 699000,
    rating: 4.7,
    reviewCount: 567,
    thumbnail: '/images/courses/20250212_BWEjSujucS.jpeg',
    isPopular: false,
    isFavorite: false,
    tags: ['UI/UX', 'Figma', 'Design', 'Prototype'],
    createdAt: '2024-03-05',
    updatedAt: '2024-06-10',
  },
  {
    id: '4',
    title: 'JavaScript ES6+ và Modern Development',
    description: 'Học JavaScript hiện đại với ES6+, async/await, và các kỹ thuật lập trình tiên tiến',
    instructor: 'Phạm Văn D',
    duration: 1000,
    level: 'intermediate',
    category: 'Programming',
    price: 549000,
    originalPrice: 849000,
    rating: 4.6,
    reviewCount: 743,
    thumbnail: '/images/courses/20250212_BWEjSujucS.jpeg',
    isPopular: false,
    isFavorite: false,
    tags: ['JavaScript', 'ES6+', 'Frontend', 'Modern JS'],
    createdAt: '2024-04-01',
    updatedAt: '2024-06-25',
  },
  {
    id: '5',
    title: 'Digital Marketing và SEO toàn diện',
    description: 'Khóa học marketing số và SEO từ cơ bản đến nâng cao',
    instructor: 'Nguyễn Thị E',
    duration: 1400,
    level: 'beginner',
    category: 'Marketing',
    price: 699000,
    originalPrice: 1099000,
    rating: 4.5,
    reviewCount: 456,
    thumbnail: '/images/courses/20250212_BWEjSujucS.jpeg',
    isPopular: true,
    isFavorite: false,
    tags: ['Digital Marketing', 'SEO', 'SEM', 'Google Ads'],
    createdAt: '2024-04-20',
    updatedAt: '2024-06-18',
  },
  {
    id: '6',
    title: 'Quản lý kinh doanh và lãnh đạo',
    description: 'Phát triển kỹ năng lãnh đạo và quản lý kinh doanh hiệu quả',
    instructor: 'Lê Minh F',
    duration: 1100,
    level: 'advanced',
    category: 'Business',
    price: 899000,
    originalPrice: 1399000,
    rating: 4.8,
    reviewCount: 321,
    thumbnail: '/images/courses/20250212_BWEjSujucS.jpeg',
    isPopular: false,
    isFavorite: false,
    tags: ['Management', 'Leadership', 'Business Strategy', 'Team Building'],
    createdAt: '2024-05-05',
    updatedAt: '2024-06-22',
  },
  {
    id: '7',
    title: 'Cloud Computing và AWS',
    description: 'Học cách triển khai ứng dụng lên AWS và các dịch vụ cloud computing',
    instructor: 'Phạm Văn G',
    duration: 1600,
    level: 'intermediate',
    category: 'Technology',
    price: 1299000,
    originalPrice: 1899000,
    rating: 4.7,
    reviewCount: 456,
    thumbnail: '/images/courses/20250212_BWEjSujucS.jpeg',
    isPopular: false,
    isFavorite: false,
    tags: ['AWS', 'Cloud Computing', 'DevOps', 'Infrastructure'],
    createdAt: '2024-03-15',
    updatedAt: '2024-06-10',
  },
  {
    id: '8',
    title: 'Cybersecurity và An toàn thông tin',
    description: 'Tìm hiểu về bảo mật mạng, phòng chống tấn công và an toàn thông tin',
    instructor: 'Nguyễn Thị H',
    duration: 1400,
    level: 'advanced',
    category: 'Technology',
    price: 1599000,
    originalPrice: 2199000,
    rating: 4.9,
    reviewCount: 234,
    thumbnail: '/images/courses/20250212_BWEjSujucS.jpeg',
    isPopular: true,
    isFavorite: false,
    tags: ['Cybersecurity', 'Network Security', 'Ethical Hacking', 'IT Security'],
    createdAt: '2024-04-01',
    updatedAt: '2024-06-25',
  },
];

export const courseService = {

  // gợi ý khóa học AI
  getAIRecommendations : async (userId: string): Promise<ApiResponse<AIRecommendation[]>> => {
    await new Promise(resolve => setTimeout(resolve,800));
    try {
      // lay hanh vi nguoi dung tuong ung voi userId
      const userBehavior = getUserBehaviorById(userId);

      // goi groq de lay goi y 
      const aiSuggestions = await groqService.getAICourseSuggestions(userBehavior, mockCourses);

      // Chuyển đổi kết quả thành định dạng API response
      const recommendations: AIRecommendation[] = aiSuggestions.map(suggestion => ({
        courseId: suggestion.courseId,
        score: suggestion.confidence,
        reason: suggestion.reason,
        tags: suggestion.tags,
      }));
      return{
        data: recommendations,
        success: true,
      }
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);

      //fallback nếu có lỗi
      const recommendations: AIRecommendation[] =[
        {
           courseId: '1',
          score: 0.95,
          reason: 'Phù hợp với sở thích lập trình và level trung cấp của bạn',
          tags: ['React', 'TypeScript', 'Frontend'],
        },
        {
          courseId: '2',
          score: 0.87,
          reason: 'Dựa trên xu hướng học tập của người dùng tương tự',
          tags: ['Machine Learning', 'Python', 'AI'],
        },
      ]
      return {
       data: recommendations,
        success: true,
        message: 'Failed to fetch AI recommendations',
      };
    }
  },
 //luu hanh vi nguoi dung
   // Lưu hành vi người dùng
  saveUserBehavior: (userId: string, action: string, courseId: string) => {
    const key = `user_behavior_${userId}`;
    const stored = localStorage.getItem(key);
    let behavior: UserBehavior;
    
    if (stored) {
      behavior = JSON.parse(stored);
    } else {
      behavior = {
        viewedCourses: [],
        favoriteCourses: [],
        completedCourses: [],
        searchHistory: [],
        preferences: ['Programming', 'Design'],
      };
    }
    
    switch (action) {
      case 'view':
        if (!behavior.viewedCourses.includes(courseId)) {
          behavior.viewedCourses.push(courseId);
          // Giới hạn 50 khóa học gần nhất
          if (behavior.viewedCourses.length > 50) {
            behavior.viewedCourses = behavior.viewedCourses.slice(-50);
          }
        }
        break;
      case 'favorite':
        if (!behavior.favoriteCourses.includes(courseId)) {
          behavior.favoriteCourses.push(courseId);
        }
        break;
      case 'unfavorite':
        behavior.favoriteCourses = behavior.favoriteCourses.filter((id: string) => id !== courseId);
        break;
      case 'search':
        // Lưu từ khóa tìm kiếm (courseId trong trường hợp này là search term)
        const searchTerm = courseId; // courseId actually contains the search term
        if (!behavior.searchHistory.includes(searchTerm)) {
          behavior.searchHistory.push(searchTerm);
          // Giới hạn 20 tìm kiếm gần nhất
          if (behavior.searchHistory.length > 20) {
            behavior.searchHistory = behavior.searchHistory.slice(-20);
          }
        }
        break;
    }
    
    localStorage.setItem(key, JSON.stringify(behavior));
  },
  
  // Tìm kiếm khóa học
  searchCourses: async (filters: SearchFilters): Promise<ApiResponse<Course[]>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredCourses = [...mockCourses];
    
    // Filter by query
    if (filters.query) {
      filteredCourses = filteredCourses.filter(course =>
        course.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        course.description.toLowerCase().includes(filters.query.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(filters.query.toLowerCase()))
      );
    }
    
    // Filter by category
    if (filters.category) {
      filteredCourses = filteredCourses.filter(course => 
        course.category === filters.category
      );
    }
    
    // Filter by level
    if (filters.level && filters.level.length > 0) {
      filteredCourses = filteredCourses.filter(course => 
        filters.level!.includes(course.level)
      );
    }
    
    // Filter by price range
    if (filters.priceRange) {
      filteredCourses = filteredCourses.filter(course => 
        course.price >= filters.priceRange![0] && 
        course.price <= filters.priceRange![1]
      );
    }
    
    // Filter by rating
    if (filters.rating) {
      filteredCourses = filteredCourses.filter(course => 
        course.rating >= filters.rating!
      );
    }
    
    // Sort results
    switch (filters.sortBy) {
      case 'price_low':
        filteredCourses.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filteredCourses.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredCourses.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filteredCourses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        filteredCourses.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        // relevance - keep original order
        break;
    }
    
    return {
      data: filteredCourses,
      success: true,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: filteredCourses.length,
        itemsPerPage: 20,
      },
    };
  },

  // Lấy chi tiết khóa học
  getCourseById: async (id: string): Promise<ApiResponse<Course>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const course = mockCourses.find(c => c.id === id);
    if (!course) {
      return {
        data: {} as Course,
        success: false,
        message: 'Course not found',
      };
    }
    
    return {
      data: course,
      success: true,
    };
  },

  // Lấy tất cả khóa học
  getAllCourses: async (): Promise<ApiResponse<Course[]>> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      data: mockCourses,
      success: true,
    };
  },

  // Lấy khóa học phổ biến
  getPopularCourses: async (): Promise<ApiResponse<Course[]>> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const popularCourses = mockCourses.filter(course => course.isPopular);
    
    return {
      data: popularCourses,
      success: true,
    };
  },

};
//helper function to get user behavior by ID
function getUserBehaviorById(userId: string): UserBehavior {
  const key = `user_behavior_${userId}`;
  const stored = localStorage.getItem(key);
  if(stored) {
    return JSON.parse(stored);
  }

  //hanh vi mac dinh neu khong co trong localStorage
  return{
    viewedCourses: [],
    favoriteCourses: [],
    completedCourses: [],
    preferences: ['Programming', 'Design'],
    searchHistory: [],
  }
}

