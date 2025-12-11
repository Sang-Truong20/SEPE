import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import axiosClient from '../../../configs/axiosClient';
import useMessage from '../../util/getError';

/**
 * API: Track endpoints
 * OpenAPI components:
 *  - CreateTrackDto: { name?: string, description?: string, phaseId: integer }
 *  - UpdateTrackDto: { name?: string, description?: string, phaseId: integer }
 *  - RandomChallengeTrackRequest: { trackId: integer, challengeIds?: integer[], quantity: integer }
 */
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
  const { getMessage } = useMessage();

  // 1. Lấy danh sách tất cả tracks
  /**
   * API: GET /api/Track
   * method: GET
   * path: /api/Track
   * request: none
   * response: 200 OK -> array of Track objects
   */
  const fetchTracks = useQuery({
    queryKey: trackQueryKeys.list(),
    queryFn: async () => {
      const response = await axiosClient.get('/Track');
      return response.data;
    },
  });

  /**
   * API: GET /api/Track/{id}
   * method: GET
   * path: /api/Track/{id}
   * request: path param id: integer
   * response: 200 OK -> Track object
   */
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

  /**
   * API: POST /api/Track
   * method: POST
   * path: /api/Track
   * request body: CreateTrackDto
   *   - name: string | null
   *   - description: string | null
   *   - phaseId: integer
   * response: 200 OK -> created Track
   */
  // 3. Tạo track mới
  const createTrack = useMutation({
    mutationFn: (payload) => axiosClient.post('/Track', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trackQueryKeys.lists() });
      message.success('Tạo phần thi thành công!');
    },
    onError: (error) => {
      console.error('Error creating track:', error);
      message.error(getMessage(error));
    },
  });

  /**
   * API: PUT /api/Track/{id}
   * method: PUT
   * path: /api/Track/{id}
   * request body: UpdateTrackDto
   *   - name: string | null
   *   - description: string | null
   *   - phaseId: integer
   * response: 200 OK -> updated Track
   */
  // 4. Cập nhật track
  const updateTrack = useMutation({
    mutationFn: ({ id, payload }) => axiosClient.put(`/Track/${id}`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: trackQueryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: trackQueryKeys.lists() });
      message.success('Cập nhật phần thi thành công!');
    },
    onError: (error) => {
      console.error('Error updating track:', error);
      message.error(getMessage(error));
    },
  });

  /**
   * API: DELETE /api/Track/{id}
   * method: DELETE
   * path: /api/Track/{id}
   * request: path param id: integer
   * response: 200 OK
   */
  // 5. Xóa track
  const deleteTrack = useMutation({
    mutationFn: (id) => axiosClient.delete(`/Track/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trackQueryKeys.lists() });
      message.success('Xóa phần thi thành công!');
    },
    onError: (error) => {
      console.error('Error deleting track:', error);
      message.error(getMessage(error));
    },
  });

  /**
   * API: POST /api/Track/assign-random-challenge
   * method: POST
   * path: /api/Track/assign-random-challenge
   * request body: RandomChallengeTrackRequest
   *   - trackId: integer
   *   - challengeIds?: integer[]
   *   - quantity: integer
   * response: 200 OK
   */
  // 6. Gán challenge ngẫu nhiên cho track
  const assignRandomChallenge = useMutation({
    mutationFn: (payload) =>
      axiosClient.post('/Track/assign-random-challenge', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trackQueryKeys.lists() });
      message.success('Gán thử thách ngẫu nhiên thành công!');
    },
    onError: (error) => {
      console.error('Error assigning random challenges:', error);
      message.error(getMessage(error));
    },
  });

  /**
   * API: POST /api/TeamTrack/select
   * method: POST
   * path: /api/TeamTrack/select
   * request body: TeamSelectTrackRequest
   *   - teamId: integer
   *   - trackId: integer
   * response: 200 OK
   */
  // 7. Team chọn track (TeamTrack/select)
  const selectTrackForTeam = useMutation({
    mutationFn: (payload) => axiosClient.post('/TeamTrack/select', payload),
    onSuccess: () => {
      // Có thể cần invalidate thêm key của team hoặc challenge nếu có
      message.success('Đội đã chọn phần thi thành công!');
    },
    onError: (error) => {
      console.error('Error selecting track for team:', error);
      message.error(getMessage(error));
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
