import { useState } from 'react';
import { Modal, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../constants';

const NotificationBell = ({ count = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      title: 'Luật mới',
      message: 'Luật mới được ban hành',
      time: '5 phút trước',
      read: false,
    },
    {
      id: 2,
      title: 'Luật mới',
      message: 'Luật mới được ban hành',
      time: '1 giờ trước',
      read: false,
    },
    {
      id: 3,
      title: 'Luật mới',
      message: 'Luật mới được ban hành',
      time: '2 giờ trước',
      read: true,
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Thông báo</h3>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50/30' : ''
                    }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelected(notification);
                }}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 ml-2" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  Không có thông báo mới
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-200">
              <button
                className="text-blue-600 text-sm font-medium hover:text-blue-700 w-full text-center"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpen(false);
                  navigate(PATH_NAME.STUDENT_NOTIFICATIONS || '/student/notifications');
                }}
              >
                Xem tất cả thông báo
              </button>
            </div>
          </div>
        </>
      )}

      <Modal
        open={!!selected}
        title={selected?.title || 'Chi tiết thông báo'}
        onCancel={() => setSelected(null)}
        footer={[
          <Button key="close" type="primary" onClick={() => setSelected(null)}>
            Đóng
          </Button>,
        ]}
      >
        <div className="space-y-2">
          <div className="text-gray-800">{selected?.message}</div>
          <div className="text-sm text-gray-500">{selected?.time}</div>
        </div>
      </Modal>
    </div>
  );
};

export default NotificationBell;
