import { useState, useCallback, useEffect } from 'react';
import { Course, SearchFilters } from '../types';
import { courseService } from '../services/courseService';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCourses = useCallback(async (filters: SearchFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await courseService.searchCourses(filters);
      if (response.success) {
        setCourses(response.data);
      } else {
        setError(response.message || 'Có lỗi xảy ra khi tìm kiếm khóa học');
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPopularCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await courseService.getPopularCourses();
      if (response.success) {
        setCourses(response.data);
      } else {
        setError(response.message || 'Có lỗi xảy ra khi tải khóa học');
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAllCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await courseService.getAllCourses();
      if (response.success) {
        setCourses(response.data);
      } else {
        setError(response.message || 'Có lỗi xảy ra khi tải khóa học');
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load all courses on hook initialization
  useEffect(() => {
    loadAllCourses();
  }, [loadAllCourses]);

  return {
    courses,
    loading,
    error,
    searchCourses,
    loadPopularCourses,
    loadAllCourses,
  };
};
