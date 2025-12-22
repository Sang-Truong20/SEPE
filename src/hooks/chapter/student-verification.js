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
    mutationFn: async (userId) => {
      const response = await axiosClient.put(`/StudentVerification/approve/${userId}`);
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
    mutationFn: async (payload) => {
      const userId =
        typeof payload === 'object' && payload !== null
          ? payload.userId
          : payload;
      const reason =
        typeof payload === 'object' && payload !== null ? payload.reason || '' : '';

      const response = await axiosClient.put(`/StudentVerification/reject/${userId}`, {
        reason,
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

