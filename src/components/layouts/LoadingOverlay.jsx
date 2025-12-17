import { Spin } from 'antd';
import useLoadingStore from '../../store/loadingStore';

const LoadingOverlay = () => {
  const { isLoading, message } = useLoadingStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm">
      <Spin size="large" />
      <div className="mt-4 text-lg text-white animate-pulse">
        {message || 'Đang xử lý...'}
      </div>
    </div>
  );
};

export default LoadingOverlay;

