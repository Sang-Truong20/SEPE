import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';
import { message } from 'antd';

export const chapterStudentVerificationQueryKeys = {
  origin: ['chapter', 'studentVerification'],
  pendingOrRejected: () => [
    ...chapterStudentVerificationQueryKeys.origin,
    'pending-or-rejected',
  ],
  approve: (id) => [...chapterStudentVerificationQueryKeys.origin, 'approve', id],
  reject: (id) => [...chapterStudentVerificationQueryKeys.origin, 'reject', id],
};

// GET /api/StudentVerification/verifications/pending-or-rejected
export const useGetPendingOrRejectedStudentVerifications = (options = {}) => {
  return useQuery({
    queryKey: chapterStudentVerificationQueryKeys.pendingOrRejected(),
    queryFn: async () => {
      const response = await axiosClient.get(
        '/StudentVerification/verifications/pending-or-rejected',
      );
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

// Approve student verification
export const useApproveStudentVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: chapterStudentVerificationQueryKeys.approve(),
    mutationFn: async (verificationId) => {
      const response = await axiosClient.put(`/StudentVerification/approve/${verificationId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chapterStudentVerificationQueryKeys.pendingOrRejected(),
      });
      message.success('Đã phê duyệt xác thực sinh viên thành công!');
    },
    onError: (error) => {
      message.error(
        error?.response?.data?.message || 'Không thể phê duyệt xác thực. Vui lòng thử lại.',
      );
    },
  });
};

// Reject student verification
export const useRejectStudentVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: chapterStudentVerificationQueryKeys.reject(),
    mutationFn: async ({ verificationId, reason }) => {
      const response = await axiosClient.put(`/StudentVerification/reject/${verificationId}`, {
        reason: reason || '',
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chapterStudentVerificationQueryKeys.pendingOrRejected(),
      });
      message.success('Đã từ chối xác thực sinh viên!');
    },
    onError: (error) => {
      message.error(
        error?.response?.data?.message || 'Không thể từ chối xác thực. Vui lòng thử lại.',
      );
    },
  });
};

