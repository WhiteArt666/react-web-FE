import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFavorites } from '../contexts/FavoritesContext';
import { useToast } from '../hooks/useToast';
import { Course } from '../types';
import Toast from '../components/ui/Toast';
import { 
  FavoritesHeader, 
  FavoritesGrid, 
  FavoritesEmptyState 
} from '../components/favorites';
import '../styles/favorites.css';

// Đăng ký ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const FavoritesPage: React.FC = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const { toast, showToast, hideToast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const emptyStateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      // Animation cho header
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          ease: "power3.out"
        }
      );
    }

    if (favorites.length > 0 && gridRef.current) {
      // Animation cho grid courses
      const cards = gridRef.current.children;
      gsap.fromTo(cards,
        { 
          opacity: 0, 
          y: 50,
          scale: 0.8
        },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          delay: 0.3
        }
      );

      // Scroll animation
      ScrollTrigger.batch(cards, {
        onEnter: (elements) => {
          gsap.fromTo(elements, 
            { opacity: 0, y: 100 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }
          );
        },
        start: "top bottom-=100",
        once: true
      });
    } else if (emptyStateRef.current) {
      // Animation cho empty state
      gsap.fromTo(emptyStateRef.current,
        { opacity: 0, scale: 0.5 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 0.5
        }
      );
    }

    // Cleanup ScrollTrigger
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [favorites]);

  const handleRemoveFromFavorites = (course: Course) => {
    removeFromFavorites(course.id);
    showToast(`Đã xóa "${course.title}" khỏi danh sách yêu thích`, 'success');
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <FavoritesHeader 
          ref={headerRef} 
          favoritesCount={favorites.length} 
        />

        {/* Content */}
        {favorites.length > 0 ? (
          <FavoritesGrid
            ref={gridRef}
            favorites={favorites}
            onRemoveCourse={handleRemoveFromFavorites}
          />
        ) : (
          <FavoritesEmptyState ref={emptyStateRef} />
        )}
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={hideToast}
      />
    </div>
  );
};

export default FavoritesPage;
