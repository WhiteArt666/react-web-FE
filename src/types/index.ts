// Định nghĩa các types chính cho ứng dụng

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number; // phút
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  thumbnail: string;
  isPopular: boolean;
  isFavorite: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Instructor {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  rating: number;
  totalStudents: number;
  coursesCount: number;
  expertise: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  courseCount: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  favoriteCoursesIds: string[];
  enrolledCoursesIds: string[];
  preferences: {
    categories: string[];
    level: string[];
    priceRange: [number, number];
  };
}

export interface AIRecommendation {
  courseId: string;
  score: number;
  reason: string;
  tags: string[];
}

export interface SearchFilters {
  query: string;
  category?: string;
  level?: string[];
  priceRange?: [number, number];
  rating?: number;
  duration?: [number, number];
  sortBy?: 'relevance' | 'rating' | 'price_low' | 'price_high' | 'newest' | 'popular';
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: PaginationInfo;
}

// Cart types
export interface CartItem {
  id: string;
  course: Course;
  quantity: number;
  addedAt: string;
  price: number; // Giá tại thời điểm thêm vào giỏ
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartRecommendation {
  courseId: string;
  score: number;
  reason: string;
  type: 'complementary' | 'similar' | 'advanced' | 'beginner';
  basedOnCourseId?: string;
}
