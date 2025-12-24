import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import axiosClient from '../../configs/axiosClient';

export const teamMemberQueryKeys = {
    origin: ['student', 'team-member'],
    leader: ['student', 'team-member', 'leader'],
    members: (teamId) => [...teamMemberQueryKeys.origin, 'members', teamId],
    isLeader: (teamId) => [...teamMemberQueryKeys.origin, 'is-leader', teamId],
    kick: (teamId, memberId) => [...teamMemberQueryKeys.leader, 'kick', teamId, memberId],
    leave: (teamId) => [...teamMemberQueryKeys.origin, 'leave', teamId],
    invite: (teamId) => [...teamMemberQueryKeys.leader, 'invite', teamId],
    transferLeader: (teamId, newLeaderId) => [...teamMemberQueryKeys.leader, 'transfer-leader', teamId, newLeaderId],
};

// Get team members
export const useGetTeamMembers = (teamId, options = {}) => {
    return useQuery({
        queryKey: teamMemberQueryKeys.members(teamId),
        queryFn: async () => {
            const response = await axiosClient.get(`/TeamMember/${teamId}/members`);
            return response.data;
        },
        enabled: !!teamId && (options.enabled !== false),
        staleTime: 2 * 60 * 1000, // 2 minutes - team members can change frequently
        ...options,
    });
};

// Check if current user is team leader
export const useIsTeamLeader = (teamId, options = {}) => {
    return useQuery({
        queryKey: teamMemberQueryKeys.isLeader(teamId),
        queryFn: async () => {
            const response = await axiosClient.get(`/TeamMember/${teamId}/is-leader`);
            return response.data?.data?.isLeader || false;
        },
        enabled: !!teamId && (options.enabled !== false),
        staleTime: 2 * 60 * 1000, // 2 minutes
        ...options,
    });
};

// Kick team member
export const useKickTeamMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: teamMemberQueryKeys.kick(),
        mutationFn: async ({ teamId, memberId }) => {
            const response = await axiosClient.delete(`/TeamMember/${teamId}/kick/${memberId}`);
            return response.data;
        },
        onSuccess: (data, variables) => {
            // Invalidate team members list
            queryClient.invalidateQueries({ queryKey: teamMemberQueryKeys.members(variables.teamId) });
        },
        onError: (error) => {
            console.error('Kick team member error:', error);
        },
    });
};

// Leave team
export const useLeaveTeam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: teamMemberQueryKeys.leave(),
        mutationFn: async (teamId) => {
            const response = await axiosClient.post(`/TeamMember/${teamId}/leave`);
            return response.data;
        },
        onSuccess: (data, variables) => {
            // Remove team members cache for this team
            queryClient.removeQueries({ queryKey: teamMemberQueryKeys.members(variables) });

            // Invalidate team list to reflect membership changes
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === 'student' && query.queryKey[1] === 'team'
            });
        },
        onError: (error) => {
            console.error('Leave team error:', error);
        },
    });
};

// Invite team member
export const useInviteTeamMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: teamMemberQueryKeys.invite(),
        mutationFn: async ({ teamId, email }) => {
            const response = await axiosClient.post(`/TeamMember/${teamId}/invite`, {
                email: email,
            });
            return response.data;
        },
        onSuccess: (data, variables) => {
            // Invalidate team members list to show pending invitations
            queryClient.invalidateQueries({ queryKey: teamMemberQueryKeys.members(variables.teamId) });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || 'Không thể gửi lời mời. Vui lòng thử lại.';
            message.error(msg);
        },
    });
};

// Transfer team leadership
export const useTransferTeamLeader = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: teamMemberQueryKeys.transferLeader(),
        mutationFn: async ({ teamId, newLeaderId }) => {
            const response = await axiosClient.post(`/TeamMember/${teamId}/transfer-leader/${newLeaderId}`);
            return response.data;
        },
        onSuccess: (data, variables) => {
            // Invalidate team members list to reflect leadership change
            queryClient.invalidateQueries({ queryKey: teamMemberQueryKeys.members(variables.teamId) });

            // Invalidate team data to update leader info
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === 'student' && query.queryKey[1] === 'team'
            });
        },
        onError: (error) => {
            console.error('Transfer team leader error:', error);
        },
    });
};

