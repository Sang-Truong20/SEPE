import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import axiosClient from '../../configs/axiosClient';

export const chapterMentorVerificationQueryKeys = {
  origin: ['chapter', 'mentorVerification'],
  list: () => [...chapterMentorVerificationQueryKeys.origin, 'list'],
  approvedByHackathon: (hackathonId) => [
    ...chapterMentorVerificationQueryKeys.origin,
    'hackathon',
    hackathonId,
    'approved',
  ],
};

// GET /MentorVerification
export const useGetMentorVerifications = (options = {}) => {
  return useQuery({
    queryKey: chapterMentorVerificationQueryKeys.list(),
    queryFn: async () => {
      const response = await axiosClient.get('/MentorVerification');
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

// GET /MentorVerification/hackathon/{hackathonId}/approved
export const useGetApprovedMentorsByHackathon = (hackathonId, options = {}) => {
  return useQuery({
    queryKey: chapterMentorVerificationQueryKeys.approvedByHackathon(hackathonId),
    queryFn: async () => {
      const response = await axiosClient.get(
        `/MentorVerification/hackathon/${hackathonId}/approved`,
      );
      return response.data;
    },
    enabled: !!hackathonId && options.enabled !== false,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

// PATCH /MentorVerification/{id}/approve
export const useApproveMentorVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ verificationId }) => {
      const response = await axiosClient.patch(
        `/MentorVerification/${verificationId}/approve`,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: chapterMentorVerificationQueryKeys.list(),
      });

      if (variables?.hackathonId) {
        queryClient.invalidateQueries({
          queryKey: chapterMentorVerificationQueryKeys.approvedByHackathon(
            variables.hackathonId,
          ),
        });
      }

      message.success('Đã duyệt mentor thành công');
    },
    onError: (error) => {
      message.error(
        error?.response?.data?.message || 'Không thể duyệt mentor. Vui lòng thử lại.',
      );
    },
  });
};

// PATCH /MentorVerification/{id}/reject
export const useRejectMentorVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ verificationId, reason }) => {
      const payload = reason ? { reason } : {};
      const response = await axiosClient.patch(
        `/MentorVerification/${verificationId}/reject`,
        payload,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: chapterMentorVerificationQueryKeys.list(),
      });

      if (variables?.hackathonId) {
        queryClient.invalidateQueries({
          queryKey: chapterMentorVerificationQueryKeys.approvedByHackathon(
            variables.hackathonId,
          ),
        });
      }

      message.success('Đã từ chối mentor thành công');
    },
    onError: (error) => {
      message.error(
        error?.response?.data?.message || 'Không thể từ chối mentor. Vui lòng thử lại.',
      );
    },
  });
};


