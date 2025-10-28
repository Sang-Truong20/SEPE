import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";

export const seasonQueryKeys = {
    all: ['Seasons'],
    lists: () => [...seasonQueryKeys.all, 'list'],
    list: (filters) => [...seasonQueryKeys.lists(), filters],
    details: () => [...seasonQueryKeys.all, 'detail'],
    detail: (id) => [...seasonQueryKeys.details(), id],
};

export const useSeasons = () => {
    const queryClient = useQueryClient();

    // Fetch all seasons
    const fetchSeasons = useQuery({
        queryKey: seasonQueryKeys.lists(),
        queryFn: async () => {
            const response = await axiosClient.get('/Season');
            return response.data;
        },
    });

    // Fetch single season
    const fetchSeason = (id) => useQuery({
        queryKey: seasonQueryKeys.detail(id),
        queryFn: async () => {
            const response = await axiosClient.get(`/Season/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

    // Create season
    const createSeason = useMutation({
        mutationFn: (payload) => axiosClient.post('/Season', payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: seasonQueryKeys.lists() });
            message.success('Season created successfully!');
        },
        onError: (error) => {
            console.error('Error creating season:', error);
            message.error('Failed to create season. Please try again.');
        },
    });

    // Update season
    const updateSeason = useMutation({
        mutationFn: ({ id, payload }) => axiosClient.put(`/Season/${id}`, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: seasonQueryKeys.all });
            message.success('Season updated successfully!');
        },
        onError: (error) => {
            console.error('Error updating season:', error);
            message.error('Failed to update season. Please try again.');
        },
    });

    // Delete season
    const deleteSeason = useMutation({
        mutationFn: (id) => axiosClient.delete(`/Season/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: seasonQueryKeys.lists() });
            message.success('Season deleted successfully!');
        },
        onError: (error) => {
            console.error('Error deleting season:', error);
            message.error('Failed to delete season. Please try again.');
        },
    });

    return {
        fetchSeasons,
        fetchSeason,
        createSeason,
        updateSeason,
        deleteSeason,
    };
};
