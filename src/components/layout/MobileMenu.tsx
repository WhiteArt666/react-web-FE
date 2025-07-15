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
      <div className={`fixed left-0 top-0 h-full w-72 sm:w-80 bg-white border-r shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-white">
          <Link to="/" className="flex items-center space-x-2" onClick={onClose}>
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              🎓
            </div>
            <span className="font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent text-xl sm:text-2xl">
              EduMarket
            </span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
        
        <nav className="flex flex-col p-4 sm:p-6 space-y-2 sm:space-y-3 bg-white flex-1">
          <Button 
            variant="ghost" 
            className="justify-start h-10 sm:h-12 text-base sm:text-lg" 
            asChild
          >
            <Link to="/" onClick={onClose}>
              <Home className="mr-3 h-4 w-4 sm:h-5 sm:w-5" />
              Trang chủ
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            className="justify-start h-10 sm:h-12 text-base sm:text-lg" 
            asChild
          >
            <Link to="/courses" onClick={onClose}>
              <BookOpen className="mr-3 h-4 w-4 sm:h-5 sm:w-5" />
              Khóa Học
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            className="justify-start relative h-10 sm:h-12 text-base sm:text-lg" 
            asChild
          >
            <Link to="/cart" onClick={onClose}>
              <ShoppingCart className="mr-3 h-4 w-4 sm:h-5 sm:w-5" />
              Giỏ hàng
              {cart.totalItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {cart.totalItems > 99 ? '99+' : cart.totalItems}
                </Badge>
              )}
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            className="justify-start relative h-10 sm:h-12 text-base sm:text-lg" 
            asChild
          >
            <Link to="/favorites" onClick={onClose}>
              <Heart className="mr-3 h-4 w-4 sm:h-5 sm:w-5" />
              Yêu thích
              {favoritesCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {favoritesCount > 9 ? '9+' : favoritesCount}
                </Badge>
              )}
            </Link>
          </Button>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 border-t bg-white">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3 sm:space-x-4">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10 sm:h-12 sm:w-12"
                  }
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium truncate">{user?.name}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              <SignInButton mode="modal">
                <Button variant="outline" className="w-full justify-start h-10 sm:h-12 text-base sm:text-lg" onClick={onClose}>
                  <User className="mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                  Đăng nhập
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="w-full justify-start h-10 sm:h-12 text-base sm:text-lg" onClick={onClose}>
                  <User className="mr-3 h-4 w-4 sm:h-5 sm:w-5" />
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
