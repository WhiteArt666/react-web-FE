import React from 'react';
import { Badge } from '../ui/badge';
import SearchBar from '../common/SearchBar';
import { Search, Filter, SortAsc } from 'lucide-react';

interface SearchSectionProps {
  onSearch: (filters: any) => void;
  loading: boolean;
}

const SearchSection: React.FC<SearchSectionProps> = ({ onSearch, loading }) => {
  return (
    <section className="py-16 bg-background relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30"></div>
      <div className="container mx-auto px-4 relative">
        <SearchBar onSearch={onSearch} loading={loading} />
        
        {/* Additional search features */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
              <Search className="w-3 h-3 mr-1" />
              Tìm kiếm nâng cao
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
              <Filter className="w-3 h-3 mr-1" />
              Lọc theo cấp độ
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
              <SortAsc className="w-3 h-3 mr-1" />
              Sắp xếp
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            💡 Gợi ý: Thử tìm kiếm "JavaScript", "Python", "Design" hoặc "Marketing"
          </p>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
