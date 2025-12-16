import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";
import useMessage from "../../util/getError";

/**
 * Appeal Management Hooks
 * Dựa trên Swagger thực tế: https://www.sealfall25.somee.com/swagger/index.html
 *
 * Các endpoint chính:
 * - GET /api/Appeal/all
 * - GET /api/Appeal/team/{teamId}
 * - GET /api/Appeal/phase/{phaseId}
 * - GET /api/Appeal/{appealId}
 * - POST /api/Appeal
 * - PUT /api/Appeal/{appealId}/review
 */
export const appealQueryKeys = {
  all: ['Appeals'],
  lists: () => [...appealQueryKeys.all, 'list'],
  list: (filters) => [...appealQueryKeys.lists(), filters],
  details: () => [...appealQueryKeys.all, 'detail'],
  detail: (id) => [...appealQueryKeys.details(), id],
  byTeam: (teamId) => ['Appeals', 'byTeam', teamId],
  byPhase: (phaseId) => ['Appeals', 'byPhase', phaseId],
};

export const useAppeal = () => {
  const queryClient = useQueryClient();
  const { getMessage } = useMessage();

  /**
   * API: GET /api/Appeal/all
   * method: GET
   * path: /api/Appeal/all
   * request: none
   * response: 200 OK
   * example response:
   * {
   *   "success": true,
   *   "message": "Appeals retrieved successfully",
   *   "data": [
   *     {
   *       "appealId": 2,
   *       "appealType": "Score",
   *       "teamId": 8,
   *       "teamName": "Fpt",
   *       "adjustmentId": null,
   *       "penaltyType": null,
   *       "submissionId": 3,
   *       "judgeId": 4,
   *       "judgeName": "dovuongquang3002",
   *       "message": "string",
   *       "reason": "string",
   *       "status": "Approved",
   *       "adminResponse": "string",
   *       "reviewedById": 2,
   *       "reviewedByName": "quangtrung89000",
   *       "createdAt": "2025-11-29T23:41:20.6765737",
   *       "reviewedAt": "2025-11-30T00:17:49.2888989"
   *     }
   *   ]
   * }
   */
  const fetchAppeals = useQuery({
    queryKey: appealQueryKeys.lists(),
    queryFn: async () => {
      const response = await axiosClient.get('/Appeal/all');
      return response.data;
    },
  });

  /**
   * API: GET /api/Appeal/{id}/all
   * method: GET
   * path: /api/Appeal/{id}/all
   * request: path param id: integer
   * response: 200 OK -> Appeal object
   * example response:
   * {
   *   "success": true,
   *   "message": "Appeals retrieved successfully",
   *   "data": [
   *     {
   *       "appealId": 2,
   *       "appealType": "Score",
   *       "teamId": 8,
   *       "teamName": "Fpt",
   *       "adjustmentId": null,
   *       "penaltyType": null,
   *       "submissionId": 3,
   *       "judgeId": 4,
   *       "judgeName": "dovuongquang3002",
   *       "message": "string",
   *       "reason": "string",
   *       "status": "Approved",
   *       "adminResponse": "string",
   *       "reviewedById": 2,
   *       "reviewedByName": "quangtrung89000",
   *       "createdAt": "2025-11-29T23:41:20.6765737",
   *       "reviewedAt": "2025-11-30T00:17:49.2888989"
   *     }
   *   ]
   * }
   */
  const fetchAppealsByTeam = (teamId) =>
    useQuery({
      queryKey: appealQueryKeys.byTeam(teamId),
      queryFn: async () => {
        const response = await axiosClient.get(`/Appeal/team/${teamId}`);
        return response.data;
      },
      enabled: !!teamId,
    });

  /**
   * API: GET /api/Appeal/phase/{phaseId}
   * method: GET
   * path: /api/Appeal/phase/{phaseId}
   * request: path param phaseId: integer
   * response: 200 OK
   * example response:
   * {
   *   "success": true,
   *   "message": "Appeals retrieved successfully",
   *   "data": [
   *     {
   *       "appealId": 2,
   *       "appealType": "Score",
   *       "teamId": 8,
   *       "teamName": "Fpt",
   *       "adjustmentId": null,
   *       "penaltyType": null,
   *       "submissionId": 3,
   *       "judgeId": 4,
   *       "judgeName": "dovuongquang3002",
   *       "message": "string",
   *       "reason": "string",
   *       "status": "Approved",
   *       "adminResponse": "string",
   *       "reviewedById": 2,
   *       "reviewedByName": "quangtrung89000",
   *       "createdAt": "2025-11-29T23:41:20.6765737",
   *       "reviewedAt": "2025-11-30T00:17:49.2888989"
   *     }
   *   ]
   * }
   */
  const fetchAppealsByPhase = (phaseId) =>
    useQuery({
      queryKey: appealQueryKeys.byPhase(phaseId),
      queryFn: async () => {
        const response = await axiosClient.get(`/Appeal/phase/${phaseId}`);
        return response.data;
      },
      enabled: !!phaseId,
    });

  /**
   * API: GET /api/Appeal/{appealId}
   * method: GET
   * path: /api/Appeal/{appealId}
   * request: path param appealId: integer
   * response: 200 OK ->
   * {
   *   "appealId": 1,
   *   "appealType": "Penalty",
   *   "teamId": 8,
   *   "teamName": "Fpt",
   *   "adjustmentId": 1,
   *   "penaltyType": "Penalty",
   *   "submissionId": null,
   *   "judgeId": null,
   *   "judgeName": null,
   *   "message": "Cần đc check var",
   *   "reason": "Khiếu nại penalty",
   *   "status": "Approved",
   *   "adminResponse": "ok",
   *   "reviewedById": 2,
   *   "reviewedByName": "quangtrung89000",
   *   "createdAt": "2025-11-25T16:06:41.3308851",
   *   "reviewedAt": "2025-11-30T00:01:12.6764836"
   * }
   */
  const fetchAppeal = (id) =>
    useQuery({
      queryKey: appealQueryKeys.detail(id),
      queryFn: async () => {
        const response = await axiosClient.get(`/Appeal/${id}`);
        return response.data;
      },
      enabled: !!id,
    });

  /**
   * API: POST /api/Appeal
   * method: POST
   * path: /api/Appeal
   * request body: AppealRequest
   *   - appealCode: string | null
   *   - title: string | null
   *   - description: string
   *   - status: string (default: Pending)
   *   - teamId: integer (int32) required
   *   - phaseId: integer (int32) required
   * response: 200 OK -> created Appeal
   */
  // Create appeal
  const createAppeal = useMutation({
    mutationFn: (payload) => axiosClient.post('/Appeal', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appealQueryKeys.lists() });
      message.success('Tạo khiếu nại thành công!');
    },
    onError: (error) => {
      console.error('Error creating appeal:', error);
      message.error(getMessage(error));
    },
  });

  /**
   * API: PUT /api/Appeal/{id}/review
   * method: PUT
   * path: /api/Appeal/{id}/review
   * request body: AppealUpdateDto
   *   - status: string (Pending, Approved, Rejected)
   *   - adminResponse: String "ok",
   * response: 200 OK -> updated Appeal
   */
  // Update appeal
  const updateAppeal = useMutation({
    mutationFn: ({ id, payload }) =>
      axiosClient.put(`/Appeal/${id}/review`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appealQueryKeys.all });
      message.success('Cập nhật khiếu nại thành công!');
    },
    onError: (error) => {
      console.error('Error updating appeal:', error);
      message.error(getMessage(error));
    },
  });

  return {
    fetchAppeals,
    fetchAppealsByTeam,
    fetchAppealsByPhase,
    fetchAppeal,
    createAppeal,
    updateAppeal,
  };
};