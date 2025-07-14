import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Grid, List } from 'lucide-react';

interface Category {
  value: string;
  label: string;
  count: number;
}

interface CoursesResultsHeaderProps {
  coursesCount: number;
  selectedCategory: string;
  categories: Category[];
  viewMode: 'grid' | 'list';
  onClearCategory: () => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const CoursesResultsHeader: React.FC<CoursesResultsHeaderProps> = ({
  coursesCount,
  selectedCategory,
  categories,
  viewMode,
  onClearCategory,
  onViewModeChange,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <span className="text-gray-600">
          {coursesCount} khóa học
        </span>
        {selectedCategory && (
          <Badge variant="outline" className="flex items-center gap-1">
            {categories.find(c => c.value === selectedCategory)?.label}
            <button
              onClick={onClearCategory}
              className="ml-1 hover:text-red-500"
            >
              ×
            </button>
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('grid')}
        >
          <Grid className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('list')}
        >
          <List className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CoursesResultsHeader;
