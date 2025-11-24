import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';
import { message } from 'antd';

export const teamMemberApprovalQueryKeys = {
    origin: ['student', 'team-member-approval'],
    pendingMembers: (teamId) => [...teamMemberApprovalQueryKeys.origin, 'pending', teamId],
    approve: () => [...teamMemberApprovalQueryKeys.origin, 'approve'],
    reject: () => [...teamMemberApprovalQueryKeys.origin, 'reject'],
};

// Mock data for pending members
const mockPendingMembers = {
    'team-1': [
        {
            id: 3,
            userId: 'user-3',
            name: 'Lê Minh Đức',
            email: 'duc@example.com',
            role: 'Lập trình Backend',
            skills: ['Python', 'FastAPI', 'PostgreSQL'],
            avatar: 'LMD',
            status: 'pending',
            invitedAt: '2024-10-15T10:30:00Z',
            message: 'Tôi muốn tham gia đội của bạn',
        },
        {
            id: 5,
            userId: 'user-5',
            name: 'Nguyễn Văn Hùng',
            email: 'hung@example.com',
            role: 'Full Stack Developer',
            skills: ['React', 'Node.js', 'MongoDB'],
            avatar: 'NVH',
            status: 'pending',
            invitedAt: '2024-10-16T14:20:00Z',
            message: null,
        },
    ],
};

// Get pending members for approval
export const useGetPendingMembers = (teamId, options = {}) => {
    return useQuery({
        queryKey: teamMemberApprovalQueryKeys.pendingMembers(teamId),
        queryFn: async () => {
            // Mock data
            if (mockPendingMembers[teamId]) {
                await new Promise((resolve) => setTimeout(resolve, 300));
                return mockPendingMembers[teamId];
            }
            
            // Real API call
            const response = await axiosClient.get(`/TeamMember/${teamId}/pending`);
            return response.data;
        },
        enabled: !!teamId && (options.enabled !== false),
        staleTime: 1 * 60 * 1000, // 1 minute
        placeholderData: mockPendingMembers[teamId] || [],
        ...options,
    });
};

// Approve team member
export const useApproveTeamMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: teamMemberApprovalQueryKeys.approve(),
        mutationFn: async ({ teamId, memberId }) => {
            // Mock - simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            
            // Real API call
            const response = await axiosClient.post(`/TeamMember/${teamId}/approve/${memberId}`);
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ 
                queryKey: teamMemberApprovalQueryKeys.pendingMembers(variables.teamId) 
            });
            queryClient.invalidateQueries({ 
                queryKey: ['student', 'team-member', 'members', variables.teamId] 
            });
            message.success('Đã chấp nhận thành viên vào đội');
        },
        onError: (error) => {
            message.error(error?.response?.data?.message || 'Không thể chấp nhận thành viên');
        },
    });
};

// Reject team member
export const useRejectTeamMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: teamMemberApprovalQueryKeys.reject(),
        mutationFn: async ({ teamId, memberId, reason }) => {
            // Mock - simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            
            // Real API call
            const response = await axiosClient.post(`/TeamMember/${teamId}/reject/${memberId}`, {
                reason,
            });
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ 
                queryKey: teamMemberApprovalQueryKeys.pendingMembers(variables.teamId) 
            });
            message.success('Đã từ chối thành viên');
        },
        onError: (error) => {
            message.error(error?.response?.data?.message || 'Không thể từ chối thành viên');
        },
    });
};

