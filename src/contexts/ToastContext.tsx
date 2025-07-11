import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
  id: string;
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void;
  hideToast: () => void;
  toast: ToastState;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success',
    id: ''
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentToastIdRef = useRef<string>('');
  const lastToastMessageRef = useRef<string>('');
  const lastToastTimeRef = useRef<number>(0);

  // Clear timeout khi component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showToast = useCallback((
    message: string, 
    type: 'success' | 'error' | 'info' = 'success',
    duration: number = 3000
  ) => {
    const now = Date.now();
    
    // Ngăn chặn spam toast với cùng một message trong vòng 1 giây
    if (lastToastMessageRef.current === message && (now - lastToastTimeRef.current) < 1000) {
      return;
    }

    // Clear timeout hiện tại nếu có
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Tạo unique ID cho toast này
    const toastId = now.toString() + Math.random().toString(36).substr(2, 9);
    currentToastIdRef.current = toastId;
    lastToastMessageRef.current = message;
    lastToastTimeRef.current = now;

    // Hiển thị toast mới
    setToast({
      show: true,
      message,
      type,
      id: toastId
    });

    // Set timeout để auto-hide
    timeoutRef.current = setTimeout(() => {
      // Chỉ hide nếu đây vẫn là toast hiện tại (không bị ghi đè)
      if (currentToastIdRef.current === toastId) {
        setToast(prev => ({ ...prev, show: false }));
      }
    }, duration);
  }, []);

  const hideToast = useCallback(() => {
    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Reset refs
    currentToastIdRef.current = '';
    lastToastMessageRef.current = '';
    lastToastTimeRef.current = 0;
    
    // Hide toast
    setToast(prev => ({ ...prev, show: false }));
  }, []);

  const value = {
    toast,
    showToast,
    hideToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};
