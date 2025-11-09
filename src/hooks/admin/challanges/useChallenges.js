import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";

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

    // Fetch single challenge
    const fetchChallenge = (id) => useQuery({
        queryKey: challengeQueryKeys.detail(id),
        queryFn: async () => {
            const response = await axiosClient.get(`/Challenge/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

    // Update challenge (full PUT)
    const updateChallenge = useMutation({
        mutationFn: ({ id, payload }) => axiosClient.put(`/Challenge/${id}/partner`, payload),
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
        updateChallenge,
        updateChallengeStatus,
        deleteChallenge,
    };
};