import {
  CrownOutlined,
  MessageOutlined,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Tag,
} from 'antd';
import { useState } from 'react';

const { Option } = Select;

const StudentTeams = () => {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const myTeams = [
    {
      id: '1',
      name: 'Code Crusaders',
      hackathon: 'AI Revolution 2024',
      role: 'leader',
      members: [
        {
          id: '1',
          name: 'Nguyễn Văn A',
          avatar: null,
          role: 'leader',
          status: 'active',
          skills: ['Python', 'React', 'Machine Learning'],
        },
        {
          id: '2',
          name: 'Trần Thị B',
          avatar: null,
          role: 'member',
          status: 'active',
          skills: ['JavaScript', 'Node.js', 'UI/UX'],
        },
        {
          id: '3',
          name: 'Lê Văn C',
          avatar: null,
          role: 'member',
          status: 'inactive',
          skills: ['Python', 'Data Science'],
        },
      ],
      maxMembers: 5,
      status: 'active',
      project: 'AI-Powered Code Assistant',
      progress: 85,
    },
    {
      id: '2',
      name: 'Blockchain Heroes',
      hackathon: 'Web3 Future Hackathon',
      role: 'member',
      members: [
        {
          id: '4',
          name: 'Phạm Thị D',
          avatar: null,
          role: 'leader',
          status: 'active',
          skills: ['Solidity', 'React', 'Web3'],
        },
        {
          id: '5',
          name: 'Hoàng Văn E',
          avatar: null,
          role: 'member',
          status: 'active',
          skills: ['JavaScript', 'Smart Contracts'],
        },
      ],
      maxMembers: 4,
      status: 'forming',
      project: null,
      progress: 45,
    },
  ];

  const availableTeams = [
    {
      id: '3',
      name: 'Green Innovators',
      hackathon: 'Green Tech Challenge',
      members: 2,
      maxMembers: 5,
      leader: 'Đỗ Thị F',
      description: 'Looking for developers passionate about sustainability',
      skills: ['JavaScript', 'React', 'Environmental Science'],
    },
    {
      id: '4',
      name: 'Mobile Mavericks',
      hackathon: 'Mobile App Innovation',
      members: 3,
      maxMembers: 4,
      leader: 'Vũ Văn G',
      description: 'Building the next generation of mobile apps',
      skills: ['React Native', 'Flutter', 'Mobile Development'],
    },
  ];

  const handleCreateTeam = (values) => {
    console.log('Creating team:', values);
    setIsCreateModalVisible(false);
    // Navigate to team management page
  };

  const handleJoinTeam = (teamId) => {
    console.log('Joining team:', teamId);
    // Handle team joining logic
  };

  const handleViewTeam = (teamId) => {
    console.log('Viewing team:', teamId);
    setSelectedTeam(myTeams.find((team) => team.id === teamId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'forming':
        return 'blue';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            Đội của tôi
          </h1>
          <p className="text-gray-400 mt-2">
            Quản lý đội và tìm đội mới để tham gia
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            icon={<PlusOutlined />}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all"
            onClick={() => setIsCreateModalVisible(true)}
          >
            Tạo đội mới
          </Button>
        </div>
      </div>

      {/* My Teams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {myTeams.map((team) => (
          <Card
            key={team.id}
            className="border-0 hover:shadow-lg transition-all duration-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl text-white">{team.name}</h3>
                  <p className="text-gray-400">{team.hackathon}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Tag color={getStatusColor(team.status)}>
                    {team.status.toUpperCase()}
                  </Tag>
                  {team.role === 'leader' && (
                    <CrownOutlined className="text-yellow-400" />
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Thành viên:</span>
                  <span className="text-white">
                    {team.members.length}/{team.maxMembers}
                  </span>
                </div>
                {team.project && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Dự án:</span>
                    <span className="text-white">{team.project}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Tiến độ:</span>
                  <span className="text-white">{team.progress}%</span>
                </div>
              </div>

              <div className="w-full bg-gray-700/50 rounded-full h-2 mb-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${team.progress}%` }}
                ></div>
              </div>

              {/* Team Members */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex -space-x-2">
                  {team.members.slice(0, 3).map((member) => (
                    <Avatar
                      key={member.id}
                      size="small"
                      className={`border-2 border-card-background ${
                        member.status === 'active' ? '' : 'opacity-50'
                      }`}
                    >
                      {member.name.charAt(0)}
                    </Avatar>
                  ))}
                  {team.members.length > 3 && (
                    <Avatar
                      size="small"
                      className="border-2 border-card-background bg-primary"
                    >
                      +{team.members.length - 3}
                    </Avatar>
                  )}
                </div>

                <Space>
                  <Button
                    type="text"
                    size="small"
                    className="text-white hover:text-primary"
                    icon={<MessageOutlined />}
                  >
                    Chat
                  </Button>
                  <Button
                    type="text"
                    size="small"
                    className="text-white hover:text-primary"
                    icon={<SettingOutlined />}
                  >
                    Cài đặt
                  </Button>
                </Space>
              </div>

              <div className="flex gap-2">
                <Button
                  size="small"
                  className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white border-0"
                  onClick={() => handleViewTeam(team.id)}
                >
                  Xem chi tiết
                </Button>
                <Button
                  size="small"
                  variant="outline"
                  className="border-white/20 bg-white/5 hover:bg-white/10"
                >
                  Chỉnh sửa
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Available Teams */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-6">
          Đội đang tìm thành viên
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {availableTeams.map((team) => (
            <Card
              key={team.id}
              className="border-0 hover:shadow-lg transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {team.name}
                      </h3>
                      <Tag color="blue">Tuyển thành viên</Tag>
                    </div>

                    <p className="text-gray-400 text-sm mb-2">
                      {team.hackathon}
                    </p>

                    <p className="text-gray-400 text-sm mb-3">
                      {team.description}
                    </p>

                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-sm text-gray-400">
                        {team.members}/{team.maxMembers} thành viên
                      </span>
                      <span className="text-sm text-gray-400">
                        Trưởng nhóm: {team.leader}
                      </span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1">
                      {team.skills.map((skill) => (
                        <Tag
                          key={skill}
                          size="small"
                          className="bg-card-background/50 text-gray-300 border border-card-border"
                        >
                          {skill}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white border-0"
                    onClick={() => handleJoinTeam(team.id)}
                  >
                    Xin gia nhập
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Team Modal */}
      <Modal
        title="Tạo đội mới"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={null}
        className="[&_.ant-modal-content]:bg-gray-900/95 [&_.ant-modal-content]:backdrop-blur-xl [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white [&_.ant-modal-mask]:bg-black/50"
      >
        <Form onFinish={handleCreateTeam} layout="vertical">
          <Form.Item
            label="Tên đội"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên đội!' }]}
          >
            <Input placeholder="Nhập tên đội của bạn" />
          </Form.Item>

          <Form.Item
            label="Hackathon"
            name="hackathon"
            rules={[{ required: true, message: 'Vui lòng chọn hackathon!' }]}
          >
            <Select placeholder="Chọn hackathon">
              <Option value="ai-revolution">AI Revolution 2024</Option>
              <Option value="web3-hackathon">Web3 Future Hackathon</Option>
              <Option value="green-tech">Green Tech Challenge</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Mô tả đội" name="description">
            <Input.TextArea
              rows={3}
              placeholder="Mô tả về đội và dự án của bạn..."
            />
          </Form.Item>

          <Form.Item label="Kỹ năng cần thiết" name="skills">
            <Select
              mode="multiple"
              placeholder="Chọn các kỹ năng cần thiết"
              style={{ width: '100%' }}
            >
              <Option value="python">Python</Option>
              <Option value="javascript">JavaScript</Option>
              <Option value="react">React</Option>
              <Option value="nodejs">Node.js</Option>
              <Option value="machine-learning">Machine Learning</Option>
              <Option value="blockchain">Blockchain</Option>
              <Option value="mobile">Mobile Development</Option>
              <Option value="ui/ux">UI/UX Design</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsCreateModalVisible(false)}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 border-0"
              >
                Tạo đội
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentTeams;
