import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";
import useMessage from "../../util/getError";

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
    const { getMessage } = useMessage();

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
        onSuccess: async (_, variables) => {
            if (variables.hackathonId) {
                // Invalidate and refetch
                await queryClient.invalidateQueries({
                    queryKey: prizeQueryKeys.list(variables.hackathonId),
                });
                // Also refetch directly to ensure it updates
                await queryClient.refetchQueries({
                    queryKey: prizeQueryKeys.list(variables.hackathonId),
                });
            } else {
                await queryClient.invalidateQueries({
                    queryKey: prizeQueryKeys.all,
                });
            }
            message.success('Tạo giải thưởng thành công!');
        },
        onError: (error) => {
            console.error('Error creating prize:', error);
            message.error(getMessage(error));
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
        onSuccess: async (_, variables) => {
            // Invalidate specific list query if hackathonId is provided, otherwise invalidate all
            if (variables.hackathonId) {
                await queryClient.invalidateQueries({
                    queryKey: prizeQueryKeys.list(variables.hackathonId),
                });
                // Also refetch directly to ensure it updates
                await queryClient.refetchQueries({
                    queryKey: prizeQueryKeys.list(variables.hackathonId),
                });
            } else {
                await queryClient.invalidateQueries({
                    queryKey: prizeQueryKeys.all,
                });
            }
            message.success('Cập nhật giải thưởng thành công!');
        },
        onError: (error) => {
            console.error('Error updating prize:', error);
            message.error(getMessage(error));
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
        mutationFn: ({ prizeId }) => axiosClient.delete(`/Prize/${prizeId}`),
        onSuccess: async (_, variables) => {
            // Invalidate specific list query if hackathonId is provided, otherwise invalidate all
            if (variables.hackathonId) {
                await queryClient.invalidateQueries({
                    queryKey: prizeQueryKeys.list(variables.hackathonId),
                });
                // Also refetch directly to ensure it updates
                await queryClient.refetchQueries({
                    queryKey: prizeQueryKeys.list(variables.hackathonId),
                });
            } else {
                await queryClient.invalidateQueries({
                    queryKey: prizeQueryKeys.all,
                });
            }
            message.success('Xóa giải thưởng thành công!');
        },
        onError: (error) => {
            console.error('Error deleting prize:', error);
            message.error(getMessage(error));
        },
    });

    return {
        fetchPrizes,
        createPrize,
        updatePrize,
        deletePrize,
    };
};
