import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const groupQueryKeys = {
    origin: ['student', 'group'],
    teamsByGroup: (groupId) => [...groupQueryKeys.origin, 'teams', groupId],
};

/**
 * Get teams in a specific group
 * API: GET /api/Group/{groupId}/teams
 * @param {number} groupId - The group ID
 * @param {object} options - Query options (enabled, staleTime, etc.)
 * @returns {object} Query result with data, isLoading, error, etc.
 */
export const useGetGroupTeams = (groupId, options = {}) => {
    return useQuery({
        queryKey: groupQueryKeys.teamsByGroup(groupId),
        queryFn: async () => {
            const response = await axiosClient.get(`/Group/${groupId}/teams`);
            // Handle different response structures
            return Array.isArray(response.data) 
                ? response.data 
                : Array.isArray(response.data?.data)
                    ? response.data.data
                    : [];
        },
        enabled: !!groupId && (options.enabled !== false),
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
};

