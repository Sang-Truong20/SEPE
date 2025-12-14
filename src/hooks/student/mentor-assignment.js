import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import axiosClient from '../../configs/axiosClient';

export const mentorAssignmentQueryKeys = {
  origin: ['student', 'mentor-assignment'],
};

/**
 * POST /api/MentorAssignment
 * Assign mentor to team for hackathon
 */
export const useAssignMentor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mentorId, hackathonId, teamId }) => {
      if (!mentorId || !hackathonId || !teamId) {
        throw new Error('mentorId, hackathonId, and teamId are required');
      }
      const response = await axiosClient.post('/MentorAssignment', {
        mentorId,
        hackathonId,
        teamId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mentorAssignmentQueryKeys.origin });
      message.success('Đã gửi yêu cầu mentor thành công');
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || 'Gửi yêu cầu mentor thất bại');
    },
  });
};

