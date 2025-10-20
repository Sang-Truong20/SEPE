import {
  TrophyOutlined,
  TeamOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BarChartOutlined,
  PlusOutlined,
  EyeOutlined,
  CalendarOutlined,
  StarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  BellOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Row, Statistic, Table, Tag, Avatar, Space, Badge, Progress } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../constants';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Hackathons tham gia', value: '5', icon: TrophyOutlined, change: '+1' },
    { label: 'Đội đang tham gia', value: '2', icon: TeamOutlined, change: '+0' },
    { label: 'Bài nộp', value: '8', icon: FileTextOutlined, change: '+2' },
    { label: 'Điểm trung bình', value: '87.5/100', icon: BarChartOutlined, change: '+5.2' },
  ];

  const activeHackathons = [
    {
      key: '1',
      name: 'AI Revolution 2024',
      status: 'active',
      deadline: '2024-03-17 23:59',
      team: 'Code Crusaders',
      progress: 85,
      prize: '$50,000',
    },
    {
      key: '2',
      name: 'Web3 Future Hackathon',
      status: 'upcoming',
      deadline: '2024-04-01 09:00',
      team: 'Blockchain Heroes',
      progress: 45,
      prize: '$25,000',
    },
  ];

  const recentSubmissions = [
    {
      key: '1',
      project: 'AI-Powered Code Assistant',
      hackathon: 'AI Revolution 2024',
      submitted: '2024-03-16 14:30',
      status: 'submitted',
      score: '92.3/100',
    },
    {
      key: '2',
      project: 'Smart City Dashboard',
      hackathon: 'AI Revolution 2024',
      submitted: '2024-03-15 18:45',
      status: 'under review',
      score: 'Not scored',
    },
  ];

  const currentTeam = {
    name: 'Code Crusaders',
    project: 'Smart City Traffic Management',
    members: 4,
    progress: 75,
    deadline: '5 ngày',
    status: 'Đang phát triển'
  };

  const recentActivity = [
    { action: 'Nộp milestone 3', time: '2 giờ trước', type: 'success' },
    { action: 'Tham gia meeting với mentor', time: '1 ngày trước', type: 'info' },
    { action: 'Cập nhật README.md', time: '2 ngày trước', type: 'neutral' },
    { action: 'Tạo branch feature/ui', time: '3 ngày trước', type: 'neutral' }
  ];

  const upcomingDeadlines = [
    {
      title: 'AI Revolution 2024 - Submission Deadline',
      time: '2 days left',
      color: 'text-orange-400',
    },
    {
      title: 'Team Formation - Web3 Hackathon',
      time: '5 days left',
      color: 'text-blue-400',
    },
  ];

  const hackathonColumns = [
    {
      title: 'Hackathon',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span className="font-medium text-text-primary">{text}</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        if (status === 'active') color = 'green';
        else if (status === 'upcoming') color = 'blue';
        else color = 'default';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Đội',
      dataIndex: 'team',
      key: 'team',
    },
    {
      title: 'Tiến độ',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      ),
    },
    {
      title: 'Giải thưởng',
      dataIndex: 'prize',
      key: 'prize',
      render: (text) => (
        <span className="text-text-accent font-medium">{text}</span>
      ),
    },
    {
      title: 'Hạn nộp',
      dataIndex: 'deadline',
      key: 'deadline',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: () => (
        <Button
          type="text"
          className="text-white hover:text-primary"
          icon={<EyeOutlined />}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const submissionColumns = [
    {
      title: 'Dự án',
      dataIndex: 'project',
      key: 'project',
      render: (text) => (
        <span className="font-medium text-text-primary">{text}</span>
      ),
    },
    {
      title: 'Hackathon',
      dataIndex: 'hackathon',
      key: 'hackathon',
    },
    {
      title: 'Đã nộp',
      dataIndex: 'submitted',
      key: 'submitted',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        if (status === 'submitted') color = 'green';
        else if (status === 'under review') color = 'gold';
        else color = 'default';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Điểm',
      dataIndex: 'score',
      key: 'score',
      render: (text) => (
        <span className={text === 'Not scored' ? 'text-gray-500' : 'text-primary'}>
          {text}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            Dashboard Sinh viên
          </h1>
          <p className="text-muted-foreground mt-2">
            Quản lý dự án và theo dõi tiến độ của bạn
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 bg-white/5 hover:bg-white/10"
          >
            <CalendarOutlined className="w-4 h-4 mr-2" />
            Lịch
          </Button>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 bg-white/5 hover:bg-white/10"
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
          <Card key={index} className="bg-card-background border border-card-border backdrop-blur-xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl text-white">{stat.value}</p>
                  <div className="flex items-center text-sm text-green-400">
                    <span className="mr-1">{stat.change}</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Current Team Project */}
        <div className="lg:col-span-2">
          <Card className="bg-card-background border border-card-border backdrop-blur-xl">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <TeamOutlined className="w-5 h-5 mr-2 text-blue-400" />
                <span className="text-xl font-semibold text-white">Dự Án Hiện Tại</span>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl text-white">{currentTeam.name}</h3>
                  <p className="text-muted-foreground">{currentTeam.project}</p>
                </div>
                <Tag color="green" className="border-green-500/30 text-green-300">
                  {currentTeam.status}
                </Tag>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tiến độ dự án</span>
                  <span className="text-white">{currentTeam.progress}%</span>
                </div>
                <Progress percent={currentTeam.progress} showInfo={false} className="bg-white/10" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <TeamOutlined className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-muted-foreground">{currentTeam.members} thành viên</span>
                </div>
                <div className="flex items-center">
                  <ClockCircleOutlined className="w-4 h-4 text-orange-400 mr-2" />
                  <span className="text-muted-foreground">Còn {currentTeam.deadline}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => navigate(PATH_NAME.STUDENT_TEAMS)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0"
                >
                  Xem Dự Án
                </Button>
                <Button
                  onClick={() => navigate(PATH_NAME.STUDENT_SUBMISSIONS)}
                  variant="outline"
                  className="border-white/20 bg-white/5 hover:bg-white/10"
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
              <span className="text-xl font-semibold text-white">Hoạt Động Gần Đây</span>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-400' :
                    activity.type === 'info' ? 'bg-blue-400' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-400/10 border-blue-500/20 backdrop-blur-xl">
        <div className="p-6">
          <h3 className="text-xl mb-4 text-white">Thao Tác Nhanh</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => navigate(PATH_NAME.STUDENT_HACKATHONS)}
              variant="outline"
              className="border-white/20 bg-white/5 hover:bg-white/10 h-auto py-4 flex flex-col items-center"
            >
              <TrophyOutlined className="w-6 h-6 mb-2 text-blue-400" />
              <span>Tham Gia Hackathon</span>
            </Button>
            <Button
              onClick={() => navigate(PATH_NAME.STUDENT_TEAMS)}
              variant="outline"
              className="border-white/20 bg-white/5 hover:bg-white/10 h-auto py-4 flex flex-col items-center"
            >
              <TeamOutlined className="w-6 h-6 mb-2 text-green-400" />
              <span>Quản Lý Đội</span>
            </Button>
            <Button
              onClick={() => navigate(PATH_NAME.STUDENT_SUBMISSIONS)}
              variant="outline"
              className="border-white/20 bg-white/5 hover:bg-white/10 h-auto py-4 flex flex-col items-center"
            >
              <FileTextOutlined className="w-6 h-6 mb-2 text-purple-400" />
              <span>Nộp Dự Án</span>
            </Button>
            <Button
              onClick={() => navigate(PATH_NAME.STUDENT_LEADERBOARD)}
              variant="outline"
              className="border-white/20 bg-white/5 hover:bg-white/10 h-auto py-4 flex flex-col items-center"
            >
              <BarChartOutlined className="w-6 h-6 mb-2 text-yellow-400" />
              <span>Xem Kết Quả</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentDashboard;
