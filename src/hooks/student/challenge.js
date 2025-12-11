import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const challengeQueryKeys = {
    origin: ['student', 'challenge'],
    challengesByTrack: (trackId) => [...challengeQueryKeys.origin, 'track', trackId],
    challenge: (id) => [...challengeQueryKeys.origin, 'detail', id],

};

// Get challenge by ID
export const useGetChallenge = (challengeId, options = {}) => {
    return useQuery({
        queryKey: challengeQueryKeys.challenge(challengeId),
        queryFn: async () => {
            const response = await axiosClient.get(`/Challenge/${challengeId}`);
            return response.data;
        },
        enabled: !!challengeId && (options.enabled !== false),
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
};

// Get challenges by track ID
export const useGetChallengesByTrack = (trackId, ) => {
    return useQuery({
        queryKey: challengeQueryKeys.challengesByTrack(trackId),
        queryFn: async () => {
            const response = await axiosClient.get(`/Challenge/track/${trackId}`);
            return response.data;
        },
        enabled: !!trackId,
    });
};




