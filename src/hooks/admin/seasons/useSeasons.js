import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";

/**
 * API: GET /api/Season
 * method: GET
 * path: /api/Season
 * request: none
 * response: 200 OK -> array of Season objects (inferred)
 * SeasonRequest/SeasonUpdateDto fields (OpenAPI components):
 *   - seasonCode: string | null
 *   - name: string | null
 *   - startDate: string (date-time)
 *   - endDate: string (date-time)
 * describe: Manage seasons (list, detail, create, update, delete)
 */
export const seasonQueryKeys = {
    all: ['Seasons'],
    lists: () => [...seasonQueryKeys.all, 'list'],
    list: (filters) => [...seasonQueryKeys.lists(), filters],
    details: () => [...seasonQueryKeys.all, 'detail'],
    detail: (id) => [...seasonQueryKeys.details(), id],
};

export const useSeasons = () => {
    const queryClient = useQueryClient();

    // Fetch all seasons
    const fetchSeasons = useQuery({
        queryKey: seasonQueryKeys.lists(),
        queryFn: async () => {
            const response = await axiosClient.get('/Season');
            return response.data;
        },
    });

    /**
     * API: GET /api/Season/{id}
     * method: GET
     * path: /api/Season/{id}
     * request: path param id: integer
     * response: 200 OK -> Season object
     */
    // Fetch single season
    const fetchSeason = (id) => useQuery({
        queryKey: seasonQueryKeys.detail(id),
        queryFn: async () => {
            const response = await axiosClient.get(`/Season/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

    /**
     * API: POST /api/Season
     * method: POST
     * path: /api/Season
     * request body: SeasonRequest
     *   - seasonCode: string | null
     *   - name: string | null
     *   - startDate: string (date-time)
     *   - endDate: string (date-time)
     * response: 200 OK -> created Season
     */
    // Create season
    const createSeason = useMutation({
        mutationFn: (payload) => axiosClient.post('/Season', payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: seasonQueryKeys.lists() });
            message.success('Season created successfully!');
        },
        onError: (error) => {
            console.error('Error creating season:', error);
            message.error('Failed to create season. Please try again.');
        },
    });

    /**
     * API: PUT /api/Season/{id}
     * method: PUT
     * path: /api/Season/{id}
     * request body: SeasonUpdateDto
     *   - seasonCode: string | null
     *   - name: string | null
     *   - startDate: string (date-time)
     *   - endDate: string (date-time)
     * response: 200 OK -> updated Season
     */
    // Update season
    const updateSeason = useMutation({
        mutationFn: ({ id, payload }) => axiosClient.put(`/Season/${id}`, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: seasonQueryKeys.all });
            message.success('Season updated successfully!');
        },
        onError: (error) => {
            console.error('Error updating season:', error);
            message.error('Failed to update season. Please try again.');
        },
    });

    /**
     * API: DELETE /api/Season/{id}
     * method: DELETE
     * path: /api/Season/{id}
     * request: path param id: integer
     * response: 200 OK
     */
    // Delete season
    const deleteSeason = useMutation({
        mutationFn: (id) => axiosClient.delete(`/Season/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: seasonQueryKeys.lists() });
            message.success('Season deleted successfully!');
        },
        onError: (error) => {
            console.error('Error deleting season:', error);
            message.error('Failed to delete season. Please try again.');
        },
    });

    return {
        fetchSeasons,
        fetchSeason,
        createSeason,
        updateSeason,
        deleteSeason,
    };
};
