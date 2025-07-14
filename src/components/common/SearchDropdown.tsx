import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, Filter, Clock, Star, User, TrendingUp } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { courseService } from '../../services/courseService';
import { Course } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';

interface SearchDropdownProps {
  onClose?: () => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search courses
  const searchCourses = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await courseService.searchCourses({
        query: searchQuery
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query && isOpen) {
        searchCourses(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim()) {
      setIsOpen(true);
    } else {
      setSearchResults([]);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    const newRecentSearches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));

    // Navigate to courses page with search query
    navigate(`/courses?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
    setQuery('');
    onClose?.();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  const handleCourseClick = (course: Course) => {
    navigate(`/course/${course.id}`);
    setIsOpen(false);
    setQuery('');
    onClose?.();
  };

  const handleRecentSearchClick = (searchQuery: string) => {
    setQuery(searchQuery);
    handleSearch(searchQuery);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder="Tìm kiếm khóa học..."
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyPress={handleKeyPress}
          className="pl-10 pr-12 h-9 w-full md:w-[280px] lg:w-[350px] xl:w-[400px]"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => {
              setQuery('');
              setSearchResults([]);
              inputRef.current?.focus();
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-md shadow-lg z-[60] max-h-96 overflow-y-auto">
          {/* Search Results */}
          {query && (
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Kết quả tìm kiếm</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => handleSearch(query)}
                >
                  Xem tất cả
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <LoadingSpinner size="small" />
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((course) => (
                    <div
                      key={course.id}
                      onClick={() => handleCourseClick(course)}
                      className="flex items-center space-x-3 p-2 hover:bg-accent rounded-md cursor-pointer transition-colors"
                    >
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{course.title}</p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            <span className="truncate max-w-20 sm:max-w-none">{course.instructor}</span>
                          </span>
                          <span className="hidden sm:flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDuration(course.duration)}
                          </span>
                          <span className="flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            {course.rating}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs sm:text-sm font-medium">{formatPrice(course.price)}</p>
                        <Badge variant="secondary" className="text-xs">
                          {course.level}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  Không tìm thấy khóa học nào
                </div>
              )}
            </div>
          )}

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-3 border-t">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Tìm kiếm gần đây</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={clearRecentSearches}
                >
                  Xóa tất cả
                </Button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md cursor-pointer"
                  >
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{search}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {!query && (
            <div className="p-3 border-t">
              <h3 className="text-sm font-medium mb-2">Khám phá</h3>
              <div className="space-y-1">
                <Link
                  to="/courses?popular=true"
                  className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span>Khóa học phổ biến</span>
                </Link>
                <Link
                  to="/courses?level=beginner"
                  className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <span>Dành cho người mới bắt đầu</span>
                </Link>
              </div>
            </div>
          )}

          {/* Search Button */}
          <div className="p-3 border-t">
            <Button
              className="w-full"
              onClick={() => handleSearch(query)}
              disabled={!query.trim()}
            >
              <Search className="w-4 h-4 mr-2" />
              Tìm kiếm "{query}"
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
