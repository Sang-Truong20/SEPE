import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";
import useMessage from "../../util/getError";

/**
 * API Group: JudgeAssignment
 * describe: Manage judge assignments to hackathons (admin assign, list by hackathon, block/reactivate assignment)
 * JudgeAssignmentCreateDto fields:
 *   - judgeId: integer (int32) required
 *   - hackathonId: integer (int32) required
 *   - phaseId: integer (int32, nullable)
 *   - trackId: integer (int32, nullable)
 */
export const judgeAssignmentQueryKeys = {
  all: ['JudgeAssignments'],
  lists: () => [...judgeAssignmentQueryKeys.all, 'list'],
  byHackathon: (hackathonId) => [...judgeAssignmentQueryKeys.lists(), 'hackathon', hackathonId],
  myAssignments: () => [...judgeAssignmentQueryKeys.lists(), 'my-assignments'],
};

export const useJudgeAssignment = () => {
  const queryClient = useQueryClient();
  const { getMessage } = useMessage();

  /**
   * API: GET /api/JudgeAssignment/Hackathon-my-assignments
   * method: GET
   * path: /api/JudgeAssignment/Hackathon-my-assignments
   * request: No parameters
   * response: 200 OK -> array of hackathon assignments for current judge
   *
   * Response body
   * [
   *   {
   *     "hackathonId": 1,
   *     "hackathonName": "AI Agent",
   *     "status": "Active",
   *     "phaseName": "Vong Ban Ket",
   *     "assignedAt": "2025-11-11T09:27:35.9484064"
   *   }
   * ]
   */
  const fetchMyHackathonAssignments = () =>
    useQuery({
      queryKey: judgeAssignmentQueryKeys.myAssignments(),
      queryFn: async () => {
        const response = await axiosClient.get(
          `/JudgeAssignment/Hackathon-my-assignments`,
        );
        return response.data;
      },
    });

  /**
   * API: GET /api/JudgeAssignment/hackathon/{hackathonId}
   * method: GET
   * path: /api/JudgeAssignment/hackathon/{hackathonId}
   * request: path param hackathonId: integer
   * response: 200 OK -> array of judge assignment objects (inferred)
   *
   * Response body
   * [
   *   {
   *     "assignmentId": 2,
   *     "judgeId": 4, // để navigate /admin/users/4
   *     "judgeName": "dovuongquang3002",
   *     "hackathonId": 1,
   *     "hackathonName": null,
   *     "trackId": 3, // để naviage /admin/tracks/{id}
   *     "trackName": "Track 1",
   *     "assignedAt": "2025-11-11T09:27:35.9484064",
   *     "status": "Active"
   *   },
   *  ]
   */
  const fetchJudgeAssignmentsByHackathon = (hackathonId) =>
    useQuery({
      queryKey: judgeAssignmentQueryKeys.byHackathon(hackathonId),
      queryFn: async () => {
        const response = await axiosClient.get(
          `/JudgeAssignment/hackathon/${hackathonId}`,
        );
        return response.data;
      },
      enabled: !!hackathonId,
    });

  /**
   * API: POST /api/JudgeAssignment/Adminassignjugde
   * method: POST
   * path: /api/JudgeAssignment/Adminassignjugde  (note: spelling "assignjugde" as in Swagger)
   * request body: JudgeAssignmentCreateDto
   *   - judgeId: integer (int32) required
   *   - hackathonId: integer (int32) required
   *   - phaseId: integer (int32, nullable)
   *   - trackId: integer (int32, nullable)
   * response: 200 OK -> created assignment (inferred)
   */
  const createJudgeAssignment = useMutation({
    mutationFn: (payload) =>
      axiosClient.post('/JudgeAssignment/Adminassignjugde', payload),
    onSuccess: (_, variables) => {
      // Invalidate và refetch danh sách theo hackathonId
      queryClient.invalidateQueries({
        queryKey: judgeAssignmentQueryKeys.byHackathon(variables.hackathonId)
      });
      message.success('Phân công giám khảo thành công!');
    },
    onError: (error) => {
      console.error('Error assigning judge:', error);
      message.error(getMessage(error));
    },
  });

  /**
   * API: PUT /api/JudgeAssignment/block/{assignmentId}
   * method: PUT
   * path: /api/JudgeAssignment/block/{assignmentId}
   * request: path param assignmentId: integer
   * response: 200 OK
   */
  const blockJudgeAssignment = useMutation({
    mutationFn: (assignmentId) =>
      axiosClient.put(`/JudgeAssignment/block/${assignmentId}`),
    onSuccess: () => {
      // Invalidate tất cả queries để refetch
      queryClient.invalidateQueries({ queryKey: judgeAssignmentQueryKeys.all });
      message.success('Đã khóa phân công giám khảo!');
    },
    onError: (error) => {
      console.error('Error blocking judge assignment:', error);
      message.error(getMessage(error));
    },
  });

  /**
   * API: PUT /api/JudgeAssignment/reactivate/{assignmentId}
   * method: PUT
   * path: /api/JudgeAssignment/reactivate/{assignmentId}
   * request: path param assignmentId: integer
   * response: 200 OK
   */
  const reactivateJudgeAssignment = useMutation({
    mutationFn: (assignmentId) =>
      axiosClient.put(`/JudgeAssignment/reactivate/${assignmentId}`),
    onSuccess: () => {
      // Invalidate tất cả queries để refetch
      queryClient.invalidateQueries({ queryKey: judgeAssignmentQueryKeys.all });
      message.success('Khôi phục phân công giám khảo thành công!');
    },
    onError: (error) => {
      console.error('Error reactivating judge assignment:', error);
      message.error(getMessage(error));
    },
  });

  return {
    fetchMyHackathonAssignments,
    fetchJudgeAssignmentsByHackathon,
    createJudgeAssignment,
    blockJudgeAssignment,
    reactivateJudgeAssignment,
  };
};
