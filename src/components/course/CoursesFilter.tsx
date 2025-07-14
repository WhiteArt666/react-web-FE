import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { SlidersHorizontal } from 'lucide-react';

interface Category {
  value: string;
  label: string;
  count: number;
}

interface CoursesFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryFilter: (category: string) => void;
  onQuickFilter: (sortBy: string) => void;
}

const CoursesFilter: React.FC<CoursesFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryFilter,
  onQuickFilter,
}) => {
  return (
    <div className="lg:w-1/4">
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Filter */}
          <div>
            <h3 className="font-semibold mb-3">Danh mục</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => onCategoryFilter(category.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span>{category.label}</span>
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Filters */}
          <div>
            <h3 className="font-semibold mb-3">Lọc nhanh</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => onQuickFilter('rating')}
              >
                Đánh giá cao nhất
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => onQuickFilter('newest')}
              >
                Mới nhất
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => onQuickFilter('popular')}
              >
                Phổ biến nhất
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoursesFilter;
