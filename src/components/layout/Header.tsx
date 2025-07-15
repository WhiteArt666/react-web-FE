import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Search, Heart, Menu, User } from 'lucide-react';
import SearchDropdown from '../common/SearchDropdown';
import CartIcon from '../cart/CartIcon';
import MobileMenu from './MobileMenu';

const Header: React.FC = () => {
  const { favoritesCount } = useFavorites();
  const { user, isAuthenticated } = useAuth();
  const { isSignedIn } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
        {/* Desktop Logo */}
        <div className="mr-2 sm:mr-4 hidden md:flex">
          <Link className="mr-4 lg:mr-6 flex items-center space-x-2" to="/">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs lg:text-sm">
                🎓
              </div>
              <span className="hidden font-bold lg:inline-block bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent text-lg lg:text-xl">
                EduMarket
              </span>
            </div>
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        
        {/* Mobile Logo */}
        <div className="mr-2 sm:mr-4 md:hidden">
          <Link className="flex items-center space-x-1.5 sm:space-x-2" to="/">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
              🎓
            </div>
            <span className="font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent text-base sm:text-lg">
              EduMarket
            </span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-1 sm:space-x-2 md:justify-end">
          {/* Search - Desktop và Mobile */}
          <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
            <SearchDropdown />
          </div>
          
          <nav className="flex items-center space-x-0.5 sm:space-x-1">
            {/* Desktop Navigation Links */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:inline-flex text-xs lg:text-sm px-2 lg:px-3"
              asChild
            >
              <Link to="/">Trang chủ</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:inline-flex text-xs lg:text-sm px-2 lg:px-3"
              asChild
            >
              <Link to="/courses">Khóa Học</Link>
            </Button>
            
            <div className="flex items-center space-x-0.5 sm:space-x-1">
              {/* Cart Button - Always visible but different styles */}
              <div className="block sm:hidden">
                <CartIcon showText={false} />
              </div>
              <div className="hidden sm:block">
                <CartIcon className="text-xs lg:text-sm" />
              </div>
              
              {/* Favorites Button - Always visible but different styles */}
              <div className="block sm:hidden">
                <Button variant="ghost" size="icon" className="relative h-8 w-8" asChild>
                  <Link to="/favorites">
                    <Heart className="h-4 w-4" />
                    {favoritesCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center"
                      >
                        {favoritesCount > 9 ? '9+' : favoritesCount}
                      </Badge>
                    )}
                  </Link>
                </Button>
              </div>
              <div className="hidden sm:block">
                <Button variant="ghost" size="sm" className="relative text-xs lg:text-sm px-2 lg:px-3" asChild>
                  <Link to="/favorites">
                    <Heart className="h-4 w-4 mr-1 lg:mr-2" />
                    <span className="hidden lg:inline">Yêu thích</span>
                    <span className="lg:hidden">Thích</span>
                    {favoritesCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-4 w-4 lg:h-5 lg:w-5 rounded-full p-0 text-[10px] lg:text-xs flex items-center justify-center"
                      >
                        {favoritesCount > 9 ? '9+' : favoritesCount}
                      </Badge>
                    )}
                  </Link>
                </Button>
              </div>
              
              {/* Authentication Section */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <span className="hidden xl:inline-block text-sm font-medium truncate max-w-20">
                    {user?.name}
                  </span>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "h-7 w-7 sm:h-8 sm:w-8"
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {/* Desktop Auth Buttons */}
                  <div className="hidden sm:flex items-center space-x-1 lg:space-x-2">
                    <SignInButton mode="modal">
                      <Button variant="ghost" size="sm" className="text-xs lg:text-sm px-2 lg:px-3">
                        Đăng nhập
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button size="sm" className="text-xs lg:text-sm px-2 lg:px-3">
                        Đăng ký
                      </Button>
                    </SignUpButton>
                  </div>
                  
                  {/* Mobile Auth Button */}
                  <div className="sm:hidden">
                    <SignInButton mode="modal">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <User className="h-4 w-4" />
                      </Button>
                    </SignInButton>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
        
        {/* Mobile Menu */}
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
      </div>
    </header>
  );
};

export default Header;
