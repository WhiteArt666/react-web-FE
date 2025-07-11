import React, { useRef, useEffect } from 'react';
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
        
        gsap.fromTo(heroRef.current.querySelector('.hero-visual'), 
          { opacity: 0, scale: 0.8, rotation: -10 },
          { opacity: 1, scale: 1, rotation: 0, duration: 1.2, delay: 0.3, ease: "back.out(1.7)" }
        );
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

    return () => ctx.revert();
  }, []);

  const stats = [
    { value: '10,000+', label: 'Khóa học', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
    { value: '500,000+', label: 'Học viên', icon: Users, color: 'from-green-500 to-green-600' },
    { value: '1,000+', label: 'Giảng viên', icon: Star, color: 'from-yellow-500 to-yellow-600' },
    { value: '50+', label: 'Danh mục', icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
  ];

  const achievementBadges = [
    { icon: Trophy, label: 'Top Rated', color: 'bg-yellow-500' },
    { icon: Award, label: 'Best Seller', color: 'bg-purple-500' },
    { icon: Zap, label: 'Fast Track', color: 'bg-blue-500' },
    { icon: Target, label: 'Goal Oriented', color: 'bg-green-500' },
    { icon: Brain, label: 'AI Powered', color: 'bg-pink-500' },
    { icon: Rocket, label: 'Accelerated', color: 'bg-orange-500' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-50 to-pink-50 z-10">
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:60px_60px]" />
      
      {/* Additional decorative elements */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
      <div className="absolute top-20 right-20 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
      
      <div ref={heroRef} className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge className="hero-badge bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Nền tảng học tập thông minh
            </Badge>
            
            <div className="space-y-4">
              <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Học tập thông minh với{' '}
                <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent relative">
                  AI
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                </span>
              </h1>
              <p className="hero-description text-xl md:text-2xl text-muted-foreground leading-relaxed">
                Khám phá hàng nghìn khóa học chất lượng cao với gợi ý cá nhân hóa từ AI. 
                Tìm kiếm, học tập và phát triển kỹ năng một cách hiệu quả nhất.
              </p>
            </div>
            
            <div className="hero-buttons flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8 py-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Play className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">Bắt đầu học ngay</span>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 relative group">
                <span className="group-hover:translate-x-1 transition-transform duration-200">Khám phá khóa học</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </div>
            
            {/* Achievement Badges */}
            <div className="flex flex-wrap gap-2 pt-4">
              {achievementBadges.slice(0, 3).map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <Badge key={index} className={`${badge.color} text-white border-0 px-3 py-1`}>
                    <Icon className="w-3 h-3 mr-1" />
                    {badge.label}
                  </Badge>
                );
              })}
            </div>
            
            <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="stat-card text-center border-0 shadow-sm bg-white/50 backdrop-blur-sm relative overflow-hidden group hover-lift enhanced-card">
                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    <CardContent className="p-4 relative">
                      <Icon className="w-6 h-6 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform duration-200 magnetic" />
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end">
            <div className="hero-visual relative">
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
              <div className="absolute top-1/2 -left-8 w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-sm animate-spin shadow-lg">
                💡
              </div>
              <div className="absolute top-10 left-10 w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-xs animate-pulse shadow-lg">
                🚀
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
