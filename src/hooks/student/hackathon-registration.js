import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';
import { message } from 'antd';

export const hackathonRegistrationQueryKeys = {
    origin: ['student', 'hackathon-registration'],
    register: () => [...hackathonRegistrationQueryKeys.origin, 'register'],
    myRegistrations: () => [...hackathonRegistrationQueryKeys.origin, 'my-registrations'],
};

// Get my hackathon registrations
export const useGetMyHackathonRegistrations = (options = {}) => {
    return useQuery({
        queryKey: hackathonRegistrationQueryKeys.myRegistrations(),
        queryFn: async () => {
            const response = await axiosClient.get('/HackathonRegistration/my-registrations');
            // Handle response structure: { success, message, data: [...] }
            return response.data?.data || response.data || [];
        },
        staleTime: 2 * 60 * 1000,
        ...options,
    });
};

// Register for hackathon
export const useRegisterHackathon = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: hackathonRegistrationQueryKeys.register(),
        mutationFn: async ({ hackathonId, link, teamId }) => {
            const response = await axiosClient.post('/HackathonRegistration/register', {
                hackathonId,
                link,
                teamId,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: hackathonRegistrationQueryKeys.origin });
            message.success('Đăng ký hackathon thành công!');
        },
        onError: (error) => {
            message.error(error?.response?.data?.message || 'Không thể đăng ký hackathon. Vui lòng thử lại.');
        },
    });
};





