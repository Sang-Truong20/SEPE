import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";
import useMessage from "../../util/getError";

/**
 * API endpoints for HackathonPhase
 * OpenAPI components: HackathonPhaseCreateDto, HackathonPhaseUpdateDto
 * HackathonPhaseCreateDto fields:
 *   - hackathonId: integer
 *   - phaseName: string | null
 *   - startDate: string (date-time)
 *   - endDate: string (date-time)
 * HackathonPhaseUpdateDto fields:
 *   - phaseName: string | null
 *   - startDate: string (date-time)
 *   - endDate: string (date-time)
 */
export const hackathonPhaseQueryKeys = {
    all: ['HackathonPhases'],
    lists: () => [...hackathonPhaseQueryKeys.all, 'list'],
    list: (hackathonId) => [...hackathonPhaseQueryKeys.lists(), hackathonId],
    details: () => [...hackathonPhaseQueryKeys.all, 'detail'],
    detail: (id) => [...hackathonPhaseQueryKeys.details(), id],
};

export const useHackathonPhases = () => {
    const queryClient = useQueryClient();
    const { getMessage } = useMessage();

    // Fetch phases by hackathon ID
    /**
     * API: GET /api/HackathonPhase/{hackathonId}
     * method: GET
     * path: /api/HackathonPhase/{hackathonId}
     * request: path param hackathonId: integer
     * response: 200 OK -> array of phases
     */
    const fetchHackathonPhases = (hackathonId) => useQuery({
        queryKey: hackathonPhaseQueryKeys.list(hackathonId),
        queryFn: async () => {
            const response = await axiosClient.get(`/HackathonPhase/${hackathonId}`);
            return response.data;
        },
        enabled: !!hackathonId,
    });

    /**
     * API: GET /api/HackathonPhase/phase/{id}
     * method: GET
     * path: /api/HackathonPhase/phase/{id}
     * request: path param id: integer
     * response: 200 OK -> single phase object
     */
    // Fetch single phase
    const fetchHackathonPhase = (id) => useQuery({
        queryKey: hackathonPhaseQueryKeys.detail(id),
        queryFn: async () => {
            const response = await axiosClient.get(`/HackathonPhase/phase/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

    /**
     * API: POST /api/HackathonPhase
     * method: POST
     * path: /api/HackathonPhase
     * request body: array of HackathonPhaseCreateDto (OpenAPI component)
     * [{
     *   - hackathonId: integer
     *   - phaseName: string | null
     *   - startDate: string (date-time)
     *   - endDate: string (date-time)
     * }]
     * response: 200 OK -> created phases
     */
    // Create phase
    const createHackathonPhase = useMutation({
        mutationFn: (payload) => axiosClient.post('/HackathonPhase/', payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: hackathonPhaseQueryKeys.list(variables.hackathonId)
            });
            message.success('Tạo giai đoạn hackathon thành công!');
        },
        onError: (error) => {
            console.error('Error creating hackathon phase:', error);
            message.error(getMessage(error));
        },
    });

    /**
     * API: PUT /api/HackathonPhase/{id}
     * method: PUT
     * path: /api/HackathonPhase/{id}
     * request body: HackathonPhaseUpdateDto
     *   - phaseName: string | null
     *   - startDate: string (date-time)
     *   - endDate: string (date-time)
     * response: 200 OK -> updated phase
     */
    // Update phase
    const updateHackathonPhase = useMutation({
        mutationFn: ({ id, payload }) => axiosClient.put(`/HackathonPhase/${id}`, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: hackathonPhaseQueryKeys.all });
            message.success('Cập nhật giai đoạn hackathon thành công!');
        },
        onError: (error) => {
            console.error('Error updating hackathon phase:', error);
            message.error(getMessage(error));
        },
    });

    /**
     * API: DELETE /api/HackathonPhase/{id}
     * method: DELETE
     * path: /api/HackathonPhase/{id}
     * request: path param id: integer
     * response: 200 OK
     */
    // Delete phase
    const deleteHackathonPhase = useMutation({
        mutationFn: (id) => axiosClient.delete(`/HackathonPhase/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: hackathonPhaseQueryKeys.all });
            message.success('Xóa giai đoạn hackathon thành công!');
        },
        onError: (error) => {
            console.error('Error deleting hackathon phase:', error);
            message.error(getMessage(error));
        },
    });

    return {
        fetchHackathonPhases,
        fetchHackathonPhase,
        createHackathonPhase,
        updateHackathonPhase,
        deleteHackathonPhase,
    };
};
