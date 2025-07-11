import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Book, Clock, Star, Trash2 } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useToast } from '../hooks/useToast';
import { Course } from '../types';
import Toast from '../components/ui/Toast';
import '../styles/favorites.css';

// Đăng ký ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const FavoritesPage: React.FC = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const { toast, showToast, hideToast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const emptyStateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      // Animation cho header
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          ease: "power3.out"
        }
      );
    }

    if (favorites.length > 0 && gridRef.current) {
      // Animation cho grid courses
      const cards = gridRef.current.children;
      gsap.fromTo(cards,
        { 
          opacity: 0, 
          y: 50,
          scale: 0.8
        },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          delay: 0.3
        }
      );

      // Scroll animation
      ScrollTrigger.batch(cards, {
        onEnter: (elements) => {
          gsap.fromTo(elements, 
            { opacity: 0, y: 100 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }
          );
        },
        start: "top bottom-=100",
        once: true
      });
    } else if (emptyStateRef.current) {
      // Animation cho empty state
      gsap.fromTo(emptyStateRef.current,
        { opacity: 0, scale: 0.5 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 0.5
        }
      );
    }

    // Cleanup ScrollTrigger
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [favorites]);

  const handleRemoveFromFavorites = (course: Course) => {
    removeFromFavorites(course.id);
    showToast(`Đã xóa "${course.title}" khỏi danh sách yêu thích`, 'success');
  };

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
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-6">
            <Heart className="w-8 h-8 text-white" fill="currentColor" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Khóa học yêu thích
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Tổng hợp tất cả các khóa học bạn đã lưu để học sau. Có {favorites.length} khóa học trong danh sách của bạn.
          </p>
        </div>

        {/* Content */}
        {favorites.length > 0 ? (
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((course: Course) => (
              <div
                key={course.id}
                className="favorite-card bg-white rounded-2xl shadow-lg overflow-hidden group"
              >
                {/* Course Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="card-image w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => handleRemoveFromFavorites(course)}
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
            ))}
          </div>
        ) : (
          /* Empty State */
          <div ref={emptyStateRef} className="text-center py-16">
            <div className="float-animation inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Chưa có khóa học yêu thích
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Hãy khám phá và thêm các khóa học bạn quan tâm vào danh sách yêu thích để học sau.
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
              Khám phá khóa học
            </button>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={hideToast}
      />
    </div>
  );
};

export default FavoritesPage;
