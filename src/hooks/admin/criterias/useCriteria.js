import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import axiosClient from '../../../configs/axiosClient';

// -------------------------------------------------------------------
// Query Keys cho Criterion
// -------------------------------------------------------------------
export const criterionQueryKeys = {
  all: ['Criteria'],
  lists: () => [...criterionQueryKeys.all, 'list'],
  list: (phaseId) => [...criterionQueryKeys.lists(), phaseId ?? 'all'], // Dựa vào phaseId
  details: () => [...criterionQueryKeys.all, 'detail'],
  detail: (id) => [...criterionQueryKeys.details(), id],
};

// -------------------------------------------------------------------
// Hook chính
// -------------------------------------------------------------------
export const useCriteria = () => {
  const queryClient = useQueryClient();

  // 1. Lấy danh sách criteria theo phaseId
  const fetchCriteria = (phaseId) =>
    useQuery({
      queryKey: criterionQueryKeys.list(phaseId),
      queryFn: async () => {
        const response = await axiosClient.get('/Criterion', {
          params: { phaseId },
        });
        return response.data;
      },
      enabled: !!phaseId,
    });

  // 2. Lấy chi tiết một criterion theo id
  const fetchCriterionById = (id) =>
    useQuery({
      queryKey: criterionQueryKeys.detail(id),
      queryFn: async () => {
        const response = await axiosClient.get(`/Criterion/${id}`);
        return response.data;
      },
      enabled: !!id,
    });

  // 3. Tạo criterion mới (có thể với multiple criteria items)
  const createCriterion = useMutation({
    mutationFn: (payload) => axiosClient.post('/Criterion', payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: criterionQueryKeys.list(variables.phaseId),
      });
      message.success('Criterion created successfully!');
    },
    onError: (error) => {
      console.error('Error creating criterion:', error);
      message.error('Failed to create criterion. Please try again.');
    },
  });

  // 4. Cập nhật criterion
  const updateCriterion = useMutation({
    mutationFn: ({ id, payload }) =>
      axiosClient.put(`/Criterion/${id}`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: criterionQueryKeys.detail(variables.id),
      });
      // Invalidate list nếu biết phaseId, nhưng giả sử invalidate all lists
      queryClient.invalidateQueries({ queryKey: criterionQueryKeys.lists() });
      message.success('Criterion updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating criterion:', error);
      message.error('Failed to update criterion. Please try again.');
    },
  });

  // 5. Xóa criterion
  const deleteCriterion = useMutation({
    mutationFn: (id) => axiosClient.delete(`/Criterion/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: criterionQueryKeys.lists() });
      message.success('Criterion deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting criterion:', error);
      message.error('Failed to delete criterion. Please try again.');
    },
  });

  return {
    // Queries
    fetchCriteria,
    fetchCriterionById,

    // Mutations
    createCriterion,
    updateCriterion,
    deleteCriterion,
  };
};
