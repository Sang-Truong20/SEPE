import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const trackPhaseQueryKeys = {
    origin: ['student', 'track-phase'],
    tracksByPhase: (phaseId) => [...trackPhaseQueryKeys.origin, 'phase', phaseId],
};

// Get tracks by phase
export const useGetTracksByPhase = (phaseId, options = {}) => {
    return useQuery({
        queryKey: trackPhaseQueryKeys.tracksByPhase(phaseId),
        queryFn: async () => {
            const response = await axiosClient.get('/Track', {
                params: { phaseId },
            });
            return response.data || [];
        },
        enabled: !!phaseId && (options.enabled !== false),
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
};

