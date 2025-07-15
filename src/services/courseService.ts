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
    thumbnail: '/images/courses/ai3.jpg',
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
    thumbnail: '/images/courses/ai9.jpg',
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
    thumbnail: '/images/courses/ai8.jpg',
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
    thumbnail: '/images/courses/ai2.jpg',
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
    thumbnail: '/images/courses/ai8.jpg',
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
    thumbnail: '/images/courses/ai8.jpg',
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
    thumbnail: '/images/courses/ai3.jpg',
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
    thumbnail: '/images/courses/ai5.jpg',
    isPopular: true,
    isFavorite: false,
    tags: ['Cybersecurity', 'Network Security', 'Ethical Hacking', 'IT Security'],
    createdAt: '2024-04-01',
    updatedAt: '2024-06-25',
  },
  {
    id: '9',
    title: 'Python cơ bản cho người mới bắt đầu',
    description: 'Học lập trình Python từ zero, phù hợp cho người chưa có kinh nghiệm',
    instructor: 'Trần Văn I',
    duration: 800,
    level: 'beginner',
    category: 'Programming',
    price: 399000,
    originalPrice: 599000,
    rating: 4.6,
    reviewCount: 892,
    thumbnail: '/images/courses/ai4.jpg',
    isPopular: true,
    isFavorite: false,
    tags: ['Python', 'Programming', 'Beginner', 'Data Types'],
    createdAt: '2024-01-20',
    updatedAt: '2024-06-15',
  },
  {
    id: '10',
    title: 'Python nâng cao và OOP',
    description: 'Lập trình hướng đối tượng và các kỹ thuật nâng cao trong Python',
    instructor: 'Trần Văn I',
    duration: 1200,
    level: 'advanced',
    category: 'Programming',
    price: 699000,
    originalPrice: 999000,
    rating: 4.8,
    reviewCount: 543,
    thumbnail: '/images/courses/AI1.jpg',
    isPopular: false,
    isFavorite: false,
    tags: ['Python', 'OOP', 'Advanced', 'Design Patterns'],
    createdAt: '2024-02-15',
    updatedAt: '2024-06-20',
  },
  {
    id: '11',
    title: 'Deep Learning với TensorFlow',
    description: 'Học deep learning và neural networks với TensorFlow và Keras',
    instructor: 'Trần Thị B',
    duration: 2000,
    level: 'advanced',
    category: 'Data Science',
    price: 1299000,
    originalPrice: 1799000,
    rating: 4.9,
    reviewCount: 321,
    thumbnail: '/images/courses/ai10.jpg',
    isPopular: true,
    isFavorite: false,
    tags: ['Deep Learning', 'TensorFlow', 'Neural Networks', 'AI'],
    createdAt: '2024-03-01',
    updatedAt: '2024-06-25',
  },
  {
    id: '12',
    title: 'Data Analysis với Python và Pandas',
    description: 'Phân tích dữ liệu chuyên nghiệp với Python, Pandas và Matplotlib',
    instructor: 'Nguyễn Thị J',
    duration: 1500,
    level: 'intermediate',
    category: 'Data Science',
    price: 899000,
    originalPrice: 1299000,
    rating: 4.7,
    reviewCount: 678,
    thumbnail: '/images/courses/ai7.jpg',
    isPopular: false,
    isFavorite: false,
    tags: ['Data Analysis', 'Python', 'Pandas', 'Matplotlib'],
    createdAt: '2024-02-28',
    updatedAt: '2024-06-18',
  },
  {
    id: '13',
    title: 'Advanced UI/UX Design Principles',
    description: 'Nguyên tắc thiết kế UX/UI nâng cao và design thinking',
    instructor: 'Lê Văn C',
    duration: 1300,
    level: 'advanced',
    category: 'Design',
    price: 799000,
    originalPrice: 1199000,
    rating: 4.8,
    reviewCount: 432,
    thumbnail: '/images/courses/ai4.jpg',
    isPopular: false,
    isFavorite: false,
    tags: ['UI/UX', 'Design Thinking', 'Advanced', 'User Research'],
    createdAt: '2024-03-10',
    updatedAt: '2024-06-22',
  },
  {
    id: '14',
    title: 'Photoshop và Graphic Design',
    description: 'Thiết kế đồ họa chuyên nghiệp với Adobe Photoshop',
    instructor: 'Phạm Thị K',
    duration: 1100,
    level: 'intermediate',
    category: 'Design',
    price: 649000,
    originalPrice: 949000,
    rating: 4.6,
    reviewCount: 567,
    thumbnail: '/images/courses/ai3.jpg',
    isPopular: true,
    isFavorite: false,
    tags: ['Photoshop', 'Graphic Design', 'Adobe', 'Visual Design'],
    createdAt: '2024-04-05',
    updatedAt: '2024-06-15',
  },
  {
    id: '15',
    title: 'Node.js và Backend Development',
    description: 'Xây dựng API và backend với Node.js, Express và MongoDB',
    instructor: 'Nguyễn Văn A',
    duration: 1600,
    level: 'intermediate',
    category: 'Programming',
    price: 799000,
    originalPrice: 1199000,
    rating: 4.7,
    reviewCount: 654,
    thumbnail: '/images/courses/ai3.jpg',
    isPopular: true,
    isFavorite: false,
    tags: ['Node.js', 'Backend', 'Express', 'MongoDB'],
    createdAt: '2024-03-15',
    updatedAt: '2024-06-20',
  },
  {
    id: '16',
    title: 'Vue.js Framework từ cơ bản đến nâng cao',
    description: 'Học Vue.js 3 với Composition API và ecosystem Vue',
    instructor: 'Phạm Văn D',
    duration: 1400,
    level: 'intermediate',
    category: 'Programming',
    price: 699000,
    originalPrice: 999000,
    rating: 4.5,
    reviewCount: 423,
    thumbnail: '/images/courses/ai7.jpg',
    isPopular: false,
    isFavorite: false,
    tags: ['Vue.js', 'Frontend', 'JavaScript', 'SPA'],
    createdAt: '2024-04-10',
    updatedAt: '2024-06-25',
  },
  {
    id: '17',
    title: 'Social Media Marketing Strategy',
    description: 'Chiến lược marketing trên các nền tảng mạng xã hội',
    instructor: 'Nguyễn Thị E',
    duration: 1200,
    level: 'intermediate',
    category: 'Marketing',
    price: 749000,
    originalPrice: 1099000,
    rating: 4.4,
    reviewCount: 389,
    thumbnail: '/images/courses/ai4.jpg',
    isPopular: false,
    isFavorite: false,
    tags: ['Social Media', 'Marketing Strategy', 'Facebook Ads', 'Instagram'],
    createdAt: '2024-05-01',
    updatedAt: '2024-06-18',
  },
  {
    id: '18',
    title: 'Content Marketing và Storytelling',
    description: 'Tạo nội dung hấp dẫn và kể chuyện trong marketing',
    instructor: 'Lê Thị L',
    duration: 1000,
    level: 'beginner',
    category: 'Marketing',
    price: 599000,
    originalPrice: 899000,
    rating: 4.6,
    reviewCount: 512,
    thumbnail: '/images/courses/ai7.jpg',
    isPopular: true,
    isFavorite: false,
    tags: ['Content Marketing', 'Storytelling', 'Brand Building', 'Creative Writing'],
    createdAt: '2024-05-15',
    updatedAt: '2024-06-22',
  },
  {
    id: '19',
    title: 'Project Management với Agile',
    description: 'Quản lý dự án hiệu quả với phương pháp Agile và Scrum',
    instructor: 'Lê Minh F',
    duration: 1300,
    level: 'intermediate',
    category: 'Business',
    price: 849000,
    originalPrice: 1249000,
    rating: 4.7,
    reviewCount: 445,
    thumbnail: '/images/courses/AI1.jpg',
    isPopular: false,
    isFavorite: false,
    tags: ['Project Management', 'Agile', 'Scrum', 'Team Leadership'],
    createdAt: '2024-04-25',
    updatedAt: '2024-06-20',
  },
  {
    id: '20',
    title: 'Financial Analysis và Investment',
    description: 'Phân tích tài chính và đầu tư cho doanh nghiệp',
    instructor: 'Trần Văn M',
    duration: 1500,
    level: 'advanced',
    category: 'Business',
    price: 1199000,
    originalPrice: 1699000,
    rating: 4.8,
    reviewCount: 287,
    thumbnail: '/images/courses/ai2.jpg',
    isPopular: false,
    isFavorite: false,
    tags: ['Financial Analysis', 'Investment', 'Business Finance', 'ROI'],
    createdAt: '2024-05-10',
    updatedAt: '2024-06-25',
  },
  {
    id: '21',
    title: 'Docker và Container Technology',
    description: 'Containerization và deployment với Docker và Kubernetes',
    instructor: 'Phạm Văn G',
    duration: 1400,
    level: 'advanced',
    category: 'Technology',
    price: 1099000,
    originalPrice: 1599000,
    rating: 4.6,
    reviewCount: 334,
    thumbnail: '/images/courses/ai5.jpg',
    isPopular: true,
    isFavorite: false,
    tags: ['Docker', 'Container', 'Kubernetes', 'DevOps'],
    createdAt: '2024-03-20',
    updatedAt: '2024-06-15',
  },
  {
    id: '22',
    title: 'Blockchain và Cryptocurrency',
    description: 'Tìm hiểu về blockchain, smart contracts và cryptocurrency',
    instructor: 'Nguyễn Văn N',
    duration: 1800,
    level: 'intermediate',
    category: 'Technology',
    price: 1399000,
    originalPrice: 1999000,
    rating: 4.5,
    reviewCount: 198,
    thumbnail: '/images/courses/AI1.jpg',
    isPopular: false,
    isFavorite: false,
    tags: ['Blockchain', 'Cryptocurrency', 'Smart Contracts', 'Web3'],
    createdAt: '2024-04-15',
    updatedAt: '2024-06-20',
  },
  {
    id: '23',
    title: 'Mobile App Development với Flutter',
    description: 'Phát triển ứng dụng di động đa nền tảng với Flutter',
    instructor: 'Lê Thị O',
    duration: 1700,
    level: 'intermediate',
    category: 'Programming',
    price: 899000,
    originalPrice: 1299000,
    rating: 4.7,
    reviewCount: 456,
    thumbnail: '/images/courses/ai5.jpg',
    isPopular: true,
    isFavorite: false,
    tags: ['Flutter', 'Mobile App', 'Dart', 'Cross-platform'],
    createdAt: '2024-05-05',
    updatedAt: '2024-06-22',
  },
  {
    id: '24',
    title: 'iOS Development với Swift',
    description: 'Phát triển ứng dụng iOS native với Swift và SwiftUI',
    instructor: 'Phạm Thị P',
    duration: 1600,
    level: 'advanced',
    category: 'Programming',
    price: 1199000,
    originalPrice: 1799000,
    rating: 4.8,
    reviewCount: 278,
    thumbnail: '/images/courses/ai3.jpg',
    isPopular: false,
    isFavorite: false,
    tags: ['iOS', 'Swift', 'SwiftUI', 'Mobile Development'],
    createdAt: '2024-04-20',
    updatedAt: '2024-06-18',
  },
  {
    id: '25',
    title: 'Game Development với Unity',
    description: 'Tạo game 2D và 3D với Unity Engine và C#',
    instructor: 'Nguyễn Văn Q',
    duration: 2200,
    level: 'intermediate',
    category: 'Programming',
    price: 999000,
    originalPrice: 1499000,
    rating: 4.6,
    reviewCount: 387,
    thumbnail: '/images/courses/ai8.jpg',
    isPopular: true,
    isFavorite: false,
    tags: ['Unity', 'Game Development', 'C#', '3D Graphics'],
    createdAt: '2024-03-25',
    updatedAt: '2024-06-25',
  },
  {
    id: '26',
    title: 'Data Science với R Programming',
    description: 'Khoa học dữ liệu và thống kê với ngôn ngữ R',
    instructor: 'Trần Thị R',
    duration: 1400,
    level: 'intermediate',
    category: 'Data Science',
    price: 799000,
    originalPrice: 1199000,
    rating: 4.5,
    reviewCount: 234,
    thumbnail: '/images/courses/AI1.jpg',
    isPopular: false,
    isFavorite: false,
    tags: ['R Programming', 'Data Science', 'Statistics', 'Data Visualization'],
    createdAt: '2024-04-30',
    updatedAt: '2024-06-20',
  },
  {
    id: '27',
    title: 'Animation và Motion Graphics',
    description: 'Tạo animation và motion graphics với After Effects',
    instructor: 'Lê Văn S',
    duration: 1500,
    level: 'intermediate',
    category: 'Design',
    price: 849000,
    originalPrice: 1249000,
    rating: 4.7,
    reviewCount: 345,
    thumbnail: '/images/courses/ai4.jpg',
    isPopular: false,
    isFavorite: false,
    tags: ['Animation', 'Motion Graphics', 'After Effects', 'Video Editing'],
    createdAt: '2024-05-20',
    updatedAt: '2024-06-22',
  },
  {
    id: '28',
    title: 'E-commerce Business Strategy',
    description: 'Xây dựng và phát triển business e-commerce thành công',
    instructor: 'Nguyễn Thị T',
    duration: 1200,
    level: 'beginner',
    category: 'Business',
    price: 699000,
    originalPrice: 999000,
    rating: 4.4,
    reviewCount: 412,
    thumbnail: '/images/courses/ai2.jpg',
    isPopular: true,
    isFavorite: false,
    tags: ['E-commerce', 'Online Business', 'Dropshipping', 'Digital Marketing'],
    createdAt: '2024-05-25',
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

