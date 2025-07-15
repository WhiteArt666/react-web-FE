import React, { useRef, useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Sparkles, Play, ArrowRight, BookOpen, Users, Star, TrendingUp, Trophy, Award, Zap, Target, Brain, Rocket } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const scrollToAIRecommendations = () => {
    const aiSection = document.querySelector('[data-section="ai-recommendations"]');
    if (aiSection) {
      aiSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  const slides = [
    '/images/courses/AI1.jpg',
    '/images/courses/ai2.jpg',
    '/images/courses/ai3.jpg',
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animations
      if (heroRef.current) {
        gsap.fromTo(heroRef.current.querySelector('.hero-badge'), 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );
        
        gsap.fromTo(heroRef.current.querySelector('.hero-title'), 
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power2.out" }
        );
        
        gsap.fromTo(heroRef.current.querySelector('.hero-description'), 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: "power2.out" }
        );
        
        gsap.fromTo(heroRef.current.querySelector('.hero-buttons'), 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: "power2.out" }
        );

        // Slider animation - chỉ animate scale, không animate opacity
        if (sliderRef.current) {
          const slideImages = sliderRef.current.querySelectorAll('.slide-image');
          gsap.fromTo(slideImages, 
            { scale: 1.2 },
            { 
              scale: 1, 
              duration: 1.5, 
              ease: "power2.out"
            }
          );
        }
      }

      // Stats animation on scroll
      if (statsRef.current) {
        gsap.fromTo(statsRef.current.querySelectorAll('.stat-card'), 
          { opacity: 0, y: 50, scale: 0.8 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    // Auto-slide functionality với state
    const interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 7000);

    return () => {
      ctx.revert();
      clearInterval(interval);
    };
  }, [slides.length]);

  const stats = [
    { value: '10,000+', label: 'Khóa học', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
    { value: '500,000+', label: 'Học viên', icon: Users, color: 'from-green-500 to-green-600' },
    { value: '1,000+', label: 'Giảng viên', icon: Star, color: 'from-yellow-500 to-yellow-600' },
    { value: '50+', label: 'Danh mục', icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <section className="relative overflow-hidden min-h-screen bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30">
      {/* Grid background với opacity thấp hơn */}
      <div className="absolute inset-0 bg-grid-black/[0.01] bg-[size:60px_60px]" />
      
      {/* Decorative elements - tăng visibility và responsive */}
      <div className="absolute top-6 left-6 sm:top-10 sm:left-10 w-3 h-3 bg-blue-400/80 rounded-full animate-ping shadow-lg"></div>
      <div className="absolute top-16 right-16 sm:top-20 sm:right-20 w-4 h-4 bg-purple-400/80 rounded-full animate-pulse shadow-lg"></div>
      <div className="absolute bottom-16 left-1/4 sm:bottom-20 w-3 h-3 bg-pink-400/80 rounded-full animate-bounce shadow-lg"></div>
      <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-yellow-400/60 rounded-full animate-ping"></div>
      <div className="absolute bottom-1/3 right-10 w-3 h-3 bg-green-400/60 rounded-full animate-pulse"></div>
      
      <div ref={heroRef} className="relative container mx-auto px-4 py-12 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 sm:space-y-8 z-10 order-2 lg:order-1">
            <Badge className="hero-badge bg-white/20 backdrop-blur-sm text-primary border-primary/30 hover:bg-white/30 text-sm sm:text-lg py-2 px-3 sm:px-4 shadow-sm">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Nền tảng học tập thông minh
            </Badge>
            
            <div className="space-y-4 sm:space-y-6">
              <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-tight">
                Học tập thông minh với{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent relative inline-block">
                  AI
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-3 h-3 sm:w-5 sm:h-5 bg-yellow-400/80 rounded-full animate-ping shadow-lg"></div>
                </span>
              </h1>
              <p className="hero-description text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-xl">
                Khám phá hàng nghìn khóa học chất lượng cao với gợi ý cá nhân hóa từ AI. Tăng tốc hành trình học tập của bạn ngay hôm nay!
              </p>
            </div>
            
            <div className="hero-buttons flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button size="lg" className="text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-7 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 relative overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Play className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 relative z-10" />
                <span className="relative z-10 font-semibold">Bắt đầu học ngay</span>
              </Button>
              <Button variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-7 border-2 border-primary/20 hover:bg-white/10 backdrop-blur-sm group shadow-sm hover:shadow-md transition-all duration-300" onClick={scrollToAIRecommendations}>
                <span className="group-hover:translate-x-1 transition-transform duration-200 font-semibold">Nhận gợi ý từ AI</span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </div>
            
          </div>
          
          <div ref={sliderRef} className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 order-1 lg:order-2">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`slide-image absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                  index === currentSlideIndex ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  backgroundImage: `url(${slide})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 text-white">
                  <h3 className="text-lg sm:text-2xl font-bold">Khóa học nổi bật #{index + 1}</h3>
                  <p className="text-sm sm:text-lg opacity-90">Trải nghiệm học tập đỉnh cao với nội dung chất lượng</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-8 sm:pt-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="stat-card text-center border-0 shadow-md hover:shadow-lg bg-white/40 backdrop-blur-md relative overflow-hidden group transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <CardContent className="p-3 sm:p-6 relative">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-primary group-hover:scale-110 transition-transform duration-200" />
                  <div className="text-xl sm:text-3xl font-extrabold text-foreground">{stat.value}</div>
                  <div className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;