import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";

export const teamQueryKeys = {
    all: ['Teams'],
    lists: () => [...teamQueryKeys.all, 'list'],
    list: (filters) => [...teamQueryKeys.lists(), filters],
    details: () => [...teamQueryKeys.all, 'detail'],
    detail: (id) => [...teamQueryKeys.details(), id],
};

export const useTeams = () => {
    const queryClient = useQueryClient();

    // Fetch all teams - GET /api/Team
    const fetchTeams = useQuery({
        queryKey: teamQueryKeys.lists(),
        queryFn: async () => {
            const response = await axiosClient.get('/Team');
            return response.data;
        },
    });

    // Fetch single team by id - GET /api/Team/{id}
    const fetchTeam = (id) => useQuery({
        queryKey: teamQueryKeys.detail(id),
        queryFn: async () => {
            const response = await axiosClient.get(`/Team/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

    // Create new team - POST /api/Team
    const createTeam = useMutation({
        mutationFn: (payload) => axiosClient.post('/Team', payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: teamQueryKeys.all });
            queryClient.invalidateQueries({ queryKey: teamQueryKeys.lists() });
            message.success('Team created successfully!');
        },
        onError: (error) => {
            console.error('Error creating team:', error);
            message.error('Failed to create team. Please try again.');
        },
    });

    // Update team (full PUT) - PUT /api/Team/{id}
    // Payload: { teamName, chapterId } (leaderId không được update theo API)
    const updateTeam = useMutation({
        mutationFn: ({ id, payload }) => axiosClient.put(`/Team/${id}`, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: teamQueryKeys.all });
            queryClient.invalidateQueries({ queryKey: teamQueryKeys.lists() });
            message.success('Team updated successfully!');
        },
        onError: (error) => {
            console.error('Error updating team:', error);
            message.error('Failed to update team. Please try again.');
        },
    });

    // Delete team - DELETE /api/Team/{id}
    const deleteTeam = useMutation({
        mutationFn: (id) => axiosClient.delete(`/Team/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: teamQueryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: teamQueryKeys.all });
            message.success('Team deleted successfully!');
        },
        onError: (error) => {
            console.error('Error deleting team:', error);
            message.error('Failed to delete team. Please try again.');
        },
    });

    return {
        fetchTeams,
        fetchTeam,
        createTeam,
        updateTeam,
        deleteTeam,
    };
};