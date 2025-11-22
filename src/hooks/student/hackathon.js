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
            const response = await axiosClient.get('/Hackathons');
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
            // Mock data for testing - Remove this when backend is ready
            if (hackathonId === '1' || hackathonId === 1) {
                await new Promise((resolve) => setTimeout(resolve, 300));
                return {
                    id: '1',
                    name: 'SEAL Hackathon 2024 - HCM',
                    title: 'SEAL Hackathon 2024 - HCM',
                    description: 'Cuộc thi hackathon lớn nhất năm 2024 tại TP.HCM, tập trung vào các giải pháp công nghệ sáng tạo cho doanh nghiệp và xã hội. Hackathon này mang đến cơ hội cho các team thể hiện tài năng và sáng tạo trong lĩnh vực công nghệ thông tin.',
                    status: 'active',
                    startDate: '2024-10-01',
                    endDate: '2024-10-31',
                    participantCount: 150,
                    seasonName: 'Mùa Thu 2024',
                    theme: 'Innovation & Technology',
                };
            }
            
            // Real API call
            const response = await axiosClient.get(`/Hackathons/${hackathonId}`);
            return response.data;
        },
        enabled: !!hackathonId ,
        staleTime: 5 * 60 * 1000, // 5 minutes
        
    });
};
