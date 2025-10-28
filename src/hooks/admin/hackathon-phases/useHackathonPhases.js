import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";

export const hackathonPhaseQueryKeys = {
    all: ['HackathonPhases'],
    lists: () => [...hackathonPhaseQueryKeys.all, 'list'],
    list: (hackathonId) => [...hackathonPhaseQueryKeys.lists(), hackathonId],
    details: () => [...hackathonPhaseQueryKeys.all, 'detail'],
    detail: (id) => [...hackathonPhaseQueryKeys.details(), id],
};

export const useHackathonPhases = () => {
    const queryClient = useQueryClient();

    // Fetch phases by hackathon ID
    const fetchHackathonPhases = (hackathonId) => useQuery({
        queryKey: hackathonPhaseQueryKeys.list(hackathonId),
        queryFn: async () => {
            const response = await axiosClient.get(`/HackathonPhase/${hackathonId}`);
            return response.data;
        },
        enabled: !!hackathonId,
    });

    // Fetch single phase
    const fetchHackathonPhase = (id) => useQuery({
        queryKey: hackathonPhaseQueryKeys.detail(id),
        queryFn: async () => {
            const response = await axiosClient.get(`/HackathonPhase/phase/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

    // Create phase
    const createHackathonPhase = useMutation({
        mutationFn: (payload) => axiosClient.post('/HackathonPhase/', payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: hackathonPhaseQueryKeys.list(variables.hackathonId)
            });
            message.success('Hackathon phase created successfully!');
        },
        onError: (error) => {
            console.error('Error creating hackathon phase:', error);
            message.error('Failed to create hackathon phase. Please try again.');
        },
    });

    // Update phase
    const updateHackathonPhase = useMutation({
        mutationFn: ({ id, payload }) => axiosClient.put(`/HackathonPhase/${id}`, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: hackathonPhaseQueryKeys.all });
            message.success('Hackathon phase updated successfully!');
        },
        onError: (error) => {
            console.error('Error updating hackathon phase:', error);
            message.error('Failed to update hackathon phase. Please try again.');
        },
    });

    // Delete phase
    const deleteHackathonPhase = useMutation({
        mutationFn: (id) => axiosClient.delete(`/HackathonPhase/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: hackathonPhaseQueryKeys.all });
            message.success('Hackathon phase deleted successfully!');
        },
        onError: (error) => {
            console.error('Error deleting hackathon phase:', error);
            message.error('Failed to delete hackathon phase. Please try again.');
        },
    });

    return {
        fetchHackathonPhases,
        fetchHackathonPhase,
        createHackathonPhase,
        updateHackathonPhase,
        deleteHackathonPhase,
    };
};
