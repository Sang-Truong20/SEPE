import { Card } from 'antd';
import {
  BellOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  TrophyOutlined,
} from '@ant-design/icons';

const NotificationStats = ({ total, unread, hackathons, teamInvites }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="bg-card-background border border-card-border backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <BellOutlined className="text-blue-400 text-xl" />
          </div>
          <div>
            <p className="text-2xl text-text-primary font-bold">{total}</p>
            <p className="text-sm text-muted-foreground">Tổng số</p>
          </div>
        </div>
      </Card>

      <Card className="bg-card-background border border-card-border backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-red-500/10 rounded-lg">
            <ExclamationCircleOutlined className="text-red-400 text-xl" />
          </div>
          <div>
            <p className="text-2xl text-text-primary font-bold">{unread}</p>
            <p className="text-sm text-muted-foreground">Chưa đọc</p>
          </div>
        </div>
      </Card>

      <Card className="bg-card-background border border-card-border backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-yellow-500/10 rounded-lg">
            <TrophyOutlined className="text-yellow-400 text-xl" />
          </div>
          <div>
            <p className="text-2xl text-text-primary font-bold">{hackathons}</p>
            <p className="text-sm text-muted-foreground">Hackathons</p>
          </div>
        </div>
      </Card>

      <Card className="bg-card-background border border-card-border backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-green-500/10 rounded-lg">
            <TeamOutlined className="text-green-400 text-xl" />
          </div>
          <div>
            <p className="text-2xl text-text-primary font-bold">{teamInvites}</p>
            <p className="text-sm text-muted-foreground">Lời mời đội</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotificationStats;

