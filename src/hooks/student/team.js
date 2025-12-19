import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const teamQueryKeys = {
  origin: ['student', 'team'],
  teams: () => [...teamQueryKeys.origin, 'list'],
  myTeams: () => [...teamQueryKeys.origin, 'my-teams'],
  team: (id) => [...teamQueryKeys.origin, 'detail', id],
  create: () => [...teamQueryKeys.origin, 'create'],
};

// Create team
export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: teamQueryKeys.create(),
    mutationFn: async (teamData) => {
      const response = await axiosClient.post('/Team', {
        teamName: teamData.teamName,
        chapterId: teamData.chapterId,
        leaderId: teamData.leaderId,
      });

      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch teams list
      queryClient.invalidateQueries({ queryKey: teamQueryKeys.teams() });
      queryClient.invalidateQueries({ queryKey: teamQueryKeys.myTeams() });
    },
  });
};

// Get all teams
export const useGetTeams = (options = {}) => {
  return useQuery({
    queryKey: teamQueryKeys.teams(),
    queryFn: async () => {
      const response = await axiosClient.get('/Team');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// Get current user's teams
export const useGetMyTeams = (options = {}) => {
  return useQuery({
    queryKey: teamQueryKeys.myTeams(),
    queryFn: async () => {
      const response = await axiosClient.get('/Team/my-teams');
      // Handle response structure: { success, message, data: [...] }
      return response.data?.data || response.data || [];
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// Get team by ID
export const useGetTeam = (teamId, options = {}) => {
  return useQuery({
    queryKey: teamQueryKeys.team(teamId),
    queryFn: async () => {
      const response = await axiosClient.get(`/Team/${teamId}`);
      return response.data;
    },
    enabled: !!teamId && options.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};
