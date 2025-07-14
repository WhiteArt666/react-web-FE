import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Search, Heart, Menu, User } from 'lucide-react';
import SearchDropdown from '../common/SearchDropdown';
import MobileMenu from './MobileMenu';

const Header: React.FC = () => {
  const { favoritesCount } = useFavorites();
  const { user, isAuthenticated } = useAuth();
  const { isSignedIn } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Desktop Logo */}
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" to="/">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                🎓
              </div>
              <span className="hidden font-bold sm:inline-block bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent text-xl">
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
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        
        {/* Mobile Logo */}
        <div className="mr-4 md:hidden">
          <Link className="flex items-center space-x-2" to="/">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              🎓
            </div>
            <span className="font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent text-lg">
              EduMarket
            </span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* Search - Desktop và Mobile */}
          <div className="w-full flex-1 md:w-auto md:flex-none max-w-md md:max-w-none">
            <SearchDropdown />
          </div>
          
          <nav className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:inline-flex"
              asChild
            >
              <Link to="/">Trang chủ</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:inline-flex"
              asChild
            >
              <Link to="/courses">Danh Mục Khóa Học</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:inline-flex"
              asChild
            >
              {/* <Link to="/categories">Danh mục</Link> */}
            </Button>
            
            <div className="flex items-center space-x-2">
              {/* Favorites Button - Hidden on mobile, shown on larger screens */}
              <Button variant="ghost" className="relative hidden sm:flex" asChild>
                <Link to="/favorites">
                  <Heart className="h-4 w-4 mr-2" />
                  <span className="hidden lg:inline text-sm font-medium">Khóa học yêu thích</span>
                  {favoritesCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                    >
                      {favoritesCount}
                    </Badge>
                  )}
                </Link>
              </Button>
              
              {/* Favorites Button - Mobile only */}
              <Button variant="ghost" size="icon" className="relative sm:hidden" asChild>
                <Link to="/favorites">
                  <Heart className="h-4 w-4" />
                  {favoritesCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs flex items-center justify-center"
                    >
                      {favoritesCount}
                    </Badge>
                  )}
                </Link>
              </Button>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <span className="hidden lg:inline-block text-sm font-medium">
                    {user?.name}
                  </span>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8"
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                      Đăng nhập
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button size="sm" className="hidden sm:inline-flex">
                      Đăng ký
                    </Button>
                  </SignUpButton>
                  {/* Mobile auth buttons */}
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="icon" className="sm:hidden">
                      <User className="h-4 w-4" />
                    </Button>
                  </SignInButton>
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
