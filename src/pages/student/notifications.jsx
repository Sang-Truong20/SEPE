import {
  BellOutlined,
  TrophyOutlined,
  TeamOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
  CheckOutlined,
  CloseOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Badge,
  Tag,
  Empty,
  Spin,
  Space,
  Popconfirm,
} from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  useGetNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useAcceptTeamInvite,
  useRejectTeamInvite,
} from '../../hooks/student/notification';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../constants';

dayjs.extend(relativeTime);

// Mock data for UI preview
const mockNotifications = [
  {
    notificationId: 1,
    id: 1,
    type: 'TEAM_INVITE',
    title: 'Lời mời tham gia đội',
    message: 'Bạn đã nhận được lời mời tham gia đội "Code Crusaders" từ Nguyễn Văn A',
    content: 'Bạn đã nhận được lời mời tham gia đội "Code Crusaders" từ Nguyễn Văn A',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    teamId: 1,
    relatedId: 1,
  },
  {
    notificationId: 2,
    id: 2,
    type: 'HACKATHON',
    title: 'Hackathon mới đã được công bố',
    message: 'AI Revolution 2024 đã được công bố. Đăng ký ngay để tham gia!',
    content: 'AI Revolution 2024 đã được công bố. Đăng ký ngay để tham gia!',
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
  },
  {
    notificationId: 3,
    id: 3,
    type: 'DEADLINE',
    title: 'Nhắc nhở deadline',
    message: 'Deadline nộp bài cho milestone 3 còn lại 2 ngày. Hãy hoàn thiện và nộp bài đúng hạn!',
    content: 'Deadline nộp bài cho milestone 3 còn lại 2 ngày. Hãy hoàn thiện và nộp bài đúng hạn!',
    isRead: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
  },
  {
    notificationId: 4,
    id: 4,
    type: 'ANNOUNCEMENT',
    title: 'Cập nhật tiêu chí chấm điểm',
    message: 'Tiêu chí chấm điểm cho AI Revolution 2024 đã được cập nhật. Vui lòng xem chi tiết.',
    content: 'Tiêu chí chấm điểm cho AI Revolution 2024 đã được cập nhật. Vui lòng xem chi tiết.',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    notificationId: 5,
    id: 5,
    type: 'ACHIEVEMENT',
    title: 'Hoàn thành hồ sơ',
    message: 'Chúc mừng! Hồ sơ của bạn đã được hoàn thành 100% và hiển thị cho các đội khác.',
    content: 'Chúc mừng! Hồ sơ của bạn đã được hoàn thành 100% và hiển thị cho các đội khác.',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    notificationId: 6,
    id: 6,
    type: 'TEAM_INVITE',
    title: 'Lời mời tham gia đội',
    message: 'Bạn đã nhận được lời mời tham gia đội "Tech Warriors" từ Trần Thị B',
    content: 'Bạn đã nhận được lời mời tham gia đội "Tech Warriors" từ Trần Thị B',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    teamId: 2,
    relatedId: 2,
  },
  {
    notificationId: 7,
    id: 7,
    type: 'RESULT',
    title: 'Kết quả Hackathon',
    message: 'Kết quả Web3 Future Hackathon đã được công bố. Kiểm tra xếp hạng của đội bạn!',
    content: 'Kết quả Web3 Future Hackathon đã được công bố. Kiểm tra xếp hạng của đội bạn!',
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    notificationId: 8,
    id: 8,
    type: 'HACKATHON',
    title: 'Hackathon sắp bắt đầu',
    message: 'AI Revolution 2024 sẽ bắt đầu vào ngày mai. Hãy chuẩn bị sẵn sàng!',
    content: 'AI Revolution 2024 sẽ bắt đầu vào ngày mai. Hãy chuẩn bị sẵn sàng!',
    isRead: false,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
  },
];

