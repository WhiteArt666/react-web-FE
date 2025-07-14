import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '../../types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import CourseCard from './CourseCard';
import { Lightbulb, Eye } from 'lucide-react';

interface RelatedCoursesProps {
  course: Course | null;
  relatedCourses: Course[];
  viewedCourses: Course[];
  relatedLoading: boolean;
  user: any;
}

const RelatedCourses: React.FC<RelatedCoursesProps> = ({
  course,
  relatedCourses,
  viewedCourses,
  relatedLoading,
  user
}) => {
  const navigate = useNavigate();

  const renderLoadingGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden h-96 flex flex-col">
          <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-200% animate-pulse"></div>
          <div className="p-6 flex-1 flex flex-col gap-4">
            <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-200% animate-pulse rounded w-4/5"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-200% animate-pulse rounded w-3/5"></div>
            <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-200% animate-pulse rounded w-full"></div>
            <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-200% animate-pulse rounded w-1/2 mt-auto"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div className="space-y-12">
        {/* Related Courses */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Khóa học liên quan</h2>
            {relatedCourses.length > 0 && (
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                {relatedCourses.length} khóa học
              </Badge>
            )}
          </div>
          
          {relatedLoading ? (
            renderLoadingGrid()
          ) : relatedCourses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedCourses.map((relatedCourse) => (
                  <div key={relatedCourse.id} className="relative">
                    <CourseCard course={relatedCourse} />
                    {relatedCourse.category === course?.category && (
                      <Badge className="absolute -top-2 -right-2 bg-blue-100 text-blue-800 border-blue-200">
                        Cùng chủ đề
                      </Badge>
                    )}
                    {relatedCourse.tags.some(tag => course?.tags.includes(tag)) && 
                     relatedCourse.category !== course?.category && (
                      <Badge className="absolute -top-2 -right-2 bg-green-100 text-green-800 border-green-200">
                        Chủ đề tương tự
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/category/${encodeURIComponent(course?.category || '')}`)}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  Xem thêm khóa học {course?.category}
                </Button>
              </div>
            </>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-500 mb-4">
                  <div className="text-4xl mb-2">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">Đang tải khóa học liên quan</h3>
                  <p>Vui lòng đợi trong giây lát...</p>
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Viewed Courses */}
        {user && viewedCourses.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Khóa học đã xem</h2>
              <Badge variant="outline" className="text-purple-600 border-purple-200">
                {viewedCourses.length} khóa học
              </Badge>
            </div>
            
            {relatedLoading ? (
              renderLoadingGrid()
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {viewedCourses.map((viewedCourse) => (
                  <div key={viewedCourse.id} className="relative">
                    <CourseCard course={viewedCourse} />
                    <Badge className="absolute -top-2 -right-2 bg-purple-100 text-purple-800 border-purple-200">
                      Đã xem
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                onClick={() => navigate('/courses')}
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                Khám phá thêm khóa học
              </Button>
            </div>
          </section>
        )}

        {/* Call to Action */}
        {!user && (
          <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Đăng nhập để xem lịch sử khóa học
            </h3>
            <p className="text-gray-600 mb-6">
              Theo dõi tiến trình học tập và nhận gợi ý khóa học phù hợp từ AI
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => navigate('/courses')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Khám phá khóa học
              </Button>
              <Button variant="outline">
                Đăng nhập ngay
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default RelatedCourses;
