import {
  BarChartOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FileAddOutlined,
  FileTextOutlined,
  PlusOutlined,
  TrophyOutlined,
  UploadOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Input, Space, Table, Tabs, Tag, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../../constants';

const { Search } = Input;

const HackathonDashboard = () => {
  const navigate = useNavigate();
  const stats = [
    {
      icon: <UserOutlined className="text-3xl" />,
      value: '1247',
      label: 'Tổng người dùng',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      icon: <TrophyOutlined className="text-3xl" />,
      value: '3',
      label: 'Hackathon đang diễn ra',
      color: 'bg-yellow-50 border-yellow-200',
      iconColor: 'text-yellow-600',
    },
    {
      icon: <FileTextOutlined className="text-3xl" />,
      value: '89',
      label: 'Bài nộp',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
    },
    {
      icon: <BarChartOutlined className="text-3xl" />,
      value: '12',
      label: 'Chờ đánh giá',
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
    },
  ];

  const activities = [
    {
      text: 'New user registration: Alex Johnson',
      time: '2 minutes ago',
      color: 'bg-green-500',
    },
    {
      text: 'Submission received: AI Code Assistant',
      time: '15 minutes ago',
      color: 'bg-blue-500',
    },
    {
      text: 'Judge completed review: SmartCity AI',
      time: '1 hour ago',
      color: 'bg-purple-500',
    },
  ];

  const systemHealth = [
    { label: 'Server Status', status: 'Online', color: 'text-green-600' },
    { label: 'Database', status: 'Healthy', color: 'text-green-600' },
    { label: 'File Storage', status: '85% Full', color: 'text-yellow-600' },
    { label: 'API Status', status: 'Operational', color: 'text-green-600' },
  ];

  const hackathonData = [
    {
      key: '1',
      name: 'AI Revolution 2024',
      status: 'active',
      participants: 1250,
      submissions: 89,
      dates: '2024-03-15 - 2024-03-17',
      prize: '$50,000',
    },
    {
      key: '2',
      name: 'Web3 Future Hackathon',
      status: 'completed',
      participants: 890,
      submissions: 76,
      dates: '2024-04-01 - 2024-04-03',
      prize: '$25,000',
    },
    {
      key: '3',
      name: 'Green Tech Challenge',
      status: 'upcoming',
      participants: 230,
      submissions: 0,
      dates: '2024-04-20 - 2024-04-22',
      prize: '$30,000',
    },
  ];

  // === User Data ===
  const userData = [
    {
      key: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      role: 'participant',
      status: 'active',
      joinDate: '2024-01-15',
      activity: '2 teams, 3 hackathons',
    },
    {
      key: '2',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      role: 'judge',
      status: 'active',
      joinDate: '2024-02-01',
      activity: '0 teams, 5 hackathons',
    },
    {
      key: '3',
      name: 'Mike Rodriguez',
      email: 'mike@example.com',
      role: 'participant',
      status: 'pending',
      joinDate: '2024-03-10',
      activity: '1 teams, 1 hackathons',
    },
  ];

  const hackathonColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span className="font-medium text-gray-900">{text}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        if (status === 'active') color = 'green';
        else if (status === 'completed') color = 'blue';
        else color = 'gold';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Participants',
      dataIndex: 'participants',
      key: 'participants',
    },
    {
      title: 'Submissions',
      dataIndex: 'submissions',
      key: 'submissions',
    },
    {
      title: 'Dates',
      dataIndex: 'dates',
      key: 'dates',
    },
    {
      title: 'Prize',
      dataIndex: 'prize',
      key: 'prize',
      render: (text) => (
        <span className="text-green-600 font-medium">{text}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} />
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" icon={<DeleteOutlined />} danger />
        </Space>
      ),
    },
  ];

  const userColumns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar>
            {record.name.split(' ')[0][0] + record.name.split(' ')[1][0]}
          </Avatar>
          <div>
            <div className="font-medium text-gray-900">{record.name}</div>
            <div className="text-gray-500 text-sm">{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (role) => {
        const color = role === 'judge' ? 'blue' : 'green';
        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        let color = '';
        if (status === 'active') color = 'green';
        else color = 'gold';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Join Date',
      dataIndex: 'joinDate',
    },
    {
      title: 'Activity',
      dataIndex: 'activity',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} />
          <Button type="text" icon={<UserSwitchOutlined />} />
          <Button type="text" icon={<DeleteOutlined />} danger />
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: '1',
      label: 'Tổng quan',
      children: (
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
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activity */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">
                Hoạt động gần đây
              </h2>
              <div className="space-y-4">
                {activities.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div
                      className={`w-2 h-2 ${activity.color} rounded-full mt-2 flex-shrink-0`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">
                        {activity.text}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">
                System Health
              </h2>
              <div className="space-y-4">
                {systemHealth.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-gray-600">{item.label}</span>
                    <span className={`font-semibold ${item.color}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      key: '2',
      label: 'Hackathons',
      children: (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Manage Hackathons
            </h2>
            <Button type="primary" icon={<PlusOutlined />}>
              New Hackathon
            </Button>
          </div>
          <Table
            columns={hackathonColumns}
            dataSource={hackathonData}
            pagination={false}
          />
        </div>
      ),
    },
    {
      key: '3',
      label: 'Người dùng',
      children: (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              User Management
            </h2>
            <div className="flex items-center gap-2">
              <Search
                placeholder="Search users..."
                allowClear
                className="w-64"
              />
              <Button icon={<UploadOutlined />} type="primary">
                Import
              </Button>
            </div>
          </div>
          <Table
            columns={userColumns}
            dataSource={userData}
            pagination={false}
          />
        </div>
      ),
    },
    {
      key: '4',
      label: 'Bài nộp',
      children: (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Submissions Management
            </h2>
            <Button type="primary" icon={<DownloadOutlined />}>
              Export
            </Button>
          </div>

          <Table
            pagination={false}
            columns={[
              {
                title: 'Project',
                dataIndex: 'project',
                key: 'project',
                render: (text) => <span className="font-medium">{text}</span>,
              },
              {
                title: 'Team',
                dataIndex: 'team',
                key: 'team',
              },
              {
                title: 'Hackathon',
                dataIndex: 'hackathon',
                key: 'hackathon',
              },
              {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (status) => {
                  let color = 'default';
                  if (status === 'submitted') color = 'green';
                  else if (status === 'under review') color = 'gold';
                  else if (status === 'draft') color = 'gray';
                  return <Tag color={color}>{status.toUpperCase()}</Tag>;
                },
              },
              {
                title: 'Submitted',
                dataIndex: 'submitted',
                key: 'submitted',
              },
              {
                title: 'Score',
                dataIndex: 'score',
                key: 'score',
                render: (text) => (
                  <span
                    className={text === 'Not scored' ? 'text-gray-400' : ''}
                  >
                    {text}
                  </span>
                ),
              },
              {
                title: 'Actions',
                key: 'actions',
                render: () => (
                  <Space size="middle">
                    <Tooltip title="View details">
                      <Button type="text" icon={<EyeOutlined />} />
                    </Tooltip>
                    <Tooltip title="Download">
                      <Button type="text" icon={<DownloadOutlined />} />
                    </Tooltip>
                  </Space>
                ),
              },
            ]}
            dataSource={[
              {
                key: 1,
                project: 'AI-Powered Code Assistant',
                team: 'Code Crusaders',
                hackathon: 'AI Revolution 2024',
                status: 'submitted',
                submitted: '2024-03-16 14:30',
                score: '92.3/100',
              },
              {
                key: 2,
                project: 'SmartCity AI',
                team: 'Neural Networks',
                hackathon: 'AI Revolution 2024',
                status: 'under review',
                submitted: '2024-03-16 16:45',
                score: 'Not scored',
              },
              {
                key: 3,
                project: 'VR Learning Environment',
                team: 'Tech Titans',
                hackathon: 'AI Revolution 2024',
                status: 'draft',
                submitted: 'Not submitted',
                score: 'Not scored',
              },
            ]}
          />
        </div>
      ),
    },
    {
      key: '5',
      label: 'Cài đặt',
      children: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Platform Settings */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              Platform Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-1">
                  Platform Name
                </label>
                <Input defaultValue="SEAL Hackathon" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">
                  Maximum Team Size
                </label>
                <Input defaultValue="5" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">
                  Default Registration Fee
                </label>
                <Input defaultValue="$0" />
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              Email Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-1">SMTP Server</label>
                <Input defaultValue="smtp.fpt.edu.vn" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">From Email</label>
                <Input defaultValue="seal@fpt.edu.vn" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">
                  Support Email
                </label>
                <Input defaultValue="support.seal@fpt.edu.vn" />
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Bảng điều khiển Quản trị
            </h1>
            <p className="text-gray-400">
              Quản lý hackathon, người dùng và cài đặt nền tảng
            </p>
          </div>
          <div className="flex gap-3">
            <Button icon={<FileAddOutlined />}>Duyệt đề bài</Button>
            <Button icon={<DownloadOutlined />}>Xuất dữ liệu</Button>
            <Button
              onClick={() => navigate(PATH_NAME.HACKATHON_CREATE_PAGE)}
              type="primary"
              icon={<PlusOutlined />}
            >
              Tạo Hackathon
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultActiveKey="1" items={tabItems} />
    </div>
  );
};

export default HackathonDashboard;
