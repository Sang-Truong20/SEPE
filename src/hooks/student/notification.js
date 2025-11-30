import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import axiosClient from '../../configs/axiosClient';

export const notificationQueryKeys = {
    origin: ['student', 'notification'],
    all: () => [...notificationQueryKeys.origin, 'list'],
    unread: () => [...notificationQueryKeys.origin, 'unread'],
    detail: (id) => [...notificationQueryKeys.origin, 'detail', id],
};

// Get all notifications
export const useGetNotifications = () => {
    return useQuery({
        queryKey: notificationQueryKeys.all(),
        queryFn: async () => {
            const response = await axiosClient.get('/Notification');
            return response.data;
        },
        staleTime: 1 * 60 * 1000, // 1 minute
    });
};

// Get unread notifications count
export const useGetUnreadCount = () => {
    return useQuery({
        queryKey: notificationQueryKeys.unread(),
        queryFn: async () => {
            const response = await axiosClient.get('/Notification/unread/count');
            return response.data;
        },
        staleTime: 30 * 1000, // 30 seconds
    });
};

// Mark notification as read
export const useMarkAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (notificationIds) => {
            // Accept single ID or array of IDs
            const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];
            const response = await axiosClient.put('/Notification/mark-read', {
                notificationIds: ids,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all() });
            queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unread() });
        },
    });
};

// Mark all notifications as read
export const useMarkAllAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await axiosClient.put('/Notification/mark-all-read');
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all() });
            queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unread() });
            message.success('Đã đánh dấu tất cả là đã đọc');
        },
    });
};

// Accept team invite
export const useAcceptTeamInvite = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ notificationId, teamId }) => {
            const response = await axiosClient.post(`/TeamMember/${teamId}/accept-invite`, {
                notificationId,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all() });
            queryClient.invalidateQueries({ queryKey: ['student', 'team'] });
            message.success('Đã chấp nhận lời mời tham gia đội');
        },
        onError: (error) => {
            message.error(error?.response?.data?.message || 'Không thể chấp nhận lời mời');
        },
    });
};

// Reject team invite
export const useRejectTeamInvite = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ notificationId, teamId }) => {
            const response = await axiosClient.post(`/TeamMember/${teamId}/reject-invite`, {
                notificationId,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all() });
            message.success('Đã từ chối lời mời');
        },
        onError: (error) => {
            message.error(error?.response?.data?.message || 'Không thể từ chối lời mời');
        },
    });
};

