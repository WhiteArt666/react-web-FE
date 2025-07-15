import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { TrendingUp, Code, Palette, Music, Globe, Lightbulb, ArrowRight } from 'lucide-react';
import CourseGrid from '../course/CourseGrid';
import { Course } from '../../types';

interface PopularCoursesSectionProps {
  courses: Course[];
  loading: boolean;
  onCategoryClick: (categoryName: string) => void;
}

const PopularCoursesSection: React.FC<PopularCoursesSectionProps> = ({ 
  courses, 
  loading, 
  onCategoryClick 
}) => {
  const navigate = useNavigate();
  
  // Limit to maximum 12 courses
  const displayedCourses = courses.slice(0, 12);
  const hasMoreCourses = courses.length > 12;
  return (
    <section className="py-16 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-32 h-32 bg-orange-200/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-yellow-200/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
            <TrendingUp className="w-4 h-4 mr-2" />
            Xu hướng hot
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Khóa học phổ biến
          </h2>
          <p className="text-xl text-muted-foreground">
            Những khóa học được yêu thích nhất trong tuần
          </p>
          
          {/* Trending stats */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {[
              { label: "Lượt xem tuần này", value: "125K+", icon: "👀" },
              { label: "Học viên đăng ký", value: "15K+", icon: "👥" },
              { label: "Đánh giá 5 sao", value: "98%", icon: "⭐" }
            ].map((stat, index) => (
              <div key={index} className="flex items-center gap-2 bg-white/50 rounded-full px-4 py-2 backdrop-blur-sm">
                <span className="text-lg">{stat.icon}</span>
                <div className="text-left">
                  <div className="text-sm font-semibold text-orange-600">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <CourseGrid 
          courses={displayedCourses} 
          loading={loading}
        />
        
        {/* View More Button */}
        {hasMoreCourses && (
          <div className="text-center mt-8">
            <Button 
              onClick={() => navigate('/courses')}
              size="lg"
              className="group bg-gradient-to-r from-primary-600 to-purple-600 hover:from-orange-600 hover:to-red-600 text-white border-0 px-8 py-3"
            >
              Xem thêm khóa học
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
        
        {/* Course categories quick access */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-6">Khám phá thêm theo chủ đề</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: "Lập trình", icon: Code, color: "bg-blue-500" },
              { name: "Thiết kế", icon: Palette, color: "bg-purple-500" },
              { name: "Âm nhạc", icon: Music, color: "bg-green-500" },
              { name: "Kinh doanh", icon: TrendingUp, color: "bg-orange-500" },
              { name: "Ngôn ngữ", icon: Globe, color: "bg-pink-500" },
              { name: "Khoa học", icon: Lightbulb, color: "bg-cyan-500" }
            ].map((topic, index) => {
              const Icon = topic.icon;
              return (
                <Button 
                  key={index} 
                  variant="outline" 
                  className="group hover:scale-105 transition-all duration-200"
                  onClick={() => onCategoryClick(topic.name)}
                >
                  <div className={`w-4 h-4 mr-2 rounded ${topic.color} text-white flex items-center justify-center`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  {topic.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularCoursesSection;
