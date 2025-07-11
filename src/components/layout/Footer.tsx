import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-secondary-900 to-primary-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl flex items-center justify-center text-xl">
                🎓
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                EduMarket
              </span>
            </div>
            
            <p className="text-gray-300 leading-relaxed max-w-md">
              Nền tảng giáo dục thương mại điện tử tích hợp AI, 
              giúp bạn tìm kiếm và học tập hiệu quả nhất với hơn 10,000+ khóa học chất lượng cao.
            </p>
            
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
              ].map(({ icon: Icon, href, label }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110"
                  asChild
                >
                  <a href={href} aria-label={label}>
                    <Icon className="w-5 h-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Khóa học</h4>
            <ul className="space-y-3">
              {['Lập trình', 'Thiết kế', 'Marketing', 'Kinh doanh', 'Khoa học dữ liệu', 'Công nghệ'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-200 hover:underline text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Công ty</h4>
            <ul className="space-y-3">
              {['Về chúng tôi', 'Tuyển dụng', 'Liên hệ', 'Đối tác', 'Tin tức', 'Blog'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-200 hover:underline text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support & Newsletter */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Hỗ trợ</h4>
              <ul className="space-y-3">
                {['Trung tâm trợ giúp', 'Điều khoản', 'Bảo mật', 'FAQ'].map((item) => (
                  <li key={item}>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-primary-400 transition-colors duration-200 hover:underline text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Newsletter */}
            <Card className="bg-white/5 border-white/10 p-4">
              <h5 className="font-semibold mb-3 text-white">Đăng ký nhận tin</h5>
              <p className="text-gray-400 text-sm mb-3">
                Nhận thông tin về khóa học mới và ưu đãi đặc biệt
              </p>
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email của bạn"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:bg-white/20"
                />
                <Button className="w-full bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700">
                  <Mail className="w-4 h-4 mr-2" />
                  Đăng ký
                </Button>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white">support@edumarket.vn</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Hotline</p>
                <p className="text-white">1900 1234</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Địa chỉ</p>
                <p className="text-white">Hà Nội, Việt Nam</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 EduMarket. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              {['Chính sách Cookie', 'Accessibility', 'Sitemap'].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
