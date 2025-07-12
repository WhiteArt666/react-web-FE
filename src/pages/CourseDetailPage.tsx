import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Course } from '../types';
import { useCourseDetail } from '../hooks/useCourseDetail';
import { useRelatedCourses } from '../hooks/useRelatedCourses';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { courseService } from '../services/courseService';
import { formatPrice, formatDuration } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CourseCard from '../components/course/CourseCard';
import { 
  ArrowLeft, 
  Heart, 
  Clock, 
  Star, 
  User, 
  BookOpen, 
  Play,
  Download,
  Share2,
  Award,
  CheckCircle,
  Users,
  Globe,
  Calendar,
  Eye,
  Lightbulb
} from 'lucide-react';

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { course, loading, error } = useCourseDetail(courseId || '');
  const { relatedCourses, viewedCourses, loading: relatedLoading } = useRelatedCourses(course, user?.id);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor' | 'reviews'>('overview');

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    if (!courseId) {
      navigate('/courses');
      return;
    }

    // Lưu hành vi xem chi tiết khi component mount và có course
    if (user && course) {
      courseService.saveUserBehavior(user.id, 'view_detail', courseId);
    }
  }, [courseId, navigate, user, course]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Có lỗi xảy ra</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate('/courses')}>
              Quay lại danh sách khóa học
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Không tìm thấy khóa học</h2>
            <p className="text-gray-600 mb-6">Khóa học bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Button onClick={() => navigate('/courses')}>
              Quay lại danh sách khóa học
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isCourseFavorite = isFavorite(course.id);

  const handleFavoriteClick = () => {
    if (isCourseFavorite) {
      removeFromFavorites(course.id);
      if (user) {
        courseService.saveUserBehavior(user.id, 'unfavorite', course.id);
      }
    } else {
      addToFavorites(course);
      if (user) {
        courseService.saveUserBehavior(user.id, 'favorite', course.id);
      }
    }
  };

  const handleEnroll = () => {
    // Logic đăng ký khóa học
    if (user) {
      courseService.saveUserBehavior(user.id, 'enroll', course.id);
      alert('Đăng ký khóa học thành công! (Demo)');
    } else {
      alert('Vui lòng đăng nhập để đăng ký khóa học');
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Cơ bản';
      case 'intermediate': return 'Trung cấp';
      case 'advanced': return 'Nâng cao';
      default: return level;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header với nút back */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Hero */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/courses/course1.jpg';
                    }}
                  />
                  {course.isPopular && (
                    <Badge className="absolute top-4 left-4 bg-orange-500 text-white">
                      🔥 Phổ biến
                    </Badge>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {course.title}
                      </h1>
                      <p className="text-gray-600 text-lg mb-4">
                        {course.description}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleFavoriteClick}
                      className={`ml-4 ${isCourseFavorite ? 'text-red-500 border-red-200' : 'text-gray-500'}`}
                    >
                      <Heart className={`w-4 h-4 ${isCourseFavorite ? 'fill-current' : ''}`} />
                    </Button>
                  </div>

                  {/* Course Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{course.rating}</span>
                      <span className="text-gray-500">({course.reviewCount} đánh giá)</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{course.instructor}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{formatDuration(course.duration)}</span>
                    </div>
                    
                    <Badge className={getLevelColor(course.level)}>
                      {getLevelText(course.level)}
                    </Badge>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
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
          </div>

          {/* Sidebar */}
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
                  onClick={handleEnroll}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium mb-3"
                >
                  Đăng ký học ngay
                </Button>

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
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Thông tin khóa học
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Related Courses and Viewed Courses Section */}
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
    </div>
  );
};

export default CourseDetailPage;
