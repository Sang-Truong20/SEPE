import { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Avatar,
  Badge,
  Modal,
  Form,
  Input,
  message,
  Tabs,
  Space,
  Alert,
  Tag,
} from 'antd';
import {
  UserPlus,
  Crown,
  Mail,
  Github,
  Linkedin,
  XCircle,
  CheckCircle,
  Clock,
  Code,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_NAME } from '../../constants';

const { TabPane } = Tabs;

// ============================================
// MOCK DATA - NO API CALLS
// This page uses mock data for testing purposes
// Replace getTeamById() and mock functions with real API calls when backend is ready
// ============================================

// Mock data - multiple teams for testing
const mockTeamsData = {
  'team-1': {
    id: 'team-1',
    teamName: 'Chiến binh Code',
    description: 'Đội thi chuyên về phát triển ứng dụng AI và Machine Learning',
    hackathon: 'Cuộc Cách mạng AI 2024',
    leaderId: 'user-1',
    members: [
      {
        id: 1,
        userId: 'user-1',
        name: 'Nguyễn Việt Anh',
        email: 'anh@example.com',
        role: 'Trưởng nhóm',
        skills: ['React', 'Node.js', 'AI/ML'],
        avatar: 'NVA',
        status: 'confirmed',
        github: 'https://github.com/nguyenvietanh',
        linkedin: 'https://linkedin.com/in/nguyenvietanh',
        isLeader: true,
        penalty: null,
      },
      {
        id: 2,
        userId: 'user-2',
        name: 'Trần Thị Lan',
        email: 'lan@example.com',
        role: 'Thiết kế UI/UX',
        skills: ['Figma', 'CSS', 'Design Systems'],
        avatar: 'TTL',
        status: 'confirmed',
        github: 'https://github.com/tranthilan',
        linkedin: 'https://linkedin.com/in/tranthilan',
        isLeader: false,
        penalty: null,
      },
      {
        id: 3,
        userId: 'user-3',
        name: 'Lê Minh Đức',
        email: 'duc@example.com',
        role: 'Lập trình Backend',
        skills: ['Python', 'FastAPI', 'PostgreSQL'],
        avatar: 'LMD',
        status: 'pending',
        github: 'https://github.com/leminhduc',
        linkedin: 'https://linkedin.com/in/leminhduc',
        isLeader: false,
        penalty: null,
      },
      {
        id: 4,
        userId: 'user-4',
        name: 'Phạm Văn Hải',
        email: 'hai@example.com',
        role: 'Lập trình Frontend',
        skills: ['Vue.js', 'TypeScript'],
        avatar: 'PVH',
        status: 'confirmed',
        github: 'https://github.com/phamvanhai',
        linkedin: 'https://linkedin.com/in/phamvanhai',
        isLeader: false,
        penalty: {
          type: 'abandonment',
          reason: 'Bỏ thi giữa chừng trong hackathon trước',
          date: '2024-10-15',
          severity: 'medium',
        },
      },
    ],
    tasks: [
      {
        id: 1,
        title: 'Thiết lập repository dự án',
        assignee: 'Nguyễn Việt Anh',
        status: 'completed',
        priority: 'high',
      },
      {
        id: 2,
        title: 'Thiết kế mockup giao diện người dùng',
        assignee: 'Trần Thị Lan',
        status: 'in-progress',
        priority: 'high',
      },
      {
        id: 3,
        title: 'Triển khai hệ thống xác thực',
        assignee: 'Lê Minh Đức',
        status: 'todo',
        priority: 'medium',
      },
      {
        id: 4,
        title: 'Tích hợp API mô hình AI',
        assignee: 'Nguyễn Việt Anh',
        status: 'todo',
        priority: 'high',
      },
      {
        id: 5,
        title: 'Tạo slide thuyết trình',
        assignee: 'Trần Thị Lan',
        status: 'todo',
        priority: 'low',
      },
    ],
  },
  'team-2': {
    id: 'team-2',
    teamName: 'Tech Innovators',
    description: 'Phát triển ứng dụng AI cho giáo dục',
    hackathon: 'Blockchain Hackathon Vietnam',
    leaderId: 'user-5',
    members: [
      {
        id: 5,
        userId: 'user-5',
        name: 'Nguyễn Văn Hùng',
        email: 'hung@example.com',
        role: 'Trưởng nhóm',
        skills: ['React', 'Node.js'],
        avatar: 'NVH',
        status: 'confirmed',
        github: 'https://github.com/nguyenvanhung',
        linkedin: 'https://linkedin.com/in/nguyenvanhung',
        isLeader: true,
        penalty: null,
      },
      {
        id: 6,
        userId: 'user-6',
        name: 'Lê Thị Mai',
        email: 'mai@example.com',
        role: 'Full Stack Developer',
        skills: ['Vue.js', 'Express', 'MongoDB'],
        avatar: 'LTM',
        status: 'confirmed',
        github: 'https://github.com/lethimai',
        linkedin: 'https://linkedin.com/in/lethimai',
        isLeader: false,
        penalty: null,
      },
    ],
    tasks: [],
  },
};

