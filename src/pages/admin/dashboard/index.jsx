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
import { Avatar, Button, Space, Table, Tabs, Tag, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../../constants';
import { Input } from '../../../components/ui';

const { Search } = Input;

const HackathonDashboard = () => {
  const navigate = useNavigate();
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
            <div className="font-medium text-text-primary">{record.name}</div>
            <div className="text-text-secondary text-sm">{record.email}</div>
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
          <Button
            type="text"
            className="text-white hover:text-primary"
            icon={<EyeOutlined className="text-white hover:text-primary" />}
          />
          <Button
            type="text"
            className="text-white hover:text-primary"
            icon={
              <UserSwitchOutlined className="text-white hover:text-primary" />
            }
          />
          <Button
            type="text"
            className="text-white hover:text-red-500"
            icon={<DeleteOutlined className="text-white hover:text-red-500" />}
            danger
          />
        </Space>
      ),
    },
  ];
  const tabItems = [
    {
      key: '3',
      label: 'Người dùng',
      children: (
        <div className="bg-dark-secondary border border-dark-accent rounded-xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-text-primary">
              Quản lý người dùng
            </h2>
            <div className="flex items-center gap-2">
              <Search
                placeholder="Tìm kiếm người dùng..."
                allowClear
                className="w-64"
              />
              <Button
                icon={<UploadOutlined />}
                type="primary"
                className="bg-primary hover:bg-primary/90 transition-all"
              >
                Import
              </Button>
            </div>
          </div>
          <Table
            columns={userColumns}
            dataSource={userData}
            pagination={false}
            className="[&_.ant-table]:bg-transparent [&_th]:!bg-white/5 [&_th]:!text-white [&_td]:!text-gray-300 [&_td]:border-white/10 [&_th]:border-white/10 [&_tr:hover_td]:!bg-white/[0.03] [&_button]:opacity-100 [&_button:hover]:opacity-100"
          />
        </div>
      ),
    },
    {
      key: '4',
      label: 'Bài nộp',
      children: (
        <div className="bg-dark-secondary border border-dark-accent rounded-xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-text-primary">
              Quản lý bài nộp
            </h2>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              className="bg-primary hover:bg-primary/90 transition-all"
            >
              Xuất file
            </Button>
          </div>

          <Table
            className="[&_.ant-table]:bg-transparent [&_th]:!bg-white/5 [&_th]:!text-white [&_td]:!text-gray-300 [&_td]:border-white/10 [&_th]:border-white/10 [&_tr:hover_td]:!bg-white/[0.03] [&_button]:opacity-100 [&_button:hover]:opacity-100"
            pagination={false}
            columns={[
              {
                title: 'Dự án',
                dataIndex: 'project',
                key: 'project',
                render: (text) => (
                  <span className="font-medium text-text-primary">{text}</span>
                ),
              },
              {
                title: 'Đội',
                dataIndex: 'team',
                key: 'team',
              },
              {
                title: 'Hackathon',
                dataIndex: 'hackathon',
                key: 'hackathon',
              },
              {
                title: 'Trạng thái',
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
                title: 'Đã nộp',
                dataIndex: 'submitted',
                key: 'submitted',
              },
              {
                title: 'Điểm',
                dataIndex: 'score',
                key: 'score',
                render: (text) => (
                  <span
                    className={
                      text === 'Not scored' ? 'text-gray-500' : 'text-primary'
                    }
                  >
                    {text}
                  </span>
                ),
              },
              {
                title: 'Thao tác',
                key: 'actions',
                render: () => (
                  <Space size="middle">
                    <Tooltip title="Xem chi tiết">
                      <Button
                        type="text"
                        className="text-white hover:text-primary"
                        icon={
                          <EyeOutlined className="text-white hover:text-primary" />
                        }
                      />
                    </Tooltip>
                    <Tooltip title="Tải xuống">
                      <Button
                        type="text"
                        className="text-white hover:text-primary"
                        icon={
                          <DownloadOutlined className="text-white hover:text-primary" />
                        }
                      />
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
          <div className="bg-dark-secondary border border-dark-accent rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-text-primary">
              Platform Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-text-secondary mb-1">
                  Platform Name
                </label>
                <Input defaultValue="SEAL Hackathon" />
              </div>
              <div>
                <label className="block text-text-secondary mb-1">
                  Maximum Team Size
                </label>
                <Input defaultValue="5" />
              </div>
              <div>
                <label className="block text-text-secondary mb-1">
                  Default Registration Fee
                </label>
                <Input defaultValue="$0" />
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div className="bg-dark-secondary border border-dark-accent rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-text-primary">
              Email Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-text-secondary mb-1">
                  SMTP Server
                </label>
                <Input defaultValue="smtp.fpt.edu.vn" />
              </div>
              <div>
                <label className="block text-text-secondary mb-1">
                  From Email
                </label>
                <Input defaultValue="seal@fpt.edu.vn" />
              </div>
              <div>
                <label className="block text-text-secondary mb-1">
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
          {/*<div className="flex gap-3">*/}
            {/*<Button*/}
            {/*  icon={<FileAddOutlined />}*/}
            {/*  className="border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all"*/}
            {/*>*/}
            {/*  Duyệt đề bài*/}
            {/*</Button>*/}
            {/*<Button*/}
            {/*  icon={<DownloadOutlined />}*/}
            {/*  className="border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all"*/}
            {/*>*/}
            {/*  Xuất dữ liệu*/}
            {/*</Button>*/}
            {/*<Button*/}
            {/*  onClick={() => navigate(PATH_NAME.HACKATHON_CREATE_PAGE)}*/}
            {/*  type="primary"*/}
            {/*  icon={<PlusOutlined />}*/}
            {/*  className="bg-primary hover:opacity-90 transition-all"*/}
            {/*>*/}
            {/*  Tạo Hackathon*/}
            {/*</Button>*/}
          {/*</div>*/}
        </div>
      </div>

      <Tabs
        defaultActiveKey="1"
        items={tabItems}
        className="[&_.ant-tabs-tab]:text-text-secondary [&_.ant-tabs-tab-active]:text-primary [&_.ant-tabs-ink-bar]:bg-primary"
      />

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
