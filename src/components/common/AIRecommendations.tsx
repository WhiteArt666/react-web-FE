import React, { useState, useEffect } from 'react';
import { Course, AIRecommendation } from '../../types';
import { useAIRecommendations } from '../../hooks/useAIRecommendations';
import { useCourses } from '../../hooks/useCourses';
import { useAuth } from '../../contexts/AuthContext';
import { SignInButton } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Sparkles, RefreshCw, Brain, TrendingUp } from 'lucide-react';
import CourseCard from '../course/CourseCard';
import '../../styles/ai-recommendations.css';

const AIRecommendations: React.FC = () => {
  const { user } = useAuth();
  const { courses, loading: coursesLoading } = useCourses();
  const { recommendations, loading, error, refetch } = useAIRecommendations(user?.id || '');
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('🔄 AIRecommendations state update:', {
      recommendations: recommendations.length,
      loading,
      error,
      showRecommendations,
      coursesAvailable: courses.length,
      coursesLoading
    });
  }, [recommendations, loading, error, showRecommendations, courses.length, coursesLoading]);

  const handleGetRecommendations = async () => {
    console.log('🎯 Starting AI recommendations request...');
    setShowRecommendations(true);
    await refetch();
    console.log('📊 Recommendations after refetch:', recommendations.length);
  };

  const handleDebugUserBehavior = () => {
    if (!user?.id) return;
    
    const key = `user_behavior_${user.id}`;
    const stored = localStorage.getItem(key);
    
    if (stored) {
      const behavior = JSON.parse(stored);
      console.log('🔍 Current user behavior:', behavior);
      alert(`User Behavior Debug:
- Viewed courses: ${behavior.viewedCourses.length}
- Favorite courses: ${behavior.favoriteCourses.length}  
- Search history: ${behavior.searchHistory.length}
- Preferences: ${behavior.preferences.join(', ')}

Check console for full details.`);
    } else {
      alert('No user behavior data found. Try viewing or favoriting some courses first.');
    }
  };

  const getRecommendedCourses = (): Course[] => {
    console.log('🔍 Mapping recommendations to courses:', {
      recommendations: recommendations.length,
      availableCourses: courses.length,
      recommendationIds: recommendations.map(r => r.courseId),
      availableCourseIds: courses.map(c => c.id)
    });
    
    const recommendedCourses = recommendations
      .map((rec: AIRecommendation) => {
        const course = courses.find(course => course.id === rec.courseId);
        if (!course) {
          console.log(`⚠️ Course not found for ID: ${rec.courseId}`, {
            searchingIn: courses.map(c => ({ id: c.id, title: c.title }))
          });
        } else {
          console.log(`✅ Found course: ${course.id} - ${course.title}`);
        }
        return course;
      })
      .filter(Boolean) as Course[];
    
    console.log('🎯 Final recommended courses:', recommendedCourses.length);
    return recommendedCourses;
  };

  if (!user) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">Đăng nhập để nhận gợi ý AI</h3>
          <p className="text-gray-600 mb-4">
            Đăng nhập để AI có thể phân tích sở thích và gợi ý khóa học phù hợp nhất
          </p>
          <SignInButton mode="modal">
            <Button>Đăng nhập ngay</Button>
          </SignInButton>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="ai-recommendations-container space-y-6 w-full max-w-full overflow-hidden">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Gợi ý thông minh từ AI
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-2">
                AI phân tích sở thích và hành vi học tập để gợi ý khóa học phù hợp nhất
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Sparkles className="w-4 h-4" />
                <span>Được cá nhân hóa riêng cho bạn</span>
              </div>
            </div>
            <div className="flex gap-2">
              {/* <Button
                variant="outline"
                size="sm"
                onClick={handleDebugUserBehavior}
                className="text-xs"
              >
                Debug Data
              </Button> */}
              <Button
                onClick={handleGetRecommendations}
                disabled={loading || coursesLoading || courses.length === 0}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Đang phân tích...
                  </>
                ) : coursesLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Đang tải dữ liệu...
                  </>
                ) : courses.length === 0 ? (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Chưa có khóa học
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Nhận gợi ý AI
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {showRecommendations && (
        <div className="space-y-6 w-full max-w-full">
          {loading && (
            <Card className="p-8 text-center w-full">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-medium">AI đang phân tích...</span>
              </div>
              <p className="text-gray-600">
                Đang xử lý dữ liệu học tập và tìm kiếm khóa học phù hợp
              </p>
            </Card>
          )}

          {error && (
            <Card className="p-6 border-red-200 bg-red-50">
              <div className="text-center">
                <div className="text-red-600 mb-2">⚠️ Có lỗi xảy ra</div>
                <p className="text-red-700">{error}</p>
                <Button variant="outline" onClick={refetch} className="mt-3">
                  Thử lại
                </Button>
              </div>
            </Card>
          )}

          {!loading && !error && recommendations.length > 0 && getRecommendedCourses().length > 0 && (
            <div className="space-y-6 w-full">
              {/* Stats */}
              <div className="ai-stats-grid grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                <Card className="text-center p-4 w-full">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {recommendations.length}
                  </div>
                  <div className="text-sm text-gray-600">Gợi ý AI</div>
                </Card>
                <Card className="text-center p-4 w-full">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {Math.round(recommendations.reduce((sum: number, r: AIRecommendation) => sum + r.score, 0) / recommendations.length * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Độ phù hợp</div>
                </Card>
                <Card className="text-center p-4 w-full">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    <TrendingUp className="w-6 h-6 inline" />
                  </div>
                  <div className="text-sm text-gray-600">Cá nhân hóa</div>
                </Card>
              </div>

              {/* Recommended Courses */}
              <div className="w-full overflow-hidden">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Khóa học gợi ý cho bạn
                </h3>
                
                <div className="ai-recommendations-grid">
                  {getRecommendedCourses().map((course, index) => {
                    const recommendation = recommendations.find((r: AIRecommendation) => r.courseId === course.id);
                    return (
                    
                      <div key={course.id} className="ai-course-item">
                        {/* Simple AI Suggestion Text */}
                        <div className="mt-2 mb-3">
                          <p className="text-xs text-purple-600 font-medium">
                            Top {index + 1} - Gợi ý bởi AI, bạn nên học
                          </p>
                        </div>
                        
                        {/* Course Card Container */}
                        <div className="ai-course-card">
                          <CourseCard course={course} />
                        </div>
                        
                        {/* Recommendation Reason */}
                        <Card className="ai-recommendation-reason bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 shadow-sm w-full">
                          <div className="ai-recommendation-content p-4">
                            <Brain className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                            <div className="ai-recommendation-text">
                              <div className="text-sm font-medium text-purple-900 mb-2">
                                Lý do gợi ý:
                              </div>
                              <div className="ai-text-content text-sm text-purple-700 leading-relaxed mb-3">
                                {recommendation?.reason}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-purple-600 font-medium">
                                  Độ phù hợp:
                                </span>
                                <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                                  {Math.round((recommendation?.score || 0) * 100)}%
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {!loading && !error && (recommendations.length === 0 || getRecommendedCourses().length === 0) && (
            <Card className="ai-empty-state p-8 text-center w-full">
              <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Bắt đầu khám phá để nhận gợi ý AI</h3>
              <p className="text-gray-600 mb-4">
                Hãy xem và yêu thích một số khóa học để AI có thể đưa ra gợi ý tốt hơn
              </p>
              <div className="ai-empty-grid">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-blue-600 font-medium mb-1">👀 Xem khóa học</div>
                  <div className="text-gray-600">Duyệt qua các khóa học để AI hiểu sở thích</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-purple-600 font-medium mb-1">❤️ Yêu thích</div>
                  <div className="text-gray-600">Đánh dấu những khóa học bạn quan tâm</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-green-600 font-medium mb-1">🔍 Tìm kiếm</div>
                  <div className="text-gray-600">Tìm kiếm các chủ đề bạn muốn học</div>
                </div>
              </div>
              <Button variant="outline" className="mt-4" onClick={() => window.location.href = '/courses'}>
                Khám phá khóa học
              </Button>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;