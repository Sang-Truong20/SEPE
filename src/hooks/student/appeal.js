import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const appealQueryKeys = {
    origin: ['student', 'appeal'],
    appeals: () => [...appealQueryKeys.origin, 'list'],
    teamAppeals: (teamId) => [...appealQueryKeys.origin, 'team', teamId],
    teamPhaseAppeals: (teamId, phaseId) => [...appealQueryKeys.origin, 'team', teamId, 'phase', phaseId],
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
            const appealType = appealData.appealType || 'Penalty';
            
            // Build payload based on appeal type
            const payload = {
                appealType: appealType,
                teamId: appealData.teamId,
                judgeId: appealData.judgeId,
                message: appealData.message,
                reason: appealData.reason,
            };

            // Penalty Appeal: include adjustmentId, exclude submissionId
            if (appealType === 'Penalty') {
                if (appealData.adjustmentId !== undefined && appealData.adjustmentId !== null) {
                    payload.adjustmentId = appealData.adjustmentId;
                }
                // Do NOT include submissionId for Penalty appeals
            }
            
            // Score Appeal: include submissionId, exclude adjustmentId
            if (appealType === 'Score') {
                payload.submissionId = appealData.submissionId;
                // Do NOT include adjustmentId for Score appeals
            }

            const response = await axiosClient.post('/Appeal', payload);

            return response.data;
        },
        onSuccess: (data, variables) => {
            // Invalidate appeal lists
            queryClient.invalidateQueries({ queryKey: appealQueryKeys.appeals() });

            // Invalidate team appeals for the specific team
            if (variables.teamId) {
                queryClient.invalidateQueries({ queryKey: appealQueryKeys.teamAppeals(variables.teamId) });
            }
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

// Get appeals by team and phase
export const useGetTeamPhaseAppeals = (teamId, phaseId, options = {}) => {
    return useQuery({
        queryKey: appealQueryKeys.teamPhaseAppeals(teamId, phaseId),
        queryFn: async () => {
            const response = await axiosClient.get(`/Appeal/team/${teamId}/phase/${phaseId}`);
            return response.data;
        },
        enabled: !!teamId && !!phaseId && (options.enabled !== false),
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
