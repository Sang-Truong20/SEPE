import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import axiosClient from '../../../configs/axiosClient';
import useMessage from '../../util/getError';

/**
 * API: GET /api/Criterion
 * method: GET
 * path: /api/Criterion
 * request: (optional) query params
 *   - phaseId: integer (query) - filter criteria by phase id
 * response: 200 OK
 *   - OpenAPI: endpoint references request DTOs but does not declare a named response schema for Criterion list.
 *   - Inferred response shape (common): { data: Criterion[] }
 *     Where Criterion inferred properties (not explicitly listed in OpenAPI as a "Criterion" schema):
 *       - id: integer
 *       - phaseId: integer
 *       - trackId: integer | null
 *       - name: string | null
 *       - weight: number | null
 * describe: Fetch list of criteria, optionally filtered by phaseId
 * example: GET /api/Criterion?phaseId=1
 */
// -------------------------------------------------------------------
// Query Keys cho Criterion
// -------------------------------------------------------------------
export const criterionQueryKeys = {
  all: ['Criteria'],
  lists: () => [...criterionQueryKeys.all, 'list'],
  list: (phaseId) => [...criterionQueryKeys.lists(), phaseId ?? 'all'], // Dựa vào phaseId
  details: () => [...criterionQueryKeys.all, 'detail'],
  detail: (id) => [...criterionQueryKeys.details(), id],
};

// -------------------------------------------------------------------
// Hook chính
// -------------------------------------------------------------------
export const useCriteria = () => {
  const queryClient = useQueryClient();
  const { getMessage } = useMessage();

  // 1. Lấy danh sách criteria theo phaseId
  /**
   * API: GET /api/Criterion
   * method: GET
   * path: /api/Criterion
   * request: query param
   *   - phaseId: integer (optional)
   * response: 200 OK
   *   - OpenAPI: no explicit response schema; returns an array of Criterion objects.
   *   - Inferred Criterion properties (types & nullability):
   *       - id: integer
   *       - phaseId: integer
   *       - trackId: integer | null
   *       - name: string | null
   *       - weight: number | null
   * describe: Fetch list of criteria for a phase
   * example request: GET /api/Criterion?phaseId=2
   * example response:
   * {
   *   "data": [
   *     { "id": 123, "phaseId": 2, "trackId": null, "name": "Technical", "weight": 3 }
   *   ]
   * }
   */
  const fetchCriteria = (phaseId) =>
    useQuery({
      queryKey: criterionQueryKeys.list(phaseId),
      queryFn: async () => {
        const response = await axiosClient.get('/Criterion', {
          params: { phaseId },
        });
        return response.data;
      },
      enabled: !!phaseId,
    });

  // 2. Lấy chi tiết một criterion theo id
  /**
   * API: GET /api/Criterion/{id}
   * method: GET
   * path: /api/Criterion/{id}
   * request: path param
   *   - id: integer (required)
   * response: 200 OK
   *   - OpenAPI: no named response schema; expected single Criterion object
   *   - Example Criterion (inferred):
   *       {
   *         "id": 123,
   *         "phaseId": 2,
   *         "trackId": null,
   *         "name": "Technical",
   *         "weight": 3
   *       }
   * describe: Get criterion detail by id
   * example: GET /api/Criterion/123
   */
  const fetchCriterionById = (id) =>
    useQuery({
      queryKey: criterionQueryKeys.detail(id),
      queryFn: async () => {
        const response = await axiosClient.get(`/Criterion/${id}`);
        return response.data;
      },
      enabled: !!id,
    });

  // 3. Tạo criterion mới (có thể với multiple criteria items)
  /**
   * API: POST /api/Criterion
   * method: POST
   * path: /api/Criterion
   * request body: CriterionCreateDto (OpenAPI component)
   *   - phaseId: integer
   *   - trackId: integer | null (optional)
   *   - criteria: array of CriterionItemDto
   *       - CriterionItemDto (OpenAPI component):
   *           - name: string | null
   *           - weight: number (double)
   * response: 200 OK
   *   - OpenAPI: request DTO defined, but endpoint response schema is not explicitly declared.
   *   - Inferred response: created Criterion or array of created Criterion objects.
   * example request payload:
   * {
   *   "phaseId": 1,
   *   "criteria": [
   *     { "name": "Technical", "weight": 3 },
   *     { "name": "Presentation", "weight": 2 }
   *   ]
   * }
   */
  const createCriterion = useMutation({
    mutationFn: (payload) => axiosClient.post('/Criterion', payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: criterionQueryKeys.list(variables.phaseId),
      });
      message.success('Tạo tiêu chí thành công!');
    },
    onError: (error) => {
      console.error('Error creating criterion:', error);
      message.error(getMessage(error));
    },
  });

  // 4. Cập nhật criterion
  /**
   * API: PUT /api/Criterion/{id}
   * method: PUT
   * path: /api/Criterion/{id}
   * request body: CriterionUpdateDto (OpenAPI component)
   *   - trackId: integer | null (optional)
   *   - name: string | null (optional)
   *   - weight: number (optional)
   * response: 200 OK
   *   - OpenAPI: no explicit response schema declared; expected updated Criterion object.
   * example request payload:
   * {
   *   "name": "Updated name",
   *   "weight": 4
   * }
   */
  const updateCriterion = useMutation({
    mutationFn: ({ id, payload }) =>
      axiosClient.put(`/Criterion/${id}`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: criterionQueryKeys.detail(variables.id),
      });
      // Invalidate list nếu biết phaseId, nhưng giả sử invalidate all lists
      queryClient.invalidateQueries({ queryKey: criterionQueryKeys.lists() });
      message.success('Cập nhật tiêu chí thành công!');
    },
    onError: (error) => {
      console.error('Error updating criterion:', error);
      message.error(getMessage(error));
    },
  });

  // 5. Xóa criterion
  /**
   * API: DELETE /api/Criterion/{id}
   * method: DELETE
   * path: /api/Criterion/{id}
   * request: path param id (integer)
   * response: 200 OK
   * describe: Delete a criterion by id
   * example: DELETE /api/Criterion/123
   */
  const deleteCriterion = useMutation({
    mutationFn: (id) => axiosClient.delete(`/Criterion/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: criterionQueryKeys.lists() });
      message.success('Xóa tiêu chí thành công!');
    },
    onError: (error) => {
      console.error('Error deleting criterion:', error);
      message.error(getMessage(error));
    },
  });

  return {
    // Queries
    fetchCriteria,
    fetchCriterionById,

    // Mutations
    createCriterion,
    updateCriterion,
    deleteCriterion,
  };
};
