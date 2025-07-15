import React from 'react';
import { Course } from '../../types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { formatPrice } from '../../lib/utils';
import AddToCartButton from '../cart/AddToCartButton';
import { 
  Share2, 
  Download, 
  CheckCircle, 
  BookOpen, 
  Globe, 
  Calendar 
} from 'lucide-react';

interface CourseSidebarProps {
  course: Course;
  onEnroll: () => void;
  getLevelColor: (level: string) => string;
  getLevelText: (level: string) => string;
  formatDuration: (duration: number) => string;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  course,
  onEnroll,
  getLevelColor,
  getLevelText,
  formatDuration
}) => {
  return (
    <div className="space-y-6">
      {/* Price & Enroll Card */}
      <Card className="sticky top-4">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              {course.originalPrice && course.originalPrice > course.price && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(course.originalPrice)}
                </span>
              )}
              <span className="text-3xl font-bold text-blue-600">
                {formatPrice(course.price)}
              </span>
            </div>
            {course.originalPrice && course.originalPrice > course.price && (
              <Badge className="bg-red-100 text-red-800">
                Giảm {Math.round((1 - course.price / course.originalPrice) * 100)}%
              </Badge>
            )}
          </div>

          <Button 
            onClick={onEnroll}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium mb-3"
          >
            Đăng ký học ngay
          </Button>

          <AddToCartButton 
            course={course}
            size="lg"
            className="w-full mb-3"
            showText={true}
          />

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Chia sẻ
            </Button>
            <Button variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Tải xuống
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Truy cập trọn đời</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Chứng chỉ hoàn thành</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Hỗ trợ 24/7</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Cộng đồng học viên</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Info */}
      <Card>
        <div className="p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <BookOpen className="w-5 h-5" />
            Thông tin khóa học
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Thời lượng:</span>
              <span className="font-medium">{formatDuration(course.duration)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cấp độ:</span>
              <Badge className={getLevelColor(course.level)}>
                {getLevelText(course.level)}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Danh mục:</span>
              <span className="font-medium">{course.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ngôn ngữ:</span>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span className="font-medium">Tiếng Việt</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cập nhật:</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">
                  {new Date(course.updatedAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CourseSidebar;
