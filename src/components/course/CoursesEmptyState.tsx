import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface CoursesEmptyStateProps {
  onShowAllCourses: () => void;
}

const CoursesEmptyState: React.FC<CoursesEmptyStateProps> = ({ onShowAllCourses }) => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="text-gray-500 mb-4">
          <div className="text-4xl mb-2">📚</div>
          <h3 className="text-xl font-semibold mb-2">Không tìm thấy khóa học</h3>
          <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
        <Button onClick={onShowAllCourses}>
          Xem tất cả khóa học
        </Button>
      </CardContent>
    </Card>
  );
};

export default CoursesEmptyState;
