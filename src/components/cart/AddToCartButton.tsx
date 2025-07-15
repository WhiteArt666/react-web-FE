import React from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Course } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface AddToCartButtonProps {
  course: Course;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  showText?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  course,
  size = 'default',
  variant = 'default',
  className = '',
  showText = true
}) => {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(course.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inCart) {
      addToCart(course);
    }
  };

  return (
    <Button
      variant={inCart ? 'outline' : variant}
      size={size}
      className={`${className} transition-all duration-200`}
      onClick={handleAddToCart}
      disabled={inCart}
    >
      {inCart ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          {showText && <span>Đã thêm</span>}
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 mr-2" />
          {showText && <span>Thêm vào giỏ</span>}
        </>
      )}
    </Button>
  );
};

export default AddToCartButton;
