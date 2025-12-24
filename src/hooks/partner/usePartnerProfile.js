import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import axiosClient from '../../configs/axiosClient';
import useMessage from '../util/getError';

export const usePartnerProfile = () => {
  const queryClient = useQueryClient();
  const { getMessage } = useMessage();

  const createProfile = useMutation({
    mutationFn: (formData) => {
      return axiosClient.post('/partner/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      // Invalidate user data to refetch profile
      queryClient.invalidateQueries({ queryKey: ['userData'] });
      message.success('Tạo hồ sơ thành công!');
    },
    onError: (error) => {
      console.error('Error creating partner profile:', error);
      message.error(getMessage(error));
    },
  });

  const updateProfile = useMutation({
    mutationFn: (formData) => {
      return axiosClient.put('/partner/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      // Invalidate user data to refetch profile
      queryClient.invalidateQueries({ queryKey: ['userData'] });
      message.success('Cập nhật hồ sơ thành công!');
    },
    onError: (error) => {
      console.error('Error updating partner profile:', error);
      message.error(getMessage(error));
    },
  });

  /**
   * Delete partner profile
   * DELETE /api/partner/profile
   */
  const deleteProfile = useMutation({
    mutationFn: () => {
      return axiosClient.delete('/partner/profile');
    },
    onSuccess: () => {
      // Invalidate user data to refetch profile
      queryClient.invalidateQueries({ queryKey: ['userData'] });
      message.success('Xóa hồ sơ thành công!');
    },
    onError: (error) => {
      console.error('Error deleting partner profile:', error);
      message.error(getMessage(error));
    },
  });

  return {
    createProfile,
    updateProfile,
    deleteProfile,
  };
};
