import {
  BarChart3,
  ChevronDown,
  FileText,
  Home,
  LogOut,
  Settings,
  Trophy,
  User,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../constants';

const StudentLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const userData = {
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@student.university.edu.vn',
    avatar: null,
    role: 'Sinh viên',
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: PATH_NAME.STUDENT_DASHBOARD,
    },
    {
      id: 'hackathons',
      label: 'Hackathons',
      icon: Trophy,
      path: PATH_NAME.STUDENT_HACKATHONS,
    },
    { id: 'teams', label: 'Teams', icon: Users, path: PATH_NAME.STUDENT_TEAMS },
    {
      id: 'submissions',
      label: 'Submissions',
      icon: FileText,
      path: PATH_NAME.STUDENT_SUBMISSIONS,
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: BarChart3,
      path: PATH_NAME.STUDENT_LEADERBOARD,
    },
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation - Top bar similar to Hackathon Management Web App UI */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-dark-secondary/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 lg:gap-4 shrink-0">
              <div className="h-7 lg:h-8 w-7 lg:w-8 bg-gradient-to-r from-orange-400 to-blue-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div className="h-6 lg:h-8 w-px bg-white/20 shrink-0"></div>
              <span className="text-base lg:text-xl whitespace-nowrap bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">
                SEPE Student Portal
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
                      ? 'bg-gradient-to-r from-orange-500/20 to-blue-500/20 text-orange-400 border border-orange-500/30'
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
              {/* Dropdown Avatar */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-blue-400 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden lg:block text-white">
                    {userData.name.split(' ')[0]}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-white transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    {/* Overlay */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    />

                    {/* Dropdown Content */}
                    <div className="absolute right-0 top-full mt-2 w-72 bg-dark-secondary/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50">
                      {/* User Info Header */}
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-blue-400 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                              {userData.name}
                            </p>
                            <p className="text-muted-foreground text-sm truncate">
                              {userData.email}
                            </p>
                            <p className="text-orange-400 text-xs font-medium">
                              {userData.role}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            handleNavigate(PATH_NAME.STUDENT_PROFILE);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                        >
                          <User className="w-5 h-5 text-muted-foreground" />
                          <span className="text-white">Hồ sơ cá nhân</span>
                        </button>

                        <button
                          onClick={() => {
                            // Handle settings navigation
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                        >
                          <Settings className="w-5 h-5 text-muted-foreground" />
                          <span className="text-white">Cài đặt</span>
                        </button>

                        <div className="border-t border-white/10 my-2"></div>

                        <button
                          onClick={() => {
                            // Handle logout logic here
                            console.log('Logout clicked');
                            setIsDropdownOpen(false);
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
                      ? 'bg-gradient-to-r from-orange-500/20 to-blue-500/20 text-orange-400 border border-orange-500/30'
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

      {/* Footer */}
      <footer className="mt-16 border-t border-white/5 bg-dark-secondary/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-6 w-6 bg-gradient-to-r from-orange-400 to-blue-400 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">S</span>
                </div>
                <div className="h-6 w-px bg-white/20"></div>
                <span className="text-base bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent whitespace-nowrap">
                  SEPE Student Portal
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Nền tảng học tập và thi đấu cho sinh viên công nghệ thông tin.
              </p>
            </div>

            <div>
              <h4 className="text-white mb-4">Học tập</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Hackathons
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Đội thi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Bài nộp
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Bảng xếp hạng
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
              © 2024 SEPE Student Portal. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentLayout;
