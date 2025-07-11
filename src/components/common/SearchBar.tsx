import React, { useState, useCallback, useEffect } from 'react';
import { SearchFilters } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Search, Filter, X } from 'lucide-react';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../contexts/AuthContext';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading = false }) => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    level: [],
    priceRange: [0, 2000000],
    rating: 0,
    sortBy: 'relevance',
  });

  const categories = [
    { value: '', label: 'Tất cả danh mục' },
    { value: 'Programming', label: 'Lập trình' },
    { value: 'Design', label: 'Thiết kế' },
    { value: 'Data Science', label: 'Khoa học dữ liệu' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Business', label: 'Kinh doanh' },
  ];

  const levels = [
    { value: 'beginner', label: 'Cơ bản' },
    { value: 'intermediate', label: 'Trung cấp' },
    { value: 'advanced', label: 'Nâng cao' },
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Liên quan nhất' },
    { value: 'rating', label: 'Đánh giá cao nhất' },
    { value: 'price_low', label: 'Giá thấp đến cao' },
    { value: 'price_high', label: 'Giá cao đến thấp' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'popular', label: 'Phổ biến nhất' },
  ];

  const handleSearch = useCallback(() => {
    const searchFilters = {
      ...filters,
      query,
    };
    
    // Lưu lịch sử tìm kiếm nếu có query và user đã đăng nhập
    if (query.trim() && user?.id) {
      courseService.saveUserBehavior(user.id, 'search', query.trim());
      console.log('💾 Saved search term to user behavior:', query.trim());
    }
    
    onSearch(searchFilters);
  }, [filters, query, onSearch, user]);

  const handleManualSearch = useCallback(() => {
    handleSearch();
  }, [handleSearch]);

  // Debounce search only when query changes (not filters)
  useEffect(() => {
    if (query.trim()) {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 500); // Wait 500ms after user stops typing

      return () => clearTimeout(timeoutId);
    }
  }, [query]); // Only depend on query, not handleSearch

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleManualSearch();
    }
  };

  const handleLevelChange = (level: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      level: checked 
        ? [...prev.level || [], level]
        : (prev.level || []).filter(l => l !== level)
    }));
  };

  const clearFilters = () => {
    setQuery('');
    setFilters({
      query: '',
      category: '',
      level: [],
      priceRange: [0, 2000000],
      rating: 0,
      sortBy: 'relevance',
    });
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.level && filters.level.length > 0) count++;
    if (filters.rating && filters.rating > 0) count++;
    if (filters.priceRange && filters.priceRange[1] < 2000000) count++;
    if (filters.sortBy !== 'relevance') count++;
    return count;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Main Search Bar */}
      <Card className="shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tìm kiếm khóa học, giáo trình, tài liệu..."
                className="pl-10 h-12 text-base"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <Filter className="w-4 h-4 mr-2" />
                Bộ lọc
                {activeFiltersCount() > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {activeFiltersCount()}
                  </Badge>
                )}
              </Button>
              
              <Button 
                size="lg" 
                onClick={handleManualSearch} 
                disabled={loading}
                className="px-6"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span className="ml-2 hidden sm:inline">Tìm kiếm</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Bộ lọc tìm kiếm</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Danh mục</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Cấp độ</label>
                <div className="space-y-2">
                  {levels.map(level => (
                    <div key={level.value} className="flex items-center space-x-2">
                      <input
                        id={level.value}
                        type="checkbox"
                        checked={filters.level?.includes(level.value) || false}
                        onChange={(e) => handleLevelChange(level.value, e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor={level.value} className="text-sm">
                        {level.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sort Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sắp xếp theo</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({...prev, sortBy: e.target.value as any}))}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  {sortOptions.map(sort => (
                    <option key={sort.value} value={sort.value}>
                      {sort.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Khoảng giá</label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  step="50000"
                  value={filters.priceRange?.[1] || 2000000}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: [0, parseInt(e.target.value)]
                  }))}
                  className="w-full slider-thumb"
                />
                <div className="text-sm text-muted-foreground text-center">
                  0₫ - {new Intl.NumberFormat('vi-VN').format(filters.priceRange?.[1] || 2000000)}₫
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Đánh giá tối thiểu</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <Button
                    key={rating}
                    variant={filters.rating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilters(prev => ({...prev, rating}))}
                  >
                    {'⭐'.repeat(rating)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
              <Button variant="outline" onClick={clearFilters} className="flex-1">
                Xóa bộ lọc
              </Button>
              <Button onClick={handleManualSearch} className="flex-1">
                Áp dụng bộ lọc
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;
