import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import axiosClient from '../../../configs/axiosClient';

// -------------------------------------------------------------------
// Query Keys cho Track
// -------------------------------------------------------------------
export const trackQueryKeys = {
  all: ['Tracks'],
  lists: () => [...trackQueryKeys.all, 'list'],
  list: (filters) => [...trackQueryKeys.lists(), filters ?? 'all'], // có thể mở rộng filter sau
  details: () => [...trackQueryKeys.all, 'detail'],
  detail: (id) => [...trackQueryKeys.details(), id],
};

// -------------------------------------------------------------------
// Hook chính
// -------------------------------------------------------------------
export const useTracks = () => {
  const queryClient = useQueryClient();

  // 1. Lấy danh sách tất cả tracks
  const fetchTracks = useQuery({
    queryKey: trackQueryKeys.list(),
    queryFn: async () => {
      const response = await axiosClient.get('/Track');
      return response.data;
    },
  });

  // 2. Lấy chi tiết một track theo id
  const fetchTrackById = (id) =>
    useQuery({
      queryKey: trackQueryKeys.detail(id),
      queryFn: async () => {
        const response = await axiosClient.get(`/Track/${id}`);
        return response.data;
      },
      enabled: !!id,
    });

  // 3. Tạo track mới
  const createTrack = useMutation({
    mutationFn: (payload) => axiosClient.post('/Track', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trackQueryKeys.lists() });
      message.success('Track created successfully!');
    },
    onError: (error) => {
      console.error('Error creating track:', error);
      message.error('Failed to create track. Please try again.');
    },
  });

  // 4. Cập nhật track
  const updateTrack = useMutation({
    mutationFn: ({ id, payload }) => axiosClient.put(`/Track/${id}`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: trackQueryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: trackQueryKeys.lists() });
      message.success('Track updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating track:', error);
      message.error('Failed to update track. Please try again.');
    },
  });

  // 5. Xóa track
  const deleteTrack = useMutation({
    mutationFn: (id) => axiosClient.delete(`/Track/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trackQueryKeys.lists() });
      message.success('Track deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting track:', error);
      message.error('Failed to delete track. Please try again.');
    },
  });

  // 6. Gán challenge ngẫu nhiên cho track
  const assignRandomChallenge = useMutation({
    mutationFn: (payload) =>
      axiosClient.post('/Track/assign-random-challenge', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trackQueryKeys.lists() });
    },
    onError: (error) => {
      console.error('Error assigning random challenges:', error);
    },
  });

  // 7. Team chọn track (TeamTrack/select)
  const selectTrackForTeam = useMutation({
    mutationFn: (payload) => axiosClient.post('/TeamTrack/select', payload),
    onSuccess: () => {
      // Có thể cần invalidate thêm key của team hoặc challenge nếu có
      message.success('Team has selected the track successfully!');
    },
    onError: (error) => {
      console.error('Error selecting track for team:', error);
      message.error('Failed to select track. Please try again.');
    },
  });

  return {
    // Queries
    fetchTracks,
    fetchTrackById,

    // Mutations
    createTrack,
    updateTrack,
    deleteTrack,
    assignRandomChallenge,
    selectTrackForTeam,
  };
};
