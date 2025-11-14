import {
  CalendarOutlined,
  ClockCircleOutlined,
  UsersOutlined,
  PlusOutlined,
  VideoCameraOutlined,
  EnvironmentOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Badge, Button, Card, Tag, DatePicker, Modal, Form, Input, Select } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../constants';
import dayjs from 'dayjs';

const MentorSchedule = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form] = Form.useForm();

  // Mock data
  const meetings = [
    {
      id: '1',
      teamId: '1',
      teamName: 'Tech Innovators',
      date: new Date(2024, 9, 10),
      time: '14:00',
      duration: '1 giờ',
      topic: 'Sprint Review & Demo',
      type: 'review',
      location: 'online',
      locationDetail: 'Google Meet',
      status: 'scheduled',
      notes: 'Chuẩn bị demo MVP',
    },
    {
      id: '2',
      teamId: '2',
      teamName: 'AI Warriors',
      date: new Date(2024, 9, 11),
      time: '10:00',
      duration: '45 phút',
      topic: 'Technical Guidance - ML Model',
      type: 'technical',
      location: 'online',
      locationDetail: 'Zoom',
      status: 'scheduled',
    },
    {
      id: '3',
      teamId: '3',
      teamName: 'Blockchain Pioneers',
      date: new Date(2024, 9, 12),
      time: '15:00',
      duration: '30 phút',
      topic: 'Final Preparation',
      type: 'planning',
      location: 'offline',
      locationDetail: 'FPT University - Room A301',
      status: 'scheduled',
    },
    {
      id: '4',
      teamId: '1',
      teamName: 'Tech Innovators',
      date: new Date(2024, 9, 5),
      time: '14:00',
      duration: '1 giờ',
      topic: 'Progress Check',
      type: 'feedback',
      location: 'online',
      locationDetail: 'Google Meet',
      status: 'completed',
      notes: 'Team có tiến bộ tốt',
    },
  ];

  const teams = [
    { id: '1', name: 'Tech Innovators' },
    { id: '2', name: 'AI Warriors' },
    { id: '3', name: 'Blockchain Pioneers' },
  ];

  const upcomingMeetings = meetings
    .filter((m) => m.status === 'scheduled' && m.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const recentMeetings = meetings
    .filter((m) => m.status === 'completed')
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  const getMeetingTypeBadge = (type) => {
    switch (type) {
      case 'review':
        return <Tag color="blue">Review</Tag>;
      case 'planning':
        return <Tag color="purple">Planning</Tag>;
      case 'feedback':
        return <Tag color="green">Feedback</Tag>;
      case 'technical':
        return <Tag color="orange">Technical</Tag>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return <Tag color="processing">Đã lên lịch</Tag>;
      case 'completed':
        return <Tag color="success">Hoàn thành</Tag>;
      case 'cancelled':
        return <Tag color="error">Đã hủy</Tag>;
      default:
        return null;
    }
  };

  const handleCreateMeeting = () => {
    form.validateFields().then(() => {
      setShowCreateModal(false);
      form.resetFields();
      // In real app, save to backend
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Button onClick={() => navigate(PATH_NAME.MENTOR_DASHBOARD)}>
        Quay lại Dashboard
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Lịch Hẹn
          </h1>
          <p className="text-gray-400 text-lg mt-2">
            Quản lý lịch họp với các teams
          </p>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 border-0"
        >
          Tạo Lịch Họp
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 bg-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
              <CalendarOutlined className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl text-white">{upcomingMeetings.length}</p>
              <p className="text-sm text-gray-400">Sắp tới</p>
            </div>
          </div>
        </Card>

        <Card className="border-0 bg-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center">
              <CheckCircleOutlined className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl text-white">{recentMeetings.length}</p>
              <p className="text-sm text-gray-400">Đã hoàn thành</p>
            </div>
          </div>
        </Card>

        <Card className="border-0 bg-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <ClockCircleOutlined className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl text-white">12.5h</p>
              <p className="text-sm text-gray-400">Tuần này</p>
            </div>
          </div>
        </Card>

        <Card className="border-0 bg-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
              <UsersOutlined className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl text-white">{teams.length}</p>
              <p className="text-sm text-gray-400">Teams</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card
          title="Lịch"
          className="border-0 bg-white/5 backdrop-blur-xl"
        >
          <DatePicker
            className="w-full mb-4 bg-white/5 border-white/10"
            format="DD/MM/YYYY"
          />
        </Card>

        {/* Upcoming Meetings */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            title={`Cuộc Họp Sắp Tới (${upcomingMeetings.length})`}
            className="border-0 bg-white/5 backdrop-blur-xl"
          >
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white mb-1">{meeting.teamName}</h4>
                      <p className="text-sm text-gray-400">{meeting.topic}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getMeetingTypeBadge(meeting.type)}
                      {getStatusBadge(meeting.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <CalendarOutlined className="text-cyan-400" />
                      <span>
                        {meeting.date.toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <ClockCircleOutlined className="text-cyan-400" />
                      <span>
                        {meeting.time} • {meeting.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 col-span-2">
                      {meeting.location === 'online' ? (
                        <VideoCameraOutlined className="text-cyan-400" />
                      ) : (
                        <EnvironmentOutlined className="text-cyan-400" />
                      )}
                      <span>{meeting.locationDetail}</span>
                    </div>
                  </div>

                  {meeting.notes && (
                    <div className="mt-3 p-2 rounded bg-white/5 text-sm text-gray-400">
                      📝 {meeting.notes}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      className="border-white/20 bg-white/5"
                    >
                      Sửa
                    </Button>
                    <Button
                      size="small"
                      icon={<DeleteOutlined />}
                      danger
                      className="border-red-500/20 bg-red-500/5"
                    >
                      Hủy
                    </Button>
                    {meeting.location === 'online' && (
                      <Button
                        size="small"
                        type="primary"
                        icon={<VideoCameraOutlined />}
                        className="ml-auto bg-gradient-to-r from-cyan-600 to-blue-600 border-0"
                      >
                        Tham gia
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {upcomingMeetings.length === 0 && (
                <div className="text-center py-8">
                  <CalendarOutlined className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">
                    Chưa có cuộc họp nào được lên lịch
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Recent Meetings */}
          {recentMeetings.length > 0 && (
            <Card
              title="Cuộc Họp Gần Đây"
              className="border-0 bg-white/5 backdrop-blur-xl"
            >
              <div className="space-y-3">
                {recentMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm text-white">
                          {meeting.teamName} - {meeting.topic}
                        </h5>
                        <p className="text-xs text-gray-400 mt-1">
                          {meeting.date.toLocaleDateString('vi-VN')} •{' '}
                          {meeting.time}
                        </p>
                      </div>
                      {getStatusBadge(meeting.status)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Create Meeting Modal */}
      <Modal
        title="Tạo Lịch Họp Mới"
        open={showCreateModal}
        onOk={handleCreateMeeting}
        onCancel={() => {
          setShowCreateModal(false);
          form.resetFields();
        }}
        okText="Tạo lịch"
        cancelText="Hủy"
        className="[&_.ant-modal-content]:bg-dark-secondary [&_.ant-modal-content]:border-white/10"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="team"
              label="Team"
              rules={[{ required: true, message: 'Vui lòng chọn team' }]}
            >
              <Select placeholder="Chọn team" className="bg-white/5">
                {teams.map((team) => (
                  <Select.Option key={team.id} value={team.id}>
                    {team.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="type"
              label="Loại cuộc họp"
              rules={[
                { required: true, message: 'Vui lòng chọn loại cuộc họp' },
              ]}
            >
              <Select placeholder="Chọn loại" className="bg-white/5">
                <Select.Option value="review">Review</Select.Option>
                <Select.Option value="planning">Planning</Select.Option>
                <Select.Option value="feedback">Feedback</Select.Option>
                <Select.Option value="technical">Technical</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="topic"
            label="Chủ đề"
            rules={[{ required: true, message: 'Vui lòng nhập chủ đề' }]}
          >
            <Input placeholder="VD: Sprint Review & Demo" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="date"
              label="Ngày"
              rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
            >
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item
              name="time"
              label="Giờ"
              rules={[{ required: true, message: 'Vui lòng nhập giờ' }]}
            >
              <Input type="time" />
            </Form.Item>
          </div>

          <Form.Item
            name="duration"
            label="Thời lượng"
            rules={[
              { required: true, message: 'Vui lòng chọn thời lượng' },
            ]}
          >
            <Select placeholder="Chọn thời lượng" className="bg-white/5">
              <Select.Option value="30">30 phút</Select.Option>
              <Select.Option value="45">45 phút</Select.Option>
              <Select.Option value="60">1 giờ</Select.Option>
              <Select.Option value="90">1.5 giờ</Select.Option>
              <Select.Option value="120">2 giờ</Select.Option>
            </Select>
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="location"
              label="Hình thức"
              rules={[
                { required: true, message: 'Vui lòng chọn hình thức' },
              ]}
            >
              <Select placeholder="Chọn hình thức" className="bg-white/5">
                <Select.Option value="online">Online</Select.Option>
                <Select.Option value="offline">Offline</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="locationDetail"
              label="Địa điểm/Link"
              rules={[
                { required: true, message: 'Vui lòng nhập địa điểm/link' },
              ]}
            >
              <Input placeholder="Google Meet, Zoom, hoặc phòng họp" />
            </Form.Item>
          </div>

          <Form.Item name="notes" label="Ghi chú (tùy chọn)">
            <Input.TextArea
              placeholder="Thêm ghi chú cho cuộc họp..."
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MentorSchedule;




