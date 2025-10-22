import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const teamQueryKeys = {
    origin: ['student', 'team'],
    teams: () => [...teamQueryKeys.origin, 'list'],
    team: (id) => [...teamQueryKeys.origin, 'detail', id],
    create: () => [...teamQueryKeys.origin, 'create'],
    update: (id) => [...teamQueryKeys.origin, 'update', id],
    delete: (id) => [...teamQueryKeys.origin, 'delete', id],
};

// Create team
export const useCreateTeam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: teamQueryKeys.create(),
        mutationFn: async (teamData) => {
            const response = await axiosClient.post('/api/Team', {
                teamName: teamData.teamName,
                chapterId: teamData.chapterId,
                leaderId: teamData.leaderId,
            });

            return response.data;
        },
        onSuccess: () => {
            // Invalidate and refetch teams list
            queryClient.invalidateQueries({ queryKey: teamQueryKeys.teams() });
        },
    });
};

// Get all teams
export const useGetTeams = (options = {}) => {
    return useQuery({
        queryKey: teamQueryKeys.teams(),
        queryFn: async () => {
            const response = await axiosClient.get('/api/Team');
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
};

// Get team by ID
export const useGetTeam = (teamId, options = {}) => {
    return useQuery({
        queryKey: teamQueryKeys.team(teamId),
        queryFn: async () => {
            const response = await axiosClient.get(`/api/Team/${teamId}`);
            return response.data;
        },
        enabled: !!teamId && (options.enabled !== false),
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
};

// Update team
export const useUpdateTeam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: teamQueryKeys.update(),
        mutationFn: async ({ teamId, ...updateData }) => {
            const response = await axiosClient.put(`/api/Team/${teamId}`, updateData);
            return response.data;
        },
        onSuccess: (data, variables) => {
            // Update the cached team
            queryClient.setQueryData(teamQueryKeys.team(variables.teamId), data);

            // Invalidate team list to refetch
            queryClient.invalidateQueries({ queryKey: teamQueryKeys.teams() });

            // Invalidate other team-related queries that might be affected
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === 'student' &&
                                   query.queryKey[1] === 'team' &&
                                   query.queryKey[2] !== 'detail' // Keep individual team cache but invalidate lists
            });
        },
    });
};

// Delete team
export const useDeleteTeam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: teamQueryKeys.delete(),
        mutationFn: async (teamId) => {
            const response = await axiosClient.delete(`/api/Team/${teamId}`);
            return response.data;
        },
        onSuccess: (data, variables) => {
            // Remove the team from cache
            queryClient.removeQueries({ queryKey: teamQueryKeys.team(variables) });

            // Invalidate team list to refetch
            queryClient.invalidateQueries({ queryKey: teamQueryKeys.teams() });

            // Invalidate other team-related queries that might be affected
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === 'student' &&
                                   query.queryKey[1] === 'team' &&
                                   query.queryKey[2] !== 'detail' // Keep other individual teams but invalidate lists
            });
        },
    });
};


