import React from 'react';
import { Course } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { 
  BookOpen, 
  CheckCircle, 
  User, 
  Star, 
  Play, 
  Users 
} from 'lucide-react';

interface CourseTabsProps {
  course: Course;
  activeTab: 'overview' | 'curriculum' | 'instructor' | 'reviews';
  setActiveTab: (tab: 'overview' | 'curriculum' | 'instructor' | 'reviews') => void;
}

const CourseTabs: React.FC<CourseTabsProps> = ({
  course,
  activeTab,
  setActiveTab
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex border-b">
          {[
            { id: 'overview', label: 'Tổng quan', icon: BookOpen },
            { id: 'curriculum', label: 'Chương trình học', icon: CheckCircle },
            { id: 'instructor', label: 'Giảng viên', icon: User },
            { id: 'reviews', label: 'Đánh giá', icon: Star }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Mô tả khóa học</h3>
              <p className="text-gray-700 leading-relaxed">
                {course.description}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">Bạn sẽ học được gì?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Nắm vững kiến thức cơ bản',
                  'Thực hành với dự án thực tế',
                  'Hiểu sâu về best practices',
                  'Xây dựng portfolio chuyên nghiệp',
                  'Chuẩn bị cho công việc thực tế',
                  'Hỗ trợ từ cộng đồng học viên'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Chương trình học</h3>
            {[
              { title: 'Giới thiệu và chuẩn bị', lessons: 5, duration: 45 },
              { title: 'Kiến thức cơ bản', lessons: 8, duration: 120 },
              { title: 'Thực hành nâng cao', lessons: 12, duration: 180 },
              { title: 'Dự án thực tế', lessons: 6, duration: 90 },
              { title: 'Triển khai và tối ưu', lessons: 4, duration: 60 }
            ].map((chapter, index) => (
              <Card key={index} className="border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{chapter.title}</h4>
                      <div className="text-sm text-gray-500 mt-1">
                        {chapter.lessons} bài học • {chapter.duration} phút
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'instructor' && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {course.instructor.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{course.instructor}</h3>
                <p className="text-gray-600 mb-2">Senior Developer & Instructor</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>4.8 rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>50,000+ học viên</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>25 khóa học</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Giới thiệu</h4>
              <p className="text-gray-700">
                Với hơn 10 năm kinh nghiệm trong ngành phát triển phần mềm, 
                {course.instructor} đã giảng dạy cho hàng nghìn học viên trên toàn thế giới.
                Chuyên môn sâu về các công nghệ web hiện đại và phương pháp giảng dạy hiệu quả.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-500">{course.rating}</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      className={`w-4 h-4 ${star <= course.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500 mt-1">{course.reviewCount} đánh giá</div>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'Nguyễn Văn A', rating: 5, comment: 'Khóa học rất tuyệt vời, giảng viên nhiệt tình!' },
                { name: 'Trần Thị B', rating: 4, comment: 'Nội dung chất lượng, dễ hiểu và thực tế.' },
                { name: 'Lê Văn C', rating: 5, comment: 'Đáng đồng tiền bát gạo, recommend cho mọi người!' }
              ].map((review, index) => (
                <Card key={index} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{review.name}</div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                              key={star} 
                              className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseTabs;
