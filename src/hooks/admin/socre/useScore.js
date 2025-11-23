import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";

// -------------------------------------------------------------------
// Query Keys cho Score
// -------------------------------------------------------------------
export const scoreQueryKeys = {
  all: ["Scores"],
  lists: () => [...scoreQueryKeys.all, "list"],
  list: (filters) => [...scoreQueryKeys.lists(), filters ?? "all"], // Có thể mở rộng filter sau (ví dụ: groupId hoặc phaseId)
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
        return response.data;
      },
      enabled: !!groupId,
    });

  // 2. Lấy my scores grouped theo phaseId
  const fetchMyScoresGrouped = (phaseId) =>
    useQuery({
      queryKey: scoreQueryKeys.list({ phaseId }),
      queryFn: async () => {
        const response = await axiosClient.get(`/Score/myscores/grouped/${phaseId}`);
        return response.data;
      },
      enabled: !!phaseId,
    });

  // 3. Tạo score mới cho submission (POST)
  const createScore = useMutation({
    mutationFn: (payload) => axiosClient.post("/Score/score", payload),
    onSuccess: (_, variables) => {
      // Invalidate dựa trên submissionId hoặc liên quan (nếu biết group/phase, thêm invalidate cụ thể)
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
      // Invalidate dựa trên submissionId hoặc liên quan
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