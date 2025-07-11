import { useState, useEffect } from 'react';
import { Course } from '../types';
import { courseService } from '../services/courseService';

export const useCourseDetail = (courseId: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await courseService.getCourseById(courseId);
        if (response.success) {
          setCourse(response.data);
        } else {
          setError(response.message || 'Không tìm thấy khóa học');
        }
      } catch (err) {
        setError('Không thể tải thông tin khóa học');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  return {
    course,
    loading,
    error,
  };
};
