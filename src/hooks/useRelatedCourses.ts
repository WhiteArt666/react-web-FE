import { useState, useEffect } from 'react';
import { Course } from '../types';
import { courseService } from '../services/courseService';

export const useRelatedCourses = (currentCourse: Course | null, userId?: string) => {
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  const [viewedCourses, setViewedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRelatedAndViewedCourses = async () => {
      if (!currentCourse) return;

      setLoading(true);
      try {
        // Lấy tất cả khóa học
        const allCoursesResponse = await courseService.getAllCourses();
        const allCourses = allCoursesResponse.data;

        // Lọc khóa học liên quan với nhiều cấp độ ưu tiên
        let related: Course[] = [];
        
        // Cấp 1: Khóa học cùng category
        const sameCategoryCourses = allCourses.filter(course => 
          course.id !== currentCourse.id && 
          course.category === currentCourse.category
        );
        
        // Cấp 2: Khóa học có tags tương tự
        const similarTagsCourses = allCourses.filter(course => 
          course.id !== currentCourse.id && 
          course.category !== currentCourse.category &&
          course.tags.some(tag => currentCourse.tags.includes(tag))
        );
        
        // Cấp 3: Khóa học cùng level (nếu cần thiết)
        const sameLevelCourses = allCourses.filter(course => 
          course.id !== currentCourse.id && 
          course.category !== currentCourse.category &&
          course.level === currentCourse.level &&
          !course.tags.some(tag => currentCourse.tags.includes(tag))
        );
        
        // Cấp 4: Khóa học phổ biến khác
        const popularCourses = allCourses.filter(course => 
          course.id !== currentCourse.id && 
          course.category !== currentCourse.category &&
          course.level !== currentCourse.level &&
          !course.tags.some(tag => currentCourse.tags.includes(tag)) &&
          (course.isPopular || course.rating >= 4.5)
        );
        
        // Sắp xếp mỗi nhóm theo rating
        const sortByRating = (courses: Course[]) => 
          courses.sort((a, b) => b.rating - a.rating);
        
        // Kết hợp theo thứ tự ưu tiên
        related = [
          ...sortByRating(sameCategoryCourses).slice(0, 4),
          ...sortByRating(similarTagsCourses).slice(0, 3),
          ...sortByRating(sameLevelCourses).slice(0, 2),
          ...sortByRating(popularCourses).slice(0, 3)
        ].slice(0, 6); // Lấy tối đa 6 khóa học
        
        // Nếu vẫn không đủ 6 khóa học, lấy thêm từ tất cả khóa học khác
        if (related.length < 6) {
          const remainingCourses = allCourses
            .filter(course => 
              course.id !== currentCourse.id && 
              !related.some(r => r.id === course.id)
            )
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 6 - related.length);
          
          related = [...related, ...remainingCourses];
        }

        setRelatedCourses(related);
        
        console.log('Related courses found:', {
          currentCourse: currentCourse.title,
          currentCategory: currentCourse.category,
          currentTags: currentCourse.tags,
          totalAvailable: allCourses.length,
          sameCategoryCount: sameCategoryCourses.length,
          similarTagsCount: similarTagsCourses.length,
          sameLevelCount: sameLevelCourses.length,
          popularCount: popularCourses.length,
          finalRelatedCount: related.length,
          relatedTitles: related.map(c => c.title)
        });

        // Lấy khóa học đã xem từ localStorage nếu có userId
        if (userId) {
          const viewedCourseIds = getViewedCourseIds(userId, currentCourse.id);
          const viewed = allCourses
            .filter(course => viewedCourseIds.includes(course.id))
            .slice(0, 6); // Lấy tối đa 6 khóa học đã xem

          setViewedCourses(viewed);
        }
      } catch (error) {
        console.error('Error fetching related courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedAndViewedCourses();
  }, [currentCourse, userId]);

  return { relatedCourses, viewedCourses, loading };
};

// Helper function để lấy danh sách ID khóa học đã xem
const getViewedCourseIds = (userId: string, currentCourseId: string): string[] => {
  try {
    const behaviorKey = `user_behavior_${userId}`;
    const behaviorData = localStorage.getItem(behaviorKey);
    
    if (behaviorData) {
      const behavior = JSON.parse(behaviorData);
      return behavior.viewedCourses?.filter((id: string) => id !== currentCourseId) || [];
    }
  } catch (error) {
    console.error('Error reading user behavior:', error);
  }
  
  return [];
};
