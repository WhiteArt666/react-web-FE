import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Course, User } from '../types';

interface FavoritesContextType {
  favorites: Course[];
  addToFavorites: (course: Course) => void;
  removeFromFavorites: (courseId: string) => void;
  isFavorite: (courseId: string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Course[]>([]);

  const addToFavorites = useCallback((course: Course) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.id === course.id);
      if (exists) return prev;
      return [...prev, { ...course, isFavorite: true }];
    });
  }, []);

  const removeFromFavorites = useCallback((courseId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== courseId));
  }, []);

  const isFavorite = useCallback((courseId: string) => {
    return favorites.some(fav => fav.id === courseId);
  }, [favorites]);

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    favoritesCount: favorites.length,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
