import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '../../types';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { courseService } from '../../services/courseService';
import { formatPrice, formatDuration } from '../../lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Heart, Clock, Star, User, BookOpen } from 'lucide-react';
import AddToCartButton from '../cart/AddToCartButton';

interface CourseCardProps {
  course: Course;
  onCourseClick?: (course: Course) => void;
  viewMode?: 'grid' | 'list';
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onCourseClick, viewMode = 'grid' }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const isCourseFavorite = isFavorite(course.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isCourseFavorite) {
      removeFromFavorites(course.id);
      showToast(`Đã xóa "${course.title}" khỏi danh sách yêu thích`, 'success', 2500);
      // Lưu hành vi unfavorite
      if (user) {
        courseService.saveUserBehavior(user.id, 'unfavorite', course.id);
      }
    } else {
      addToFavorites(course);
      showToast(`Đã thêm "${course.title}" vào danh sách yêu thích! 💕`, 'success', 2500);
      // Lưu hành vi favorite
      if (user) {
        courseService.saveUserBehavior(user.id, 'favorite', course.id);
      }
    }
  };

  const handleCourseClick = () => {
    // Lưu hành vi view
    if (user) {
      courseService.saveUserBehavior(user.id, 'view', course.id);
    }

    // Nếu có callback từ parent component thì gọi nó
    if (onCourseClick) {
      onCourseClick(course);
    } else {
      // Ngược lại thì navigate đến trang chi tiết
      navigate(`/course/${course.id}`);
    }
  };

  const getLevelVariant = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Cơ bản';
      case 'intermediate':
        return 'Trung cấp';
      case 'advanced':
        return 'Nâng cao';
      default:
        return 'Tất cả';
    }
  };

  // Grid view (default)
  if (viewMode === 'grid') {
    return (
      <Card
        className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col overflow-hidden"
        onClick={handleCourseClick}
      >
        <div className="relative">
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-course.jpg';
              }}
            />
          </div>

          {/* Overlay with favorite button */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-3 right-3 w-9 h-9 rounded-full transition-all duration-200 ${isCourseFavorite
                  ? 'bg-white text-red-500 hover:bg-white/90'
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                }`}
              onClick={handleFavoriteClick}
            >
              <Heart className={`w-4 h-4 ${isCourseFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Popular badge */}
          {course.isPopular && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
              🔥 Phổ biến
            </Badge>
          )}
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {course.category}
            </Badge>
            <Badge variant={getLevelVariant(course.level)} className="text-xs">
              {getLevelText(course.level)}
            </Badge>
          </div>

          <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
        </CardHeader>

        <CardContent className="pt-0 flex-1 pb-4">
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {course.description}
          </p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <User className="w-4 h-4" />
            <span className="truncate">{course.instructor}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{course.rating}</span>
              <span className="text-xs">({course.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(course.duration)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-2">
            {course.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="pt-3 pb-4 flex flex-col gap-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
              {course.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(course.originalPrice)}
                </span>
              )}
              <span className="text-lg font-bold text-primary">
                {formatPrice(course.price)}
              </span>
            </div>

            <Button
              size="sm"
              className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 flex-shrink-0"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              <span className="whitespace-nowrap">Xem chi tiết</span>
            </Button>
          </div>

          {/* <div className="flex items-center justify-between gap-2 w-full">
            <AddToCartButton 
              course={course}
              size="sm"
              className="flex-1"
              showText={true}
            />
            
            <Button
              size="sm"
              variant="outline"
              className={`transition-all duration-200 ${
                isCourseFavorite ? 'text-red-600 hover:text-red-700' : 'text-gray-600 hover:text-gray-700'
              }`}
              onClick={handleFavoriteClick}
            >
              <Heart className={`w-4 h-4 ${isCourseFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div> */}
        </CardFooter>
      </Card>
    );
  }

  // List view
  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg overflow-hidden"
      onClick={handleCourseClick}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-48 md:w-56 lg:w-64 flex-shrink-0">
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-course.jpg';
              }}
            />
          </div>

          {/* Popular badge */}
          {course.isPopular && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
              🔥 Phổ biến
            </Badge>
          )}
        </div>

        <div className="flex-1 p-4 sm:p-6 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {course.category}
              </Badge>
              <Badge variant={getLevelVariant(course.level)} className="text-xs">
                {getLevelText(course.level)}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={`w-9 h-9 rounded-full transition-all duration-200 flex-shrink-0 ${isCourseFavorite
                  ? 'text-red-500 hover:bg-red-50'
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              onClick={handleFavoriteClick}
            >
              <Heart className={`w-4 h-4 ${isCourseFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>

          <h3 className="font-semibold text-lg sm:text-xl mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {course.title}
          </h3>

          <p className="text-gray-600 mb-3 line-clamp-2 text-sm sm:text-base">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span className="truncate max-w-24 sm:max-w-none">{course.instructor}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(course.duration)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{course.rating}</span>
              <span className="text-gray-500">({course.reviewCount.toLocaleString()})</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 mt-auto">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl sm:text-2xl font-bold text-primary">
                {formatPrice(course.price)}
              </span>
              {course.originalPrice && course.originalPrice > course.price && (
                <span className="text-sm text-gray-500 line-through whitespace-nowrap">
                  {formatPrice(course.originalPrice)}
                </span>
              )}
              {course.originalPrice && course.originalPrice > course.price && (
                <Badge variant="destructive" className="text-xs flex-shrink-0">
                  -{Math.round((1 - course.price / course.originalPrice) * 100)}%
                </Badge>
              )}
            </div>

            <Button
              className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap px-4 py-2 flex-shrink-0"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Xem chi tiết
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
