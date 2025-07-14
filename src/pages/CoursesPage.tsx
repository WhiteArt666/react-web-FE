import React, { useEffect, useState } from 'react';
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

  const handleQuickFilter = (sortBy: string) => {
    searchCourses({
      query: '',
      category: '',
      level: [],
      priceRange: [0, 2000000],
      rating: 0,
      sortBy: sortBy as 'relevance' | 'rating' | 'price_low' | 'price_high' | 'newest' | 'popular',
    });
  };

  const handleClearCategory = () => {
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
