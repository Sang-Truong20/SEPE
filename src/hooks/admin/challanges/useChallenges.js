import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";

/**
 * API: GET /api/Challenge
 * method: GET
 * path: /api/Challenge
 * request: none
 * response: { data: Challenge[] }
 * describe: Fetch list of challenges
 * example: GET /api/Challenge -> { data: [ { id: 1, title: '...' } ] }
 */
export const challengeQueryKeys = {
    all: ['Challenges'],
    lists: () => [...challengeQueryKeys.all, 'list'],
    list: (filters) => [...challengeQueryKeys.lists(), filters],
    details: () => [...challengeQueryKeys.all, 'detail'],
    detail: (id) => [...challengeQueryKeys.details(), id],
};

export const useChallenges = () => {
    const queryClient = useQueryClient();

    // Fetch all challenges
    const fetchChallenges = useQuery({
        queryKey: challengeQueryKeys.lists(),
        queryFn: async () => {
            const response = await axiosClient.get('/Challenge');
            return response.data;
        },
    });

    /**
     * API: POST /api/Challenge/create
     * method: POST
     * path: /api/Challenge/create
     * request: multipart/form-data { Title, Description, HackathonId, File }
     * response: { data: Challenge }
     * describe: Create a new challenge (multipart form with optional file)
     * example: formData -> Title='X', Description='Y', HackathonId=1, File=Blob
     */
    const createChallenge = useMutation({
        mutationFn: async (payload) => {
            const formData = new FormData();

            formData.append("Title", payload.title);
            formData.append("Description", payload.description);
            formData.append("HackathonId", Number(payload.hackathonId));
            if (payload.file) formData.append("File", payload.file);

            return axiosClient.post(`/Challenge/create`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: challengeQueryKeys.lists() });
            message.success("Challenge created!");
        },
    });

    // Fetch single challenge
    /**
     * API: GET /api/Challenge/{id}
     * method: GET
     * path: /api/Challenge/{id}
     * request: none (path param id)
     * response: { data: Challenge }
     * describe: Get single challenge by id
     * example: GET /api/Challenge/123 -> { data: { id: 123, title: '...' } }
     */
    const fetchChallenge = (id) => useQuery({
        queryKey: challengeQueryKeys.detail(id),
        queryFn: async () => {
            const response = await axiosClient.get(`/Challenge/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

  const fetchCompleteChallenge = (hackathonId) => useQuery({
    queryKey: challengeQueryKeys.detail(hackathonId),
    queryFn: async () => {
      const response = await axiosClient.get(`/Challenge/completed/${hackathonId}`);
      return response.data;
    },
    enabled: !!hackathonId,
  });

    // Update challenge (full PUT)
    /**
     * API: PUT /api/Challenge/{id}/partner
     * method: PUT
     * path: /api/Challenge/{id}/partner
     * request: multipart/form-data or JSON payload for update
     * response: { data: Challenge }
     * describe: Update challenge fields (partner-specific endpoint)
     * example: PUT /api/Challenge/123/partner
     */
    const updateChallenge = useMutation({
        mutationFn: ({ id, payload }) => {
            // If payload contains file or File field, send as FormData as Swagger expects multipart
            if (payload instanceof FormData) {
                // already FormData
                return axiosClient.put(`/Challenge/${id}/partner`, payload, { headers: { 'Content-Type': undefined } });
            }

            const hasFile = payload && (payload.File || payload.file);
            if (hasFile) {
                const fd = new FormData();
                fd.append('Title', payload.Title ?? payload.title ?? '');
                fd.append('Description', payload.Description ?? payload.description ?? '');
                if (payload.HackathonId || payload.hackathonId) fd.append('HackathonId', String(payload.HackathonId ?? payload.hackathonId));
                // append file
                const fileVal = payload.File ?? payload.file;
                if (fileVal) fd.append('File', fileVal instanceof File ? fileVal : fileVal[0]?.originFileObj ?? fileVal);

                return axiosClient.put(`/Challenge/${id}/partner`, fd, { headers: { 'Content-Type': undefined } });
            }

            // fallback: send JSON for simple updates without files
            return axiosClient.put(`/Challenge/${id}/partner`, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: challengeQueryKeys.all });
            message.success('Challenge updated successfully!');
        },
        onError: (error) => {
            console.error('Error updating challenge:', error);
            message.error('Failed to update challenge. Please try again.');
        },
    });

    // Update challenge status only (PATCH)
    /**
     * API: PATCH /api/Challenge/{id}/status
     * method: PATCH
     * path: /api/Challenge/{id}/status
     * request: { status: string }
     * response: 200 OK
     * describe: Update only the status of a challenge
     * example: PATCH /api/Challenge/123/status { status: 'active' }
     */
    const updateChallengeStatus = useMutation({
        mutationFn: ({ id, status }) =>
            axiosClient.patch(`/Challenge/${id}/status`, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: challengeQueryKeys.all });
            queryClient.invalidateQueries({ queryKey: challengeQueryKeys.lists() });
            message.success('Challenge status updated successfully!');
        },
        onError: (error) => {
            console.error('Error updating challenge status:', error);
            message.error('Failed to update status. Please try again.');
        },
    });

    // Delete challenge
    /**
     * API: DELETE /api/Challenge/{id}
     * method: DELETE
     * path: /api/Challenge/{id}
     * request: none (path param id)
     * response: 200 OK
     * describe: Delete challenge by id
     * example: DELETE /api/Challenge/123
     */
    const deleteChallenge = useMutation({
        mutationFn: (id) => axiosClient.delete(`/Challenge/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: challengeQueryKeys.lists() });
            message.success('Challenge deleted successfully!');
        },
        onError: (error) => {
            console.error('Error deleting challenge:', error);
            message.error('Failed to delete challenge. Please try again.');
        },
    });

    return {
        fetchChallenges,
        fetchChallenge,
        createChallenge,
        fetchCompleteChallenge,
        updateChallenge,
        updateChallengeStatus,
        deleteChallenge,
    };
};