import { Card, Empty, Spin } from 'antd';
import NotificationCard from './NotificationCard';
import NotificationFilters from './NotificationFilters';

const NotificationList = ({
  notifications,
  filter,
  onFilterChange,
  unreadCount,
  isLoading,
  onMarkAsRead,
  onAcceptInvite,
  onRejectInvite,
  isMarkingRead,
  isAcceptingInvite,
  isRejectingInvite,
}) => {
  return (
    <Card className="bg-card-background border border-card-border backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">
          Thông báo gần đây
        </h2>
        <NotificationFilters
          filter={filter}
          onFilterChange={onFilterChange}
          unreadCount={unreadCount}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.notificationId || notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onAcceptInvite={onAcceptInvite}
              onRejectInvite={onRejectInvite}
              isMarkingRead={isMarkingRead}
              isAcceptingInvite={isAcceptingInvite}
              isRejectingInvite={isRejectingInvite}
            />
          ))}
        </div>
      ) : (
        <Empty
          description="Không có thông báo nào"
          className="py-12"
        />
      )}
    </Card>
  );
};

export default NotificationList;

