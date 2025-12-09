import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import axiosClient from '../../configs/axiosClient';

export const teamHackathonApprovalQueryKeys = {
  origin: ['chapter', 'team-hackathon-approval'],
  pending: (hackathonId) => [...teamHackathonApprovalQueryKeys.origin, 'pending', hackathonId],
  approved: () => [...teamHackathonApprovalQueryKeys.origin, 'approved'],
  rejected: () => [...teamHackathonApprovalQueryKeys.origin, 'rejected'],
};

// Get pending team hackathon approvals
export const useGetPendingTeamHackathonApprovals = (hackathonId) => {
  return useQuery({
    queryKey: teamHackathonApprovalQueryKeys.pending(hackathonId),
    queryFn: async () => {
      const response = await axiosClient.get(`/HackathonRegistration/pending/${hackathonId}`);
      return response.data;
    },
    enabled: !!hackathonId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Approve team hackathon participation
export const useApproveTeamHackathon = (hackathonId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ approvalId }) => {
      const response = await axiosClient.put(`/HackathonRegistration/${approvalId}/approve`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamHackathonApprovalQueryKeys.pending(hackathonId) });
      queryClient.invalidateQueries({ queryKey: teamHackathonApprovalQueryKeys.approved() });
      message.success('Đã duyệt team tham gia hackathon');
    },
    onError: () => {
      message.error('Có lỗi xảy ra khi duyệt team');
    },
  });
};

// Reject team hackathon participation
export const useRejectTeamHackathon = (hackathonId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ approvalId, reason }) => {
      const response = await axiosClient.put(`/HackathonRegistration/${approvalId}/reject`, { reason });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamHackathonApprovalQueryKeys.pending(hackathonId) });
      queryClient.invalidateQueries({ queryKey: teamHackathonApprovalQueryKeys.rejected() });
      message.success('Đã từ chối team tham gia hackathon');
    },
    onError: () => {
      message.error('Có lỗi xảy ra khi từ chối team');
    },
  });
};