// Function to get team data by ID
const getTeamById = (teamId) => {
  return mockTeamsData[teamId] || null;
};

const MyTeamPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('members');
  const [teamData, setTeamData] = useState(() => getTeamById(id));
  const [isInviting, setIsInviting] = useState(false);

  // Update team data when ID changes
  useEffect(() => {
    const newTeamData = getTeamById(id);
    setTeamData(newTeamData);
    setActiveTab('members'); // Reset tab when switching teams
  }, [id]);

  // Mock current user - in real app, get from auth context
  const currentUserId = 'user-1';
  const isLeader = teamData?.leaderId === currentUserId;

  const handleInvite = async (values) => {
    setIsInviting(true);
    // Simulate API call
    setTimeout(() => {
      const currentMembers = teamData.members || [];
      const newMember = {
        id: currentMembers.length + 1,
        userId: `user-${currentMembers.length + 1}`,
        name: values.email.split('@')[0],
        email: values.email,
        role: 'Thành viên',
        skills: [],
        avatar: values.email.substring(0, 2).toUpperCase(),
        status: 'pending',
        github: '',
        linkedin: '',
        isLeader: false,
        penalty: null,
      };

      setTeamData({
        ...teamData,
        members: [...currentMembers, newMember],
      });

      message.success('Lời mời đã được gửi thành công!');
      form.resetFields();
      setInviteModalVisible(false);
      setIsInviting(false);
    }, 1000);
  };

  const handleKickMember = (memberId) => {
    Modal.confirm({
      title: 'Xác nhận loại thành viên',
      content: 'Bạn có chắc chắn muốn loại thành viên này khỏi đội?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => {
        const currentMembers = teamData.members || [];
        setTeamData({
          ...teamData,
          members: currentMembers.filter(
            (m) => m.id !== memberId && m.userId !== memberId,
          ),
        });
        message.success('Đã loại thành viên khỏi đội');
      },
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
      case 'active':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      default:
        return status;
    }
  };

  if (!teamData) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert
          message="Không tìm thấy đội"
          description={`Đội với ID "${id}" không tồn tại. Vui lòng kiểm tra lại hoặc quay về danh sách đội.`}
          type="error"
          showIcon
          action={
            <Button onClick={() => navigate(PATH_NAME.STUDENT_TEAMS)}>
              Xem danh sách đội
            </Button>
          }
        />
      </div>
    );
  }

  const members = teamData.members || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            {teamData.teamName || 'Đội của tôi'}
          </h1>
          <p className="text-gray-400 mt-2">
            {teamData.hackathon || 'Quản lý đội và thành viên của bạn'}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl text-white">{members.length}</p>
              <p className="text-sm text-gray-400">Thành viên</p>
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl text-white">
                {
                  members.filter(
                    (m) => m.status === 'confirmed' || m.status === 'active',
                  ).length
                }
              </p>
              <p className="text-sm text-gray-400">Đã xác nhận</p>
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl text-white">
                {members.filter((m) => m.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-400">Chờ xác nhận</p>
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl text-white">20%</p>
              <p className="text-sm text-gray-400">Tiến độ</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="[&_.ant-tabs-tab]:text-gray-400 [&_.ant-tabs-tab-active]:text-white [&_.ant-tabs-ink-bar]:bg-gradient-to-r [&_.ant-tabs-ink-bar]:from-green-500 [&_.ant-tabs-ink-bar]:to-emerald-400"
      >
        <TabPane tab="Thành viên" key="members">
          <Card className="backdrop-blur-xl bg-white/5 border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl text-white">
                Thành Viên Đội ({members.length}/5)
              </h3>
              {isLeader ? (
                <Button
                  type="primary"
                  icon={<UserPlus className="w-4 h-4" />}
                  onClick={() => setInviteModalVisible(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 border-0"
                  disabled={members.length >= 5}
                >
                  Mời Thành Viên {members.length >= 5 && '(Đã đủ 5 thành viên)'}
                </Button>
              ) : (
                <Badge
                  variant="outline"
                  className="border-orange-500/30 text-orange-300 px-3 py-1 rounded"
                >
                  Chỉ trưởng nhóm mới có thể mời thành viên
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map((member) => {
                const isMemberLeader =
                  member.isLeader ||
                  member.id === teamData.leaderId ||
                  member.userId === teamData.leaderId;
                const memberName = member.name || member.user?.name || 'N/A';
                const memberEmail = member.email || member.user?.email || '';
                const memberSkills = member.skills || [];
                const avatarInitials =
                  member.avatar ||
                  memberName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                return (
                  <Card
                    key={member.id || member.userId}
                    className="bg-white/5 border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start space-x-4">
                      <Avatar
                        size={48}
                        className="bg-gradient-to-r from-green-400 to-emerald-400 text-white"
                      >
                        {avatarInitials}
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-white font-medium">
                            {memberName}
                          </h4>
                          {isMemberLeader && (
                            <Crown className="w-4 h-4 text-yellow-400" />
                          )}
                          <Badge
                            status={getStatusColor(member.status)}
                            text={getStatusText(member.status)}
                            className="text-xs"
                          />
                        </div>

                        <p className="text-sm text-gray-400 mb-3">
                          {member.role || 'Thành viên'}
                        </p>

                        {member.penalty && (
                          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 mb-3">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="w-4 h-4 text-red-400" />
                              <span className="text-red-300 text-xs">
                                Cảnh báo
                              </span>
                            </div>
                            <p className="text-xs text-red-200 mt-1">
                              {member.penalty.reason}
                            </p>
                          </div>
                        )}

                        {memberSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {memberSkills.slice(0, 4).map((skill, idx) => (
                              <Tag
                                key={idx}
                                className="text-xs bg-white/5 border-white/10 text-gray-300"
                              >
                                {skill}
                              </Tag>
                            ))}
                            {memberSkills.length > 4 && (
                              <Tag className="text-xs bg-white/5 border-white/10 text-gray-300">
                                +{memberSkills.length - 4}
                              </Tag>
                            )}
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          {memberEmail && (
                            <Button
                              type="text"
                              size="small"
                              icon={<Mail className="w-4 h-4" />}
                              className="text-gray-400 hover:text-white"
                              href={`mailto:${memberEmail}`}
                            />
                          )}
                          {member.github && (
                            <Button
                              type="text"
                              size="small"
                              icon={<Github className="w-4 h-4" />}
                              className="text-gray-400 hover:text-white"
                              href={member.github}
                              target="_blank"
                            />
                          )}
                          {member.linkedin && (
                            <Button
                              type="text"
                              size="small"
                              icon={<Linkedin className="w-4 h-4" />}
                              className="text-gray-400 hover:text-white"
                              href={member.linkedin}
                              target="_blank"
                            />
                          )}
                          {isLeader && !isMemberLeader && (
                            <Button
                              type="text"
                              size="small"
                              danger
                              icon={<XCircle className="w-4 h-4" />}
                              onClick={() =>
                                handleKickMember(member.id || member.userId)
                              }
                              className="text-red-400 hover:text-red-300"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {members.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Chưa có thành viên nào</p>
              </div>
            )}
          </Card>
        </TabPane>

        <TabPane tab="Thông tin đội" key="info">
          <Card className="backdrop-blur-xl bg-white/5 border-white/10">
            <Space direction="vertical" size="large" className="w-full">
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Tên đội</h4>
                <p className="text-white text-lg">{teamData.teamName}</p>
              </div>

              {teamData.description && (
                <div>
                  <h4 className="text-gray-400 text-sm mb-2">Mô tả</h4>
                  <p className="text-white">{teamData.description}</p>
                </div>
              )}

              {teamData.hackathon && (
                <div>
                  <h4 className="text-gray-400 text-sm mb-2">Hackathon</h4>
                  <p className="text-white">{teamData.hackathon}</p>
                </div>
              )}
            </Space>
          </Card>
        </TabPane>
      </Tabs>

      {/* Invite Modal */}
      <Modal
        title="Mời Thành Viên Mới"
        open={inviteModalVisible}
        onCancel={() => {
          setInviteModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        className="[&_.ant-modal-content]:bg-gray-900/95 [&_.ant-modal-content]:backdrop-blur-xl [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white [&_.ant-modal-mask]:bg-black/50"
      >
        <p className="text-gray-400 mb-4">
          Chỉ trưởng nhóm mới có quyền mời thành viên vào đội thi
        </p>
        <Form form={form} onFinish={handleInvite} layout="vertical">
          <Form.Item
            label={<span className="text-white">Email thành viên</span>}
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input
              placeholder="example@email.com"
              prefix={<Mail className="w-4 h-4 text-gray-400" />}
            />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setInviteModalVisible(false);
                  form.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isInviting}
                className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 border-0"
              >
                {isInviting ? 'Đang gửi...' : 'Gửi Lời Mời'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MyTeamPage;
