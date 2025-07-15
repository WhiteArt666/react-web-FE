import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Home, BookOpen, Heart, User, LogOut, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useCart } from '../../contexts/CartContext';
import { SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated, user } = useAuth();
  const { favoritesCount } = useFavorites();
  const { cart } = useCart();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-background border-r shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/" className="flex items-center space-x-2" onClick={onClose}>
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              🎓
            </div>
            <span className="font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent text-xl">
              EduMarket
            </span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="flex flex-col p-4 space-y-2">
          <Button 
            variant="ghost" 
            className="justify-start" 
            asChild
          >
            <Link to="/" onClick={onClose}>
              <Home className="mr-2 h-4 w-4" />
              Trang chủ
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            className="justify-start" 
            asChild
          >
            <Link to="/courses" onClick={onClose}>
              <BookOpen className="mr-2 h-4 w-4" />
              Danh Mục Khóa Học
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            className="justify-start relative" 
            asChild
          >
            <Link to="/cart" onClick={onClose}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Giỏ hàng
              {cart.totalItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {cart.totalItems > 99 ? '99+' : cart.totalItems}
                </Badge>
              )}
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            className="justify-start relative" 
            asChild
          >
            <Link to="/favorites" onClick={onClose}>
              <Heart className="mr-2 h-4 w-4" />
              Khóa học yêu thích
              {favoritesCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {favoritesCount}
                </Badge>
              )}
            </Link>
          </Button>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8"
                  }
                }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <SignInButton mode="modal">
                <Button variant="outline" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Đăng nhập
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Đăng ký
                </Button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
