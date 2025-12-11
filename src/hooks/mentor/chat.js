import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const mentorChatQueryKeys = {
    origin: ['mentor', 'chat'],
    mentorGroups: (mentorId) => [...mentorChatQueryKeys.origin, mentorId, 'groups'],
    mentorHackathonGroups: (mentorId, hackathonId) => [
        ...mentorChatQueryKeys.origin,
        mentorId,
        'hackathon',
        hackathonId,
        'groups',
    ],
};

// Get chat groups for a mentor
export const useMentorChatGroups = (mentorId) => {
    return useQuery({
        queryKey: mentorChatQueryKeys.mentorGroups(mentorId),
        queryFn: async () => {
            const response = await axiosClient.get(`/Chat/mentor/${mentorId}/groups`);
            return response.data;
        },
        enabled: !!mentorId,
        staleTime: 30 * 1000,
    });
};

// Get chat groups for a mentor within a hackathon
export const useMentorHackathonChatGroups = (mentorId, hackathonId) => {
    return useQuery({
        queryKey: mentorChatQueryKeys.mentorHackathonGroups(mentorId, hackathonId),
        queryFn: async () => {
            const response = await axiosClient.get(
                `/Chat/mentor/${mentorId}/hackathon/${hackathonId}/groups`,
            );
            return response.data;
        },
        enabled: !!mentorId && !!hackathonId,
        staleTime: 30 * 1000,
    });
};

