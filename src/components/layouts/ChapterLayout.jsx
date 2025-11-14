import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../constants';
import { useUserData } from '../../hooks/useUserData.js';
import { useLogout } from '../../hooks/useLogout.js';
import {
  Bell,
  Building2,
  ChevronDown,
  GraduationCap,
  Home,
  LogOut,
  Mail,
  Users,
  UserCheck,
} from 'lucide-react';

const ChapterLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo } = useUserData();
  const mutationLogout = useLogout();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: PATH_NAME.CHAPTER_DASHBOARD },
    { id: 'verify', label: 'Duyệt sinh viên', icon: UserCheck, path: PATH_NAME.CHAPTER_VERIFY_STUDENTS },
    { id: 'mentor', label: 'Mentor', icon: GraduationCap, path: PATH_NAME.CHAPTER_MENTOR_MANAGEMENT },
    { id: 'teams', label: 'Teams', icon: Users, path: PATH_NAME.CHAPTER_TEAMS },
    { id: 'notifications', label: 'Thông báo', icon: Mail, path: PATH_NAME.CHAPTER_NOTIFICATIONS },
  ];

  const notifications = [
    { id: 1, title: '5 yêu cầu verify mới', time: '30 phút trước', read: false },
    { id: 2, title: '2 mentor chờ duyệt', time: '1 giờ trước', read: false },
    { id: 3, title: 'Cập nhật danh sách khoa', time: 'Hôm qua', read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNavigate = (path) => {
    navigate(path);
  };

  const isActivePage = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    mutationLogout();
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-dark-secondary/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 lg:gap-4 shrink-0">
              <div className="h-8 w-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div className="h-6 lg:h-8 w-px bg-white/20 shrink-0" />
              <span className="text-base lg:text-xl whitespace-nowrap bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Chapter Panel
              </span>
            </div>

            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.path)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    isActivePage(item.path)
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotificationOpen(!isNotificationOpen);
                    setIsDropdownOpen(false);
                  }}
                  className="relative p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
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
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-80 bg-dark-secondary/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50">
                      <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <h3 className="text-white font-semibold text-lg">Thông báo</h3>
                        <button
                          onClick={() => {
                            handleNavigate(PATH_NAME.CHAPTER_NOTIFICATIONS);
                            setIsNotificationOpen(false);
                          }}
                          className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          Xem tất cả
                        </button>
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-white/10">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 hover:bg-white/5 transition-colors ${
                              !notification.read ? 'bg-emerald-500/5' : ''
                            }`}
                          >
                            <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'text-white font-medium'}`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                          </div>
                        ))}
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
                  className="flex items-center space-x-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-semibold">
                    {(userInfo?.fullName || 'CP').slice(0, 2).toUpperCase()}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-white transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-72 bg-dark-secondary/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50">
                      <div className="p-4 border-b border-white/10">
                        <p className="text-white font-medium truncate">{userInfo?.fullName || 'Chapter Admin'}</p>
                        <p className="text-muted-foreground text-sm truncate">{userInfo?.email || 'chapter@sepe.vn'}</p>
                        <p className="text-emerald-400 text-xs font-medium">Đại diện trường</p>
                      </div>
                      <div className="py-2">
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
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30'
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

      <main className="pt-6">
        <Outlet />
      </main>

      <footer className="mt-12 border-t border-white/5 bg-dark-secondary/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-muted-foreground">SEPE Chapter Panel</span>
          </div>
          <p className="text-xs text-muted-foreground text-center md:text-right">
            © {new Date().getFullYear()} SEPE. Empowering every chapter to manage students & mentors effectively.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ChapterLayout;

