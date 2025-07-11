import React from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Brain, Target, Lightbulb, TrendingUp } from 'lucide-react';
import AIRecommendations from '../common/AIRecommendations';

const AIRecommendationsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden">
      {/* Enhanced background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-100/30 to-blue-100/30"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
            <Brain className="w-4 h-4 mr-2" />
            Powered by AI
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Gợi ý thông minh cho bạn
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI của chúng tôi phân tích sở thích và mục tiêu học tập để đưa ra những gợi ý khóa học phù hợp nhất
          </p>
        </div>
        
        <AIRecommendations />
        
        {/* AI Features showcase */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: "Phân tích mục tiêu",
              description: "AI hiểu rõ mục tiêu học tập của bạn",
              stats: "99% độ chính xác"
            },
            {
              icon: Lightbulb,
              title: "Gợi ý thông minh",
              description: "Đề xuất khóa học phù hợp với trình độ",
              stats: "500K+ gợi ý/ngày"
            },
            {
              icon: TrendingUp,
              title: "Theo dõi tiến độ",
              description: "Cập nhật học tập theo thời gian thực",
              stats: "24/7 monitoring"
            }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{feature.description}</p>
                  <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                    {feature.stats}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AIRecommendationsSection;
