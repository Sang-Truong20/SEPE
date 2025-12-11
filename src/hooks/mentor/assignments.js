import { useQuery, useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import axiosClient from '../../configs/axiosClient';

export const mentorAssignmentQueryKeys = {
  origin: ['mentor', 'assignments'],
  list: (mentorId) => [...mentorAssignmentQueryKeys.origin, mentorId],
  detail: (assignmentId) => [...mentorAssignmentQueryKeys.origin, 'detail', assignmentId],
};

/**
 * GET /api/MentorAssignment/mentor/{mentorId}/assignments
 */
export const useGetMentorAssignments = (mentorId) => {
  return useQuery({
    queryKey: mentorAssignmentQueryKeys.list(mentorId),
    queryFn: async () => {
      const response = await axiosClient.get(`/MentorAssignment/mentor/${mentorId}/assignments`);
      return response.data;
    },
    enabled: !!mentorId,
    staleTime: 60 * 1000,
  });
};

/**
 * PUT /api/MentorAssignment/{assignmentId}/approve
 */
export const useApproveMentorAssignment = () => {
  return useMutation({
    mutationFn: async (assignmentId) => {
      const response = await axiosClient.put(`/MentorAssignment/${assignmentId}/approve`);
      return response.data;
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || 'Duyệt yêu cầu thất bại');
    },
  });
};

/**
 * PUT /api/MentorAssignment/{assignmentId}/reject
 */
export const useRejectMentorAssignment = () => {
  return useMutation({
    mutationFn: async (assignmentId) => {
      const response = await axiosClient.put(`/MentorAssignment/${assignmentId}/reject`);
      return response.data;
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || 'Từ chối yêu cầu thất bại');
    },
  });
};

