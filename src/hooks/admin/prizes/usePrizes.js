import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";

/**
 * API: GET /api/Prize/hackathon/{hackathonId}
 * method: GET
 * path: /api/Prize/hackathon/{hackathonId}
 * request: path param hackathonId: integer (required)
 * response: 200 OK -> list of Prize objects
 *   - Prize properties (inferred from CreatePrizeDTO):
 *       - prizeId?: integer
 *       - prizeName: string | null
 *       - prizeType: string | null
 *       - rank: integer | null
 *       - reward: string | null
 *       - hackathonId: integer
 * describe: Get prizes for a hackathon
 * example: GET /api/Prize/hackathon/5
 */
export const prizeQueryKeys = {
    all: ['Prizes'],
    lists: () => [...prizeQueryKeys.all, 'list'],
    list: (hackathonId) => [...prizeQueryKeys.lists(), hackathonId],
    details: () => [...prizeQueryKeys.all, 'detail'],
    detail: (id) => [...prizeQueryKeys.details(), id],
};

export const usePrizes = () => {
    const queryClient = useQueryClient();

    // Fetch prizes by hackathon ID
    const fetchPrizes = (hackathonId) => useQuery({
        queryKey: prizeQueryKeys.list(hackathonId),
        queryFn: async () => {
            const response = await axiosClient.get(`/Prize/hackathon/${hackathonId}`);
            return response.data;
        },
        enabled: !!hackathonId,
    });

    /**
     * API: POST /api/Prize
     * method: POST
     * path: /api/Prize
     * request body: CreatePrizeDTO (OpenAPI component)
     *   - prizeName: string | null
     *   - prizeType: string | null
     *   - rank: integer | null
     *   - reward: string | null
     *   - hackathonId: integer
     * response: 200 OK -> created Prize
     * example payload:
     * {
     *   "prizeName": "First Prize",
     *   "prizeType": "cash",
     *   "rank": 1,
     *   "reward": "1000$",
     *   "hackathonId": 3
     * }
     */
    // Create prize
    const createPrize = useMutation({
        mutationFn: (payload) => axiosClient.post('/Prize', payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: prizeQueryKeys.list(variables.hackathonId)
            });
            message.success('Prize created successfully!');
        },
        onError: (error) => {
            console.error('Error creating prize:', error);
            message.error('Failed to create prize. Please try again.');
        },
    });

    /**
     * API: PUT /api/Prize
     * method: PUT
     * path: /api/Prize
     * request body: UpdatePrizeDTO (OpenAPI component)
     *   - prizeId: integer
     *   - prizeName: string | null
     *   - prizeType: string | null
     *   - rank: integer | null
     *   - reward: string | null
     * response: 200 OK -> updated Prize
     */
    // Update prize
    const updatePrize = useMutation({
        mutationFn: (payload) => axiosClient.put('/Prize', payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: prizeQueryKeys.all });
            message.success('Prize updated successfully!');
        },
        onError: (error) => {
            console.error('Error updating prize:', error);
            message.error('Failed to update prize. Please try again.');
        },
    });

    /**
     * API: DELETE /api/Prize/{prizeId}
     * method: DELETE
     * path: /api/Prize/{prizeId}
     * request: path param prizeId: integer
     * response: 200 OK
     * describe: Delete a prize by id
     */
    // Delete prize
    const deletePrize = useMutation({
        mutationFn: (id) => axiosClient.delete(`/Prize/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: prizeQueryKeys.all });
            message.success('Prize deleted successfully!');
        },
        onError: (error) => {
            console.error('Error deleting prize:', error);
            message.error('Failed to delete prize. Please try again.');
        },
    });

    return {
        fetchPrizes,
        createPrize,
        updatePrize,
        deletePrize,
    };
};
