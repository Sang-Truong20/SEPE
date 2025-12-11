import {
  TeamOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  AlertOutlined,
  MailOutlined,
  MessageOutlined,
  TrophyOutlined,
  FileTextOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { Badge, Button, Card, Input, Progress, Tag, Avatar, Tabs } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../constants';

const MentorMyTeams = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Mock data
  const myTeams = [
    {
      id: '1',
      name: 'Tech Innovators',
      hackathon: 'SEAL Hackathon 2024 - HCM',
      description:
        'Chúng tôi đang phát triển một AI-powered healthcare platform để cải thiện chẩn đoán bệnh thông qua machine learning.',
      members: [
        {
          id: '1',
          name: 'Nguyễn Văn An',
          email: 'annv@fpt.edu.vn',
          role: 'leader',
        },
        {
          id: '2',
          name: 'Trần Thị Bình',
          email: 'binhtt@fpt.edu.vn',
          role: 'member',
        },
        {
          id: '3',
          name: 'Lê Văn Cường',
          email: 'cuonglv@fpt.edu.vn',
          role: 'member',
        },
        {
          id: '4',
          name: 'Phạm Thị Dung',
          email: 'dungpt@fpt.edu.vn',
          role: 'member',
        },
        {
          id: '5',
          name: 'Hoàng Văn Em',
          email: 'emhv@fpt.edu.vn',
          role: 'member',
        },
      ],
      progress: 75,
      status: 'on-track',
      nextMeeting: '2024-10-10 14:00',
      lastUpdate: '2 giờ trước',
      milestones: [
        { name: 'Research & Planning', completed: true, dueDate: '2024-09-15' },
        { name: 'MVP Development', completed: true, dueDate: '2024-09-30' },
        {
          name: 'Testing & Refinement',
          completed: false,
          dueDate: '2024-10-15',
        },
        {
          name: 'Final Presentation Prep',
          completed: false,
          dueDate: '2024-10-25',
        },
      ],
      feedback: [
        {
          date: '2024-10-05',
          content:
            'Tiến độ tốt, cần tập trung vào optimization cho ML model',
          rating: 4,
        },
        {
          date: '2024-09-28',
          content: 'MVP demo rất ấn tượng, UI/UX cần cải thiện thêm',
          rating: 5,
        },
      ],
    },
    {
      id: '2',
      name: 'AI Warriors',
      hackathon: 'SEAL Hackathon 2024 - HCM',
      description:
        'Education technology platform sử dụng AI để personalize học tập cho từng học sinh.',
      members: [
        {
          id: '6',
          name: 'Trịnh Văn Minh',
          email: 'minhtv@fpt.edu.vn',
          role: 'leader',
        },
        {
          id: '7',
          name: 'Lý Thị Ngọc',
          email: 'ngoclt@fpt.edu.vn',
          role: 'member',
        },
        {
          id: '8',
          name: 'Phan Văn Oanh',
          email: 'oanhpv@fpt.edu.vn',
          role: 'member',
        },
        {
          id: '9',
          name: 'Võ Thị Phương',
          email: 'phuongvt@fpt.edu.vn',
          role: 'member',
        },
      ],
      progress: 45,
      status: 'needs-attention',
      nextMeeting: '2024-10-11 10:00',
      lastUpdate: '1 ngày trước',
      milestones: [
        { name: 'Market Research', completed: true, dueDate: '2024-09-20' },
        { name: 'Feature Design', completed: true, dueDate: '2024-10-01' },
        {
          name: 'Core Development',
          completed: false,
          dueDate: '2024-10-20',
        },
        { name: 'Beta Testing', completed: false, dueDate: '2024-10-30' },
      ],
      feedback: [
        {
          date: '2024-10-03',
          content:
            'Team cần tăng tốc độ development, consider scope reduction',
          rating: 3,
        },
      ],
    },
    {
      id: '3',
      name: 'Blockchain Pioneers',
      hackathon: 'Tech Challenge 2024',
      description:
        'DeFi platform cho microfinance, giúp người dân vùng sâu vùng xa tiếp cận tài chính dễ dàng hơn.',
      members: [
        {
          id: '10',
          name: 'Đinh Văn Phúc',
          email: 'phucdv@fpt.edu.vn',
          role: 'leader',
        },
        {
          id: '11',
          name: 'Mai Thị Quỳnh',
          email: 'quynhmt@fpt.edu.vn',
          role: 'member',
        },
        {
          id: '12',
          name: 'Phan Văn Rộng',
          email: 'rongpv@fpt.edu.vn',
          role: 'member',
        },
        {
          id: '13',
          name: 'Nguyễn Thị Sáng',
          email: 'sangnt@fpt.edu.vn',
          role: 'member',
        },
        {
          id: '14',
          name: 'Trương Văn Tài',
          email: 'taitv@fpt.edu.vn',
          role: 'member',
        },
      ],
      progress: 90,
      status: 'excellent',
      lastUpdate: '5 giờ trước',
      milestones: [
        {
          name: 'Smart Contract Development',
          completed: true,
          dueDate: '2024-09-10',
        },
        {
          name: 'Frontend Integration',
          completed: true,
          dueDate: '2024-09-25',
        },
        { name: 'Security Audit', completed: true, dueDate: '2024-10-05' },
        { name: 'Final Polish', completed: false, dueDate: '2024-10-12' },
      ],
      feedback: [
        {
          date: '2024-10-06',
          content:
            'Xuất sắc! Smart contracts rất solid, security practices tốt',
          rating: 5,
        },
        {
          date: '2024-09-30',
          content: 'Team work tốt, technical execution impressive',
          rating: 5,
        },
      ],
    },
  ];

  const filteredTeams = myTeams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.hackathon.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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

  if (selectedTeam) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Button onClick={() => setSelectedTeam(null)}>Quay lại danh sách</Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {selectedTeam.name}
            </h1>
            <p className="text-gray-400 text-lg mt-2">
              {selectedTeam.hackathon}
            </p>
          </div>
          {getStatusBadge(selectedTeam.status)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 bg-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <RiseOutlined className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl text-white">{selectedTeam.progress}%</p>
                <p className="text-sm text-gray-400">Tiến độ</p>
              </div>
            </div>
          </Card>

          <Card className="border-0 bg-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <TeamOutlined className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl text-white">
                  {selectedTeam.members.length}
                </p>
                <p className="text-sm text-gray-400">Thành viên</p>
              </div>
            </div>
          </Card>

          <Card className="border-0 bg-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                <FileTextOutlined className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl text-white">
                  {selectedTeam.feedback.length}
                </p>
                <p className="text-sm text-gray-400">Feedbacks</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs
          defaultActiveKey="overview"
          items={[
            {
              key: 'overview',
              label: 'Tổng quan',
              children: (
                <div className="space-y-6">
                  <Card
                    title="Mô tả dự án"
                    className="border-0 bg-white/5 backdrop-blur-xl"
                  >
                    <p className="text-gray-400">{selectedTeam.description}</p>
                  </Card>

                  <Card
                    title="Tiến độ tổng thể"
                    className="border-0 bg-white/5 backdrop-blur-xl"
                  >
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white">
                            {selectedTeam.progress}%
                          </span>
                        </div>
                        <Progress
                          percent={selectedTeam.progress}
                          strokeColor={{
                            '0%': '#22c55e',
                            '100%': '#10b981',
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="p-3 rounded-lg bg-white/5">
                          <p className="text-sm text-gray-400">
                            Milestones hoàn thành
                          </p>
                          <p className="text-xl text-white mt-1">
                            {
                              selectedTeam.milestones.filter((m) => m.completed)
                                .length
                            }
                            /{selectedTeam.milestones.length}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5">
                          <p className="text-sm text-gray-400">
                            Cập nhật gần nhất
                          </p>
                          <p className="text-xl text-white mt-1">
                            {selectedTeam.lastUpdate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ),
            },
            {
              key: 'members',
              label: 'Thành viên',
              children: (
                <Card
                  title={`Danh sách thành viên (${selectedTeam.members.length})`}
                  className="border-0 bg-white/5 backdrop-blur-xl"
                >
                  <div className="space-y-4">
                    {selectedTeam.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="bg-gradient-to-r from-green-500 to-emerald-500">
                            {member.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-white">{member.name}</p>
                              {member.role === 'leader' && (
                                <Tag color="gold">Leader</Tag>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                              <MailOutlined />
                              {member.email}
                            </p>
                          </div>
                        </div>
                        <Button
                          icon={<MessageOutlined />}
                          className="border-white/20 bg-white/5"
                        >
                          Nhắn tin
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              ),
            },
            {
              key: 'milestones',
              label: 'Milestones',
              children: (
                <Card
                  title="Milestones"
                  className="border-0 bg-white/5 backdrop-blur-xl"
                >
                  <div className="space-y-4">
                    {selectedTeam.milestones.map((milestone, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div className="mt-1">
                          {milestone.completed ? (
                            <CheckCircleOutlined className="w-5 h-5 text-green-400" />
                          ) : (
                            <AlertOutlined className="w-5 h-5 text-yellow-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-white">{milestone.name}</h4>
                            {milestone.completed ? (
                              <Tag color="success">Hoàn thành</Tag>
                            ) : (
                              <Tag color="warning">Đang thực hiện</Tag>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mt-1">
                            Deadline:{' '}
                            {new Date(milestone.dueDate).toLocaleDateString(
                              'vi-VN',
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ),
            },
            {
              key: 'feedback',
              label: 'Feedback',
              children: (
                <div className="space-y-6">
                  <Card
                    title="Gửi Feedback Mới"
                    className="border-0 bg-white/5 backdrop-blur-xl"
                  >
                    <Input.TextArea
                      placeholder="Nhập feedback của bạn cho team..."
                      rows={4}
                      className="bg-white/5 border-white/10 mb-4"
                    />
                    <Button
                      type="primary"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 border-0"
                    >
                      <MessageOutlined /> Gửi Feedback
                    </Button>
                  </Card>

                  <Card
                    title={`Lịch sử Feedback (${selectedTeam.feedback.length})`}
                    className="border-0 bg-white/5 backdrop-blur-xl"
                  >
                    <div className="space-y-4">
                      {selectedTeam.feedback.map((fb, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-white/5 border border-white/10"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">
                              {new Date(fb.date).toLocaleDateString('vi-VN')}
                            </span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <TrophyOutlined
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < fb.rating
                                      ? 'text-yellow-400'
                                      : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-white">{fb.content}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              ),
            },
          ]}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Button onClick={() => navigate(PATH_NAME.MENTOR_DASHBOARD)}>
        Quay lại Dashboard
      </Button>

      <div>
        <h1 className="text-4xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          My Teams
        </h1>
        <p className="text-gray-400 text-lg mt-2">
          Quản lý và hỗ trợ các teams bạn đang hướng dẫn
        </p>
      </div>

      {/* Search */}
      <Card className="border-0 bg-white/5 backdrop-blur-xl">
        <Input
          placeholder="Tìm kiếm theo tên team hoặc hackathon..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white/5 border-white/10"
          size="large"
        />
      </Card>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTeams.map((team) => (
          <Card
            key={team.id}
            className="border-0 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all cursor-pointer group"
            onClick={() => setSelectedTeam(team)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl text-white group-hover:text-green-400 transition-colors">
                  {team.name}
                </h3>
                <p className="text-gray-400 mt-2">{team.hackathon}</p>
              </div>
              {getStatusBadge(team.status)}
            </div>
            <p className="text-sm text-gray-400 line-clamp-2 mb-4">
              {team.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Tiến độ</span>
                <span className="text-white">{team.progress}%</span>
              </div>
              <Progress
                percent={team.progress}
                strokeColor={{
                  '0%': '#22c55e',
                  '100%': '#10b981',
                }}
                showInfo={false}
              />
            </div>

            <div className="flex items-center justify-between text-sm pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-gray-400">
                <TeamOutlined className="text-green-400" />
                <span>{team.members.length} thành viên</span>
              </div>
              {team.nextMeeting && (
                <div className="flex items-center gap-2 text-green-400">
                  <ClockCircleOutlined />
                  <span className="text-xs">
                    {new Date(team.nextMeeting).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
            </div>

            <Button
              type="primary"
              className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 border-0"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTeam(team);
              }}
            >
              Xem chi tiết
            </Button>
          </Card>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <Card className="border-0 bg-white/5 backdrop-blur-xl">
          <div className="p-12 text-center">
            <TeamOutlined className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Không tìm thấy team nào phù hợp</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MentorMyTeams;





