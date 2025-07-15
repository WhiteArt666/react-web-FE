import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-secondary-900 to-primary-900 text-white">
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl flex items-center justify-center text-lg sm:text-xl">
                🎓
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                EduMarket
              </span>
            </div>
            
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base max-w-md">
              Nền tảng giáo dục thương mại điện tử tích hợp AI, 
              giúp bạn tìm kiếm và học tập hiệu quả nhất với hơn 10,000+ khóa học chất lượng cao.
            </p>
            
            <div className="flex space-x-3 sm:space-x-4">
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
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110"
                  asChild
                >
                  <a href={href} aria-label={label}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-white">Khóa học</h4>
            <ul className="space-y-2 sm:space-y-3">
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
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-white">Công ty</h4>
            <ul className="space-y-2 sm:space-y-3">
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
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <h4 className="text-base sm:text-lg font-semibold text-white">Hỗ trợ</h4>
              <ul className="space-y-2 sm:space-y-3">
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
            <Card className="bg-white/5 border-white/10 p-3 sm:p-4">
              <h5 className="font-semibold mb-2 sm:mb-3 text-white text-sm sm:text-base">Đăng ký nhận tin</h5>
              <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">
                Nhận thông tin về khóa học mới và ưu đãi đặc biệt
              </p>
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email của bạn"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:bg-white/20 text-sm"
                />
                <Button className="w-full bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-sm py-2">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Đăng ký
                </Button>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="border-t border-white/10 pt-6 sm:pt-8 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-400">Email</p>
                <p className="text-white text-sm sm:text-base truncate">support@edumarket.vn</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-400">Hotline</p>
                <p className="text-white text-sm sm:text-base">1900 1234</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 sm:col-span-2 lg:col-span-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-400">Địa chỉ</p>
                <p className="text-white text-sm sm:text-base">Hà Nội, Việt Nam</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © 2024 EduMarket. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 text-xs sm:text-sm">
              {['Chính sách Cookie', 'Accessibility', 'Sitemap'].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-200 whitespace-nowrap"
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
