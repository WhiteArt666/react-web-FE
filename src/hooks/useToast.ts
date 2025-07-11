import { useState, useCallback, useRef, useEffect } from 'react';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
  id: string;
}

interface UseToastReturn {
  toast: ToastState;
  showToast: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void;
  hideToast: () => void;
}

export const useToast = (): UseToastReturn => {
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success',
    id: ''
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentToastIdRef = useRef<string>('');

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
    // Clear timeout hiện tại nếu có
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Tạo unique ID cho toast này
    const toastId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    currentToastIdRef.current = toastId;

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
    
    // Reset current toast ID
    currentToastIdRef.current = '';
    
    // Hide toast
    setToast(prev => ({ ...prev, show: false }));
  }, []);

  return {
    toast,
    showToast,
    hideToast
  };
};
