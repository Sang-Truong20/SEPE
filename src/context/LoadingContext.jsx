// src/contexts/LoadingContext.jsx
import { createContext, useContext, useState } from 'react';
import { Spin } from 'antd';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Đang xử lý...');

  const showLoading = (message = 'Đang xử lý...') => {
    setLoadingMessage(message);
    setLoading(true);
  };

  const hideLoading = () => {
    setLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {/* Global Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-dark-primary/95 backdrop-blur-sm">
          <Spin size="large" />
          <div className="mt-4 text-lg text-text-primary animate-pulse">
            {loadingMessage}
          </div>
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook để sử dụng loading
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};

export default LoadingContext;