import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const teamMemberQueryKeys = {
    origin: ['student', 'team-member'],
    members: (teamId) => [...teamMemberQueryKeys.origin, 'members', teamId],
    kick: (teamId, memberId) => [...teamMemberQueryKeys.origin, 'kick', teamId, memberId],
    leave: (teamId) => [...teamMemberQueryKeys.origin, 'leave', teamId],
};

// Get team members
export const useGetTeamMembers = (teamId, options = {}) => {
    return useQuery({
        queryKey: teamMemberQueryKeys.members(teamId),
        queryFn: async () => {
            const response = await axiosClient.get(`/api/TeamMember/${teamId}/members`);
            return response.data;
        },
        enabled: !!teamId && (options.enabled !== false),
        staleTime: 2 * 60 * 1000, // 2 minutes - team members can change frequently
        ...options,
    });
};

// Kick team member
export const useKickTeamMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: teamMemberQueryKeys.kick(),
        mutationFn: async ({ teamId, memberId }) => {
            const response = await axiosClient.post(`/api/TeamMember/${teamId}/kick/${memberId}`);
            return response.data;
        },
        onSuccess: (data, variables) => {
            // Invalidate team members list
            queryClient.invalidateQueries({ queryKey: teamMemberQueryKeys.members(variables.teamId) });

           
        },
    });
};

// Leave team
export const useLeaveTeam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: teamMemberQueryKeys.leave(),
        mutationFn: async (teamId) => {
            const response = await axiosClient.post(`/api/TeamMember/${teamId}/leave`);
            return response.data;
        },
        onSuccess: (data, variables) => {
            // Remove team members cache for this team
            queryClient.removeQueries({ queryKey: teamMemberQueryKeys.members(variables) });

            // Invalidate team list to reflect membership changes
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === 'student' && query.queryKey[1] === 'team'
            });

           
        },
    });
};

