import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';
import { message } from 'antd';

export const teamTrackQueryKeys = {
    origin: ['student', 'team-track'],
    select: () => [...teamTrackQueryKeys.origin, 'select'],
    byPhase: (teamId, phaseId) => [...teamTrackQueryKeys.origin, 'by-phase', teamId, phaseId],
};

/**
 * Get team's selected track for a specific phase
 * API: GET /api/TeamTrack/by-phase?teamId={teamId}&phaseId={phaseId}
 * Returns 204 (No Content) if team hasn't selected any track yet
 * @param {number} teamId - The team ID
 * @param {number} phaseId - The phase ID
 * @param {object} options - Query options (enabled, staleTime, etc.)
 * @returns {object} Query result with data (track object or null), isLoading, error, etc.
 */
export const useGetTeamTrackByPhase = (teamId, phaseId, options = {}) => {
    return useQuery({
        queryKey: teamTrackQueryKeys.byPhase(teamId, phaseId),
        queryFn: async () => {
            try {
                const response = await axiosClient.get('/TeamTrack/by-phase', {
                    params: { teamId, phaseId },
                });
                // Handle 204 No Content - team hasn't selected track yet
                if (response.status === 204 || !response.data) {
                    return null;
                }
                // Return track data
                return response.data?.data || response.data || null;
            } catch (error) {
                // Handle 204 as a valid case (no track selected)
                if (error?.response?.status === 204) {
                    return null;
                }
                // Re-throw other errors
                throw error;
            }
        },
        enabled: !!teamId && !!phaseId && (options.enabled !== false),
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
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
        onSuccess: () => {
            // Invalidate all team-track queries including byPhase queries
            queryClient.invalidateQueries({ queryKey: teamTrackQueryKeys.origin });
            message.success('Đã chọn track thành công');
        },
        onError: (error) => {
            message.error(error?.response?.data?.message || 'Không thể chọn track. Vui lòng thử lại.');
        },
    });
};

