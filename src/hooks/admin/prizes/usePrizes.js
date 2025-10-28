import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";

export const prizeQueryKeys = {
    all: ['Prizes'],
    lists: () => [...prizeQueryKeys.all, 'list'],
    list: (hackathonId) => [...prizeQueryKeys.lists(), hackathonId],
    details: () => [...prizeQueryKeys.all, 'detail'],
    detail: (id) => [...prizeQueryKeys.details(), id],
};

export const usePrizes = () => {
    const queryClient = useQueryClient();

    // Fetch prizes by hackathon ID
    const fetchPrizes = (hackathonId) => useQuery({
        queryKey: prizeQueryKeys.list(hackathonId),
        queryFn: async () => {
            const response = await axiosClient.get(`/Prize/hackathon/${hackathonId}`);
            return response.data;
        },
        enabled: !!hackathonId,
    });

    // Create prize
    const createPrize = useMutation({
        mutationFn: (payload) => axiosClient.post('/Prize', payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: prizeQueryKeys.list(variables.hackathonId)
            });
            message.success('Prize created successfully!');
        },
        onError: (error) => {
            console.error('Error creating prize:', error);
            message.error('Failed to create prize. Please try again.');
        },
    });

    // Update prize
    const updatePrize = useMutation({
        mutationFn: (payload) => axiosClient.put('/Prize', payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: prizeQueryKeys.all });
            message.success('Prize updated successfully!');
        },
        onError: (error) => {
            console.error('Error updating prize:', error);
            message.error('Failed to update prize. Please try again.');
        },
    });

    // Delete prize
    const deletePrize = useMutation({
        mutationFn: (id) => axiosClient.delete(`/Prize/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: prizeQueryKeys.all });
            message.success('Prize deleted successfully!');
        },
        onError: (error) => {
            console.error('Error deleting prize:', error);
            message.error('Failed to delete prize. Please try again.');
        },
    });

    return {
        fetchPrizes,
        createPrize,
        updatePrize,
        deletePrize,
    };
};
