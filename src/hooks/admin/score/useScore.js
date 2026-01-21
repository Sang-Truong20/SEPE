import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";
import useMessage from "../../util/getError";

// -------------------------------------------------------------------
// Query Keys cho Score
// -------------------------------------------------------------------
export const scoreQueryKeys = {
  all: ["Scores"],
  lists: () => [...scoreQueryKeys.all, "list"],
  list: (filters) => [...scoreQueryKeys.lists(), { ...filters }], // filters như { groupId, phaseId }
  details: () => [...scoreQueryKeys.all, "detail"],
  detail: (id) => [...scoreQueryKeys.details(), id],
};

// -------------------------------------------------------------------
// Hook chính
// -------------------------------------------------------------------
export const useScores = () => {
  const queryClient = useQueryClient();
  const { getMessage } = useMessage();

  // 1. Lấy team scores theo groupId
  /**
   * API: GET /api/Score/group/{groupId}/team-scores
   * method: GET
   * path: /api/Score/group/{groupId}/team-scores
   * request: path param groupId: integer
   * response: 200 OK -> array of team score summaries (OpenAPI doesn't provide exact response schema)
   * describe: Fetch aggregated team scores for a group
   * example: GET /api/Score/group/10/team-scores
   */
  const fetchTeamScoresByGroup = (groupId) =>
    useQuery({
      queryKey: scoreQueryKeys.list({ groupId }),
      queryFn: async () => {
        const response = await axiosClient.get(`/Score/group/${groupId}/team-scores`);
        return response.data; // Array of team score objects
      },
      enabled: !!groupId,
    });

  // 2. Lấy my scores grouped theo phaseId (dựa trên schema bạn cung cấp)
  /**
   * API: GET /api/Score/myscores/grouped/{phaseId}
   * method: GET
   * path: /api/Score/myscores/grouped/{phaseId}
   * request: path param phaseId: integer
   * response: 200 OK -> grouped scores for the requesting judge
   * describe: Fetch scores grouped for the current user by phase
   * example: GET /api/Score/myscores/grouped/5
   */
  const fetchMyScoresGrouped = (phaseId) =>
    useQuery({
      queryKey: scoreQueryKeys.list({ phaseId }),
      queryFn: async () => {
        const response = await axiosClient.get(`/Score/myscores/grouped/${phaseId}`);
        return response.data; // Array: [{ submissionId, submissionName, totalScore, scores: [{ scoreId, criteriaName, scoreValue, comment, scoredAt }] }]
      },
      enabled: !!phaseId,
    });

  // 3. Tạo score mới cho submission (POST)
  /**
   * API: POST /api/Score/submit
   * method: POST
   * path: /api/Score/submit
   * request body:
   *   - submissionId: integer
   *   - criteriaScores: array of criteria score objects
   *       - criterionId: integer
   *       - score: number (double)
   *       - comment: string | null
   * response: 200 OK
   * describe: Submit or create scores for a submission
   * example payload:
   * {
   *   "submissionId": 10,
   *   "criteriaScores": [ { "criterionId": 1, "score": 8.5, "comment": "Good" } ]
   * }
   */
  const createScore = useMutation({
    mutationFn: (payload) => axiosClient.post("/Score/submit", payload),
    onSuccess: () => {
      // Invalidate lists liên quan đến submission hoặc phase/group (giả sử dựa trên submissionId)
      // Có thể cần thêm logic lấy phaseId/groupId từ context nếu biết
      queryClient.invalidateQueries({ queryKey: scoreQueryKeys.all });
      message.success("Tạo điểm thành công!");
    },
    onError: (error) => {
      console.error("Error creating score:", error);
      message.error(getMessage(error));
    },
  });

  /**
   * API: POST /api/Score/re-score
   * method: POST
   * path: /api/Score/re-score
   * request body:
   *   - submissionId: integer
   *   - criteriaScores: array of criteria score objects
   *       - criterionId: integer
   *       - score: number (double)
   *       - comment: string | null
   * response: 200 OK
   * describe: Submit or create scores for a submission
   * example payload:
   * {
   *   "submissionId": 10,
   *   "criteriaScores": [ { "criterionId": 1, "score": 8.5, "comment": "Good" } ]
   * }
   */
  const reScore = useMutation({
    mutationFn: ({ appealId, payload }) =>
      axiosClient.post(`/Score/re-score/${appealId}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scoreQueryKeys.all });
      message.success("Chấm lại điểm thành công!");
    },
    onError: (error) => {
      console.error("Error re-scoring:", error);
      message.error(getMessage(error));
    },
  });

  // 4. Cập nhật score cho submission (POST - dùng cùng API với create)
  /**
   * API: PUT /api/Score/score/{scoreId}
   * method: PUT
   * path: /api/Score/score/{scoreId}
   * request body: Same shape as create
   *   - submissionId: integer
   *   - criteriaScores: array of criteria score objects
   *       - criterionId: integer
   *       - score: number (double)
   *       - comment: string | null
   * response: 200 OK
   * describe: Update existing scores for a submission (dùng POST giống create)
   */
  // 5. Cập nhật batch scores cho submission (PUT - dùng để update toàn bộ scores)
  /**
   * API: PUT /api/Score/submit
   * method: PUT
   * path: /api/Score/submit
   * request body:
   *   - submissionId: integer
   *   - criteriaScores: array of criteria score objects
   *       - criterionId: integer
   *       - score: number (double)
   *       - comment: string | null
   * response: 200 OK
   * describe: Update batch scores for a submission
   * example payload:
   * {
   *   "submissionId": 10,
   *   "criteriaScores": [ { "criterionId": 1, "score": 8.5, "comment": "Good" } ]
   * }
   */
  const updateScoreBatch = useMutation({
    mutationFn: (payload) => axiosClient.put("/Score/submit", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scoreQueryKeys.all });
      message.success("Cập nhật điểm thành công!");
    },
    onError: (error) => {
      console.error("Error updating score batch:", error);
      message.error(getMessage(error));
    },
  });

  const updateScoreById = useMutation({
    mutationFn: ({ scoreId, scoreValue, comment }) =>
      axiosClient.put(`/Score/scores/${scoreId}`, { scoreValue, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scoreQueryKeys.all });
      message.success("Cập nhật điểm thành công!");
    },
    onError: (error) => {
      console.error("Error updating score:", error);
      message.error(getMessage(error));
    },
  });

  return {
    // Queries
    fetchTeamScoresByGroup,
    fetchMyScoresGrouped,

    // Mutations
    createScore,        // Tạo mới hoặc overwrite toàn bộ scores cho submission
    updateScoreBatch,   // Cập nhật batch scores cho submission (PUT)
    reScore,            // Chấm lại theo appeal (dùng appealId)
    updateScoreById,    // Edit chi tiết một criterion score theo scoreId
  };
};
