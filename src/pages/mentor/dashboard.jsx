import {
  BookOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  RiseOutlined,
  TrophyOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Avatar, Badge, Button, Card, Progress, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../constants';

const MentorDashboard = () => {
  const navigate = useNavigate();

  // Mock data
  const mentorInfo = {
    name: 'Nguyễn Văn Mentor',
    email: 'mentor@fpt.edu.vn',
    expertise: ['AI/ML', 'Full-stack Development', 'Cloud Computing'],
    yearsOfExperience: 8,
    company: 'FPT Software',
  };

  const myTeams = [
    {
      id: '1',
      name: 'Tech Innovators',
      hackathon: 'SEAL Hackathon 2024 - HCM',
      members: 5,
      progress: 75,
      nextMeeting: '2024-10-10 14:00',
      status: 'on-track',
      lastUpdate: '2 giờ trước',
    },
    {
      id: '2',
      name: 'AI Warriors',
      hackathon: 'SEAL Hackathon 2024 - HCM',
      members: 4,
      progress: 45,
      nextMeeting: '2024-10-11 10:00',
      status: 'needs-attention',
      lastUpdate: '1 ngày trước',
    },
    {
      id: '3',
      name: 'Blockchain Pioneers',
      hackathon: 'Tech Challenge 2024',
      members: 5,
      progress: 90,
      status: 'excellent',
      lastUpdate: '5 giờ trước',
    },
  ];

  const upcomingMeetings = [
    {
      id: '1',
      teamName: 'Tech Innovators',
      time: 'Hôm nay, 14:00',
      duration: '1 giờ',
      topic: 'Sprint Review & Demo',
      type: 'review',
    },
    {
      id: '2',
      teamName: 'AI Warriors',
      time: 'Ngày mai, 10:00',
      duration: '45 phút',
      topic: 'Technical Guidance - ML Model',
      type: 'feedback',
    },
    {
      id: '3',
      teamName: 'Blockchain Pioneers',
      time: '12/10, 15:00',
      duration: '30 phút',
      topic: 'Final Preparation',
      type: 'planning',
    },
  ];

  const stats = [
    {
      label: 'Teams Hướng Dẫn',
      value: myTeams.length,
      icon: TeamOutlined,
      color: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-400',
    },
    {
      label: 'Cuộc Họp Tuần Này',
      value: 5,
      icon: CalendarOutlined,
      color: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-400',
    },
    {
      label: 'Tài Nguyên Chia Sẻ',
      value: 24,
      icon: BookOutlined,
      color: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-400',
    },
    {
      label: 'Tiến Độ Trung Bình',
      value: '70%',
      icon: RiseOutlined,
      color: 'from-yellow-500/20 to-orange-500/20',
      iconColor: 'text-yellow-400',
    },
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'feedback',
      team: 'Tech Innovators',
      message: 'Đã đánh giá bài nộp Sprint 2',
      time: '2 giờ trước',
    },
    {
      id: '2',
      type: 'meeting',
      team: 'AI Warriors',
      message: 'Cuộc họp technical review hoàn thành',
      time: '1 ngày trước',
    },
    {
      id: '3',
      type: 'resource',
      team: 'Tất cả teams',
      message: "Đã chia sẻ tài liệu 'Best Practices for API Design'",
      time: '2 ngày trước',
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'excellent':
        return <Tag color="success">Xuất sắc</Tag>;
      case 'on-track':
        return <Tag color="processing">Đúng tiến độ</Tag>;
      case 'needs-attention':
        return <Tag color="warning">Cần chú ý</Tag>;
      default:
        return null;
    }
  };

  const getMeetingTypeBadge = (type) => {
    switch (type) {
      case 'review':
        return <Tag color="blue">Review</Tag>;
      case 'planning':
        return <Tag color="purple">Planning</Tag>;
      case 'feedback':
        return <Tag color="green">Feedback</Tag>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Mentor Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Chào mừng trở lại, {mentorInfo.name}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-white">{mentorInfo.company}</p>
            <p className="text-xs text-gray-400">
              {mentorInfo.yearsOfExperience} năm kinh nghiệm
            </p>
          </div>
          <Avatar
            size={48}
            className="bg-gradient-to-r from-green-500 to-emerald-500"
          >
            {mentorInfo.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </Avatar>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-all duration-200 hover:scale-105 border-0 bg-white/5 backdrop-blur-xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="text-2xl text-white mt-1">{stat.value}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* My Teams */}
        <div className="lg:col-span-2">
          <Card
            title="Teams Đang Hướng Dẫn"
            extra={
              <Button
                type="link"
                onClick={() => navigate(PATH_NAME.MENTOR_MY_TEAMS)}
                className="text-green-400"
              >
                Xem tất cả
              </Button>
            }
            className="border-0 bg-white/5 backdrop-blur-xl"
          >
            <div className="space-y-4">
              {myTeams.map((team) => (
                <div
                  key={team.id}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => navigate(PATH_NAME.MENTOR_MY_TEAMS)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white">{team.name}</h4>
                        {getStatusBadge(team.status)}
                      </div>
                      <p className="text-sm text-gray-400">{team.hackathon}</p>
                    </div>
                    <Badge
                      count={team.members}
                      showZero
                      className="bg-white/10 text-white"
                    >
                      <TeamOutlined className="text-gray-400" />
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Tiến độ</span>
                      <span className="text-white">{team.progress}%</span>
                    </div>
                    <Progress
                      percent={team.progress}
                      strokeColor={{
                        '0%': '#06b6d4',
                        '100%': '#3b82f6',
                      }}
                      showInfo={false}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-3 text-sm">
                    {team.nextMeeting ? (
                      <div className="flex items-center gap-1 text-green-400">
                        <ClockCircleOutlined />
                        <span>
                          Họp:{' '}
                          {new Date(team.nextMeeting).toLocaleString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Chưa có lịch họp</span>
                    )}
                    <span className="text-gray-400">
                      Cập nhật: {team.lastUpdate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Upcoming Meetings */}
        <div>
          <Card
            title="Lịch Họp Sắp Tới"
            className="border-0 bg-white/5 backdrop-blur-xl"
          >
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="text-sm text-white mb-1">
                        {meeting.teamName}
                      </h5>
                      <p className="text-xs text-gray-400">{meeting.topic}</p>
                    </div>
                    {getMeetingTypeBadge(meeting.type)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                    <div className="flex items-center gap-1">
                      <ClockCircleOutlined />
                      <span>{meeting.time}</span>
                    </div>
                    <span>{meeting.duration}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="link"
              onClick={() => navigate(PATH_NAME.MENTOR_SCHEDULE)}
              className="w-full mt-4 text-green-400"
            >
              Xem lịch đầy đủ
            </Button>
          </Card>
        </div>
      </div>

      {/* Recent Activities */}
      <Card
        title="Hoạt Động Gần Đây"
        className="border-0 bg-white/5 backdrop-blur-xl"
      >
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center shrink-0">
                {activity.type === 'feedback' && (
                  <CheckCircleOutlined className="text-green-400" />
                )}
                {activity.type === 'meeting' && (
                  <CalendarOutlined className="text-emerald-400" />
                )}
                {activity.type === 'resource' && (
                  <FileTextOutlined className="text-purple-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white">{activity.message}</p>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{activity.team}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20 backdrop-blur-xl mt-6">
        <h3 className="text-xl mb-4 text-white">Thao Tác Nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={() => navigate(PATH_NAME.MENTOR_MY_TEAMS)}
            className="h-auto py-4 flex flex-col items-center border-white/20 bg-white/5 hover:bg-white/10"
          >
            <TeamOutlined className="w-6 h-6 mb-2 text-green-400" />
            <span>Quản Lý Teams</span>
          </Button>

          <Button
            onClick={() => navigate(PATH_NAME.MENTOR_SCHEDULE)}
            className="h-auto py-4 flex flex-col items-center border-white/20 bg-white/5 hover:bg-white/10"
          >
            <CalendarOutlined className="w-6 h-6 mb-2 text-emerald-400" />
            <span>Đặt Lịch Họp</span>
          </Button>

          <Button
            onClick={() => navigate(PATH_NAME.MENTOR_RESOURCES)}
            className="h-auto py-4 flex flex-col items-center border-white/20 bg-white/5 hover:bg-white/10"
          >
            <BookOutlined className="w-6 h-6 mb-2 text-purple-400" />
            <span>Chia Sẻ Tài Nguyên</span>
          </Button>

          <Button
            onClick={() => navigate(PATH_NAME.MENTOR_MY_TEAMS)}
            className="h-auto py-4 flex flex-col items-center border-white/20 bg-white/5 hover:bg-white/10"
          >
            <TrophyOutlined className="w-6 h-6 mb-2 text-orange-400" />
            <span>Tìm Teams Mới</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MentorDashboard;





