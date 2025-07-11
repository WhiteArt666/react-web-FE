import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Check, X, Heart } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  isVisible, 
  onClose,
  duration = 3000 
}) => {
  const toastRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isVisible && toastRef.current) {
      // Animation hiển thị
      gsap.fromTo(toastRef.current, 
        { 
          opacity: 0, 
          y: -50, 
          scale: 0.8 
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.5,
          ease: "back.out(1.7)"
        }
      );

      // Tự động ẩn sau duration
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, duration]);

  const handleClose = () => {
    if (toastRef.current) {
      gsap.to(toastRef.current, {
        opacity: 0,
        y: -30,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.in",
        onComplete: onClose
      });
    }
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'error':
        return <X className="w-5 h-5 text-red-600" />;
      case 'info':
        return <Heart className="w-5 h-5 text-pink-600" />;
      default:
        return <Check className="w-5 h-5 text-green-600" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-pink-50 border-pink-200 text-pink-800';
      default:
        return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        ref={toastRef}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${getStyles()}`}
      >
        {getIcon()}
        <span className="font-medium">{message}</span>
        <button
          onClick={handleClose}
          className="ml-2 hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
