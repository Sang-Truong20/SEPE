import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';
import { message as antdMessage } from 'antd';

export const chatQueryKeys = {
    origin: ['student', 'chat'],
    groupMessages: (chatGroupId) => [...chatQueryKeys.origin, 'group', chatGroupId, 'messages'],
    teamGroups: (teamId) => [...chatQueryKeys.origin, 'team', teamId, 'groups'],
    hackathonGroups: (hackathonId) => [...chatQueryKeys.origin, 'hackathon', hackathonId, 'groups'],
    teamHackathonGroups: (teamId, hackathonId) => [
        ...chatQueryKeys.origin,
        'team',
        teamId,
        'hackathon',
        hackathonId,
        'groups',
    ],
    sendMessage: () => [...chatQueryKeys.origin, 'send'],
    markRead: (chatGroupId) => [...chatQueryKeys.origin, 'group', chatGroupId, 'read'],
};

// Send chat message to a group
export const useSendChatMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: chatQueryKeys.sendMessage(),
        mutationFn: async ({ chatGroupId, content }) => {
            const response = await axiosClient.post('/Chat/message', {
                chatGroupId,
                content,
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            if (variables?.chatGroupId) {
                queryClient.invalidateQueries({
                    queryKey: chatQueryKeys.groupMessages(variables.chatGroupId),
                });
            }
        },
        onError: (error) => {
            antdMessage.error(
                error?.response?.data?.message || 'Không thể gửi tin nhắn. Vui lòng thử lại.',
            );
        },
    });
};

// Get messages of a chat group
export const useGetChatGroupMessages = (chatGroupId) => {
    return useQuery({
        queryKey: chatQueryKeys.groupMessages(chatGroupId),
        queryFn: async () => {
            const response = await axiosClient.get(`/Chat/group/${chatGroupId}/messages`);
            return response.data;
        },
        enabled: !!chatGroupId,
        staleTime: 10 * 1000,
    });
};

// Get chat groups for a team
export const useGetTeamChatGroups = (teamId) => {
    return useQuery({
        queryKey: chatQueryKeys.teamGroups(teamId),
        queryFn: async () => {
            const response = await axiosClient.get(`/Chat/team/${teamId}/groups`);
            return response.data;
        },
        enabled: !!teamId,
        staleTime: 30 * 1000,
    });
};

// Get chat groups for a hackathon
export const useGetHackathonChatGroups = (hackathonId) => {
    return useQuery({
        queryKey: chatQueryKeys.hackathonGroups(hackathonId),
        queryFn: async () => {
            const response = await axiosClient.get(`/Chat/hackathon/${hackathonId}/groups`);
            return response.data;
        },
        enabled: !!hackathonId,
        staleTime: 30 * 1000,
    });
};

// Get chat groups for a team within a hackathon
export const useGetTeamHackathonChatGroups = (teamId, hackathonId) => {
    return useQuery({
        queryKey: chatQueryKeys.teamHackathonGroups(teamId, hackathonId),
        queryFn: async () => {
            const response = await axiosClient.get(
                `/Chat/team/${teamId}/hackathon/${hackathonId}/groups`,
            );
            return response.data;
        },
        enabled: !!teamId && !!hackathonId,
        staleTime: 30 * 1000, 
    });
};

// Mark chat group as read
export const useMarkChatGroupAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: chatQueryKeys.markRead(),
        mutationFn: async (chatGroupId) => {
            const response = await axiosClient.put(`/Chat/group/${chatGroupId}/read`);
            return response.data;
        },
        onSuccess: (_, chatGroupId) => {
            if (chatGroupId) {
                queryClient.invalidateQueries({
                    queryKey: chatQueryKeys.groupMessages(chatGroupId),
                });
            }
        },
        onError: (error) => {
            antdMessage.error(
                error?.response?.data?.message || 'Không thể đánh dấu đã đọc. Vui lòng thử lại.',
            );
        },
    });
};