const StudentNotifications = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  // Use mock data for UI preview - comment out when API is ready
  const { data: notifications = mockNotifications, isLoading } = useGetNotifications();
  // Uncomment below and remove mockNotifications when API is ready:
  // const { data: notifications = [], isLoading } = useGetNotifications();
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

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'team_invite':
      case 'team':
        return <TeamOutlined className="text-blue-400" />;
      case 'hackathon':
        return <TrophyOutlined className="text-yellow-400" />;
      case 'deadline':
      case 'reminder':
        return <ClockCircleOutlined className="text-orange-400" />;
      case 'announcement':
        return <ExclamationCircleOutlined className="text-purple-400" />;
      case 'achievement':
        return <CheckCircleOutlined className="text-green-400" />;
      case 'result':
        return <StarOutlined className="text-yellow-400" />;
      default:
        return <BellOutlined className="text-gray-400" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'team_invite':
      case 'team':
        return 'border-blue-500/20 bg-blue-500/5';
      case 'hackathon':
        return 'border-yellow-500/20 bg-yellow-500/5';
      case 'deadline':
      case 'reminder':
        return 'border-orange-500/20 bg-orange-500/5';
      case 'announcement':
        return 'border-purple-500/20 bg-purple-500/5';
      case 'achievement':
        return 'border-green-500/20 bg-green-500/5';
      case 'result':
        return 'border-yellow-500/20 bg-yellow-500/5';
      default:
        return 'border-white/10 bg-white/5';
    }
  };

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

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return dayjs(timestamp).fromNow();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            Thông báo
          </h1>
          <p className="text-gray-400 mt-2">
            Theo dõi các thông báo và cập nhật mới nhất
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button
              onClick={() => markAllAsRead.mutate()}
              loading={markAllAsRead.isPending}
              className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
          <Button
            className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
            icon={<SettingOutlined />}
          >
            Cài đặt
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card-background border border-card-border backdrop-blur-xl">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <BellOutlined className="text-blue-400 text-xl" />
            </div>
            <div>
              <p className="text-2xl text-text-primary font-bold">
                {notifications.length}
              </p>
              <p className="text-sm text-muted-foreground">Tổng số</p>
            </div>
          </div>
        </Card>

        <Card className="bg-card-background border border-card-border backdrop-blur-xl">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <ExclamationCircleOutlined className="text-red-400 text-xl" />
            </div>
            <div>
              <p className="text-2xl text-text-primary font-bold">
                {unreadCount}
              </p>
              <p className="text-sm text-muted-foreground">Chưa đọc</p>
            </div>
          </div>
        </Card>

        <Card className="bg-card-background border border-card-border backdrop-blur-xl">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <TrophyOutlined className="text-yellow-400 text-xl" />
            </div>
            <div>
              <p className="text-2xl text-text-primary font-bold">
                {hackathonNotis}
              </p>
              <p className="text-sm text-muted-foreground">Hackathons</p>
            </div>
          </div>
        </Card>

        <Card className="bg-card-background border border-card-border backdrop-blur-xl">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <TeamOutlined className="text-green-400 text-xl" />
            </div>
            <div>
              <p className="text-2xl text-text-primary font-bold">
                {teamInvites}
              </p>
              <p className="text-sm text-muted-foreground">Lời mời đội</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Notifications List */}
      <Card className="bg-card-background border border-card-border backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">
            Thông báo gần đây
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              type={filter === 'all' ? 'primary' : 'default'}
              size="small"
              onClick={() => setFilter('all')}
            >
              Tất cả
            </Button>
            <Button
              type={filter === 'unread' ? 'primary' : 'default'}
              size="small"
              onClick={() => setFilter('unread')}
            >
              Chưa đọc ({unreadCount})
            </Button>
            <Button
              type={filter === 'team' ? 'primary' : 'default'}
              size="small"
              onClick={() => setFilter('team')}
            >
              Đội
            </Button>
            <Button
              type={filter === 'hackathon' ? 'primary' : 'default'}
              size="small"
              onClick={() => setFilter('hackathon')}
            >
              Hackathons
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => {
              const isTeamInvite =
                notification.type === 'TEAM_INVITE' ||
                notification.type === 'team_invite' ||
                notification.type?.toLowerCase().includes('team');
              const isUnread = !notification.isRead;

              return (
                <Card
                  key={notification.notificationId || notification.id}
                  className={`relative transition-all cursor-pointer ${
                    isUnread
                      ? getNotificationColor(notification.type)
                      : 'bg-card-background/50 border-card-border/50'
                  } hover:bg-white/10`}
                  onClick={() => {
                    if (isUnread) {
                      handleMarkAsRead(
                        notification.notificationId || notification.id,
                      );
                    }
                  }}
                >
                  {isUnread && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 rounded-l-lg" />
                  )}
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-white/5 rounded-lg">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4
                            className={`${
                              isUnread ? 'text-text-primary' : 'text-muted-foreground'
                            } font-medium mb-1`}
                          >
                            {notification.title || notification.message}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message || notification.content}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              {formatTime(
                                notification.createdAt ||
                                  notification.createdDate ||
                                  notification.timestamp,
                              )}
                            </span>
                            {isUnread && (
                              <Badge
                                status="processing"
                                className="ml-2"
                                color="blue"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {isTeamInvite && (
                        <div className="mt-4 flex items-center space-x-2">
                          <Popconfirm
                            title="Chấp nhận lời mời?"
                            description="Bạn có chắc chắn muốn tham gia đội này?"
                            onConfirm={() => handleAcceptInvite(notification)}
                            okText="Chấp nhận"
                            cancelText="Hủy"
                            okButtonProps={{
                              loading: acceptInvite.isPending,
                            }}
                          >
                            <Button
                              type="primary"
                              size="small"
                              icon={<CheckOutlined />}
                              className="bg-green-500 hover:bg-green-600"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Chấp nhận
                            </Button>
                          </Popconfirm>
                          <Popconfirm
                            title="Từ chối lời mời?"
                            description="Bạn có chắc chắn muốn từ chối lời mời này?"
                            onConfirm={() => handleRejectInvite(notification)}
                            okText="Từ chối"
                            cancelText="Hủy"
                            okButtonProps={{
                              danger: true,
                              loading: rejectInvite.isPending,
                            }}
                          >
                            <Button
                              danger
                              size="small"
                              icon={<CloseOutlined />}
                              onClick={(e) => e.stopPropagation()}
                            >
                              Từ chối
                            </Button>
                          </Popconfirm>
                          {notification.teamId && (
                            <Button
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`${PATH_NAME.STUDENT_TEAMS}/${notification.teamId}`);
                              }}
                            >
                              Xem đội
                            </Button>
                          )}
                        </div>
                      )}

                      {!isTeamInvite && isUnread && (
                        <div className="mt-3">
                          <Button
                            type="text"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(
                                notification.notificationId || notification.id,
                              );
                            }}
                            loading={markAsRead.isPending}
                          >
                            Đánh dấu đã đọc
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Empty
            description="Không có thông báo nào"
            className="py-12"
          />
        )}
      </Card>
    </div>
  );
};

export default StudentNotifications;

