import { Button } from 'antd';

const NotificationFilters = ({ filter, onFilterChange, unreadCount }) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        type={filter === 'all' ? 'primary' : 'default'}
        size="small"
        onClick={() => onFilterChange('all')}
      >
        Tất cả
      </Button>
      <Button
        type={filter === 'unread' ? 'primary' : 'default'}
        size="small"
        onClick={() => onFilterChange('unread')}
      >
        Chưa đọc ({unreadCount})
      </Button>
      <Button
        type={filter === 'team' ? 'primary' : 'default'}
        size="small"
        onClick={() => onFilterChange('team')}
      >
        Đội
      </Button>
      <Button
        type={filter === 'hackathon' ? 'primary' : 'default'}
        size="small"
        onClick={() => onFilterChange('hackathon')}
      >
        Hackathons
      </Button>
    </div>
  );
};

export default NotificationFilters;

