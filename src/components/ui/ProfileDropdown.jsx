import { ChevronDown, LogOut, User } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../hooks/useLogout';

const ProfileDropdown = ({
  userData,
  profilePath,
  profileLabel = 'Hồ sơ cá nhân',
  profileIcon = User,
  onCloseNotification,
}) => {
  const navigate = useNavigate();
  const mutationLogout = useLogout();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isDropdownOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
    if (onCloseNotification) {
      onCloseNotification();
    }
  };

  const handleProfileClick = () => {
    if (profilePath) {
      navigate(profilePath);
    }
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    mutationLogout();
  };

  // Get avatar content - either initials or User icon
  const getAvatarContent = () => {
    if (userData.useInitials && userData.name) {
      const initials = userData.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
      return (
        <span className="text-white font-semibold text-sm">{initials}</span>
      );
    }
    return <User className="w-4 h-4 text-white" />;
  };

  const getLargeAvatarContent = () => {
    if (userData.useInitials && userData.name) {
      const initials = userData.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
      return (
        <span className="text-white font-semibold text-xl">{initials}</span>
      );
    }
    return <User className="w-6 h-6 text-white" />;
  };

  const ProfileIcon = profileIcon;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="flex items-center space-x-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400/20"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
          {getAvatarContent()}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-white transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isDropdownOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
            onMouseDown={(e) => e.preventDefault()}
          />

          {/* Dropdown Content */}
          <div
            className="absolute right-0 top-full mt-2 w-72 bg-darkv2-secondary/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 transition-all duration-200 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User Info Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                  {getLargeAvatarContent()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {userData.name || '—'}
                  </p>
                  <p className="text-muted-foreground text-sm truncate">
                    {userData.email || '—'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {userData.role && (
                      <span className="text-green-400 text-xs font-medium">
                        {userData.role}
                      </span>
                    )}
                    {userData.isVerified !== undefined && (
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          userData.isVerified
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                            : 'bg-red-500/20 text-red-300 border border-red-400/30'
                        }`}
                      >
                        {userData.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {profilePath && (
                <>
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                  >
                    <ProfileIcon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-white">{profileLabel}</span>
                  </button>

                  <div className="border-t border-white/10 my-2"></div>
                </>
              )}

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
  );
};

export default ProfileDropdown;

