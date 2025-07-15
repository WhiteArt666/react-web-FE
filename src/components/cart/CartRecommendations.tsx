import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Star, Clock, User } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Course, CartRecommendation } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { cartRecommendationService } from '../../services/cartRecommendationService';
import { courseService } from '../../services/courseService';
import AddToCartButton from './AddToCartButton';
import LoadingSpinner from '../common/LoadingSpinner';

interface CartRecommendationsProps {
  className?: string;
}

const CartRecommendations: React.FC<CartRecommendationsProps> = ({ className = '' }) => {
  const { cart } = useCart();
  const [recommendations, setRecommendations] = useState<CartRecommendation[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('🛒 Cart items changed:', cart.items.length);
    if (cart.items.length > 0) {
      loadRecommendations();
    } else {
      setRecommendations([]);
      setCourses([]);
    }
  }, [cart.items]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading recommendations for cart items:', cart.items.length);
      const recs = await cartRecommendationService.getCartRecommendations(cart.items, 6);
      console.log('📋 Recommendations loaded:', recs.length, recs);
      setRecommendations(recs);

      // Lấy thông tin chi tiết các khóa học được gợi ý
      const coursesResponse = await courseService.getAllCourses();
      const allCourses = coursesResponse.data;
      const recommendedCourses = allCourses.filter(course => 
        recs.some(rec => rec.courseId === course.id)
      );
      console.log('📚 Recommended courses:', recommendedCourses.length);
      setCourses(recommendedCourses);
    } catch (error) {
      console.error('❌ Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Cơ bản';
      case 'intermediate': return 'Trung cấp';
      case 'advanced': return 'Nâng cao';
      default: return level;
    }
  };

  const getRecommendationTypeColor = (type: string) => {
    switch (type) {
      case 'complementary': return 'bg-blue-100 text-blue-800';
      case 'similar': return 'bg-purple-100 text-purple-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'beginner': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationTypeText = (type: string) => {
    switch (type) {
      case 'complementary': return 'Bổ sung';
      case 'similar': return 'Tương tự';
      case 'advanced': return 'Nâng cao';
      case 'beginner': return 'Cơ bản';
      default: return type;
    }
  };

  if (cart.items.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="h-5 w-5 text-yellow-500" />
        <h2 className="text-xl font-semibold">Gợi ý cho bạn</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="large" />
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Không có gợi ý nào cho giỏ hàng hiện tại</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => {
            const course = courses.find(c => c.id === rec.courseId);
            if (!course) return null;

            return (
              <Card key={rec.courseId} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Link to={`/courses/${course.id}`}>
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  </Link>
                  
                  {/* Recommendation type badge */}
                  <Badge 
                    className={`absolute top-2 right-2 text-xs ${getRecommendationTypeColor(rec.type)}`}
                  >
                    {getRecommendationTypeText(rec.type)}
                  </Badge>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge className={`text-xs ${getLevelColor(course.level)}`}>
                      {getLevelText(course.level)}
                    </Badge>
                    <span className="text-xs text-gray-500">{course.category}</span>
                  </div>

                  <Link to={`/courses/${course.id}`} className="block group">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                      {course.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <User className="h-4 w-4" />
                    <span>{course.instructor}</span>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{course.rating}</span>
                      <span className="text-xs text-gray-500">({course.reviewCount})</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(course.duration)}</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 mb-3 italic">
                    "{rec.reason}"
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary-600">
                        {formatPrice(course.price)}
                      </span>
                      {course.originalPrice && course.originalPrice > course.price && (
                        <span className="text-sm line-through text-gray-500">
                          {formatPrice(course.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <AddToCartButton 
                      course={course} 
                      size="sm" 
                      className="w-full"
                      showText={true}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CartRecommendations;
