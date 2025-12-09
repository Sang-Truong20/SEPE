import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";

/**
 * API: GET /api/Hackathons
 * method: GET
 * path: /api/Hackathons
 * request: none
 * response: 200 OK
 *   - OpenAPI: response not explicitly typed; inferred array of Hackathon objects
 *   - Hackathon (inferred properties from HackathonCreateDto):
 *       - id: integer
 *       - name: string | null
 *       - seasonId: integer
 *       - description: string | null
 *       - startDate: string (date) | null
 *       - endDate: string (date) | null
 *       - status: string | null
 * describe: Fetch list of hackathons
 * example: GET /api/Hackathons -> { data: [ { id:1, name: 'X', seasonId: 2 } ] }
 */
export const hackathonQueryKeys = {
  all: ['Hackathons'],
  lists: () => [...hackathonQueryKeys.all, 'list'],
  list: (filters) => [...hackathonQueryKeys.lists(), filters],
  details: () => [...hackathonQueryKeys.all, 'detail'],
  detail: (id) => [...hackathonQueryKeys.details(), id],
};

export const useHackathons = () => {
  const queryClient = useQueryClient();

  // Fetch all hackathons
  const fetchHackathons = useQuery({
    queryKey: hackathonQueryKeys.lists(),
    queryFn: async () => {
      const response = await axiosClient.get('/Hackathons');
      return response.data;
    },
  });

  /**
   * API: GET /api/Hackathons/{id}
   * method: GET
   * path: /api/Hackathons/{id}
   * request: path param
   *   - id: integer (required)
   * response: 200 OK
   *   - returns a Hackathon object (inferred)
   * describe: Fetch a single hackathon by id
   * example: GET /api/Hackathons/123 -> { data: { id:123, name:'...' } }
   */
  // Fetch single hackathon
  const fetchHackathon = (id) => useQuery({
    queryKey: hackathonQueryKeys.detail(id),
    queryFn: async () => {
      const response = await axiosClient.get(`/Hackathons/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  /**
   * API: POST /api/Hackathons
   * method: POST
   * path: /api/Hackathons
   * request body: HackathonCreateDto (OpenAPI component)
   *   - name: string | null
   *   - seasonId: integer
   *   - description: string | null
   *   - startDate: string (date) | null
   *   - endDate: string (date) | null
   *   - status: string | null
   * response: 200 OK
   *   - OpenAPI: response schema not explicit; returns created Hackathon object
   * example request payload:
   * {
   *   "name": "Hackathon 2025",
   *   "seasonId": 1,
   *   "startDate": "2025-01-01",
   *   "endDate": "2025-01-05"
   * }
   */
  // Create hackathon
  const createHackathon = useMutation({
    mutationFn: (payload) => axiosClient.post('/Hackathons', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hackathonQueryKeys.lists() });
      message.success('Hackathon created successfully!');
    },
    onError: (error) => {
      console.error('Error creating hackathon:', error);
      message.error('Failed to create hackathon. Please try again.');
    },
  });

  /**
   * API: PUT /api/Hackathons/{id}
   * method: PUT
   * path: /api/Hackathons/{id}
   * request body: HackathonCreateDto (same shape used for update)
   * response: 200 OK
   *   - returns updated Hackathon object (inferred)
   * example request payload: { name, seasonId, description, startDate, endDate, status }
   */
  // Update hackathon
  const updateHackathon = useMutation({
    mutationFn: ({ id, payload }) => axiosClient.put(`/Hackathons/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hackathonQueryKeys.all });
      message.success('Hackathon updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating hackathon:', error);
      message.error('Failed to update hackathon. Please try again.');
    },
  });

  /**
   * API: DELETE /api/Hackathons/{id}
   * method: DELETE
   * path: /api/Hackathons/{id}
   * request: path param id (integer)
   * response: 200 OK
   * describe: Delete a hackathon by id
   * example: DELETE /api/Hackathons/123
   */
  // Delete hackathon
  const deleteHackathon = useMutation({
    mutationFn: (id) => axiosClient.delete(`/Hackathons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hackathonQueryKeys.lists() });
      message.success('Hackathon deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting hackathon:', error);
      message.error('Failed to delete hackathon. Please try again.');
    },
  });

  return {
    fetchHackathons,
    fetchHackathon,
    createHackathon,
    updateHackathon,
    deleteHackathon,
  };
};
