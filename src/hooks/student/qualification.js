import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const qualificationQueryKeys = {
  origin: ['student', 'qualification'],
  finalQualified: (phaseId) => [...qualificationQueryKeys.origin, 'final-qualified', phaseId],
};

/**
 * GET /api/Qualification/{phaseId}/final-qualified
 * Get final qualified teams for phase 2
 */
export const useGetFinalQualifiedTeams = (phaseId, options = {}) => {
  return useQuery({
    queryKey: qualificationQueryKeys.finalQualified(phaseId),
    queryFn: async () => {
      const response = await axiosClient.get(`/Qualification/${phaseId}/final-qualified`);
      return response.data;
    },
    enabled: !!phaseId && (options.enabled !== false),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

