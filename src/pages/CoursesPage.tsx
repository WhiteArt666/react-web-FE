import React, { useEffect, useState } from 'react';
import { Course } from '../types';
import { useCourses } from '../hooks/useCourses';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from '../components/common/SearchBar';
import CourseGrid from '../components/course/CourseGrid';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react';

const CoursesPage: React.FC = () => {
  const { user } = useAuth();
  const { courses, loading, searchCourses, loadPopularCourses } = useCourses();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Categories for filtering
  const categories = [
    { value: '', label: 'Tất cả danh mục', count: 0 },
    { value: 'Programming', label: 'Lập trình', count: 0 },
    { value: 'Design', label: 'Thiết kế', count: 0 },
    { value: 'Data Science', label: 'Khoa học dữ liệu', count: 0 },
    { value: 'Marketing', label: 'Marketing', count: 0 },
    { value: 'Business', label: 'Kinh doanh', count: 0 },
  ];

  // Calculate course counts by category
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    count: cat.value === '' ? courses.length : courses.filter(c => c.category === cat.value).length
  }));

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Load all courses initially
    searchCourses({
      query: '',
      category: '',
      level: [],
      priceRange: [0, 2000000],
      rating: 0,
      sortBy: 'relevance',
    });
  }, [searchCourses]);

  const handleSearch = (filters: any) => {
    searchCourses(filters);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    searchCourses({
      query: '',
      category,
      level: [],
      priceRange: [0, 2000000],
      rating: 0,
      sortBy: 'relevance',
    });
  };

  const stats = [
    { label: 'Tổng khóa học', value: courses.length },
    { label: 'Lập trình', value: courses.filter(c => c.category === 'Programming').length },
    { label: 'Thiết kế', value: courses.filter(c => c.category === 'Design').length },
    { label: 'Khoa học dữ liệu', value: courses.filter(c => c.category === 'Data Science').length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Khóa học trực tuyến
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Khám phá hàng ngàn khóa học chất lượng cao từ các chuyên gia hàng đầu
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
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
                    {categoriesWithCounts.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => handleCategoryFilter(category.value)}
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
                      onClick={() => searchCourses({
                        query: '',
                        category: '',
                        level: [],
                        priceRange: [0, 2000000],
                        rating: 0,
                        sortBy: 'rating',
                      })}
                    >
                      Đánh giá cao nhất
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => searchCourses({
                        query: '',
                        category: '',
                        level: [],
                        priceRange: [0, 2000000],
                        rating: 0,
                        sortBy: 'newest',
                      })}
                    >
                      Mới nhất
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => searchCourses({
                        query: '',
                        category: '',
                        level: [],
                        priceRange: [0, 2000000],
                        rating: 0,
                        sortBy: 'popular',
                      })}
                    >
                      Phổ biến nhất
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course List */}
          <div className="lg:w-3/4">
            {/* View Toggle and Results Count */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  {courses.length} khóa học
                </span>
                {selectedCategory && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    {categoriesWithCounts.find(c => c.value === selectedCategory)?.label}
                    <button
                      onClick={() => handleCategoryFilter('')}
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
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Course Grid/List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : courses.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-gray-500 mb-4">
                    <div className="text-4xl mb-2">📚</div>
                    <h3 className="text-xl font-semibold mb-2">Không tìm thấy khóa học</h3>
                    <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                  </div>
                  <Button onClick={() => handleCategoryFilter('')}>
                    Xem tất cả khóa học
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <CourseGrid 
                courses={courses} 
                loading={loading}
                viewMode={viewMode}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
