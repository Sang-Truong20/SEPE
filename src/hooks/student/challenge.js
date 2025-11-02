import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const challengeQueryKeys = {
    origin: ['student', 'challenge'],
    challenges: () => [...challengeQueryKeys.origin, 'list'],
    challenge: (id) => [...challengeQueryKeys.origin, 'detail', id],

};

// Get all challenges
export const useGetChallenges = (options = {}) => {
    return useQuery({
        queryKey: challengeQueryKeys.challenges(),
        queryFn: async () => {
            const response = await axiosClient.get('/Challenge');
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
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




