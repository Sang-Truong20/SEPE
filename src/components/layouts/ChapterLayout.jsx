import { CheckCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  Bell,
  Building2,
  ChevronDown,
  GraduationCap,
  Home,
  LogOut,
  UserCheck,
  Users,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../constants';
import { useLogout } from '../../hooks/useLogout.js';
import { useUserData } from '../../hooks/useUserData.js';

dayjs.extend(relativeTime);

const mockNotifications = [
  {
    id: 1,
    title: '5 yêu cầu xác thực sinh viên mới',
    message: 'Khoa CNTT vừa gửi thêm 5 hồ sơ cần duyệt',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    id: 2,
    title: '2 mentor chờ phê duyệt',
    message: 'Mentor mới đăng ký từ trường FPT Hà Nội',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    id: 3,
    title: 'Cập nhật danh sách team',
    message: '4 team đã cập nhật thông tin thành viên',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
];

const ChapterLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo: authUser } = useUserData();
  const mutationLogout = useLogout();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: PATH_NAME.CHAPTER_DASHBOARD,
    },
    {
      id: 'verify',
      label: 'Duyệt sinh viên',
      icon: UserCheck,
      path: PATH_NAME.CHAPTER_VERIFY_STUDENTS,
    },
    {
      id: 'mentor',
      label: 'Mentor',
      icon: GraduationCap,
      path: PATH_NAME.CHAPTER_MENTOR_MANAGEMENT,
    },
    {
      id: 'approval',
      label: 'Duyệt Hackathon',
      icon: CheckCircleOutlined,
      path: PATH_NAME.CHAPTER_TEAM_HACKATHON_APPROVAL,
    },
  ];

  const notifications = mockNotifications;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const chapterUser = useMemo(
    () => ({
      name: authUser?.fullName || authUser?.name || '',
      email: authUser?.email || '',
      role: authUser?.role || '',
    }),
    [authUser],
  );

  const handleNavigate = (path) => {
    navigate(path);
  };

  const isActivePage = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    mutationLogout();
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen ">
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-darkv2-secondary/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 lg:gap-4 shrink-0">
              <div className="h-7 lg:h-8 w-7 lg:w-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div className="h-6 lg:h-8 w-px bg-white/20 shrink-0"></div>
              <span className="text-base lg:text-xl whitespace-nowrap bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                SEPE Chapter Portal
              </span>
            </div>

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

            <div className="flex items-center space-x-2 lg:space-x-4">
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
                            handleNavigate(PATH_NAME.CHAPTER_NOTIFICATIONS);
                            setIsNotificationOpen(false);
                          }}
                          className="text-sm text-green-400 hover:text-green-300 transition-colors"
                        >
                          Xem tất cả
                        </button>
                      </div>

                      <div className="overflow-y-auto flex-1 divide-y divide-white/10">
                        {notifications.map((notification) => {
                          const isUnread = !notification.isRead;
                          return (
                            <div
                              key={notification.id}
                              className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                                isUnread ? 'bg-green-500/5' : ''
                              }`}
                              onClick={() => {
                                setIsNotificationOpen(false);
                                handleNavigate(PATH_NAME.CHAPTER_NOTIFICATIONS);
                              }}
                            >
                              <div className="flex items-start space-x-3">
                                {isUnread && (
                                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`text-sm font-medium truncate ${isUnread ? 'text-white' : 'text-muted-foreground'}`}
                                  >
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    {dayjs(notification.createdAt).fromNow()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen);
                    setIsNotificationOpen(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400/20"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-semibold">
                    {chapterUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
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
                          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                            {chapterUser.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                              {chapterUser.name}
                            </p>
                            <p className="text-muted-foreground text-sm truncate">
                              {chapterUser.email}
                            </p>
                            <p className="text-green-400 text-xs font-medium">
                              {chapterUser.role}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        <button
                          onClick={() => {
                            handleNavigate(
                              PATH_NAME.CHAPTER_PROFILE || PATH_NAME.USER_INFO,
                            );
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                        >
                          <Users className="w-5 h-5 text-muted-foreground" />
                          <span className="text-white">Hồ sơ chapter</span>
                        </button>

                        <button
                          onClick={handleLogout}
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

      <main >{children || <Outlet />}</main>

      <footer className="mt-16 border-t border-white/5 bg-darkv2-secondary/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-6 w-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div className="h-6 w-px bg-white/20"></div>
                <span className="text-base bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent whitespace-nowrap">
                  SEPE Chapter Portal
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Nền tảng phối hợp giữa trường và hệ thống SEPE để quản lý
                mentor, sinh viên, teams.
              </p>
            </div>

            <div>
              <h4 className="text-white mb-4">Tác vụ</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Duyệt sinh viên
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Quản lý mentor
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Theo dõi teams
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Trung tâm thông báo
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white mb-4">Tài nguyên</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Handbook Chapter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Quy trình Verify
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Chính sách Mentor
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Liên hệ hỗ trợ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Bộ phận Vận hành
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Chính sách & Điều khoản
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Báo cáo sự cố
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SEPE Chapter Portal. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChapterLayout;
