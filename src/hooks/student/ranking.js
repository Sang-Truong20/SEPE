import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const rankingQueryKeys = {
  origin: ['student', 'ranking'],
  hackathon: (hackathonId) => [...rankingQueryKeys.origin, 'hackathon', hackathonId],
};

export const useGetHackathonRanking = (hackathonId) => {
  return useQuery({
    queryKey: rankingQueryKeys.hackathon(hackathonId),
    queryFn: async () => {
      const response = await axiosClient.get(`/Ranking/hackathon/${hackathonId}`);
      return response.data;
    },
    enabled: !!hackathonId,
  });
};


