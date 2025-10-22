import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const challengeQueryKeys = {
    origin: ['student', 'challenge'],
    challenges: () => [...challengeQueryKeys.origin, 'list'],
    challenge: (id) => [...challengeQueryKeys.origin, 'detail', id],
    create: () => [...challengeQueryKeys.origin, 'create'],
    updateStatus: () => [...challengeQueryKeys.origin, 'status'],
    updatePartner: () => [...challengeQueryKeys.origin, 'partner'],
    delete: () => [...challengeQueryKeys.origin, 'delete'],
};

// Get all challenges
export const useGetChallenges = (options = {}) => {
    return useQuery({
        queryKey: challengeQueryKeys.challenges(),
        queryFn: async () => {
            const response = await axiosClient.get('/api/Challenge');
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
};

// Get challenge by ID
export const useGetChallenge = (challengeId, options = {}) => {
    return useQuery({
        queryKey: challengeQueryKeys.challenge(challengeId),
        queryFn: async () => {
            const response = await axiosClient.get(`/api/Challenge/${challengeId}`);
            return response.data;
        },
        enabled: !!challengeId && (options.enabled !== false),
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
};

// Create challenge
export const useCreateChallenge = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: challengeQueryKeys.create(),
        mutationFn: async (challengeData) => {
            const formData = new FormData();

            // Add form fields
            formData.append('Title', challengeData.title);
            formData.append('Description', challengeData.description);
            formData.append('SeasonId', challengeData.seasonId.toString());
            formData.append('FilePath', challengeData.filePath || '');

            // Add file if provided
            if (challengeData.file) {
                formData.append('file', challengeData.file);
            }

            const response = await axiosClient.post('/api/Challenge/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        },
        onSuccess: () => {
            // Invalidate challenges list
            queryClient.invalidateQueries({ queryKey: challengeQueryKeys.challenges() });
        },
    });
};

// Update challenge status
export const useUpdateChallengeStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: challengeQueryKeys.updateStatus(),
        mutationFn: async ({ challengeId, status }) => {
            const response = await axiosClient.patch(`/api/Challenge/${challengeId}/status`, {
                status: status,
            });
            return response.data;
        },
        onSuccess: (data, variables) => {
            // Update the cached challenge
            queryClient.setQueryData(challengeQueryKeys.challenge(variables.challengeId), data);

            // Invalidate challenges list
            queryClient.invalidateQueries({ queryKey: challengeQueryKeys.challenges() });
        },
    });
};

// Update challenge partner
export const useUpdateChallengePartner = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: challengeQueryKeys.updatePartner(),
        mutationFn: async ({ challengeId, title, description, seasonId, filePath, file }) => {
            const formData = new FormData();

            // Add form fields
            formData.append('Title', title);
            formData.append('Description', description);
            formData.append('SeasonId', seasonId.toString());
            formData.append('FilePath', filePath || '');

            // Add file if provided
            if (file) {
                formData.append('File', file);
            }

            const response = await axiosClient.put(`/api/Challenge/${challengeId}/partner`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        },
        onSuccess: (data, variables) => {
            // Update the cached challenge
            queryClient.setQueryData(challengeQueryKeys.challenge(variables.challengeId), data);

            // Invalidate challenges list
            queryClient.invalidateQueries({ queryKey: challengeQueryKeys.challenges() });
        },
    });
};

// Delete challenge
export const useDeleteChallenge = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: challengeQueryKeys.delete(),
        mutationFn: async (challengeId) => {
            const response = await axiosClient.delete(`/api/Challenge/${challengeId}`);
            return response.data;
        },
        onSuccess: (data, variables) => {
            // Remove the challenge from cache
            queryClient.removeQueries({ queryKey: challengeQueryKeys.challenge(variables) });

            // Invalidate challenges list
            queryClient.invalidateQueries({ queryKey: challengeQueryKeys.challenges() });
        },
    });
};


