import React from 'react';
import { Course } from '../../types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Heart, Star, User, Clock } from 'lucide-react';
import { formatDuration } from '../../lib/utils';

interface CourseHeroProps {
  course: Course;
  isCourseFavorite: boolean;
  onFavoriteClick: () => void;
  getLevelColor: (level: string) => string;
  getLevelText: (level: string) => string;
}

const CourseHero: React.FC<CourseHeroProps> = ({
  course,
  isCourseFavorite,
  onFavoriteClick,
  getLevelColor,
  getLevelText
}) => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-64 object-cover rounded-t-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/courses/course1.jpg';
            }}
          />
          {course.isPopular && (
            <Badge className="absolute top-4 left-4 bg-orange-500 text-white">
              🔥 Phổ biến
            </Badge>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {course.title}
              </h1>
              <p className="text-gray-600 text-lg mb-4">
                {course.description}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onFavoriteClick}
              className={`ml-4 ${isCourseFavorite ? 'text-red-500 border-red-200' : 'text-gray-500'}`}
            >
              <Heart className={`w-4 h-4 ${isCourseFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Course Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">{course.rating}</span>
              <span className="text-gray-500">({course.reviewCount} đánh giá)</span>
            </div>
            
            <div className="flex items-center gap-1">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{course.instructor}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{formatDuration(course.duration)}</span>
            </div>
            
            <Badge className={getLevelColor(course.level)}>
              {getLevelText(course.level)}
            </Badge>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {course.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseHero;
