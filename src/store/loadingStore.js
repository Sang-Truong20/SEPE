import { create } from 'zustand';

const useLoadingStore = create((set) => ({
  isLoading: false,
  message: 'Đang xử lý...',
  showLoading: (message = 'Đang xử lý...') =>
    set({
      isLoading: true,
      message: message || 'Đang xử lý...',
    }),
  hideLoading: () =>
    set({
      isLoading: false,
    }),
  setLoading: (isLoading, message = 'Đang xử lý...') =>
    set({
      isLoading,
      message: message || 'Đang xử lý...',
    }),
}));

export default useLoadingStore;

