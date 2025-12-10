import { useQuery, useMutation, useQueryClient, useQueries } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";
import useMessage from "../../util/getError";

/**
 * API Documentation:
 * 2.10 - api chia các team cùng 1 track vào các nhóm
 * POST /api/Group/auto-create
 * request body: { "teamsPerGroup": 0 }
 * 
 * 3.4 Group ( View )
 * GET /api/Group/Group/{hackathonId}
 * response: array of group objects
 * [
 *   {
 *     "groupId": 1,
 *     "groupName": "A",
 *     "trackId": 3,
 *     "teamIds": [
 *       8
 *     ],
 *     "createdAt": "2025-11-12T08:06:28.7992909"
 *   }
 * ]
 * 
 * 3.5 GroupTeams
 * GET /api/Group/{groupId}/teams
 * response: array of group team objects
 * [
 *   {
 *     "groupTeamId": 1,
 *     "groupId": 1,
 *     "teamId": 8,
 *     "averageScore": 8.5,
 *     "rank": 1,
 *     "joinedAt": "2025-11-12T08:06:29.2417146",
 *     "teamName": "Fpt"
 *   }
 * ]
 */

export const groupQueryKeys = {
    all: ['Groups'],
    lists: () => [...groupQueryKeys.all, 'list'],
    listByHackathon: (hackathonId) => [...groupQueryKeys.lists(), hackathonId],
    details: () => [...groupQueryKeys.all, 'detail'],
    detail: (id) => [...groupQueryKeys.details(), id],
    teamsByGroup: (groupId) => [...groupQueryKeys.details(), 'teams', groupId],
};

export const useGroups = () => {
    const queryClient = useQueryClient();
    const { getMessage } = useMessage();

    /**
     * API: GET /api/Group/Group/{hackathonId}
     * Fetch all groups for a specific hackathon
     */
    const fetchGroupsByHackathon = (hackathonId) => useQuery({
        queryKey: groupQueryKeys.listByHackathon(hackathonId),
        queryFn: async () => {
            const response = await axiosClient.get(`/Group/Group/${hackathonId}`);
            return response.data;
        },
        enabled: !!hackathonId,
    });

    /**
     * API: GET /api/Group/{groupId}/teams
     * Fetch teams in a specific group with details
     */
    const fetchGroupTeams = (groupId) => useQuery({
        queryKey: groupQueryKeys.teamsByGroup(groupId),
        queryFn: async () => {
            const response = await axiosClient.get(`/Group/${groupId}/teams`);
            return response.data;
        },
        enabled: !!groupId,
    });

    /**
     * API: POST /api/Group/auto-create
     * Auto-create groups for teams in a hackathon
     * request body: { teamsPerGroup: number }
     */
    const autoCreateGroups = useMutation({
        mutationFn: (payload) => axiosClient.post('/Group/auto-create', payload),
        onSuccess: (data) => {
            // Invalidate groups list if hackathonId is available
            queryClient.invalidateQueries({ queryKey: groupQueryKeys.lists() });
            message.success('Tạo bảng đấu thành công!');
            return data;
        },
        onError: (error) => {
            console.error('Error creating groups:', error);
            message.error(getMessage(error));
        },
    });

  const fetchMultipleGroupTeams = (groupIds) => {
    return useQueries({
      queries: groupIds.map(groupId => ({
        queryKey: groupQueryKeys.teamsByGroup(groupId),
        queryFn: async () => {
          const response = await axiosClient.get(`/Group/${groupId}/teams`);
          return response.data;
        },
        enabled: !!groupId && groupIds.length > 0,
        staleTime: 1000 * 60, // tùy chỉnh nếu cần
      })),
    });
  };

    return {
        fetchGroupsByHackathon,
        fetchGroupTeams,
        autoCreateGroups,
        fetchMultipleGroupTeams,
    };
};
