import React, { forwardRef } from 'react';
import { Course } from '../../types';
import FavoriteCourseCard from './FavoriteCourseCard';

interface FavoritesGridProps {
  favorites: Course[];
  onRemoveCourse: (course: Course) => void;
}

const FavoritesGrid = forwardRef<HTMLDivElement, FavoritesGridProps>(
  ({ favorites, onRemoveCourse }, ref) => {
    return (
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {favorites.map((course: Course) => (
          <FavoriteCourseCard
            key={course.id}
            course={course}
            onRemove={onRemoveCourse}
          />
        ))}
      </div>
    );
  }
);

FavoritesGrid.displayName = 'FavoritesGrid';

export default FavoritesGrid;
