import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';
import { message } from 'antd';

export const mentorRegistrationQueryKeys = {
    origin: ['student', 'mentor-registration'],
    teamMentor: (teamId, hackathonId) => [
        ...mentorRegistrationQueryKeys.origin,
        'team',
        teamId,
        'hackathon',
        hackathonId,
    ],
    availableMentors: (hackathonId) => [
        ...mentorRegistrationQueryKeys.origin,
        'available',
        hackathonId,
    ],
    register: () => [...mentorRegistrationQueryKeys.origin, 'register'],
};

// Mock data for mentor registration
const mockTeamMentors = {
    'team-1-hackathon-1': {
        teamId: 'team-1',
        hackathonId: '1',
        mentorId: null,
        mentorName: null,
        status: 'not_registered', // not_registered, pending, approved, rejected
        registeredAt: null,
        message: null,
    },
    'team-1-hackathon-2': {
        teamId: 'team-1',
        hackathonId: '2',
        mentorId: 'mentor-1',
        mentorName: 'Nguyễn Văn Mentor',
        status: 'approved',
        registeredAt: '2024-09-20T10:00:00Z',
        message: 'Mentor đã được phân công cho đội',
    },
};

const mockAvailableMentors = {
    '1': [
        {
            id: 'mentor-1',
            name: 'Nguyễn Văn Mentor',
            email: 'mentor1@example.com',
            expertise: ['AI/ML', 'Web Development'],
            experience: '5 năm',
            availableSlots: 3,
        },
        {
            id: 'mentor-2',
            name: 'Trần Thị Advisor',
            email: 'advisor@example.com',
            expertise: ['Mobile Development', 'UI/UX'],
            experience: '7 năm',
            availableSlots: 2,
        },
        {
            id: 'mentor-3',
            name: 'Lê Văn Coach',
            email: 'coach@example.com',
            expertise: ['Blockchain', 'Backend'],
            experience: '4 năm',
            availableSlots: 5,
        },
    ],
};

// Get team mentor registration
export const useGetTeamMentor = (teamId, hackathonId, options = {}) => {
    return useQuery({
        queryKey: mentorRegistrationQueryKeys.teamMentor(teamId, hackathonId),
        queryFn: async () => {
            const key = `${teamId}-hackathon-${hackathonId}`;
            // Mock data
            if (mockTeamMentors[key]) {
                await new Promise((resolve) => setTimeout(resolve, 300));
                return mockTeamMentors[key];
            }
            
            // Real API call
            const response = await axiosClient.get(
                `/MentorRegistration/team/${teamId}/hackathon/${hackathonId}`
            );
            return response.data;
        },
        enabled: !!teamId && !!hackathonId && (options.enabled !== false),
        staleTime: 2 * 60 * 1000, // 2 minutes
        placeholderData: mockTeamMentors[`${teamId}-hackathon-${hackathonId}`] || null,
        ...options,
    });
};

// Get available mentors for hackathon
export const useGetAvailableMentors = (hackathonId, options = {}) => {
    return useQuery({
        queryKey: mentorRegistrationQueryKeys.availableMentors(hackathonId),
        queryFn: async () => {
            // Mock data
            if (mockAvailableMentors[hackathonId]) {
                await new Promise((resolve) => setTimeout(resolve, 300));
                return mockAvailableMentors[hackathonId];
            }
            
            // Real API call
            const response = await axiosClient.get(`/MentorRegistration/available/${hackathonId}`);
            return response.data;
        },
        enabled: !!hackathonId && (options.enabled !== false),
        staleTime: 5 * 60 * 1000, // 5 minutes
        placeholderData: mockAvailableMentors[hackathonId] || [],
        ...options,
    });
};

// Register mentor for team
export const useRegisterMentor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: mentorRegistrationQueryKeys.register(),
        mutationFn: async ({ teamId, hackathonId, mentorId, message: registrationMessage }) => {
            // Mock - simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            
            // Real API call
            const response = await axiosClient.post('/MentorRegistration', {
                teamId,
                hackathonId,
                mentorId,
                message: registrationMessage,
            });
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ 
                queryKey: mentorRegistrationQueryKeys.teamMentor(
                    variables.teamId, 
                    variables.hackathonId
                ) 
            });
            message.success('Đã đăng ký mentor thành công. Đang chờ duyệt.');
        },
        onError: (error) => {
            message.error(error?.response?.data?.message || 'Không thể đăng ký mentor');
        },
    });
};

