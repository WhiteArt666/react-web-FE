import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import Toast from './Toast';

const GlobalToast: React.FC = () => {
  const { toast, hideToast } = useToast();

  return (
    <Toast
      message={toast.message}
      type={toast.type}
      isVisible={toast.show}
      onClose={hideToast}
    />
  );
};

export default GlobalToast;
