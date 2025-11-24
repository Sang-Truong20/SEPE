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

// Mock data for team hackathon registration
const mockTeamRegistrations = {
    'team-1-hackathon-1': {
        teamId: 'team-1',
        hackathonId: '1',
        status: 'pending', // pending, approved, rejected
        registeredAt: '2024-10-01T10:00:00Z',
        chapterResponse: null,
        selectedPhaseId: null,
        selectedTrackId: null,
        phases: [
            { id: 'phase-1', name: 'Vòng loại', startDate: '2024-10-15', endDate: '2024-10-20' },
            { id: 'phase-2', name: 'Vòng chung kết', startDate: '2024-10-25', endDate: '2024-10-30' },
        ],
        tracks: [
            { id: 'track-1', name: 'AI/ML Track', description: 'Trí tuệ nhân tạo và Machine Learning' },
            { id: 'track-2', name: 'Web Development', description: 'Phát triển ứng dụng web' },
            { id: 'track-3', name: 'Mobile Development', description: 'Phát triển ứng dụng di động' },
        ],
    },
    'team-1-hackathon-2': {
        teamId: 'team-1',
        hackathonId: '2',
        status: 'approved',
        registeredAt: '2024-09-15T14:30:00Z',
        chapterResponse: 'Đội đã được duyệt tham gia hackathon',
        selectedPhaseId: 'phase-1',
        selectedTrackId: 'track-1',
        phases: [
            { id: 'phase-1', name: 'Vòng loại', startDate: '2024-10-15', endDate: '2024-10-20' },
        ],
        tracks: [
            { id: 'track-1', name: 'AI/ML Track', description: 'Trí tuệ nhân tạo và Machine Learning' },
        ],
    },
};

// Get team hackathon registration
export const useGetTeamHackathonRegistration = (teamId, hackathonId, options = {}) => {
    return useQuery({
        queryKey: hackathonRegistrationQueryKeys.teamRegistration(teamId, hackathonId),
        queryFn: async () => {
            const key = `${teamId}-hackathon-${hackathonId}`;
            // Mock data
            if (mockTeamRegistrations[key]) {
                await new Promise((resolve) => setTimeout(resolve, 300));
                return mockTeamRegistrations[key];
            }
            
            // Real API call
            const response = await axiosClient.get(`/TeamHackathonRegistration/team/${teamId}/hackathon/${hackathonId}`);
            return response.data;
        },
        enabled: !!teamId && !!hackathonId && (options.enabled !== false),
        staleTime: 2 * 60 * 1000, // 2 minutes
        placeholderData: mockTeamRegistrations[`${teamId}-hackathon-${hackathonId}`] || null,
        ...options,
    });
};

// Register team for hackathon
export const useRegisterTeamForHackathon = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: hackathonRegistrationQueryKeys.register(),
        mutationFn: async ({ teamId, hackathonId }) => {
            // Mock - simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            
            // Real API call
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
            // Mock - simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            
            // Real API call
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
            // Mock - simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            
            // Real API call
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

