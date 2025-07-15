import React from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useCart } from '../../contexts/CartContext';

interface CartSummaryProps {
  className?: string;
}

const CartSummary: React.FC<CartSummaryProps> = ({ className = '' }) => {
  const { cart, clearCart } = useCart();
  const { totalAmount, totalItems } = cart;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Tính toán các loại phí
  const subtotal = totalAmount;
  const discount = 0; // Có thể thêm logic tính discount sau
  const tax = subtotal * 0.1; // 10% VAT
  const total = subtotal - discount + tax;

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    console.log('Proceed to checkout');
  };

  return (
    <Card className={`p-6 sticky top-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>Tạm tính ({totalItems} khóa học)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Giảm giá</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span>Thuế VAT (10%)</span>
          <span>{formatPrice(tax)}</span>
        </div>
        
        <hr className="my-4" />
        
        <div className="flex justify-between text-lg font-semibold">
          <span>Tổng cộng</span>
          <span className="text-primary-600">{formatPrice(total)}</span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Button 
          className="w-full" 
          size="lg"
          onClick={handleCheckout}
          disabled={totalItems === 0}
        >
          Thanh toán
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={clearCart}
          disabled={totalItems === 0}
        >
          Xóa toàn bộ giỏ hàng
        </Button>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Bằng cách thanh toán, bạn đồng ý với</p>
        <p>
          <a href="#" className="text-primary-600 hover:underline">Điều khoản dịch vụ</a>
          {' và '}
          <a href="#" className="text-primary-600 hover:underline">Chính sách bảo mật</a>
        </p>
      </div>
    </Card>
  );
};

export default CartSummary;
