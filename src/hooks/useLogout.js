import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { PATH_NAME } from '../constants';
import { logout } from '../services/auth';
import { notify } from '../utils';
import useMessage from './util/getError';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { getMessage } = useMessage();

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      localStorage.clear();
      queryClient.clear();
      window.location.href = PATH_NAME.HOME;
    },
    onError: (err) => {
      console.log('check err', err);
      notify('error', { description: getMessage(err) });
    },
  });
  return mutate;
};

// Hàm thuần (không dùng hook) để gọi từ interceptor
export const performLogout = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  localStorage.clear();
  // Không clear queryClient ở đây vì không có context
  // Thay vào đó: reload trang → React Query sẽ tự reset khi app mount lại
  window.location.href = PATH_NAME.HOME;
};