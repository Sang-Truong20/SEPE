import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const hackathonQueryKeys = {
    origin: ['student', 'hackathon'],
    hackathons: () => [...hackathonQueryKeys.origin, 'list'],
    hackathon: (id) => [...hackathonQueryKeys.origin, 'detail', id],
};

// Get all hackathons
export const useGetHackathons = () => {
    return useQuery({
        queryKey: hackathonQueryKeys.hackathons(),
        queryFn: async () => {
            const response = await axiosClient.get('/api/Hackathons');
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        
    });
};

// Get hackathon by ID
export const useGetHackathon = (hackathonId) => {
    return useQuery({
        queryKey: hackathonQueryKeys.hackathon(hackathonId),
        queryFn: async () => {
            const response = await axiosClient.get(`/api/Hackathons/${hackathonId}`);
            return response.data;
        },
        enabled: !!hackathonId ,
        staleTime: 5 * 60 * 1000, // 5 minutes
        
    });
};
