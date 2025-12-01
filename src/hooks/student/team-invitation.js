import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const teamInvitationQueryKeys = {
    origin: ['student', 'team-invitation'],
    invite: (teamId) => [...teamInvitationQueryKeys.origin, 'invite', teamId],
    teamInvitations: (teamId) => [...teamInvitationQueryKeys.origin, 'team', teamId],
    status: () => [...teamInvitationQueryKeys.origin, 'status'],
    accept: () => [...teamInvitationQueryKeys.origin, 'accept'],
    reject: () => [...teamInvitationQueryKeys.origin, 'reject'],
};

export const useInviteTeamMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: teamInvitationQueryKeys.invite(),
        mutationFn: async ({ teamId, email }) => {
            const response = await axiosClient.post(`/TeamInvitation/${teamId}/invite`, {
                email,
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: teamInvitationQueryKeys.status() });
            queryClient.invalidateQueries({ queryKey: teamInvitationQueryKeys.invite(variables.teamId) });
        },
    });
};

export const useAcceptTeamInvitation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: teamInvitationQueryKeys.accept(),
        mutationFn: async ({ code }) => {
            const response = await axiosClient.post('/TeamInvitation/accept', null, {
                params: { code },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: teamInvitationQueryKeys.status() });
        },
    });
};

export const useRejectTeamInvitation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: teamInvitationQueryKeys.reject(),
        mutationFn: async ({ code }) => {
            const response = await axiosClient.post('/TeamInvitation/reject', null, {
                params: { code },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: teamInvitationQueryKeys.status() });
        },
    });
};

export const useTeamInvitationStatus = () => {
    return useQuery({
        queryKey: teamInvitationQueryKeys.status(),
        queryFn: async () => {
            const response = await axiosClient.get('/TeamInvitation/status');
            return response.data;
        },
        retry: false,
    });
};

// Get invitations by team ID
export const useGetTeamInvitationsByTeam = (teamId, options = {}) => {
    return useQuery({
        queryKey: teamInvitationQueryKeys.teamInvitations(teamId),
        queryFn: async () => {
            const response = await axiosClient.get(`/TeamInvitation/team/${teamId}`);
            return response.data;
        },
        enabled: !!teamId && (options.enabled !== false),
        staleTime: 5 * 60 * 1000,
        ...options,
    });
};


