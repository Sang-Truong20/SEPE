import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const chapterStudentVerificationQueryKeys = {
  origin: ['chapter', 'studentVerification'],
  pendingOrRejected: () => [
    ...chapterStudentVerificationQueryKeys.origin,
    'pending-or-rejected',
  ],
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

