import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';
import { message } from 'antd';

export const submissionQueryKeys = {
    origin: ['student', 'submission'],
    createDraft: () => [...submissionQueryKeys.origin, 'create-draft'],
    setFinal: () => [...submissionQueryKeys.origin, 'set-final'],
    submissions: (teamId, phaseChallengeId) => [...submissionQueryKeys.origin, 'submissions', teamId, phaseChallengeId],
    submissionsByTeam: (teamId) => [...submissionQueryKeys.origin, 'submissions-by-team', teamId],
    allSubmissions: () => [...submissionQueryKeys.origin, 'all'],
};

// Create draft submission
export const useCreateDraftSubmission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: submissionQueryKeys.createDraft(),
        mutationFn: async (submissionData) => {
            const response = await axiosClient.post('/Submission/draft', {
                teamId: submissionData.teamId,
                phaseId: submissionData.phaseId,
                title: submissionData.title,
                filePath: submissionData.filePath,
            });

            return response.data;
        },
        onSuccess: () => {
            // Invalidate and refetch submissions after creating draft
            queryClient.invalidateQueries({ queryKey: submissionQueryKeys.origin });
            message.success('Đã tạo bản nháp bài nộp thành công');
        },
        onError: (error) => {
            message.error(error?.response?.data?.message || 'Không thể tạo bài nộp');
        },
    });
};

// Set submission as final
export const useSetFinalSubmission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: submissionQueryKeys.setFinal(),
        mutationFn: async (submissionId) => {
            const response = await axiosClient.post('/Submission/set-final', {
                submissionId: submissionId,
            });

            return response.data;
        },
        onSuccess: () => {
            // Invalidate and refetch all submissions after setting final
            queryClient.invalidateQueries({ queryKey: submissionQueryKeys.origin });
            message.success('Đã nộp bài thành công');
        },
        onError: (error) => {
            message.error(error?.response?.data?.message || 'Không thể nộp bài');
        },
    });
};

// Get submissions by team and phase challenge
export const useGetSubmissions = (teamId, phaseChallengeId, options = {}) => {
    return useQuery({
        queryKey: submissionQueryKeys.submissions(teamId, phaseChallengeId),
        queryFn: async () => {
            const response = await axiosClient.get('/Submission/submissions', {
                params: {
                    teamId,
                    phaseChallengeId,
                },
            });
            return response.data;
        },
        enabled: !!teamId && !!phaseChallengeId && (options.enabled !== false),
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
};

// Get submissions by team
export const useGetSubmissionsByTeam = (teamId, options = {}) => {
    return useQuery({
        queryKey: submissionQueryKeys.submissionsByTeam(teamId),
        queryFn: async () => {
            const response = await axiosClient.get(`/Submission/team/${teamId}`);
            return response.data;
        },
        enabled: !!teamId && (options.enabled !== false),
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
};

// Get all submissions for current user
export const useGetAllSubmissions = (options = {}) => {
    return useQuery({
        queryKey: submissionQueryKeys.allSubmissions(),
        queryFn: async () => {
            const response = await axiosClient.get('/Submission');
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
};


