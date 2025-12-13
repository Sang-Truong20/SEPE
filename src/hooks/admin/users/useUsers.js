import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";
import useMessage from "../../util/getError";

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
  const { getMessage } = useMessage();

  // Fetch all users
  /**
   * API: GET /api/Auth/users
   * method: GET
   * path: /api/Auth/users
   * request: none
   * response: 200 OK -> array of user objects (OpenAPI lists users)
   *
   * Response body
   * [
   *   {
   *     "userId": 1,
   *     "fullName": "0583301",
   *     "email": "0583301@gmail.com",
   *     "roleName": "Mentor",
   *     "isVerified": true,
   *     "isBlocked": false,
   *     "createdAt": "2025-11-08T16:12:22.5646724"
   *   },
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
    mutationFn: ({ id, payload }) =>
      axiosClient.put(`/Auth/update-info/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
      message.success('Cập nhật người dùng thành công!');
    },
    onError: (error) => {
      console.error('Error updating user:', error);
      message.error(getMessage(error));
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
      message.success(
        variables.isBlocked
          ? 'Khóa tài khoản thành công!'
          : 'Mở khóa tài khoản thành công!',
      );
    },
    onError: (error) => {
      console.error('Error toggling user block status:', error);
      message.error(getMessage(error));
    },
  });

  /**
   * API: GET /api/Roles
   * method: GET
   * path: /api/Roles
   * request: none
   * response: 200 OK -> array of role objects
   * [
   *   {
   *     "roleId": 1,
   *     "roleName": "Member",
   *     "users": []
   *   },
   *   ...
   * ]
   */
  const fetchRoles = useQuery({
    queryKey: ['Roles'],
    queryFn: async () => {
      const response = await axiosClient.get('/Roles');
      return response.data;
    },
  });

  /**
   * API: PUT /api/Auth/admin/change-role/{id}
   * method: PUT
   * path: /api/Auth/admin/change-role/{id}
   * request body: { roleId: integer }
   * response: 200 OK
   * describe: Change user role
   */
  const changeUserRole = useMutation({
    mutationFn: ({ id, roleId }) =>
      axiosClient.put(`/Auth/admin/change-role/${id}`, { roleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
      message.success('Cập nhật vai trò thành công!');
    },
    onError: (error) => {
      console.error('Error changing user role:', error);
      message.error(getMessage(error));
    },
  });

  return {
    fetchUsers,
    updateUser,
    toggleBlockUser,
    fetchRoles,
    changeUserRole,
  };
};
