import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { getMe } from '../services/auth';

export const useUserData = () => {
  const token = Cookies.get('accessToken');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['userData'],
    queryFn: getMe,
    enabled: !!token,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const userInfo = data?.data ?? null;

  return { userInfo, isLoading, error, refetch };
};
