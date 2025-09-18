import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserMenu = ({ user, onLogout, mobile = false }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuClick = (path) => {
    if (path) {
      navigate(path);
    }
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsDropdownOpen(false);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    {
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      label: 'Thông tin cá nhân',
      path: '/member/info',
    },
    {
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m6 4H6a2 2 0 01-2-2v-6a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 11V7a4 4 0 118 0v4"
          />
        </svg>
      ),
      label: 'Mật khẩu',
      path: '/member/change-password',
    },
    {
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      label: 'Gói dịch vụ',
      path: '/member/package',
    },
  ];

  if (mobile) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-xs font-semibold">
                {getInitials(user.name)}
              </span>
            )}
          </div>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>

            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuClick(item.path)}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            <hr className="my-2 border-gray-200" />

            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
      >
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center ring-2 ring-transparent group-hover:ring-blue-200 transition-all duration-200">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-white text-sm font-semibold">
              {getInitials(user.name)}
            </span>
          )}
        </div>

        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>

        <svg
          className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuClick(item.path)}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}

          <hr className="my-2 border-gray-200" />

          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Đăng xuất</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
