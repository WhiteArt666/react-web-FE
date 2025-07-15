import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, Star, Clock, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { CartItem } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface CartItemCardProps {
  item: CartItem;
  className?: string;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, className = '' }) => {
  const { removeFromCart, updateQuantity } = useCart();
  const { course, quantity, price } = item;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(course.id);
    } else {
      updateQuantity(course.id, newQuantity);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
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
    <Card className={`overflow-hidden transition-all duration-200 hover:shadow-md ${className}`}>
      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            <Link to={`/course/${course.id}`}>
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full sm:w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              />
            </Link>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <div className="flex-1">
                <Link 
                  to={`/course/${course.id}`} 
                  className="block group"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                </Link>
                
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{course.instructor}</span>
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{course.rating}</span>
                    <span className="text-xs text-gray-500">({course.reviewCount})</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(course.duration)}</span>
                  </div>
                  
                  <Badge className={`text-xs ${getLevelColor(course.level)}`}>
                    {getLevelText(course.level)}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:items-end gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary-600">
                    {formatPrice(price)}
                  </span>
                  {course.originalPrice && course.originalPrice > price && (
                    <span className="text-sm line-through text-gray-500">
                      {formatPrice(course.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Quantity controls */}
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                      onClick={() => handleQuantityChange(quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-3 py-1 text-sm font-medium min-w-[40px] text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                      onClick={() => handleQuantityChange(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Remove button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeFromCart(course.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CartItemCard;
