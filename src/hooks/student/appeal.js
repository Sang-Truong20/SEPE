import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const appealQueryKeys = {
    origin: ['student', 'appeal'],
    appeals: () => [...appealQueryKeys.origin, 'list'],
    teamAppeals: (teamId) => [...appealQueryKeys.origin, 'team', teamId],
    appeal: (appealId) => [...appealQueryKeys.origin, 'detail', appealId],
    create: () => [...appealQueryKeys.origin, 'create'],
    review: () => [...appealQueryKeys.origin, 'review'],
};

// Create appeal
export const useCreateAppeal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: appealQueryKeys.create(),
        mutationFn: async (appealData) => {
            const response = await axiosClient.post('/Appeal', {
                adjustmentId: appealData.adjustmentId,
                teamId: appealData.teamId,
                message: appealData.message,
            });

            return response.data;
        },
        onSuccess: (data, variables) => {
            // Invalidate appeal lists
            queryClient.invalidateQueries({ queryKey: appealQueryKeys.appeals() });

            // Invalidate team appeals for the specific team
            queryClient.invalidateQueries({ queryKey: appealQueryKeys.teamAppeals(variables.teamId) });
        },
    });
};

// Get all appeals
export const useGetAllAppeals = (options = {}) => {
    return useQuery({
        queryKey: appealQueryKeys.appeals(),
        queryFn: async () => {
            const response = await axiosClient.get('/Appeal/all');
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
};

// Get appeals by team
export const useGetTeamAppeals = (teamId, options = {}) => {
    return useQuery({
        queryKey: appealQueryKeys.teamAppeals(teamId),
        queryFn: async () => {
            const response = await axiosClient.get(`/Appeal/team/${teamId}`);
            return response.data;
        },
        enabled: !!teamId && (options.enabled !== false),
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
};

// Get appeal by ID
export const useGetAppeal = (appealId, options = {}) => {
    return useQuery({
        queryKey: appealQueryKeys.appeal(appealId),
        queryFn: async () => {
            const response = await axiosClient.get(`/Appeal/${appealId}`);
            return response.data;
        },
        enabled: !!appealId && (options.enabled !== false),
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
};

// Review appeal
export const useReviewAppeal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: appealQueryKeys.review(),
        mutationFn: async ({ appealId, status, adminResponse, reviewedById }) => {
            const response = await axiosClient.put(`/Appeal/${appealId}/review`, {
                status,
                adminResponse,
                reviewedById,
            });
            return response.data;
        },
        onSuccess: (data, variables) => {
            // Update the cached appeal
            queryClient.setQueryData(appealQueryKeys.appeal(variables.appealId), data);

            // Invalidate appeal lists to refetch
            queryClient.invalidateQueries({ queryKey: appealQueryKeys.appeals() });

            // Invalidate team appeals if we can determine the team
            if (data.teamId) {
                queryClient.invalidateQueries({ queryKey: appealQueryKeys.teamAppeals(data.teamId) });
            }
        },
    });
};
