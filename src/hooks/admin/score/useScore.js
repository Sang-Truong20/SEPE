import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";

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

  // 1. Lấy team scores theo groupId
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
  const createScore = useMutation({
    mutationFn: (payload) => axiosClient.post("/Score/score", payload),
    onSuccess: (_, variables) => {
      // Invalidate lists liên quan đến submission hoặc phase/group (giả sử dựa trên submissionId)
      const submissionId = variables.submissionId;
      // Có thể cần thêm logic lấy phaseId/groupId từ context nếu biết
      queryClient.invalidateQueries({ queryKey: scoreQueryKeys.all });
      message.success("Score created successfully!");
    },
    onError: (error) => {
      console.error("Error creating score:", error);
      message.error("Failed to create score. Please try again.");
    },
  });

  // 4. Cập nhật score cho submission (PUT)
  const updateScore = useMutation({
    mutationFn: (payload) => axiosClient.put("/Score/score", payload),
    onSuccess: (_, variables) => {
      const submissionId = variables.submissionId;
      queryClient.invalidateQueries({ queryKey: scoreQueryKeys.all });
      message.success("Score updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating score:", error);
      message.error("Failed to update score. Please try again.");
    },
  });

  return {
    // Queries
    fetchTeamScoresByGroup,
    fetchMyScoresGrouped,

    // Mutations
    createScore,
    updateScore,
  };
};