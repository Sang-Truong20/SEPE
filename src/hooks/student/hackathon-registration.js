import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';
import { message } from 'antd';

export const hackathonRegistrationQueryKeys = {
    origin: ['student', 'hackathon-registration'],
    teamRegistration: (teamId, hackathonId) => [
        ...hackathonRegistrationQueryKeys.origin, 
        'team', 
        teamId, 
        'hackathon', 
        hackathonId
    ],
    register: () => [...hackathonRegistrationQueryKeys.origin, 'register'],
    selectPhase: () => [...hackathonRegistrationQueryKeys.origin, 'select-phase'],
    selectTrack: () => [...hackathonRegistrationQueryKeys.origin, 'select-track'],
};

// Get team hackathon registration
export const useGetTeamHackathonRegistration = (teamId, hackathonId, options = {}) => {
    return useQuery({
        queryKey: hackathonRegistrationQueryKeys.teamRegistration(teamId, hackathonId),
        queryFn: async () => {
            const response = await axiosClient.get(`/TeamHackathonRegistration/team/${teamId}/hackathon/${hackathonId}`);
            return response.data;
        },
        enabled: !!teamId && !!hackathonId && (options.enabled !== false),
        staleTime: 2 * 60 * 1000, // 2 minutes
        ...options,
    });
};

// Register team for hackathon
export const useRegisterTeamForHackathon = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: hackathonRegistrationQueryKeys.register(),
        mutationFn: async ({ teamId, hackathonId }) => {
            const response = await axiosClient.post('/TeamHackathonRegistration', {
                teamId,
                hackathonId,
            });
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ 
                queryKey: hackathonRegistrationQueryKeys.teamRegistration(
                    variables.teamId, 
                    variables.hackathonId
                ) 
            });
            message.success('Đã đăng ký hackathon thành công. Đang chờ chapter duyệt.');
        },
        onError: (error) => {
            message.error(error?.response?.data?.message || 'Không thể đăng ký hackathon');
        },
    });
};

// Select phase for team
export const useSelectHackathonPhase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: hackathonRegistrationQueryKeys.selectPhase(),
        mutationFn: async ({ teamId, hackathonId, phaseId }) => {
            const response = await axiosClient.post(`/TeamHackathonRegistration/select-phase`, {
                teamId,
                hackathonId,
                phaseId,
            });
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ 
                queryKey: hackathonRegistrationQueryKeys.teamRegistration(
                    variables.teamId, 
                    variables.hackathonId
                ) 
            });
            message.success('Đã chọn giai đoạn thành công');
        },
        onError: (error) => {
            message.error(error?.response?.data?.message || 'Không thể chọn giai đoạn');
        },
    });
};

// Select track for team
export const useSelectHackathonTrack = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: hackathonRegistrationQueryKeys.selectTrack(),
        mutationFn: async ({ teamId, hackathonId, trackId }) => {
            const response = await axiosClient.post(`/TeamHackathonRegistration/select-track`, {
                teamId,
                hackathonId,
                trackId,
            });
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ 
                queryKey: hackathonRegistrationQueryKeys.teamRegistration(
                    variables.teamId, 
                    variables.hackathonId
                ) 
            });
            message.success('Đã chọn track thành công');
        },
        onError: (error) => {
            message.error(error?.response?.data?.message || 'Không thể chọn track');
        },
    });
};

