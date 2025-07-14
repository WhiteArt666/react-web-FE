import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Course } from '../types';
import { useCourses } from '../hooks/useCourses';
import { useAuth } from '../contexts/AuthContext';
import CourseGrid from '../components/course/CourseGrid';
import {
  CoursesHeader,
  CoursesFilter,
  CoursesResultsHeader,
  CoursesEmptyState,
  CoursesLoadingSpinner
} from '../components/course';

const CoursesPage: React.FC = () => {
  const { user } = useAuth();
  const { courses, loading, searchCourses, loadPopularCourses } = useCourses();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentQuery, setCurrentQuery] = useState('');

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
    
    // Get query parameters
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const level = searchParams.get('level') || '';
    const popular = searchParams.get('popular') === 'true';
    
    // Set current state
    setCurrentQuery(query);
    setSelectedCategory(category);
    
    // Build search filters based on URL params
    const filters = {
      query,
      category,
      level: level ? [level] : [],
      priceRange: [0, 2000000] as [number, number],
      rating: 0,
      sortBy: popular ? 'popular' : 'relevance' as 'relevance' | 'rating' | 'price_low' | 'price_high' | 'newest' | 'popular',
    };
    
    // Search with filters
    searchCourses(filters);
  }, [searchCourses, searchParams]);

  const handleSearch = (filters: any) => {
    // Update URL params
    const newSearchParams = new URLSearchParams();
    if (filters.query) newSearchParams.set('q', filters.query);
    if (filters.category) newSearchParams.set('category', filters.category);
    if (filters.level && filters.level.length > 0) newSearchParams.set('level', filters.level[0]);
    if (filters.sortBy === 'popular') newSearchParams.set('popular', 'true');
    
    setSearchParams(newSearchParams);
    searchCourses(filters);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    
    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams);
    if (category) {
      newSearchParams.set('category', category);
    } else {
      newSearchParams.delete('category');
    }
    setSearchParams(newSearchParams);
    
    searchCourses({
      query: currentQuery,
      category,
      level: [],
      priceRange: [0, 2000000],
      rating: 0,
      sortBy: 'relevance',
    });
  };

  const handleQuickFilter = (sortBy: string) => {
    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams);
    if (sortBy === 'popular') {
      newSearchParams.set('popular', 'true');
    } else {
      newSearchParams.delete('popular');
    }
    setSearchParams(newSearchParams);
    
    searchCourses({
      query: currentQuery,
      category: selectedCategory,
      level: [],
      priceRange: [0, 2000000],
      rating: 0,
      sortBy: sortBy as 'relevance' | 'rating' | 'price_low' | 'price_high' | 'newest' | 'popular',
    });
  };

  const handleClearCategory = () => {
    // Clear URL params
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('category');
    newSearchParams.delete('level');
    setSearchParams(newSearchParams);
    
    handleCategoryFilter('');
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
      <CoursesHeader 
        stats={stats}
        onSearch={handleSearch}
        loading={loading}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <CoursesFilter
            categories={categoriesWithCounts}
            selectedCategory={selectedCategory}
            onCategoryFilter={handleCategoryFilter}
            onQuickFilter={handleQuickFilter}
          />

          {/* Course List */}
          <div className="lg:w-3/4">
            {/* Search Results Header */}
            {currentQuery && (
              <div className="mb-6 p-4 bg-white rounded-lg border shadow-sm">
                <h2 className="text-lg font-semibold mb-2">
                  Kết quả tìm kiếm cho "{currentQuery}"
                </h2>
                <p className="text-muted-foreground">
                  Tìm thấy {courses.length} khóa học phù hợp
                </p>
              </div>
            )}
            
            {/* View Toggle and Results Count */}
            <CoursesResultsHeader
              coursesCount={courses.length}
              selectedCategory={selectedCategory}
              categories={categoriesWithCounts}
              viewMode={viewMode}
              onClearCategory={handleClearCategory}
              onViewModeChange={setViewMode}
            />

            {/* Course Grid/List */}
            {loading ? (
              <CoursesLoadingSpinner />
            ) : courses.length === 0 ? (
              <CoursesEmptyState onShowAllCourses={handleClearCategory} />
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
