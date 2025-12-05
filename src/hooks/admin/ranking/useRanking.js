import { useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";

/**
 * API endpoints for Ranking (Leaderboard)
 */
export const rankingQueryKeys = {
  all: ['Rankings'],
  lists: () => [...rankingQueryKeys.all, 'list'],
  list: (hackathonId) => [...rankingQueryKeys.lists(), hackathonId],
};

export const useRankings = () => {
  const queryClient = useQueryClient();

  /**
   * API: GET /api/Ranking/hackathon/{hackathonId}
   * method: GET
   * path: /Ranking/hackathon/{hackathonId} (axiosClient baseURL includes /api)
   * request: path param hackathonId: integer (int32, required)
   * response: 200 OK → array of ranking objects
   *  [
   *   {
   *     "rankingId": 3,
   *     "teamName": "Fpt",
   *     "hackathonName": "AI Agent",
   *     "totalScore": 1,
   *     "rank": 1,
   *     "updatedAt": "2025-11-26T08:46:10.3279397"
   *   }
   * ]
   */
  const fetchRankings = (hackathonId) =>
    useQuery({
      queryKey: rankingQueryKeys.list(hackathonId),
      queryFn: async () => {
        const response = await axiosClient.get(
          `/Ranking/hackathon/${hackathonId}`,
        );
        return response.data; // → RankingItem[] (or similar)
      },
      enabled: !!hackathonId,
    });

  // Optional: invalidate rankings when scores/appeals change (can be called from other hooks)
  const invalidateRankings = (hackathonId) => {
    queryClient.invalidateQueries({
      queryKey: rankingQueryKeys.list(hackathonId),
    });
  };

  return {
    fetchRankings,
    invalidateRankings,
  };
};