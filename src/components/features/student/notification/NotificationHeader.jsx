import { Button } from 'antd';

const NotificationHeader = ({ unreadCount, onMarkAllAsRead, isMarkingAll }) => {
  return (
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
            onClick={onMarkAllAsRead}
            loading={isMarkingAll}
            className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
          >
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotificationHeader;

