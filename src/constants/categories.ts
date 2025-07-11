// Constants cho categories
export const CATEGORIES = [
  { 
    icon: '💻', 
    name: 'Programming', 
    count: 234, 
    color: 'from-blue-500 to-cyan-500', 
    description: 'Lập trình và phát triển phần mềm' 
  },
  { 
    icon: '🎨', 
    name: 'Design', 
    count: 156, 
    color: 'from-pink-500 to-rose-500', 
    description: 'Thiết kế đồ họa và UI/UX' 
  },
  { 
    icon: '📊', 
    name: 'Data Science', 
    count: 89, 
    color: 'from-green-500 to-emerald-500', 
    description: 'Khoa học dữ liệu và phân tích' 
  },
  { 
    icon: '📈', 
    name: 'Marketing', 
    count: 123, 
    color: 'from-orange-500 to-yellow-500', 
    description: 'Marketing và quảng cáo' 
  },
  { 
    icon: '💼', 
    name: 'Business', 
    count: 167, 
    color: 'from-purple-500 to-violet-500', 
    description: 'Kinh doanh và quản lý' 
  },
  { 
    icon: '🔧', 
    name: 'Technology', 
    count: 98, 
    color: 'from-indigo-500 to-blue-500', 
    description: 'Công nghệ và IT' 
  },
] as const;

export type CategoryName = typeof CATEGORIES[number]['name'];
