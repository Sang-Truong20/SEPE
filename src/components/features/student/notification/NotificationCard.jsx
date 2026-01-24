import { CheckOutlined, ClockCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../../../constants';

dayjs.extend(relativeTime);
dayjs.extend(utc);



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

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  // Convert UTC to UTC+7
  return dayjs.utc(timestamp).utcOffset(7).fromNow();
};

const formatFullDateTime = (timestamp) => {
  if (!timestamp) return '';
  // Convert UTC to UTC+7
  return dayjs.utc(timestamp).utcOffset(7).format('DD/MM/YYYY HH:mm');
};

const NotificationCard = ({
  notification,
  onMarkAsRead,
  onAcceptInvite,
  onRejectInvite,
  isMarkingRead,
  isAcceptingInvite,
  isRejectingInvite,
}) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const isTeamInvite =
    notification.type === 'TEAM_INVITE' ||
    notification.type === 'team_invite' ||
    notification.type?.toLowerCase().includes('team');
  const isUnread = !notification.isRead;
  const notificationId = notification.notificationId || notification.id;

  return (
    <Card
      className={`group relative transition-all duration-300 cursor-pointer overflow-hidden ${
        isUnread
          ? `${getNotificationColor(notification.type)} border-l-4 border-l-blue-500`
          : 'bg-card-background/50 border-card-border/50 hover:bg-card-background/70'
      } hover:shadow-xl hover:shadow-blue-500/10 hover:scale-[1.01] hover:border-blue-500/30`}
      onClick={() => {
        if (isUnread) {
          onMarkAsRead(notificationId);
        }
        setExpanded((prev) => !prev);
      }}
    >
      {isUnread && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-400 rounded-l-lg" />
      )}

      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <h4
                  className={`${
                    isUnread
                      ? 'text-white font-semibold'
                      : 'text-muted-foreground font-medium'
                  } text-base leading-tight line-clamp-2`}
                >
                  {notification.title || notification.message}
                </h4>

              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                {notification.message || notification.content}
              </p>
               <div className="flex items-center gap-3">
                 <span
                   className="text-xs text-muted-foreground font-medium flex items-center gap-1.5"
                   title={formatFullDateTime(
                     notification.sentAt ||
                       notification.createdAt ||
                       notification.createdDate ||
                       notification.timestamp,
                   )}
                 >
                   <ClockCircleOutlined className="text-[10px]" />
                   {formatTime(
                     notification.sentAt ||
                       notification.createdAt ||
                       notification.createdDate ||
                       notification.timestamp,
                   )}
                 </span>
                 <span className="text-xs text-muted-foreground/60">
                   {formatFullDateTime(
                     notification.sentAt ||
                       notification.createdAt ||
                       notification.createdDate ||
                       notification.timestamp,
                   )}
                 </span>
               </div>
            </div>
          </div>

          {isTeamInvite && (
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 flex-wrap">
              <Popconfirm
                title="Chấp nhận lời mời?"
                description="Bạn có chắc chắn muốn tham gia đội này?"
                onConfirm={() => onAcceptInvite(notification)}
                okText="Chấp nhận"
                cancelText="Hủy"
                okButtonProps={{
                  loading: isAcceptingInvite,
                }}
              >
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  className="bg-green-500 hover:bg-green-600 border-0 shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  Chấp nhận
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Từ chối lời mời?"
                description="Bạn có chắc chắn muốn từ chối lời mời này?"
                onConfirm={() => onRejectInvite(notification)}
                okText="Từ chối"
                cancelText="Hủy"
                okButtonProps={{
                  danger: true,
                  loading: isRejectingInvite,
                }}
              >
                <Button
                  danger
                  size="small"
                  icon={<CloseOutlined />}
                  className="shadow-lg shadow-red-500/10 hover:shadow-red-500/20 transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  Từ chối
                </Button>
              </Popconfirm>
              {notification.teamId && (
                <Button
                  size="small"
                  className="border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all"
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
            <div className="mt-4 pt-4 border-t border-white/10">
              <Button
                type="text"
                size="small"
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 px-3 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notificationId);
                }}
                loading={isMarkingRead}
              >
                Đánh dấu đã đọc
              </Button>
            </div>
          )}

          {expanded && (
            <div className="mt-4 p-4 rounded-lg border border-white/10 bg-white/5 text-sm text-gray-200 space-y-2">
              <div className="flex justify-between gap-2">
                <span className="text-gray-400">Loại</span>
                <span className="text-white">{notification.type || 'N/A'}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-400">Tiêu đề</span>
                <span className="text-white text-right">{notification.title || notification.message || '—'}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-400">Nội dung</span>
                <span className="text-white text-right">{notification.message || notification.content || '—'}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-400">Thời gian</span>
                <span className="text-white text-right">
                  {formatFullDateTime(
                    notification.sentAt ||
                      notification.createdAt ||
                      notification.createdDate ||
                      notification.timestamp,
                  ) || '—'}
                </span>
              </div>
              {(notification.teamName || notification.teamId) && (
                <div className="flex justify-between gap-2">
                  <span className="text-gray-400">Đội</span>
                  <span className="text-white text-right">
                    {notification.teamName || notification.teamId}
                  </span>
                </div>
              )}
              {notification.relatedId && (
                <div className="flex justify-between gap-2">
                  <span className="text-gray-400">Liên quan ID</span>
                  <span className="text-white text-right">{notification.relatedId}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default NotificationCard;

