import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';
import { message } from 'antd';

export const teamPenaltyQueryKeys = {
    origin: ['student', 'team-penalty'],
    teamPenalties: (teamId) => [...teamPenaltyQueryKeys.origin, 'team', teamId],
    penalty: (penaltyId) => [...teamPenaltyQueryKeys.origin, 'detail', penaltyId],
    createAppeal: () => [...teamPenaltyQueryKeys.origin, 'appeal', 'create'],
};

// Mock data for team penalties
const mockTeamPenalties = {
    'team-1': [
        {
            id: 'penalty-1',
            teamId: 'team-1',
            type: 'late_submission',
            reason: 'Nộp bài muộn 2 giờ trong vòng loại',
            points: -5,
            date: '2024-10-15T14:30:00Z',
            hackathonPhase: 'Vòng loại',
            status: 'active',
            canAppeal: true,
        },
        {
            id: 'penalty-2',
            teamId: 'team-1',
            type: 'rule_violation',
            reason: 'Vi phạm quy tắc sử dụng thư viện bên ngoài',
            points: -10,
            date: '2024-10-10T09:15:00Z',
            hackathonPhase: 'Vòng chung kết',
            status: 'active',
            canAppeal: true,
        },
        {
            id: 'penalty-3',
            teamId: 'team-1',
            type: 'abandonment',
            reason: 'Thành viên bỏ thi giữa chừng',
            points: -15,
            date: '2024-09-20T16:45:00Z',
            hackathonPhase: 'Vòng loại',
            status: 'appealed',
            appealStatus: 'pending',
            canAppeal: false,
        },
    ],
};

// Get team penalties
export const useGetTeamPenalties = (teamId, options = {}) => {
    return useQuery({
        queryKey: teamPenaltyQueryKeys.teamPenalties(teamId),
        queryFn: async () => {
            // Mock data
            if (mockTeamPenalties[teamId]) {
                await new Promise((resolve) => setTimeout(resolve, 300));
                return mockTeamPenalties[teamId];
            }
            
            // Real API call
            const response = await axiosClient.get(`/TeamPenalty/team/${teamId}`);
            return response.data;
        },
        enabled: !!teamId && (options.enabled !== false),
        staleTime: 5 * 60 * 1000, // 5 minutes
        placeholderData: mockTeamPenalties[teamId] || [],
        ...options,
    });
};

// Create appeal for team penalty
export const useAppealTeamPenalty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: teamPenaltyQueryKeys.createAppeal(),
        mutationFn: async ({ penaltyId, teamId, message: appealMessage }) => {
            // Mock - simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            
            // Real API call
            const response = await axiosClient.post(`/TeamPenalty/${penaltyId}/appeal`, {
                teamId,
                message: appealMessage,
            });
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ 
                queryKey: teamPenaltyQueryKeys.teamPenalties(variables.teamId) 
            });
            queryClient.invalidateQueries({ 
                queryKey: ['student', 'appeal'] 
            });
            message.success('Đơn phúc khảo đã được gửi thành công');
        },
        onError: (error) => {
            message.error(error?.response?.data?.message || 'Không thể gửi đơn phúc khảo');
        },
    });
};

