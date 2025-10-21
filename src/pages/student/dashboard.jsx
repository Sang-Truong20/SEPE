import {
  BarChartOutlined,
  BellOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  SettingOutlined,
  TeamOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { Badge, Button, Card, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../constants';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      label: 'Hackathons tham gia',
      value: '5',
      icon: TrophyOutlined,
      change: '+1',
    },
    {
      label: 'Đội đang tham gia',
      value: '2',
      icon: TeamOutlined,
      change: '+0',
    },
    { label: 'Bài nộp', value: '8', icon: FileTextOutlined, change: '+2' },
    {
      label: 'Điểm trung bình',
      value: '87.5/100',
      icon: BarChartOutlined,
      change: '+5.2',
    },
  ];

  const currentTeam = {
    name: 'Code Crusaders',
    project: 'Smart City Traffic Management',
    members: 4,
    progress: 75,
    deadline: '5 ngày',
    status: 'Đang phát triển',
  };

  const recentActivity = [
    { action: 'Nộp milestone 3', time: '2 giờ trước', type: 'success' },
    {
      action: 'Tham gia meeting với mentor',
      time: '1 ngày trước',
      type: 'info',
    },
    { action: 'Cập nhật README.md', time: '2 ngày trước', type: 'neutral' },
    { action: 'Tạo branch feature/ui', time: '3 ngày trước', type: 'neutral' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            Dashboard Sinh viên
          </h1>
          <p className="text-gray-400 mt-2">
            Quản lý dự án và theo dõi tiến độ của bạn
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button className="border-white/20 bg-white/5 hover:bg-white/10 hover:border-green-400/30 text-white hover:text-orange-300 transition-all duration-200 hover:scale-105 shadow-lg">
            <CalendarOutlined className="w-4 h-4 mr-2" />
            Lịch
          </Button>
          <div className="relative">
            <Button
              className="border-white/20 bg-white/5 hover:bg-white/10 hover:border-blue-400/30 text-white hover:text-blue-300 transition-all duration-200 hover:scale-105 shadow-lg"
              onClick={() => navigate(PATH_NAME.STUDENT_NOTIFICATIONS)}
            >
              <BellOutlined className="w-4 h-4" />
              <Badge count={3} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-all duration-200 hover:scale-105 border-0"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="text-2xl text-white font-semibold">
                    {stat.value}
                  </p>
                  <div className="flex items-center text-sm text-green-400">
                    <span className="mr-1">{stat.change}</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-lg flex items-center justify-center border border-white/10">
                  <stat.icon className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Current Team Project */}
        <div className="lg:col-span-2">
          <Card className="border-0 hover:shadow-lg transition-all duration-200">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <TeamOutlined className="w-5 h-5 mr-2 text-blue-400" />
                <span className="text-xl font-semibold text-white">
                  Dự Án Hiện Tại
                </span>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl text-white">{currentTeam.name}</h3>
                  <p className="text-gray-400">{currentTeam.project}</p>
                </div>
                <Tag
                  color="green"
                  className="border-green-500/30 text-green-300"
                >
                  {currentTeam.status}
                </Tag>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tiến độ dự án</span>
                  <span className="text-white">{currentTeam.progress}%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-400 to-emerald-400 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${currentTeam.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <TeamOutlined className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-gray-400">
                    {currentTeam.members} thành viên
                  </span>
                </div>
                <div className="flex items-center">
                  <ClockCircleOutlined className="w-4 h-4 text-orange-400 mr-2" />
                  <span className="text-gray-400">
                    Còn {currentTeam.deadline}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => navigate(PATH_NAME.STUDENT_TEAMS)}
                  className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  Xem Dự Án
                </Button>
                <Button
                  onClick={() => navigate(PATH_NAME.STUDENT_SUBMISSIONS)}
                  className="border-white/20 bg-white/5 hover:bg-white/10 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  Nộp Bài
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-card-background border border-card-border backdrop-blur-xl">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <SettingOutlined className="w-5 h-5 mr-2 text-green-400" />
              <span className="text-xl font-semibold text-white">
                Hoạt Động Gần Đây
              </span>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'success'
                        ? 'bg-green-400'
                        : activity.type === 'info'
                          ? 'bg-blue-400'
                          : 'bg-gray-400'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 hover:shadow-lg transition-all duration-200">
        <div className="p-6">
          <h3 className="text-xl mb-6 text-white font-semibold">
            Thao Tác Nhanh
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => navigate(PATH_NAME.STUDENT_HACKATHONS)}
              className="border-white/10 bg-white/5 hover:bg-gradient-to-br hover:from-green-500/10 hover:to-emerald-500/10 hover:border-green-400/30 text-white h-auto py-6 px-4 flex flex-col items-center transition-all duration-200 hover:scale-105 hover:shadow-lg group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <TrophyOutlined className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium">Tham Gia Hackathon</span>
            </Button>
            <Button
              onClick={() => navigate(PATH_NAME.STUDENT_TEAMS)}
              className="border-white/10 bg-white/5 hover:bg-gradient-to-br hover:from-green-500/10 hover:to-emerald-500/10 hover:border-green-400/30 text-white h-auto py-6 px-4 flex flex-col items-center transition-all duration-200 hover:scale-105 hover:shadow-lg group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <TeamOutlined className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium">Quản Lý Đội</span>
            </Button>
            <Button
              onClick={() => navigate(PATH_NAME.STUDENT_SUBMISSIONS)}
              className="border-white/10 bg-white/5 hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-pink-500/10 hover:border-purple-400/30 text-white h-auto py-6 px-4 flex flex-col items-center transition-all duration-200 hover:scale-105 hover:shadow-lg group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <FileTextOutlined className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium">Nộp Dự Án</span>
            </Button>
            <Button
              onClick={() => navigate(PATH_NAME.STUDENT_LEADERBOARD)}
              className="border-white/10 bg-white/5 hover:bg-gradient-to-br hover:from-yellow-500/10 hover:to-orange-500/10 hover:border-yellow-400/30 text-white h-auto py-6 px-4 flex flex-col items-center transition-all duration-200 hover:scale-105 hover:shadow-lg group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <BarChartOutlined className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium">Xem Kết Quả</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentDashboard;
