import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';


export const submissionQueryKeys = {
    origin: ['student', 'submission'],
    createDraft: () => [...submissionQueryKeys.origin, 'create-draft'],
    setFinal: () => [...submissionQueryKeys.origin, 'set-final'],
    submissions: (teamId, phaseChallengeId) => [...submissionQueryKeys.origin, 'submissions', teamId, phaseChallengeId],

};

// Create draft submission
export const useCreateDraftSubmission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: submissionQueryKeys.createDraft(),
        mutationFn: async (submissionData) => {
            const response = await axiosClient.post('/Submission/create-draft', {
                teamId: submissionData.teamId,
                challengeId: submissionData.challengeId,
                title: submissionData.title,
                githubLink: submissionData.githubLink,
                demoLink: submissionData.demoLink,
                reportLink: submissionData.reportLink,
            });

            return response.data;
        },
        onSuccess: (data, variables) => {
            // Invalidate and refetch submissions after creating draft
            queryClient.invalidateQueries({ queryKey: submissionQueryKeys.origin });

            // Optionally cache the draft submission
            queryClient.setQueryData(
                submissionQueryKeys.draft(variables.teamId, variables.challengeId),
                data
            );
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


