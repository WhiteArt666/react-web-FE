import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Search, Heart, User as UserIcon, LogOut, Menu } from 'lucide-react';

const Header: React.FC = () => {
  const { favoritesCount } = useFavorites();
  const { user, isAuthenticated } = useAuth();
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
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
        
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm khóa học..."
                className="pl-10 pr-4 h-9 w-full md:w-[300px] lg:w-[400px]"
              />
            </div>
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
              <Link to="/courses">Khóa học</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:inline-flex"
              asChild
            >
              <Link to="/categories">Danh mục</Link>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {favoritesCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {favoritesCount}
                  </Badge>
                )}
              </Button>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <span className="hidden md:inline-block text-sm font-medium">
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
                    <Button variant="ghost" size="sm">
                      Đăng nhập
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button size="sm">
                      Đăng ký
                    </Button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
