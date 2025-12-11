import { useState } from 'react';
import {
  useAcceptTeamInvite,
  useGetNotifications,
  useMarkAllAsRead,
  useMarkAsRead,
  useRejectTeamInvite,
} from '../../hooks/student/notification';
import {
  NotificationHeader,
  NotificationStats,
  NotificationList,
} from '../../components/features/student/notification';

const StudentNotifications = () => {
  const [filter, setFilter] = useState('all');
  const { data: notificationsData, isLoading } = useGetNotifications();
  
  const notifications = Array.isArray(notificationsData)
    ? notificationsData
    : notificationsData?.data
      ? notificationsData.data
      : notificationsData?.notifications
        ? notificationsData.notifications
        : [];
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const acceptInvite = useAcceptTeamInvite();
  const rejectInvite = useRejectTeamInvite();

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const teamInvites = notifications.filter(
    (n) => n.type === 'TEAM_INVITE' || n.type === 'team_invite',
  ).length;
  const hackathonNotis = notifications.filter(
    (n) => n.type === 'HACKATHON' || n.type === 'hackathon',
  ).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'all') return true;
    if (filter === 'team') {
      return (
        notification.type === 'TEAM_INVITE' ||
        notification.type === 'team_invite' ||
        notification.type?.toLowerCase().includes('team')
      );
    }
    if (filter === 'hackathon') {
      return (
        notification.type === 'HACKATHON' ||
        notification.type === 'hackathon' ||
        notification.type?.toLowerCase().includes('hackathon')
      );
    }
    return true;
  });

  const handleMarkAsRead = (notificationId) => {
    markAsRead.mutate(notificationId);
  };

  const handleAcceptInvite = (notification) => {
    const teamId = notification.relatedId || notification.teamId;
    if (teamId) {
      acceptInvite.mutate(
        { notificationId: notification.notificationId || notification.id, teamId },
        {
          onSuccess: () => {
            handleMarkAsRead(notification.notificationId || notification.id);
          },
        },
      );
    }
  };

  const handleRejectInvite = (notification) => {
    const teamId = notification.relatedId || notification.teamId;
    if (teamId) {
      rejectInvite.mutate(
        { notificationId: notification.notificationId || notification.id, teamId },
        {
          onSuccess: () => {
            handleMarkAsRead(notification.notificationId || notification.id);
          },
        },
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <NotificationHeader
        unreadCount={unreadCount}
        onMarkAllAsRead={() => markAllAsRead.mutate()}
        isMarkingAll={markAllAsRead.isPending}
      />

      <NotificationStats
        total={notifications.length}
        unread={unreadCount}
        hackathons={hackathonNotis}
        teamInvites={teamInvites}
      />

      <NotificationList
        notifications={filteredNotifications}
        filter={filter}
        onFilterChange={setFilter}
        unreadCount={unreadCount}
        isLoading={isLoading}
        onMarkAsRead={handleMarkAsRead}
        onAcceptInvite={handleAcceptInvite}
        onRejectInvite={handleRejectInvite}
        isMarkingRead={markAsRead.isPending}
        isAcceptingInvite={acceptInvite.isPending}
        isRejectingInvite={rejectInvite.isPending}
      />
    </div>
  );
};

export default StudentNotifications;

