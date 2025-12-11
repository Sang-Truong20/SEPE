import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const penaltyQueryKeys = {
    origin: ['student', 'penalty'],
    teamPhasePenalties: (teamId, phaseId) => [...penaltyQueryKeys.origin, 'team', teamId, 'phase', phaseId],
};

/**
 * GET /api/Penalty/team/{teamId}/phase/{phaseId}
 * Get penalties for a team in a specific phase
 */
export const useGetTeamPhasePenalties = (teamId, phaseId, options = {}) => {
    return useQuery({
        queryKey: penaltyQueryKeys.teamPhasePenalties(teamId, phaseId),
        queryFn: async () => {
            const response = await axiosClient.get(`/Penalty/team/${teamId}/phase/${phaseId}`);
            return response.data;
        },
        enabled: !!teamId && !!phaseId && (options.enabled !== false),
        staleTime: 2 * 60 * 1000, // 2 minutes
        ...options,
    });
};

