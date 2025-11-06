import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const hackathonPhaseQueryKeys = {
    origin: ['student', 'hackathon-phase'],
    phases: (hackathonId) => [...hackathonPhaseQueryKeys.origin, 'list', hackathonId],
};

// Get hackathon phases by hackathon ID
export const useGetHackathonPhases = (hackathonId) => {
    return useQuery({
        queryKey: hackathonPhaseQueryKeys.phases(hackathonId),
        queryFn: async () => {
            const response = await axiosClient.get(`/HackathonPhase/${hackathonId}`);
            return response.data;
        },
        enabled: !!hackathonId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

