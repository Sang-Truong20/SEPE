import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';
import { message } from 'antd';

export const teamMemberApprovalQueryKeys = {
    origin: ['student', 'team-member-approval'],
    approve: () => [...teamMemberApprovalQueryKeys.origin, 'approve'],
    reject: () => [...teamMemberApprovalQueryKeys.origin, 'reject'],
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
        onSuccess: () => {
            message.success('Đã từ chối thành viên');
        },
        onError: (error) => {
            message.error(error?.response?.data?.message || 'Không thể từ chối thành viên');
        },
    });
};

