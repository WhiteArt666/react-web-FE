import React, { useRef, useEffect, useCallback } from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Palette } from 'lucide-react';
import { CATEGORIES } from '../../constants/categories';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Course } from '../../types';

gsap.registerPlugin(ScrollTrigger);

interface CategoriesSectionProps {
  courses: Course[];
  onCategoryClick: (categoryName: string) => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ courses, onCategoryClick }) => {
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Categories animation
      if (categoriesRef.current) {
        gsap.fromTo(categoriesRef.current.querySelectorAll('.category-card'), 
          { opacity: 0, y: 15, rotationY: 15 },
          { 
            opacity: 1, 
            y: 0, 
            rotationY: 0,
            duration: 0.2,
            stagger: 0.02,
            ease: "power2.out",
            scrollTrigger: {
              trigger: categoriesRef.current,
              start: "top 85%",
              end: "bottom 40%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Tính toán số lượng khóa học theo category từ courses data
  const getCategoryCount = useCallback((categoryName: string) => {
    return courses.filter(course => 
      course.category?.toLowerCase() === categoryName.toLowerCase()
    ).length;
  }, [courses]);

  return (
    <section className="py-16 bg-muted/30 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-200/20 rounded-full blur-xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
            <Palette className="w-4 h-4 mr-2" />
            Danh mục đa dạng
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Danh mục phổ biến
          </h2>
          <p className="text-xl text-muted-foreground">
            Khám phá các lĩnh vực học tập đa dạng
          </p>
        </div>
        
        <div ref={categoriesRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {CATEGORIES.map((categoryItem, index) => (
            <Card 
              key={index} 
              className="category-card group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-3 border-0 bg-white relative overflow-hidden hover-lift enhanced-card tilt-effect"
              onClick={() => onCategoryClick(categoryItem.name)}
            >
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <CardContent className="p-6 text-center relative">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${categoryItem.color} flex items-center justify-center text-2xl text-white shadow-lg group-hover:scale-125 group-hover:rotate-12 transition-all duration-300`}>
                  {categoryItem.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {categoryItem.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {getCategoryCount(categoryItem.name)} khóa học
                </p>
                
                {/* Category badge */}
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Badge variant="secondary" className="text-xs">
                    Khám phá ngay
                  </Badge>
                </div>
              </CardContent>
              
              {/* Decorative corner */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-primary/20 rounded-full group-hover:bg-primary/40 transition-colors duration-300"></div>
            </Card>
          ))}
        </div>
        
        {/* Additional category info
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            🎯 Chọn danh mục phù hợp với mục tiêu học tập của bạn
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Trending', 'New', 'Popular', 'Beginner Friendly'].map((tag, index) => (
              <Badge key={index} variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
                {tag}
              </Badge>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default CategoriesSection;
