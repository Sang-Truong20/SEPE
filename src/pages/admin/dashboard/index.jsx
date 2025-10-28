import {
  BarChartOutlined,

  FileTextOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons';


const HackathonDashboard = () => {
  const stats = [
    {
      icon: <UserOutlined className="text-3xl" />,
      value: '1247',
      label: 'Tổng người dùng',
      color:
        'border border-white/10 bg-white/5 hover:bg-white/10 transition-all',
      iconColor: 'text-primary',
    },
    {
      icon: <TrophyOutlined className="text-3xl" />,
      value: '3',
      label: 'Hackathon đang diễn ra',
      color:
        'border border-white/10 bg-white/5 hover:bg-white/10 transition-all',
      iconColor: 'text-primary',
    },
    {
      icon: <FileTextOutlined className="text-3xl" />,
      value: '89',
      label: 'Bài nộp',
      color:
        'border border-white/10 bg-white/5 hover:bg-white/10 transition-all',
      iconColor: 'text-primary',
    },
    {
      icon: <BarChartOutlined className="text-3xl" />,
      value: '12',
      label: 'Chờ đánh giá',
      color:
        'border border-white/10 bg-white/5 hover:bg-white/10 transition-all',
      iconColor: 'text-primary',
    },
  ];

  const activities = [
    {
      text: 'New user registration: Alex Johnson',
      time: '2 minutes ago',
      color: 'bg-primary/20',
    },
    {
      text: 'Submission received: AI Code Assistant',
      time: '15 minutes ago',
      color: 'bg-secondary/20',
    },
    {
      text: 'Judge completed review: SmartCity AI',
      time: '1 hour ago',
      color: 'bg-tertiary/20',
    },
  ];

  const systemHealth = [
    { label: 'Server Status', status: 'Online', color: 'text-primary' },
    { label: 'Database', status: 'Healthy', color: 'text-primary' },
    { label: 'File Storage', status: '85% Full', color: 'text-secondary' },
    { label: 'API Status', status: 'Operational', color: 'text-primary' },
  ];

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">
              Bảng điều khiển Quản trị
            </h1>
            <p className="text-gray-400">
              Quản lý hackathon, người dùng và cài đặt nền tảng
            </p>
          </div>

        </div>
      </div>

      <>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`${stat.color} border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center gap-4">
                <div className={stat.iconColor}>{stat.icon}</div>
                <div>
                  <div className="text-3xl font-bold text-text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity */}
          <div className="lg:col-span-2 bg-dark-secondary border border-dark-accent rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-text-primary">
              Hoạt động gần đây
            </h2>
            <div className="space-y-4">
              {activities.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-2 rounded hover:bg-white/5 transition-colors"
                >
                  <div
                    className={`w-2 h-2 ${activity.color} rounded-full mt-2 flex-shrink-0`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-text-primary font-medium">
                      {activity.text}
                    </p>
                    <p className="text-text-secondary text-sm mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-dark-secondary border border-dark-accent rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-text-primary">
              System Health
            </h2>
            <div className="space-y-4">
              {systemHealth.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-text-secondary">{item.label}</span>
                  <span className={`font-semibold ${item.color}`}>
                      {item.status}
                    </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>

    </div>
  );
};

export default HackathonDashboard;
