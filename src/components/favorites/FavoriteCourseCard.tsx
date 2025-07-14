import React from 'react';
import { Book, Clock, Star, Trash2 } from 'lucide-react';
import { Course } from '../../types';

interface FavoriteCourseCardProps {
  course: Course;
  onRemove: (course: Course) => void;
}

const FavoriteCourseCard: React.FC<FavoriteCourseCardProps> = ({ course, onRemove }) => {
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="favorite-card bg-white rounded-2xl shadow-lg overflow-hidden group">
      {/* Course Image */}
      <div className="relative overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="card-image w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <button
            onClick={() => onRemove(course)}
            className="favorite-button bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-red-50 hover:text-red-500 transition-all duration-300 shadow-lg"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
        {course.isPopular && (
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Phổ biến
            </span>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 gradient-text group-hover:text-white transition-colors">
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="text-gray-600 mb-3">{course.instructor}</p>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Course Info */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(course.duration)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Book className="w-4 h-4" />
            <span className="capitalize">{course.level}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
            <span>{course.rating}</span>
            <span className="text-gray-400">({course.reviewCount})</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-purple-600">
              {formatPrice(course.price)}
            </span>
            {course.originalPrice && course.originalPrice > course.price && (
              <span className="text-gray-400 line-through text-sm">
                {formatPrice(course.originalPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg text-xs font-medium">
              {course.category}
            </span>
          </div>
        </div>

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {course.tags.slice(0, 3).map((tag: string, index: number) => (
              <span
                key={index}
                className="tag-item bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
              >
                {tag}
              </span>
            ))}
            {course.tags.length > 3 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                +{course.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Action Button */}
        <button className="favorite-button w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
          Bắt đầu học
        </button>
      </div>
    </div>
  );
};

export default FavoriteCourseCard;
