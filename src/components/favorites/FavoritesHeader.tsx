import React, { forwardRef } from 'react';
import { Heart } from 'lucide-react';

interface FavoritesHeaderProps {
  favoritesCount: number;
}

const FavoritesHeader = forwardRef<HTMLDivElement, FavoritesHeaderProps>(
  ({ favoritesCount }, ref) => {
    return (
      <div ref={ref} className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-6">
          <Heart className="w-8 h-8 text-white" fill="currentColor" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Khóa học yêu thích
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Tổng hợp tất cả các khóa học bạn đã lưu để học sau. Có {favoritesCount} khóa học trong danh sách của bạn.
        </p>
      </div>
    );
  }
);

FavoritesHeader.displayName = 'FavoritesHeader';

export default FavoritesHeader;
