import React, { useEffect, useState, useCallback } from 'react';
import { Course } from '../types';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../hooks/useCourses';
import { useAuth } from '../contexts/AuthContext';
import {
  FloatingBackground,
  HeroSection,
  SearchSection,
  FeatureHighlights,
  CategoriesSection,
  AIRecommendationsSection,
  PopularCoursesSection,
  CTASection
} from '../components/home';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courses, loading, searchCourses, loadAllCourses, loadPopularCourses } = useCourses();
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Load all courses for category counts
    loadAllCourses();
    // Load popular courses for display
    loadPopularCourses();
  }, [loadAllCourses, loadPopularCourses]);

  // Set popular courses when courses change
  useEffect(() => {
    const popular = courses.filter(course => course.isPopular);
    setPopularCourses(popular);
  }, [courses]);

  const handleSearch = useCallback((filters: any) => {
    searchCourses(filters);
  }, [searchCourses]);

  const handleCategoryClick = useCallback((categoryName: string) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingBackground />
      
      <HeroSection />
      
      <SearchSection onSearch={handleSearch} loading={loading} />
      
      {/* <FeatureHighlights /> */}
      
      <CategoriesSection 
        courses={courses} 
        onCategoryClick={handleCategoryClick} 
      />

      <PopularCoursesSection 
        courses={popularCourses} 
        loading={loading}
        onCategoryClick={handleCategoryClick}
      />
      
      <AIRecommendationsSection />
      
      
      <CTASection />
    </div>
  );
};

export default HomePage;
