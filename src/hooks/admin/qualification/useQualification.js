import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import axiosClient from '../../../configs/axiosClient';

/**
 * API: Qualification endpoints
 * OpenAPI components:
 *   - No specific DTOs defined for Qualification endpoints in the Swagger spec.
 *   - Endpoints under "Qualification" tag:
 *     - POST /phase/{phaseId}/top-teams: Selects top teams for qualification in a phase. Parameters: phaseId (integer, path). Response: 200 OK (no schema defined).
 *     - GET /{phaseId}/final-qualified: Retrieves final qualified teams for a phase. Parameters: phaseId (integer, path). Response: 200 OK (no schema defined).
 */
// -------------------------------------------------------------------
// Query Keys cho Qualification
// -------------------------------------------------------------------
export const qualificationQueryKeys = {
  all: ['Qualifications'],
  lists: () => [...qualificationQueryKeys.all, 'list'],
  list: (phaseId) => [...qualificationQueryKeys.lists(), phaseId ?? 'all'], // Filter by phaseId
  details: () => [...qualificationQueryKeys.all, 'detail'],
  detail: (phaseId) => [...qualificationQueryKeys.details(), phaseId],
};

// -------------------------------------------------------------------
// Hook chính
// -------------------------------------------------------------------
export const useQualifications = () => {
  const queryClient = useQueryClient();

  /**
   * API: GET /{phaseId}/final-qualified
   * method: GET
   * path: /{phaseId}/final-qualified
   * request: path param phaseId: integer
   * response: 200 OK
   * [
   *   {
   *     "teamId": 8,
   *     "teamName": "Fpt",
   *     "groupId": 1,
   *     "groupName": "A",
   *     "trackName": "Track 1"
   *   },
   *   {
   *     "teamId": 8,
   *     "teamName": "Fpt",
   *     "groupId": 1,
   *     "groupName": "A",
   *     "trackName": "Track 1"
   *   }
   * ]
   */
  // 1. Lấy danh sách các team qualified cuối cùng theo phaseId
  const fetchFinalQualified = (phaseId) =>
    useQuery({
      queryKey: qualificationQueryKeys.list(phaseId),
      queryFn: async () => {
        const response = await axiosClient.get(`/Qualification/${phaseId}/final-qualified`);
        return response.data;
      },
      enabled: false,
    });

  /**
   * API: POST /phase/{phaseId}/top-teams
   * method: POST
   * path: /phase/{phaseId}/top-teams
   * request: path param phaseId: integer (body schema not defined)
   * response: 200 OK -> empty array
   */
  // 2. Chọn top teams cho qualification trong phase
  const selectTopTeams = useMutation({
    mutationFn: (phaseId) => axiosClient.post(`/Qualification/phase/${phaseId}/top-teams`),
    onSuccess: (_, phaseId) => {
      queryClient.invalidateQueries({
        queryKey: qualificationQueryKeys.list(phaseId),
      });
      message.success('Top teams selected successfully!');
    },
    onError: (error) => {
      console.error('Error selecting top teams:', error);
      message.error('Failed to select top teams. Please try again.');
    },
  });

  return {
    // Queries
    fetchFinalQualified,

    // Mutations
    selectTopTeams,
  };
};