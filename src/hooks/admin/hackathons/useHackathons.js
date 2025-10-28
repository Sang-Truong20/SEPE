import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";

export const hackathonQueryKeys = {
  all: ['Hackathons'],
  lists: () => [...hackathonQueryKeys.all, 'list'],
  list: (filters) => [...hackathonQueryKeys.lists(), filters],
  details: () => [...hackathonQueryKeys.all, 'detail'],
  detail: (id) => [...hackathonQueryKeys.details(), id],
};

export const useHackathons = () => {
  const queryClient = useQueryClient();

  // Fetch all hackathons
  const fetchHackathons = useQuery({
    queryKey: hackathonQueryKeys.lists(),
    queryFn: async () => {
      const response = await axiosClient.get('/Hackathons');
      return response.data;
    },
  });

  // Fetch single hackathon
  const fetchHackathon = (id) => useQuery({
    queryKey: hackathonQueryKeys.detail(id),
    queryFn: async () => {
      const response = await axiosClient.get(`/Hackathons/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  // Create hackathon
  const createHackathon = useMutation({
    mutationFn: (payload) => axiosClient.post('/Hackathons', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hackathonQueryKeys.lists() });
      message.success('Hackathon created successfully!');
    },
    onError: (error) => {
      console.error('Error creating hackathon:', error);
      message.error('Failed to create hackathon. Please try again.');
    },
  });

  // Update hackathon
  const updateHackathon = useMutation({
    mutationFn: ({ id, payload }) => axiosClient.put(`/Hackathons/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hackathonQueryKeys.all });
      message.success('Hackathon updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating hackathon:', error);
      message.error('Failed to update hackathon. Please try again.');
    },
  });

  // Delete hackathon
  const deleteHackathon = useMutation({
    mutationFn: (id) => axiosClient.delete(`/Hackathons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hackathonQueryKeys.lists() });
      message.success('Hackathon deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting hackathon:', error);
      message.error('Failed to delete hackathon. Please try again.');
    },
  });

  return {
    fetchHackathons,
    fetchHackathon,
    createHackathon,
    updateHackathon,
    deleteHackathon,
  };
};
