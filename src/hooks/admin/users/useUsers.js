import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";

/**
 * API: Auth user endpoints
 * OpenAPI components:
 *  - UpdateUserDto: { fullName?: string }
 */
export const userQueryKeys = {
    all: ['Users'],
    lists: () => [...userQueryKeys.all, 'list'],
    list: (filters) => [...userQueryKeys.lists(), filters],
};

export const useUsers = () => {
    const queryClient = useQueryClient();

    // Fetch all users
    /**
     * API: GET /api/Auth/users
     * method: GET
     * path: /api/Auth/users
     * request: none
     * response: 200 OK -> array of user objects (OpenAPI lists users)
     */
    const fetchUsers = useQuery({
        queryKey: userQueryKeys.lists(),
        queryFn: async () => {
            const response = await axiosClient.get('/Auth/users');
            return response.data;
        },
    });

    /**
     * API: PUT /api/Auth/update-info/{id}
     * method: PUT
     * path: /api/Auth/update-info/{id}
     * request body: UpdateUserDto
     *   - fullName: string | null
     * response: 200 OK -> updated user
     */
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

    /**
     * API: PUT /api/Auth/users/{id}/block
     * method: PUT
     * path: /api/Auth/users/{id}/block
     * request: path param id: integer, query param isBlocked: boolean
     * response: 200 OK
     * describe: Block or unblock a user
     */
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
