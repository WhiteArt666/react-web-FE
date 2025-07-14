import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Course } from '../types';
import { useCourseDetail } from '../hooks/useCourseDetail';
import { useRelatedCourses } from '../hooks/useRelatedCourses';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { courseService } from '../services/courseService';
import { formatDuration } from '../lib/utils';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  CourseDetailHeader,
  CourseHero,
  CourseTabs,
  CourseSidebar,
  RelatedCourses
} from '../components/course';

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
      <CourseDetailHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Hero */}
            <CourseHero
              course={course}
              isCourseFavorite={isCourseFavorite}
              onFavoriteClick={handleFavoriteClick}
              getLevelColor={getLevelColor}
              getLevelText={getLevelText}
            />

            {/* Tabs */}
            <CourseTabs
              course={course}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {/* Sidebar */}
          <CourseSidebar
            course={course}
            onEnroll={handleEnroll}
            getLevelColor={getLevelColor}
            getLevelText={getLevelText}
            formatDuration={formatDuration}
          />
        </div>
      </div>

      {/* Related Courses and Viewed Courses Section */}
      <RelatedCourses
        course={course}
        relatedCourses={relatedCourses}
        viewedCourses={viewedCourses}
        relatedLoading={relatedLoading}
        user={user}
      />
    </div>
  );
};

export default CourseDetailPage;
