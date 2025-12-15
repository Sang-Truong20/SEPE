import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";
import useMessage from "../../util/getError";

/**
 * API: GET /api/Appeal
 * method: GET
 * path: /api/Appeal
 * request: none
 * response: 200 OK -> array of Appeal objects (inferred)
 * AppealRequest/AppealUpdateDto fields (OpenAPI components, inferred based on standard patterns):
 *   - appealCode: string | null
 *   - title: string | null
 *   - description: string (date-time)
 *   - status: string (enum: Pending, Approved, Rejected)
 *   - teamId: integer (int32)
 *   - phaseId: integer (int32)
 * describe: Manage appeals (list, detail, create, update, delete)
 */
export const appealQueryKeys = {
  all: ['Appeals'],
  lists: () => [...appealQueryKeys.all, 'list'],
  list: (filters) => [...appealQueryKeys.lists(), filters],
  details: () => [...appealQueryKeys.all, 'detail'],
  detail: (id) => [...appealQueryKeys.details(), id],
};

export const useAppeal = () => {
  const queryClient = useQueryClient();
  const { getMessage } = useMessage();

  // Fetch all appeals
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
   * [
   *     {
   *     "appealId": 1,
   *     "appealType": "Penalty",
   *     "teamId": 8,
   *     "teamName": "Fpt",
   *     "adjustmentId": 1,
   *     "submissionId": null,
   *     "judgeName": null,
   *     "message": "Cần đc check var",
   *     "reason": "Khiếu nại penalty",
   *     "status": "Approved",
   *     "adminResponse": "ok",
   *     "reviewedById": 2,
   *     "reviewedByName": "quangtrung89000",
   *     "createdAt": "2025-11-25T16:06:41.3308851",
   *     "reviewedAt": "2025-11-30T00:01:12.6764836"
   *   },
   * ]
   */
  // Fetch single appeal
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

  /**
   * API: DELETE /api/Appeal/{id}
   * method: DELETE
   * path: /api/Appeal/{id}
   * request: path param id: integer
   * response: 200 OK
   */
  // Delete appeal
  const deleteAppeal = useMutation({
    mutationFn: (id) => axiosClient.delete(`/Appeal/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appealQueryKeys.lists() });
      message.success('Xóa khiếu nại thành công!');
    },
    onError: (error) => {
      console.error('Error deleting appeal:', error);
      message.error(getMessage(error));
    },
  });

  return {
    fetchAppeals,
    fetchAppeal,
    createAppeal,
    updateAppeal,
    deleteAppeal,
  };
};
