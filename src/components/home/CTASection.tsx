import React from 'react';
import { Button } from '../ui/button';
import { Rocket, Star, Trophy, Heart, Globe, Award, Play, ArrowRight } from 'lucide-react';

const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-purple-600 to-pink-600 text-white relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-800/20"></div>
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Enhanced CTA content */}
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-4">
                {[Rocket, Star, Trophy].map((Icon, index) => (
                  <div key={index} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                ))}
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Bắt đầu hành trình học tập ngay hôm nay
            </h2>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              Tham gia cộng đồng học tập với hơn 500,000 học viên trên toàn thế giới
            </p>
          </div>
          
          {/* Enhanced CTA features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            {[
              { icon: Heart, title: "Miễn phí mãi mãi", desc: "Không ẩn phí" },
              { icon: Globe, title: "Học mọi lúc", desc: "24/7 truy cập" },
              { icon: Award, title: "Chứng chỉ", desc: "Được công nhận" }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <Icon className="w-8 h-8 mx-auto mb-2 text-white" />
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm opacity-80">{feature.desc}</p>
                </div>
              );
            })}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Play className="w-5 h-5 mr-2" />
              Đăng ký miễn phí
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Khám phá khóa học
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
          
          {/* Social proof */}
          <div className="pt-8 border-t border-white/20">
            <p className="text-sm opacity-80 mb-4">Được tin tưởng bởi các công ty hàng đầu</p>
            <div className="flex justify-center items-center gap-8 opacity-60">
              {['🏢', '🚀', '💼', '🌟', '🎯'].map((icon, index) => (
                <div key={index} className="text-2xl">{icon}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
