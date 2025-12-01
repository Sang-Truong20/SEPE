import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';
import { message } from 'antd';

export const hackathonRegistrationQueryKeys = {
    origin: ['student', 'hackathon-registration'],
    registration: (hackathonId) => [
        ...hackathonRegistrationQueryKeys.origin, 
        'hackathon', 
        hackathonId
    ],
    register: () => [...hackathonRegistrationQueryKeys.origin, 'register'],
};

// Get hackathon registration
export const useGetTeamHackathonRegistration = (hackathonId) => {
    return useQuery({
        queryKey: hackathonRegistrationQueryKeys.registration(hackathonId),
        queryFn: async () => {
            const response = await axiosClient.get(`/HackathonRegistration/${hackathonId}`);
            return response.data;
        },
        enabled: !!hackathonId,
    });
};

// Register for hackathon
export const useRegisterHackathon = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: hackathonRegistrationQueryKeys.register(),
        mutationFn: async ({ hackathonId, link }) => {
            const response = await axiosClient.post('/HackathonRegistration/register', {
                hackathonId,
                link,
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





