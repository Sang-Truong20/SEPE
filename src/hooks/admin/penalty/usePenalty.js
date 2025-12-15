import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import axiosClient from '../../../configs/axiosClient';
import useMessage from '../../util/getError';

/**
 * API Group: Penalty (Penalties & Bonuses)
 * describe: Manage penalties and bonuses (list all, list by phase, list by team in phase, detail, create, update, delete)
 * CreatePenaltiesBonuseDto / UpdatePenaltiesBonuseDto fields (identical):
 *   - teamId: integer (int32) required
 *   - phaseId: integer (int32) required
 *   - type: string | null
 *   - points: number (double) required
 *   - reason: string | null
 */
export const penaltyQueryKeys = {
  all: ['Penalties'],
  lists: () => [...penaltyQueryKeys.all, 'list'],
  listAll: () => [...penaltyQueryKeys.lists(), 'all'],
  listPhase: (phaseId) => [...penaltyQueryKeys.lists(), 'phase', phaseId],
  listTeamPhase: (teamId, phaseId) => [
    ...penaltyQueryKeys.lists(),
    'team-phase',
    teamId,
    phaseId,
  ],
  details: () => [...penaltyQueryKeys.all, 'detail'],
  detail: (id) => [...penaltyQueryKeys.details(), id],
};

export const usePenalty = () => {
  const queryClient = useQueryClient();
  const { getMessage } = useMessage();

  /**
   * API: GET /api/Penalty
   * method: GET
   * path: /api/Penalty
   * request: none
   * response: 200 OK -> array of penalty/bonus objects
   * example response:
   *
   * Response body
   * Download
   * [
   *   {
   *     "adjustmentId": 1,
   *     "teamId": 8,
   *     "phaseId": 2,
   *     "type": "Penalty",
   *     "points": 0,
   *     "reason": "Cheating (Reverted by approved appeal)",
   *     "createdAt": "2025-11-25T16:04:39.8625903",
   *     "createdBy": 2,
   *     "teamName": "Fpt",
   *     "isDeleted": false
   *   }
   * ]
   */
  const fetchPenalties = useQuery({
    queryKey: penaltyQueryKeys.listAll(),
    queryFn: async () => {
      const response = await axiosClient.get('/Penalty');
      return response.data;
    },
  });

  /**
   * Not used currently
   * API: GET /api/Penalty/phase/{phaseId}
   * method: GET
   * path: /api/Penalty/phase/{phaseId}
   * request: path param phaseId: integer
   * response: 200 OK -> array of penalty/bonus objects for the phase
   */
  const fetchPenaltiesByPhase = (phaseId) =>
    useQuery({
      queryKey: penaltyQueryKeys.listPhase(phaseId),
      queryFn: async () => {
        const response = await axiosClient.get(`/Penalty/phase/${phaseId}`);
        return response.data;
      },
      enabled: !!phaseId,
    });

  /**
   * API: GET /api/Penalty/team/{teamId}/phase/{phaseId}
   * method: GET
   * path: /api/Penalty/team/{teamId}/phase/{phaseId}
   * request: path params teamId & phaseId: integer
   * response: 200 OK -> array of penalty/bonus objects for the team in the phase
   */
  const fetchPenaltiesByTeamAndPhase = (teamId, phaseId) =>
    useQuery({
      queryKey: penaltyQueryKeys.listTeamPhase(teamId, phaseId),
      queryFn: async () => {
        const response = await axiosClient.get(
          `/Penalty/team/${teamId}/phase/${phaseId}`,
        );
        return response.data;
      },
      enabled: !!teamId && !!phaseId,
    });

  /**
   * API: GET /api/Penalty/{id}
   * method: GET
   * path: /api/Penalty/{id}
   * request: path param id: integer
   * response: 200 OK -> penalty/bonus object
   */
  const fetchPenalty = (id) =>
    useQuery({
      queryKey: penaltyQueryKeys.detail(id),
      queryFn: async () => {
        const response = await axiosClient.get(`/Penalty/${id}`);
        return response.data;
      },
      enabled: !!id,
    });

  /**
   * API: POST /api/Penalty
   * method: POST
   * path: /api/Penalty
   * request body: CreatePenaltiesBonuseDto
   *   - teamId: integer (int32) required
   *   - phaseId: integer (int32) required
   *   - type: string | null
   *   - points: number (double) required
   *   - reason: string | null
   * response: 200 OK -> created penalty/bonus object
   */
  const createPenalty = useMutation({
    mutationFn: (payload) => axiosClient.post('/Penalty', payload),
    onSuccess: (data, variables) => {
      if (variables.teamId && variables.phaseId) {
        queryClient.invalidateQueries({
          queryKey: penaltyQueryKeys.listTeamPhase(
            variables.teamId,
            variables.phaseId,
          ),
        });
      }

      if (variables.phaseId) {
        queryClient.invalidateQueries({
          queryKey: penaltyQueryKeys.listPhase(variables.phaseId),
        });
      }
      message.success('Tạo điểm thưởng/phạt thành công!');
    },
    onError: (error) => {
      console.error('Error creating penalty/bonus:', error);
      message.error(getMessage(error));
    },
  });

  /**
   * API: PUT /api/Penalty/{id}
   * method: PUT
   * path: /api/Penalty/{id}
   * request body: UpdatePenaltiesBonuseDto (same fields as CreatePenaltiesBonuseDto)
   * response: 200 OK -> updated penalty/bonus object
   */
  const updatePenalty = useMutation({
    mutationFn: ({ id, payload }) => axiosClient.put(`/Penalty/${id}`, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: penaltyQueryKeys.detail(variables.id),
      });

      queryClient.invalidateQueries({
        queryKey: [...penaltyQueryKeys.lists(), 'team-phase'],
      });
      queryClient.invalidateQueries({
        queryKey: [...penaltyQueryKeys.lists(), 'phase'],
      });
      message.success('Cập nhật điểm thưởng/phạt thành công!');
    },
    onError: (error) => {
      console.error('Error updating penalty/bonus:', error);
      message.error(getMessage(error));
    },
  });

  /**
   * API: DELETE /api/Penalty/{id}
   * method: DELETE
   * path: /api/Penalty/{id}
   * request: path param id: integer
   * response: 200 OK
   */
  const deletePenalty = useMutation({
    mutationFn: (id) => axiosClient.delete(`/Penalty/${id}`),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: penaltyQueryKeys.detail(variables),
      });

      queryClient.invalidateQueries({
        queryKey: [...penaltyQueryKeys.lists(), 'team-phase'],
      });
      queryClient.invalidateQueries({
        queryKey: [...penaltyQueryKeys.lists(), 'phase'],
      });
      message.success('Xóa điểm thưởng/phạt thành công!');
    },
    onError: (error) => {
      console.error('Error deleting penalty/bonus:', error);
      message.error(getMessage(error));
    },
  });

  return {
    fetchPenalties,
    fetchPenaltiesByPhase,
    fetchPenaltiesByTeamAndPhase,
    fetchPenalty,
    createPenalty,
    updatePenalty,
    deletePenalty,
  };
};
