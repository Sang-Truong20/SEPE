import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../../configs/axiosClient';

/**
 * API: ScoreHistory endpoints
 * OpenAPI components:
 *  - No specific DTOs defined in Swagger
 *  - Response: array of ScoreHistory objects
 *    - historyId: integer
 *    - scoreId: integer
 *    - submissionId: integer
 *    - submissionTitle: string
 *    - judgeId: integer
 *    - criteriaId: integer
 *    - criteriaName: string
 *    - oldScore: integer
 *    - oldComment: string
 *    - changedAt: string (date-time)
 *    - changeReason: string
 *    - changedBy: integer
 *    - changedByName: string
 */
// -------------------------------------------------------------------
// Query Keys cho ScoreHistory
// -------------------------------------------------------------------
export const scoreHistoryQueryKeys = {
  all: ['ScoreHistories'],
  lists: () => [...scoreHistoryQueryKeys.all, 'list'],
  listByHackathon: (hackathonId) => [...scoreHistoryQueryKeys.lists(), { hackathonId }],
  listBySubmission: (submissionId) => [...scoreHistoryQueryKeys.lists(), { submissionId }],
  listByJudge: (judgeId) => [...scoreHistoryQueryKeys.lists(), { judgeId }],
};

// -------------------------------------------------------------------
// Hook chính
// -------------------------------------------------------------------
export const useScoreHistories = () => {
  const queryClient = useQueryClient();

  /**
   * API: GET /api/ScoreHistory/hackathon/{hackathonId}
   * method: GET
   * path: /api/ScoreHistory/hackathon/{hackathonId}
   * request: path param hackathonId: integer
   * response: 200 OK -> array of ScoreHistory objects
   */
    // 1. Lấy danh sách score history theo hackathonId
  const fetchScoreHistoriesByHackathon = (hackathonId) =>
      useQuery({
        queryKey: scoreHistoryQueryKeys.listByHackathon(hackathonId),
        queryFn: async () => {
          const response = await axiosClient.get(`/ScoreHistory/hackathon/${hackathonId}`);
          return response.data;
        },
        enabled: !!hackathonId,
      });

  /**
   * API: GET /api/ScoreHistory/submission/{submissionId}
   * method: GET
   * path: /api/ScoreHistory/submission/{submissionId}
   * request: path param submissionId: integer
   * response: 200 OK -> array of ScoreHistory objects
   */
    // 2. Lấy danh sách score history theo submissionId
  const fetchScoreHistoriesBySubmission = (submissionId) =>
      useQuery({
        queryKey: scoreHistoryQueryKeys.listBySubmission(submissionId),
        queryFn: async () => {
          const response = await axiosClient.get(`/ScoreHistory/submission/${submissionId}`);
          return response.data;
        },
        enabled: !!submissionId,
      });

  /**
   * API: GET /api/ScoreHistory/judge/{judgeId}
   * method: GET
   * path: /api/ScoreHistory/judge/{judgeId}
   * request: path param judgeId: integer
   * response: 200 OK -> array of ScoreHistory objects
   */
    // 3. Lấy danh sách score history theo judgeId
  const fetchScoreHistoriesByJudge = (judgeId) =>
      useQuery({
        queryKey: scoreHistoryQueryKeys.listByJudge(judgeId),
        queryFn: async () => {
          const response = await axiosClient.get(`/ScoreHistory/judge/${judgeId}`);
          return response.data;
        },
        enabled: !!judgeId,
      });

  return {
    // Queries
    fetchScoreHistoriesByHackathon,
    fetchScoreHistoriesBySubmission,
    fetchScoreHistoriesByJudge,
  };
};