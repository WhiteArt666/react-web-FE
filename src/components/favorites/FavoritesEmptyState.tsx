import React, { forwardRef } from 'react';
import { Heart } from 'lucide-react';

const FavoritesEmptyState = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref} className="text-center py-16">
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
  );
});

FavoritesEmptyState.displayName = 'FavoritesEmptyState';

export default FavoritesEmptyState;
