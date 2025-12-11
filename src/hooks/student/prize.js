import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const prizeQueryKeys = {
    origin: ['student', 'prize'],
    prizes: () => [...prizeQueryKeys.origin, 'list'],
    prize: (hackathonId) => [...prizeQueryKeys.origin, 'detail', hackathonId],  
};

export const useGetPrizes = () => {
    return useQuery({
        queryKey: prizeQueryKeys.prizes(),
        queryFn: async () => {
            const response = await axiosClient.get('/Prize');
            return response.data;
        },
    });
};

export const useGetPrize = (hackathonId) => {
    return useQuery({
        queryKey: prizeQueryKeys.prize(hackathonId),
        queryFn: async () => {
            const response = await axiosClient.get(`/Prize/hackathon/${hackathonId}`);
            return response.data;
        },
        enabled: !!hackathonId,
    });
};