import React from 'react';
import { Card, CardContent } from '../ui/card';
import SearchBar from '../common/SearchBar';

interface CoursesHeaderProps {
  stats: Array<{ label: string; value: number }>;
  onSearch: (filters: any) => void;
  loading: boolean;
}

const CoursesHeader: React.FC<CoursesHeaderProps> = ({ stats, onSearch, loading }) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Khóa học trực tuyến
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá hàng ngàn khóa học chất lượng cao từ các chuyên gia hàng đầu
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={onSearch} loading={loading} />
      </div>
    </div>
  );
};

export default CoursesHeader;
