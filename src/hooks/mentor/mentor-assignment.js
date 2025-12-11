import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const mentorAssignmentQueryKeys = {
    origin: ['mentor', 'assignment'],
    mentorAssignments: (mentorId) => [...mentorAssignmentQueryKeys.origin, 'mentor', mentorId, 'assignments'],
    mentorTeams: (mentorId) => [...mentorAssignmentQueryKeys.origin, 'mentor', mentorId, 'teams'],
    create: () => [...mentorAssignmentQueryKeys.origin, 'create'],
    approve: (assignmentId) => [...mentorAssignmentQueryKeys.origin, 'approve', assignmentId],
    reject: (assignmentId) => [...mentorAssignmentQueryKeys.origin, 'reject', assignmentId],
};

export const useGetMentorAssignments = (mentorId) => {
    return useQuery({
        queryKey: mentorAssignmentQueryKeys.mentorAssignments(mentorId),
        queryFn: async () => {
            const response = await axiosClient.get(`/MentorAssignment/mentor/${mentorId}/assignments`);
            return response.data;
        },
        enabled: !!mentorId,
        staleTime: 2 * 60 * 1000,
    });
};

export const useGetMentorTeams = (mentorId) => {
    return useQuery({
        queryKey: mentorAssignmentQueryKeys.mentorTeams(mentorId),
        queryFn: async () => {
            const response = await axiosClient.get(`/MentorAssignment/mentor/${mentorId}/teams`);
            return response.data;
        },
        enabled: !!mentorId,
        staleTime: 5 * 60 * 1000,
    });
};

export const useCreateMentorAssignment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: mentorAssignmentQueryKeys.create(),
        mutationFn: async (payload) => {
            const response = await axiosClient.post('/MentorAssignment', payload);
            return response.data;
        },
        onSuccess: (_, variables) => {
            if (variables?.mentorId) {
                queryClient.invalidateQueries({
                    queryKey: mentorAssignmentQueryKeys.mentorAssignments(variables.mentorId),
                });
                queryClient.invalidateQueries({
                    queryKey: mentorAssignmentQueryKeys.mentorTeams(variables.mentorId),
                });
            }
        },
    });
};

export const useApproveMentorAssignment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: mentorAssignmentQueryKeys.approve(),
        mutationFn: async ({ assignmentId }) => {
            const response = await axiosClient.put(`/MentorAssignment/${assignmentId}/approve`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: ({ queryKey }) => queryKey[0] === mentorAssignmentQueryKeys.origin[0],
            });
        },
    });
};

export const useRejectMentorAssignment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: mentorAssignmentQueryKeys.reject(),
        mutationFn: async ({ assignmentId }) => {
            const response = await axiosClient.put(`/MentorAssignment/${assignmentId}/reject`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: ({ queryKey }) => queryKey[0] === mentorAssignmentQueryKeys.origin[0],
            });
        },
    });
};

