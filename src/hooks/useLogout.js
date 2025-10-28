import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { PATH_NAME } from '../constants';
import { logout } from '../services/auth';
import { notify } from '../utils';

const useLogout = () => {
  const queryClient = useQueryClient();

  const { mutate: mutateLogout } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      Cookies.remove('accessToken');
      localStorage.clear();
      queryClient.clear();
      window.location.href = PATH_NAME.HOME;
    },
    onError: (err) => {
      console.log('check err', err);
      notify('error', { description: 'Lỗi hệ thống' });
    },
  });

  return mutateLogout;
};

export { useLogout };
