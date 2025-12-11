import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';
import { message } from 'antd';

export const teamTrackQueryKeys = {
    origin: ['student', 'team-track'],
    select: () => [...teamTrackQueryKeys.origin, 'select'],
};

// Select track for team
export const useSelectTeamTrack = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: teamTrackQueryKeys.select(),
        mutationFn: async ({ teamId, trackId }) => {
            const response = await axiosClient.post('/TeamTrack/select', {
                teamId,
                trackId,
            });
            return response.data;
        },
        onSuccess: (data, variables) => {
            // Invalidate related queries if needed
            queryClient.invalidateQueries({ queryKey: teamTrackQueryKeys.origin });
            message.success('Đã chọn track thành công');
        },
        onError: (error) => {
            message.error(error?.response?.data?.message || 'Không thể chọn track. Vui lòng thử lại.');
        },
    });
};

