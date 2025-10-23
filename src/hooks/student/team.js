import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const teamQueryKeys = {
    origin: ['student', 'team'],
    teams: () => [...teamQueryKeys.origin, 'list'],
    team: (id) => [...teamQueryKeys.origin, 'detail', id],
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




