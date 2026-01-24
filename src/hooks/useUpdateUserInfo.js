import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import axiosClient from '../configs/axiosClient';

/**
 * Hook to update user info
 * API: PUT /api/Auth/update-info
 * @param {object} payload - { fullName: string }
 */
export const useUpdateUserInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ fullName }) => {
      const response = await axiosClient.put(`/Auth/update-info`, {
        fullName,
      });
      return response.data;
    },
    onSuccess: async () => {
      // Invalidate and refetch user data to update UI
      await queryClient.invalidateQueries({ queryKey: ['userData'] });
      await queryClient.refetchQueries({ queryKey: ['userData'] });
      message.success('Cập nhật tên thành công!');
    },
    onError: (error) => {
      console.error('Error updating user info:', error);
      message.error(
        error?.response?.data?.message || 'Không thể cập nhật thông tin. Vui lòng thử lại.',
      );
    },
  });
};

