import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Course } from '../types';
import { useCourses } from '../hooks/useCourses';
import { CATEGORIES } from '../constants/categories';
import SearchBar from '../components/common/SearchBar';
import CourseGrid from '../components/course/CourseGrid';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ArrowLeft, BookOpen, Users, Star, Filter, Grid, List } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const navigate = useNavigate();
  const { courses, loading, searchCourses, loadAllCourses } = useCourses();
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Decode the category name từ URL
  const decodedCategoryName = categoryName ? decodeURIComponent(categoryName) : '';
  const currentCategory = CATEGORIES.find(cat => cat.name === decodedCategoryName);

  // Load courses khi component mount
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    loadAllCourses();
  }, [loadAllCourses]);

  useEffect(() => {
    if (decodedCategoryName && courses.length > 0) {
      console.log('CategoryPage - Filtering courses:', {
        decodedCategoryName,
        totalCourses: courses.length,
        coursesData: courses.map(c => ({ id: c.id, title: c.title, category: c.category }))
      });
      
      // Filter courses by category
      const filtered = courses.filter(course => 
        course.category?.toLowerCase() === decodedCategoryName.toLowerCase()
      );
      
      console.log('CategoryPage - Filtered courses:', {
        filteredCount: filtered.length,
        filteredCourses: filtered.map(c => ({ id: c.id, title: c.title, category: c.category }))
      });
      
      setFilteredCourses(filtered);
    }
  }, [courses, decodedCategoryName]);

  const handleSearch = useCallback((filters: any) => {
    searchCourses({ ...filters, category: decodedCategoryName });
  }, [searchCourses, decodedCategoryName]);

  const handleSort = (sortType: string) => {
    setSortBy(sortType);
    let sorted = [...filteredCourses];
    
    switch (sortType) {
      case 'popular':
        // Use students count or default to 0 if not available
        sorted = sorted.sort((a, b) => {
          const aStudents = (a as any).students || 0;
          const bStudents = (b as any).students || 0;
          return bStudents - aStudents;
        });
        break;
      case 'rating':
        sorted = sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        sorted = sorted.sort((a, b) => {
          const aDate = new Date(a.createdAt || '').getTime();
          const bDate = new Date(b.createdAt || '').getTime();
          return bDate - aDate;
        });
        break;
      case 'price-low':
        sorted = sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        sorted = sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        break;
    }
    
    setFilteredCourses(sorted);
  };

  const stats = [
    { value: filteredCourses.length.toString(), label: 'Khóa học', icon: BookOpen },
    { value: '15,000+', label: 'Học viên', icon: Users },
    { value: '4.8', label: 'Đánh giá', icon: Star },
  ];

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Danh mục không tồn tại</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${currentCategory.color} text-white`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative container mx-auto px-4 py-16">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Trang chủ
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm">
                  {currentCategory.icon}
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold">
                    {currentCategory.name}
                  </h1>
                  <p className="text-xl opacity-90 mt-2">
                    {currentCategory.description}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index} className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                      <CardContent className="p-4 text-center">
                        <Icon className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-sm opacity-80">{stat.label}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <div className="text-8xl">{currentCategory.icon}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <SearchBar onSearch={handleSearch} loading={loading} />
            </div>
            
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="outline" className="text-sm">
                <Filter className="w-4 h-4 mr-2" />
                Sắp xếp theo
              </Badge>
              <select 
                value={sortBy} 
                onChange={(e) => handleSort(e.target.value)}
                className="px-4 py-2 border rounded-md bg-background"
              >
                <option value="popular">Phổ biến</option>
                <option value="rating">Đánh giá cao</option>
                <option value="newest">Mới nhất</option>
                <option value="price-low">Giá thấp</option>
                <option value="price-high">Giá cao</option>
              </select>
              
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-8 sm:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              Khóa học {currentCategory.name}
            </h2>
            <p className="text-muted-foreground">
              Tìm thấy {filteredCourses.length} khóa học
            </p>
          </div>
          
          <CourseGrid 
            courses={filteredCourses} 
            loading={loading}
            viewMode={viewMode}
          />
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;