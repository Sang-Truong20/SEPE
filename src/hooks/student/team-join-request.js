import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const teamJoinRequestQueryKeys = {
    origin: ['student', 'team-join-request'],
    team: (teamId) => [...teamJoinRequestQueryKeys.origin, 'team', teamId],
    myRequests: () => [...teamJoinRequestQueryKeys.origin, 'my-requests'],
    detail: (requestId) => [...teamJoinRequestQueryKeys.origin, 'detail', requestId],
    create: () => [...teamJoinRequestQueryKeys.origin, 'create'],
    respond: () => [...teamJoinRequestQueryKeys.origin, 'respond'],
};

export const useCreateTeamJoinRequest = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: teamJoinRequestQueryKeys.create(),
        mutationFn: async ({ teamId, message }) => {
            const response = await axiosClient.post('/TeamJoinRequest', { teamId, message });
            return response.data;
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: teamJoinRequestQueryKeys.myRequests() });

            if (variables?.teamId) {
                queryClient.invalidateQueries({ queryKey: teamJoinRequestQueryKeys.team(variables.teamId) });
            }

            options?.onSuccess?.(data, variables, context);
        },
        ...options,
    });
};

export const useGetTeamJoinRequestsByTeam = (teamId, options = {}) => {
    return useQuery({
        queryKey: teamJoinRequestQueryKeys.team(teamId),
        queryFn: async () => {
            const response = await axiosClient.get(`/TeamJoinRequest/team/${teamId}`);
            return response.data;
        },
        enabled: !!teamId && (options.enabled !== false),
        staleTime: 2 * 60 * 1000,
        ...options,
    });
};

export const useGetMyTeamJoinRequests = (options = {}) => {
    return useQuery({
        queryKey: teamJoinRequestQueryKeys.myRequests(),
        queryFn: async () => {
            const response = await axiosClient.get('/TeamJoinRequest/my-requests');
            return response.data;
        },
        staleTime: 1 * 60 * 1000,
        ...options,
    });
};

export const useGetTeamJoinRequestDetail = (requestId, options = {}) => {
    return useQuery({
        queryKey: teamJoinRequestQueryKeys.detail(requestId),
        queryFn: async () => {
            const response = await axiosClient.get(`/TeamJoinRequest/${requestId}`);
            return response.data;
        },
        enabled: !!requestId && (options.enabled !== false),
        staleTime: 5 * 60 * 1000,
        ...options,
    });
};

export const useRespondToTeamJoinRequest = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: teamJoinRequestQueryKeys.respond(),
        mutationFn: async ({ requestId, status, leaderResponse }) => {
            const response = await axiosClient.put(`/TeamJoinRequest/${requestId}/respond`, {
                status,
                leaderResponse,
            });
            return response.data;
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: teamJoinRequestQueryKeys.detail(variables.requestId) });
            queryClient.invalidateQueries({ queryKey: teamJoinRequestQueryKeys.myRequests() });

            if (variables?.teamId) {
                queryClient.invalidateQueries({ queryKey: teamJoinRequestQueryKeys.team(variables.teamId) });
            }

            options?.onSuccess?.(data, variables, context);
        },
        ...options,
    });
};

