import React, { useEffect, useState, useCallback } from 'react';
import { Course } from '../types';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../hooks/useCourses';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORIES } from '../constants/categories';
import SearchBar from '../components/common/SearchBar';
import AIRecommendations from '../components/common/AIRecommendations';
import CourseGrid from '../components/course/CourseGrid';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Sparkles, TrendingUp, Users, BookOpen, Star, Play, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courses, loading, searchCourses, loadAllCourses, loadPopularCourses } = useCourses();
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Load all courses for category counts
    loadAllCourses();
    // Load popular courses for display
    loadPopularCourses();
  }, [loadAllCourses, loadPopularCourses]);

  // Set popular courses when courses change
  useEffect(() => {
    const popular = courses.filter(course => course.isPopular);
    setPopularCourses(popular);
  }, [courses]);

  const handleSearch = useCallback((filters: any) => {
    searchCourses(filters);
  }, [searchCourses]);

   const handleCategoryClick = useCallback((categoryName: string) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  }, [navigate]);

  // Tính toán số lượng khóa học theo category từ courses data
  const getCategoryCount = useCallback((categoryName: string) => {
    return courses.filter(course => 
      course.category?.toLowerCase() === categoryName.toLowerCase()
    ).length;
  }, [courses]);

  const stats = [
    { value: '10,000+', label: 'Khóa học', icon: BookOpen },
    { value: '500,000+', label: 'Học viên', icon: Users },
    { value: '1,000+', label: 'Giảng viên', icon: Star },
    { value: '50+', label: 'Danh mục', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-50 to-pink-50">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:60px_60px]" />
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                <Sparkles className="w-4 h-4 mr-2" />
                Nền tảng học tập thông minh
              </Badge>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Học tập thông minh với{' '}
                  <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    AI
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                  Khám phá hàng nghìn khóa học chất lượng cao với gợi ý cá nhân hóa từ AI. 
                  Tìm kiếm, học tập và phát triển kỹ năng một cách hiệu quả nhất.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 py-6">
                  <Play className="w-5 h-5 mr-2" />
                  Bắt đầu học ngay
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Khám phá khóa học
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index} className="text-center border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                      <CardContent className="p-4">
                        <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-80 lg:w-96 lg:h-96">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-full blur-3xl" />
                  <div className="relative w-full h-full bg-gradient-to-br from-white to-gray-50 rounded-full flex items-center justify-center border border-gray-200 shadow-2xl">
                    <div className="text-8xl lg:text-9xl">🎓</div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl animate-bounce shadow-lg">
                  ⭐
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-lg animate-pulse shadow-lg">
                  📚
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Danh mục phổ biến
            </h2>
            <p className="text-xl text-muted-foreground">
              Khám phá các lĩnh vực học tập đa dạng
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIES.map((categoryItem, index) => (
              <Card 
                key={index} 
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-2 border-0 bg-white"
                onClick={() => handleCategoryClick(categoryItem.name)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${categoryItem.color} flex items-center justify-center text-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {categoryItem.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {categoryItem.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getCategoryCount(categoryItem.name)} khóa học
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendations Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <AIRecommendations />
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-orange-100 text-orange-700 border-orange-200">
              <TrendingUp className="w-4 h-4 mr-2" />
              Xu hướng hot
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Khóa học phổ biến
            </h2>
            <p className="text-xl text-muted-foreground">
              Những khóa học được yêu thích nhất trong tuần
            </p>
          </div>
          <CourseGrid 
            courses={popularCourses} 
            loading={loading}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Bắt đầu hành trình học tập ngay hôm nay
            </h2>
            <p className="text-xl md:text-2xl opacity-90">
              Tham gia cộng đồng học tập với hơn 500,000 học viên trên toàn thế giới
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Đăng ký miễn phí
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20">
                Khám phá khóa học
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
