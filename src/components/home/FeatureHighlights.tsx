import React from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Zap, Brain, Rocket, Globe } from 'lucide-react';

const FeatureHighlights: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Cá nhân hóa",
      description: "Hệ thống AI thông minh gợi ý khóa học phù hợp với bạn",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Rocket,
      title: "Học tập nhanh",
      description: "Phương pháp học tập tối ưu giúp bạn tiến bộ nhanh chóng",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Globe,
      title: "Cộng đồng toàn cầu",
      description: "Kết nối với hàng triệu học viên trên khắp thế giới",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 to-cyan-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
            <Zap className="w-4 h-4 mr-2" />
            Tính năng nổi bật
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tại sao chọn chúng tôi?
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm hover-lift enhanced-card glass-effect">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 magnetic pulse-glow`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
