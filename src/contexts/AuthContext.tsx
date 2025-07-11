import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { isSignedIn } = useClerkAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (isLoaded && clerkUser) {
      // Chuyển đổi Clerk user thành User type của ứng dụng
      const appUser: User = {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        name: clerkUser.fullName || clerkUser.firstName || 'User',
        avatar: clerkUser.imageUrl,
        favoriteCoursesIds: [],
        enrolledCoursesIds: [],
        preferences: {
          categories: [],
          level: [],
          priceRange: [0, 1000000],
        },
      };
      setUser(appUser);
    } else if (isLoaded && !clerkUser) {
      setUser(null);
    }
  }, [clerkUser, isLoaded]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!isSignedIn,
    loading: !isLoaded,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
