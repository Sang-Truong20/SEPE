import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const scoreQueryKeys = {
    origin: ['student', 'score'],
    myScoresGrouped: (phaseId) => [...scoreQueryKeys.origin, 'my-scores-grouped', phaseId],
    teamOverview: (teamId, phaseId) => [...scoreQueryKeys.origin, 'team-overview', teamId, phaseId],
};

/**
 * Get my scores grouped by phase
 * API: GET /api/Score/myscores/grouped/{phaseId}
 * @param {number} phaseId - The phase ID
 * @param {object} options - Query options (enabled, staleTime, etc.)
 * @returns {object} Query result with data, isLoading, error, etc.
 */
export const useGetMyScoresGrouped = (phaseId, options = {}) => {
    return useQuery({
        queryKey: scoreQueryKeys.myScoresGrouped(phaseId),
        queryFn: async () => {
            const response = await axiosClient.get(`/Score/myscores/grouped/${phaseId}`);
            // Handle different response structures
            return response.data;
        },
        enabled: !!phaseId && (options.enabled !== false),
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
};

/**
 * Get team overview scores
 * API: GET /api/Score/team-overview?teamId={teamId}&phaseId={phaseId}
 * @param {number} teamId - The team ID
 * @param {number} phaseId - The phase ID
 * @param {object} options - Query options (enabled, staleTime, etc.)
 * @returns {object} Query result with data, isLoading, error, etc.
 */
export const useGetTeamOverview = (teamId, phaseId, options = {}) => {
    return useQuery({
        queryKey: scoreQueryKeys.teamOverview(teamId, phaseId),
        queryFn: async () => {
            const response = await axiosClient.get('/Score/team-overview', {
                params: { teamId, phaseId },
            });
            return response.data;
        },
        enabled: !!teamId && !!phaseId && (options.enabled !== false),
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
};

