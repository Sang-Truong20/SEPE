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
    mutationFn: async ({ teamId, teamid }) => {
      const payloadTeamId = teamId ?? teamid;
      if (!hackathonId || !payloadTeamId) {
        throw new Error('hackathonId and teamId are required');
      }
      const response = await axiosClient.post('/HackathonRegistration/approve', {
        hackathonId,
        teamId: payloadTeamId,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      const approvedTeamId = variables?.teamId ?? variables?.teamid;

      // Optimistic update: remove approved team from pending list in cache
      if (approvedTeamId) {
        queryClient.setQueryData(
          teamHackathonApprovalQueryKeys.pending(hackathonId),
          (old) => {
            if (!old) return old;

            const list = Array.isArray(old)
              ? old
              : Array.isArray(old.data)
              ? old.data
              : [];

            const nextList = list.filter(
              (item) =>
                item.teamId !== approvedTeamId &&
                item.teamid !== approvedTeamId,
            );

            if (Array.isArray(old)) {
              return nextList;
            }

            return {
              ...old,
              data: nextList,
            };
          },
        );
      }

      queryClient.invalidateQueries({
        queryKey: teamHackathonApprovalQueryKeys.pending(hackathonId),
      });
      queryClient.invalidateQueries({
        queryKey: teamHackathonApprovalQueryKeys.approved(),
      });
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
    mutationFn: async ({ teamId, teamid, cancelReason }) => {
      const payloadTeamId = teamId ?? teamid;
      if (!hackathonId || !payloadTeamId) {
        throw new Error('hackathonId and teamId are required');
      }
      if (!cancelReason) {
        throw new Error('cancelReason is required');
      }
      const response = await axiosClient.post('/HackathonRegistration/reject', {
        hackathonId,
        teamId: payloadTeamId,
        cancelReason,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      const rejectedTeamId = variables?.teamId ?? variables?.teamid;

      // Optimistic update: remove rejected team from pending list in cache
      if (rejectedTeamId) {
        queryClient.setQueryData(
          teamHackathonApprovalQueryKeys.pending(hackathonId),
          (old) => {
            if (!old) return old;

            const list = Array.isArray(old)
              ? old
              : Array.isArray(old.data)
              ? old.data
              : [];

            const nextList = list.filter(
              (item) =>
                item.teamId !== rejectedTeamId &&
                item.teamid !== rejectedTeamId,
            );

            if (Array.isArray(old)) {
              return nextList;
            }

            return {
              ...old,
              data: nextList,
            };
          },
        );
      }

      queryClient.invalidateQueries({
        queryKey: teamHackathonApprovalQueryKeys.pending(hackathonId),
      });
      queryClient.invalidateQueries({
        queryKey: teamHackathonApprovalQueryKeys.rejected(),
      });
      message.success('Đã từ chối team tham gia hackathon');
    },
    onError: () => {
      message.error('Có lỗi xảy ra khi từ chối team');
    },
  });
};

