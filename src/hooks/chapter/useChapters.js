import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import axiosClient from '../../configs/axiosClient';
import useMessage from '../util/getError';

export const chapterQueryKeys = {
  origin: ['chapter', 'management'],
  lists: () => [...chapterQueryKeys.origin, 'list'],
  details: () => [...chapterQueryKeys.origin, 'detail'],
  detail: (id) => [...chapterQueryKeys.details(), id],
};

export const useChapters = () => {
  const queryClient = useQueryClient();
  const { getMessage } = useMessage();

  /**
   * API: GET /api/Chapter
   * method: GET
   * path: /api/Chapter
   * request: none
   * response: 200 OK -> array of Chapter objects
   */
  const fetchChapters = useQuery({
    queryKey: chapterQueryKeys.lists(),
    queryFn: async () => {
      const response = await axiosClient.get('/Chapter');
      return response.data;
    },
  });

  /**
   * API: GET /api/Chapter/{id}
   * method: GET
   * path: /api/Chapter/{id}
   * request: path param id: integer
   * response: 200 OK -> Chapter object
   */
  const fetchChapter = (id) =>
    useQuery({
      queryKey: chapterQueryKeys.detail(id),
      queryFn: async () => {
        const response = await axiosClient.get(`/Chapter/${id}`);
        return response.data;
      },
      enabled: !!id,
    });

  /**
   * API: POST /api/Chapter
   * method: POST
   * path: /api/Chapter
   * request body: { chapterName: string, description: string }
   * response: 200 OK -> created Chapter
   */
  const createChapter = useMutation({
    mutationFn: (payload) => axiosClient.post('/Chapter', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chapterQueryKeys.lists() });
      message.success('Tạo chapter thành công!');
    },
    onError: (error) => {
      console.error('Error creating chapter:', error);
      message.error(getMessage(error));
    },
  });

  /**
   * API: PUT /api/Chapter/{id}
   * method: PUT
   * path: /api/Chapter/{id}
   * request body: { chapterName: string, description: string }
   * response: 200 OK -> updated Chapter
   */
  const updateChapter = useMutation({
    mutationFn: ({ id, ...payload }) => axiosClient.put(`/Chapter/${id}`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: chapterQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: chapterQueryKeys.detail(variables.id) });
      message.success('Cập nhật chapter thành công!');
    },
    onError: (error) => {
      console.error('Error updating chapter:', error);
      message.error(getMessage(error));
    },
  });

  /**
   * API: DELETE /api/Chapter/{id}
   * method: DELETE
   * path: /api/Chapter/{id}
   * request: path param id: integer
   * response: 200 OK
   */
  const deleteChapter = useMutation({
    mutationFn: (id) => axiosClient.delete(`/Chapter/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chapterQueryKeys.lists() });
      message.success('Xóa chapter thành công!');
    },
    onError: (error) => {
      console.error('Error deleting chapter:', error);
      message.error(getMessage(error));
    },
  });

  return {
    fetchChapters,
    fetchChapter,
    createChapter,
    updateChapter,
    deleteChapter,
  };
};

