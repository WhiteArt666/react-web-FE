import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useCart } from '../../contexts/CartContext';

interface CartIconProps {
  className?: string;
  showText?: boolean;
}

const CartIcon: React.FC<CartIconProps> = ({ className = '', showText = true }) => {
  const { cart } = useCart();
  const totalItems = cart.totalItems;

  return (
    <Button variant="ghost" className={`relative ${className}`} asChild>
      <Link to="/cart">
        <ShoppingCart className="h-4 w-4 mr-2" />
        {showText && <span className="hidden lg:inline text-sm font-medium">Giỏ hàng</span>}
        {totalItems > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
          >
            {totalItems > 99 ? '99+' : totalItems}
          </Badge>
        )}
      </Link>
    </Button>
  );
};

export default CartIcon;
