import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";

export const userQueryKeys = {
    all: ['Users'],
    lists: () => [...userQueryKeys.all, 'list'],
    list: (filters) => [...userQueryKeys.lists(), filters],
};

export const useUsers = () => {
    const queryClient = useQueryClient();

    // Fetch all users
    const fetchUsers = useQuery({
        queryKey: userQueryKeys.lists(),
        queryFn: async () => {
            const response = await axiosClient.get('/Auth/users');
            return response.data;
        },
    });

    // Update user info
    const updateUser = useMutation({
        mutationFn: ({ id, payload }) => axiosClient.put(`/Auth/update-info/${id}`, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
            message.success('User updated successfully!');
        },
        onError: (error) => {
            console.error('Error updating user:', error);
            message.error('Failed to update user. Please try again.');
        },
    });

    // Block/Unblock user
    const toggleBlockUser = useMutation({
        mutationFn: ({ id, isBlocked }) =>
            axiosClient.put(`/Auth/users/${id}/block?isBlocked=${isBlocked}`),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
            message.success(variables.isBlocked ? 'User blocked successfully!' : 'User unblocked successfully!');
        },
        onError: (error) => {
            console.error('Error toggling user block status:', error);
            message.error('Failed to update user status. Please try again.');
        },
    });

    return {
        fetchUsers,
        updateUser,
        toggleBlockUser,
    };
};
