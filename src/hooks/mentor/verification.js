import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import axiosClient from '../../configs/axiosClient';

/**
 * Mentor self-verification
 * POST /api/MentorVerification/create (multipart/form-data)
 * body: fullName, email, phone, position, reasonToBecomeMentor, hackathonId (int), chapterId (int), cvFile (file)
 */
export const useCreateMentorVerification = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const formData = new FormData();
      Object.entries(payload || {}).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          formData.append(key, val);
        }
      });
      const response = await axiosClient.post('/MentorVerification/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      message.success('Gửi yêu cầu xác minh mentor thành công');
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || 'Gửi yêu cầu xác minh mentor thất bại');
    },
  });
};

