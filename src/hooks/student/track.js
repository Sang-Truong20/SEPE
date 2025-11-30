import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';
import { useGetChallenge } from './challenge';

export const trackQueryKeys = {
    origin: ['student', 'track'],
    track: (trackId) => [...trackQueryKeys.origin, 'detail', trackId],
    trackCriteria: (trackId, phaseId) => [...trackQueryKeys.origin, 'criteria', trackId, phaseId],
};

// Get track details
export const useGetTrack = (trackId, options = {}) => {
    return useQuery({
        queryKey: trackQueryKeys.track(trackId),
        queryFn: async () => {
            const response = await axiosClient.get(`/Track/${trackId}`);
            return response.data;
        },
        enabled: !!trackId && (options.enabled !== false),
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
};

// Get track criteria for a specific phase
export const useGetTrackCriteria = (trackId, phaseId, options = {}) => {
    return useQuery({
        queryKey: trackQueryKeys.trackCriteria(trackId, phaseId),
        queryFn: async () => {
            // Real API call - get criteria by phase, then filter by trackId
            const response = await axiosClient.get('/Criterion', {
                params: { phaseId },
            });
            const allCriteria = response.data || [];
            // Filter by trackId
            return allCriteria.filter(
                (c) => String(c.trackId) === String(trackId) || (c.trackId === null && trackId === null)
            );
        },
        enabled: !!trackId && !!phaseId && (options.enabled !== false),
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
};

// Get track with challenge and criteria (combined hook)
export const useGetTrackWithDetails = (trackId, phaseId, options = {}) => {
    const { data: track, isLoading: trackLoading } = useGetTrack(trackId, options);
    const { data: challenge, isLoading: challengeLoading } = useGetChallenge(
        track?.challengeId,
        { enabled: !!track?.challengeId && (options.enabled !== false) }
    );
    const { data: criteria = [], isLoading: criteriaLoading } = useGetTrackCriteria(
        trackId,
        phaseId,
        { enabled: !!trackId && !!phaseId && (options.enabled !== false) }
    );

    return {
        track,
        challenge,
        criteria,
        isLoading: trackLoading || challengeLoading || criteriaLoading,
    };
};
