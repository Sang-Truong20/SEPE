import { CheckOutlined, CloseOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Modal, Button, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  Bell,
  BookOpen,
  ChevronDown,
  Home,
  LogOut,
  MessageSquare,
  Target,
  Trophy,
  User,
} from 'lucide-react';
import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../constants';
import {
  useGetNotifications,
  useGetUnreadCount,
  useMarkAsRead,
  useAcceptTeamInvite,
  useRejectTeamInvite,
} from '../../hooks/student/notification';
import { useUserData } from '../../hooks/useUserData';
import { useLogout } from '../../hooks/useLogout';

dayjs.extend(relativeTime);

// Mock data for UI preview
const mockNotifications = [
  {
    notificationId: 1,
    id: 1,
    type: 'TEAM_UPDATE',
    title: 'Team cập nhật tiến độ',
    message: 'Tech Innovators đã cập nhật tiến độ dự án lên 75%',
    content: 'Tech Innovators đã cập nhật tiến độ dự án lên 75%',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    teamId: 1,
    relatedId: 1,
  },
  {
    notificationId: 2,
    id: 2,
    type: 'MEETING_REQUEST',
    title: 'Yêu cầu lịch họp mới',
    message: 'AI Warriors yêu cầu lịch họp technical review',
    content: 'AI Warriors yêu cầu lịch họp technical review',
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    notificationId: 3,
    id: 3,
    type: 'FEEDBACK',
    title: 'Feedback mới từ team',
    message: 'Blockchain Pioneers đã phản hồi feedback của bạn',
    content: 'Blockchain Pioneers đã phản hồi feedback của bạn',
    isRead: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

const MentorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const {
    data: notificationsResponse,
    isLoading: notificationsLoading,
  } = useGetNotifications();

  const { data: unreadCountResponse } = useGetUnreadCount();

  // Normalize notifications to always be an array
  const notifications = React.useMemo(() => {
    if (!notificationsResponse) return mockNotifications;

    if (Array.isArray(notificationsResponse)) return notificationsResponse;

    if (Array.isArray(notificationsResponse.data)) return notificationsResponse.data;

    // Fallback
    return mockNotifications;
  }, [notificationsResponse]);

  // Normalize unread count to a number
  const unreadCount = React.useMemo(() => {
    if (typeof unreadCountResponse === 'number') return unreadCountResponse;

    if (typeof unreadCountResponse?.count === 'number') return unreadCountResponse.count;

    if (typeof unreadCountResponse?.data?.count === 'number')
      return unreadCountResponse.data.count;

    return notifications.filter((n) => !n.isRead).length;
  }, [unreadCountResponse, notifications]);

  const markAsRead = useMarkAsRead();
  const acceptInvite = useAcceptTeamInvite();
  const rejectInvite = useRejectTeamInvite();
  const { userInfo: authUser } = useUserData();
  const mutationLogout = useLogout();

  const recentNotifications = notifications.slice(0, 5);

  const userData = {
    name: authUser?.fullName || authUser?.name || '',
    email: authUser?.email || '',
    avatar: authUser?.avatarUrl || authUser?.avatar || null,
    role: authUser?.role || '',
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: PATH_NAME.MENTOR_DASHBOARD,
    },
    {
      id: 'hackathons',
      label: 'Hackathons',
      icon: Trophy,
      path: PATH_NAME.MENTOR_HACKATHONS,
    },
    {
      id: 'group-chat',
      label: 'Group Chat',
      icon: MessageSquare,
      path: PATH_NAME.MENTOR_GROUP_CHAT,
    },
    {
      id: 'assignments',
      label: 'Yêu cầu mentor',
      icon: BookOpen,
      path: PATH_NAME.MENTOR_ASSIGNMENTS,
    },
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  const formatFullDateTime = (timestamp) => {
    if (!timestamp) return '—';
    return dayjs(timestamp).format('DD/MM/YYYY HH:mm');
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return dayjs(timestamp).fromNow();
  };

  const handleNotificationClick = (notification) => {
    const notificationId = notification.notificationId || notification.id;
    if (!notification.isRead && notificationId) {
      markAsRead.mutate(notificationId);
    }
    setSelectedNotification(notification);
  };

  const handleAcceptInvite = (notification) => {
    const teamId = notification.relatedId || notification.teamId;
    if (teamId) {
      acceptInvite.mutate(
        { notificationId: notification.notificationId || notification.id, teamId },
        {
          onSuccess: () => {
            const notificationId = notification.notificationId || notification.id;
            if (notificationId) {
              markAsRead.mutate(notificationId);
            }
            setSelectedNotification(null);
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
            const notificationId = notification.notificationId || notification.id;
            if (notificationId) {
              markAsRead.mutate(notificationId);
            }
            setSelectedNotification(null);
          },
        },
      );
    }
  };

  const handleMarkAsRead = (notification) => {
    const notificationId = notification.notificationId || notification.id;
    if (notificationId && !notification.isRead) {
      markAsRead.mutate(notificationId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation - Top bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-darkv2-secondary/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 lg:gap-4 shrink-0">
              <div className="h-7 lg:h-8 w-7 lg:w-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div className="h-6 lg:h-8 w-px bg-white/20 shrink-0"></div>
              <span className="text-base lg:text-xl whitespace-nowrap bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                SEPE Mentor Portal
              </span>
            </div>

            {/* Navigation Items - Desktop */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.path)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    isActivePage(item.path)
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotificationOpen(!isNotificationOpen);
                    setIsDropdownOpen(false);
                  }}
                  className="relative p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400/20"
                >
                  <Bell className="w-5 h-5 text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsNotificationOpen(false)}
                    />

                    <div className="absolute right-0 top-full mt-2 w-96 bg-darkv2-secondary/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 max-h-[600px] flex flex-col">
                      <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <h3 className="text-white font-semibold text-lg">
                          Thông báo
                        </h3>
                        <button
                          onClick={() => {
                            navigate(
                              PATH_NAME.MENTOR_NOTIFICATIONS ||
                                PATH_NAME.STUDENT_NOTIFICATIONS,
                            );
                            setIsNotificationOpen(false);
                          }}
                          className="text-sm text-green-400 hover:text-green-300 transition-colors"
                        >
                          Xem tất cả
                        </button>
                      </div>

                      <div className="overflow-y-auto flex-1">
                        {notificationsLoading ? (
                          <div className="p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          </div>
                        ) : recentNotifications.length > 0 ? (
                          <div className="divide-y divide-white/10">
                            {recentNotifications.map((notification) => {
                              const isUnread = !notification.isRead;

                              return (
                                <div
                                  key={
                                    notification.notificationId ||
                                    notification.id
                                  }
                                  className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                                    isUnread ? 'bg-blue-500/5' : ''
                                  }`}
                                  onClick={() => {
                                    handleNotificationClick(notification);
                                    setIsNotificationOpen(false);
                                  }}
                                >
                                  <div className="flex items-start space-x-3">
                                    {isUnread && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p
                                        className={`text-sm font-medium truncate ${
                                          isUnread
                                            ? 'text-white'
                                            : 'text-muted-foreground'
                                        }`}
                                      >
                                        {notification.title ||
                                          notification.message}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {notification.message ||
                                          notification.content}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-2">
                                        {dayjs(
                                          notification.createdAt ||
                                            notification.createdDate ||
                                            notification.timestamp,
                                        ).fromNow()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-8 text-center text-muted-foreground">
                            <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Không có thông báo nào</p>
                          </div>
                        )}
                      </div>

                      {recentNotifications.length > 0 && (
                        <div className="p-3 border-t border-white/10">
                          <button
                            onClick={() => {
                              navigate(
                                PATH_NAME.MENTOR_NOTIFICATIONS ||
                                  PATH_NAME.STUDENT_NOTIFICATIONS,
                              );
                              setIsNotificationOpen(false);
                            }}
                            className="w-full text-center text-sm text-green-400 hover:text-green-300 transition-colors"
                          >
                            Xem tất cả thông báo
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Dropdown Avatar */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen);
                    setIsNotificationOpen(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400/20"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-white transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    />

                    <div className="absolute right-0 top-full mt-2 w-72 bg-darkv2-secondary/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50">
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                              {userData.name}
                            </p>
                            <p className="text-muted-foreground text-sm truncate">
                              {userData.email}
                            </p>
                            <p className="text-green-400 text-xs font-medium">
                              {userData.role}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        <button
                          onClick={() => {
                            handleNavigate(
                              PATH_NAME.MENTOR_PROFILE ||
                                PATH_NAME.STUDENT_PROFILE,
                            );
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                        >
                          <User className="w-5 h-5 text-muted-foreground" />
                          <span className="text-white">Hồ sơ cá nhân</span>
                        </button>

                        <div className="border-t border-white/10 my-2"></div>

                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            mutationLogout();
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-5 h-5 text-red-400" />
                          <span className="text-red-400">Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden border-t border-white/10 py-2">
            <div className="flex items-center space-x-1 overflow-x-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.path)}
                  className={`flex-shrink-0 flex items-center space-x-1 px-3 py-2 rounded-lg text-xs transition-all ${
                    isActivePage(item.path)
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-6">
        <Outlet />
      </main>

      <Modal
        open={!!selectedNotification}
        title={
          <div className="text-white">
            {selectedNotification?.title || selectedNotification?.message || 'Chi tiết thông báo'}
          </div>
        }
        onCancel={() => setSelectedNotification(null)}
        footer={[
          <Button
            key="all"
            onClick={() => {
              navigate(
                PATH_NAME.MENTOR_NOTIFICATIONS || PATH_NAME.STUDENT_NOTIFICATIONS,
              );
              setSelectedNotification(null);
            }}
          >
            Xem tất cả thông báo
          </Button>,
          <Button key="close" type="primary" onClick={() => setSelectedNotification(null)}>
            Đóng
          </Button>,
        ]}
        className="[&_.ant-modal-content]:bg-dark-secondary [&_.ant-modal-content]:border-white/10 [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white"
        width={600}
      >
        {selectedNotification && (
          <div className="space-y-4">
            {/* Chi tiết thông báo */}
            <div className="p-4 rounded-lg border border-white/10 bg-white/5 text-sm space-y-3">
              <div className="flex justify-between gap-2">
                <span className="text-gray-400">Loại</span>
                <span className="text-white">{selectedNotification.type || 'N/A'}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-400">Tiêu đề</span>
                <span className="text-white text-right">
                  {selectedNotification.title || selectedNotification.message || '—'}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-400">Nội dung</span>
                <span className="text-white text-right">
                  {selectedNotification.message || selectedNotification.content || '—'}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-400">Thời gian</span>
                <span className="text-white text-right flex items-center gap-1.5">
                  <ClockCircleOutlined className="text-[10px]" />
                  {formatFullDateTime(
                    selectedNotification.sentAt ||
                      selectedNotification.createdAt ||
                      selectedNotification.createdDate ||
                      selectedNotification.timestamp,
                  )}
                </span>
              </div>
              {(selectedNotification.teamName || selectedNotification.teamId) && (
                <div className="flex justify-between gap-2">
                  <span className="text-gray-400">Đội</span>
                  <span className="text-white text-right">
                    {selectedNotification.teamName || selectedNotification.teamId}
                  </span>
                </div>
              )}
              {selectedNotification.relatedId && (
                <div className="flex justify-between gap-2">
                  <span className="text-gray-400">Liên quan ID</span>
                  <span className="text-white text-right">{selectedNotification.relatedId}</span>
                </div>
              )}
            </div>

            {/* Team Invite Actions */}
            {(selectedNotification.type === 'TEAM_INVITE' ||
              selectedNotification.type === 'team_invite' ||
              selectedNotification.type?.toLowerCase().includes('team')) && (
              <div className="pt-4 border-t border-white/10 flex items-center gap-2 flex-wrap">
                <Popconfirm
                  title="Chấp nhận lời mời?"
                  description="Bạn có chắc chắn muốn tham gia đội này?"
                  onConfirm={() => handleAcceptInvite(selectedNotification)}
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
                    className="bg-green-500 hover:bg-green-600 border-0"
                  >
                    Chấp nhận
                  </Button>
                </Popconfirm>
                <Popconfirm
                  title="Từ chối lời mời?"
                  description="Bạn có chắc chắn muốn từ chối lời mời này?"
                  onConfirm={() => handleRejectInvite(selectedNotification)}
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
                  >
                    Từ chối
                  </Button>
                </Popconfirm>
                {selectedNotification.teamId && (
                  <Button
                    size="small"
                    className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                    onClick={() => {
                      navigate(`${PATH_NAME.STUDENT_TEAMS}/${selectedNotification.teamId}`);
                      setSelectedNotification(null);
                    }}
                  >
                    Xem đội
                  </Button>
                )}
              </div>
            )}

            {/* Mark as Read */}
            {!selectedNotification.isRead && (
              <div className="pt-4 border-t border-white/10">
                <Button
                  type="text"
                  size="small"
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 px-3"
                  onClick={() => handleMarkAsRead(selectedNotification)}
                  loading={markAsRead.isPending}
                >
                  Đánh dấu đã đọc
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/5 bg-darkv2-secondary/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-6 w-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div className="h-6 w-px bg-white/20"></div>
                <span className="text-base bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent whitespace-nowrap">
                  SEPE Mentor Portal
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Nền tảng hỗ trợ và hướng dẫn teams cho mentors.
              </p>
            </div>

            <div>
              <h4 className="text-white mb-4">Hướng dẫn</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Teams
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Lịch hẹn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tài nguyên
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Feedback
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white mb-4">Tài nguyên</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tài liệu
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Hướng dẫn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cộng đồng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Hỗ trợ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Về chúng tôi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Liên hệ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Chính sách
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Điều khoản
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © 2024 SEPE Mentor Portal. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MentorLayout;
