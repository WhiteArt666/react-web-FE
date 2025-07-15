import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useCart } from '../contexts/CartContext';
import CartItemCard from '../components/cart/CartItemCard';
import CartSummary from '../components/cart/CartSummary';
import CartRecommendations from '../components/cart/CartRecommendations';

const CartPage: React.FC = () => {

  useEffect(() => { 
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);


  const { cart } = useCart();
  const { items, totalItems, totalAmount } = cart;

  console.log('🛒 CartPage - cart items:', items.length, items);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Empty cart state
  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Giỏ hàng</h1>
              </div>
            </div>
          </div>

          {/* Empty state */}
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              Hãy khám phá các khóa học tuyệt vời và thêm vào giỏ hàng để bắt đầu hành trình học tập
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link to="/courses">
                  Khám phá khóa học
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/favorites">
                  <Heart className="h-4 w-4 mr-2" />
                  Khóa học yêu thích
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Giỏ hàng</h1>
              <span className="text-sm text-gray-500">({totalItems} khóa học)</span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">Tổng tiền</p>
            <p className="text-2xl font-bold text-primary-600">
              {formatPrice(totalAmount)}
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Cart summary */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-12">
          <CartRecommendations />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
