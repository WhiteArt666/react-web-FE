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
        <div className="flex border-b overflow-x-auto">
          {[
            { id: 'overview', label: 'Tổng quan', icon: BookOpen },
            { id: 'curriculum', label: 'Chương trình học', icon: CheckCircle },
            { id: 'instructor', label: 'Giảng viên', icon: User },
            { id: 'reviews', label: 'Đánh giá', icon: Star }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 border-b-2 transition-colors whitespace-nowrap flex-shrink-0 text-sm sm:text-base ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6">
        {activeTab === 'overview' && (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Mô tả khóa học</h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {course.description}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Bạn sẽ học được gì?</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
                {[
                  'Nắm vững kiến thức cơ bản',
                  'Thực hành với dự án thực tế',
                  'Hiểu sâu về best practices',
                  'Xây dựng portfolio chuyên nghiệp',
                  'Chuẩn bị cho công việc thực tế',
                  'Hỗ trợ từ cộng đồng học viên'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold">Chương trình học</h3>
            {[
              { title: 'Giới thiệu và chuẩn bị', lessons: 5, duration: 45 },
              { title: 'Kiến thức cơ bản', lessons: 8, duration: 120 },
              { title: 'Thực hành nâng cao', lessons: 12, duration: 180 },
              { title: 'Dự án thực tế', lessons: 6, duration: 90 },
              { title: 'Triển khai và tối ưu', lessons: 4, duration: 60 }
            ].map((chapter, index) => (
              <Card key={index} className="border">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm sm:text-base truncate">{chapter.title}</h4>
                      <div className="text-xs sm:text-sm text-gray-500 mt-1">
                        {chapter.lessons} bài học • {chapter.duration} phút
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'instructor' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold flex-shrink-0">
                {course.instructor.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold truncate">{course.instructor}</h3>
                <p className="text-gray-600 mb-2 text-sm sm:text-base">Senior Developer & Instructor</p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>4.8 rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>50,000+ học viên</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>25 khóa học</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 text-sm sm:text-base">Giới thiệu</h4>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                Với hơn 10 năm kinh nghiệm trong ngành phát triển phần mềm, 
                {course.instructor} đã giảng dạy cho hàng nghìn học viên trên toàn thế giới.
                Chuyên môn sâu về các công nghệ web hiện đại và phương pháp giảng dạy hiệu quả.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-yellow-500">{course.rating}</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      className={`w-3 h-3 sm:w-4 sm:h-4 ${star <= course.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">{course.reviewCount} đánh giá</div>
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {[
                { name: 'Nguyễn Văn A', rating: 5, comment: 'Khóa học rất tuyệt vời, giảng viên nhiệt tình!' },
                { name: 'Trần Thị B', rating: 4, comment: 'Nội dung chất lượng, dễ hiểu và thực tế.' },
                { name: 'Lê Văn C', rating: 5, comment: 'Đáng đồng tiền bát gạo, recommend cho mọi người!' }
              ].map((review, index) => (
                <Card key={index} className="border">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">
                        {review.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs sm:text-sm truncate">{review.name}</div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                              key={star} 
                              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${star <= review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{review.comment}</p>
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
