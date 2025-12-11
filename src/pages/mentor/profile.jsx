import {
    BellOutlined,
    BookOutlined,
    ClockCircleOutlined,
    EditOutlined,
    LockOutlined,
    LogoutOutlined,
    StarOutlined,
    TeamOutlined,
    UserOutlined
} from '@ant-design/icons';
 import { Alert, Avatar, Button, Card, Form, Input, message, Select, Space, Statistic, Tabs, Tag, Upload } from 'antd';
 import { useState } from 'react';
 import { useCreateMentorVerification } from '../../hooks/mentor/verification';
 import { useGetChapters } from '../../hooks/student/chapter';

const MentorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('unverified'); // 'unverified' | 'pending' | 'verified'
  const [form] = Form.useForm();
  const verifyMutation = useCreateMentorVerification();
  const { data: chapters = [], isLoading: chaptersLoading } = useGetChapters();

  const mentorProfile = {
    name: 'Trần Minh Mentor',
    email: 'mentor@fpt.edu.vn',
    phone: '0909 888 777',
    position: 'Senior Engineer',
    organization: 'FPT Software',
    avatar: null,
    bio: '10+ năm kinh nghiệm phát triển hệ thống phân tán, mentor về backend & cloud.',
    location: 'Hồ Chí Minh, Việt Nam',
    joinDate: '2022-05-15',
    specializations: ['Backend', 'Microservices', 'Cloud', 'DevOps', 'System Design'],
    interests: ['Coaching', 'Architecture', 'Performance Tuning'],
    availability: 'Tối 3-5-7 (19:00 - 21:00)',
  };

  const stats = [
    { title: 'Teams đã mentor', value: 12, icon: <TeamOutlined className="text-primary text-xl" /> },
    { title: 'Buổi mentoring', value: 48, icon: <ClockCircleOutlined className="text-secondary text-xl" /> },
    { title: 'Điểm đánh giá', value: 4.8, suffix: '/5', icon: <StarOutlined className="text-tertiary text-xl" /> },
    { title: 'Chuyên môn chính', value: 'Backend', icon: <BookOutlined className="text-primary text-xl" /> },
  ];

  const achievements = [
    { id: '1', name: 'Top Mentor Q1', description: 'Mentor được đánh giá cao nhất quý 1', date: '2024-03-10', icon: '🏆' },
    { id: '2', name: 'Architecture Guild', description: 'Dẫn dắt guild kiến trúc cho SEPE', date: '2023-12-05', icon: '🧭' },
  ];

  const recentActivity = [
    { id: '1', type: 'session', title: 'Mentor buổi Design API cho Team Phoenix', description: 'Chủ đề: REST vs GraphQL', date: '2024-04-02', status: 'success' },
    { id: '2', type: 'review', title: 'Review code Team Atlas', description: 'Chủ đề: Observability', date: '2024-03-28', status: 'success' },
    { id: '3', type: 'plan', title: 'Lên lịch mentoring tuần tới', description: '3 buổi cho 2 team', date: '2024-03-25', status: 'info' },
  ];

  const handleSaveProfile = (values) => {
    console.log('Saving mentor profile:', values);
    setIsEditing(false);
    message.success('Cập nhật hồ sơ mentor thành công!');
  };

  const tabItems = [
    {
      key: '1',
      label: 'Tổng quan',
      children: (
        <div className="space-y-6">
          <Card className="bg-card-background border border-card-border backdrop-blur-xl">
            <div className="flex items-start gap-6">
              <Avatar size={100} icon={<UserOutlined />} />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-text-primary mb-1">{mentorProfile.name}</h2>
                    <p className="text-muted-foreground mb-1">{mentorProfile.email}</p>
                    <p className="text-muted-foreground">{mentorProfile.phone}</p>
                  </div>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0"
                    onClick={() => setIsEditing(true)}
                  >
                    Chỉnh sửa hồ sơ
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-text-secondary mb-1">Tổ chức</label>
                    <p className="text-text-primary">{mentorProfile.organization}</p>
                  </div>
                  <div>
                    <label className="block text-text-secondary mb-1">Vị trí</label>
                    <p className="text-text-primary">{mentorProfile.position}</p>
                  </div>
                  <div>
                    <label className="block text-text-secondary mb-1">Địa điểm</label>
                    <p className="text-text-primary">{mentorProfile.location}</p>
                  </div>
                  <div>
                    <label className="block text-text-secondary mb-1">Ngày tham gia</label>
                    <p className="text-text-primary">{mentorProfile.joinDate}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-text-secondary mb-2">Giới thiệu</label>
                  <p className="text-text-primary bg-card-background/50 p-3 rounded-lg border border-card-border">
                    {mentorProfile.bio}
                  </p>
                </div>

                <div className="mt-4">
                  <label className="block text-text-secondary mb-2">Thời gian có thể mentor</label>
                  <p className="text-text-primary">{mentorProfile.availability}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="bg-card-background border border-card-border backdrop-blur-xl text-center"
              >
                <Statistic
                  title={<span className="text-text-secondary">{stat.title}</span>}
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.icon}
                  valueStyle={{ color: 'white', fontSize: '20px' }}
                />
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Chuyên môn & Sở thích',
      children: (
        <div className="space-y-6">
          <Card className="bg-card-background border border-card-border backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Chuyên môn</h3>
            <div className="flex flex-wrap gap-2">
              {mentorProfile.specializations.map((skill) => (
                <Tag key={skill} className="bg-primary/20 text-primary border-primary/30">
                  {skill}
                </Tag>
              ))}
            </div>
          </Card>

          <Card className="bg-card-background border border-card-border backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Sở thích</h3>
            <div className="flex flex-wrap gap-2">
              {mentorProfile.interests.map((interest) => (
                <Tag key={interest} className="bg-secondary/20 text-secondary border-secondary/30">
                  {interest}
                </Tag>
              ))}
            </div>
          </Card>
        </div>
      ),
    },
    {
      key: '3',
      label: 'Thành tích',
      children: (
        <Card className="bg-card-background border border-card-border backdrop-blur-xl">
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-4 p-4 bg-card-background/50 rounded-lg border border-card-border"
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="text-text-primary font-medium m-0">{achievement.name}</h4>
                  <p className="text-muted-foreground text-sm m-0">{achievement.description}</p>
                  <p className="text-muted-foreground text-xs m-0">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ),
    },
    {
      key: '4',
      label: 'Hoạt động gần đây',
      children: (
        <Card className="bg-card-background border border-card-border backdrop-blur-xl">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 bg-card-background/50 rounded-lg border border-card-border"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success'
                      ? 'bg-green-400'
                      : activity.status === 'info'
                        ? 'bg-blue-400'
                        : 'bg-gray-400'
                  }`}
                />
                <div className="flex-1">
                  <h4 className="text-text-primary font-medium m-0">{activity.title}</h4>
                  <p className="text-muted-foreground text-sm m-0">{activity.description}</p>
                  <p className="text-muted-foreground text-xs m-0">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ),
    },
    {
      key: '5',
      label: 'Cài đặt',
      children: (
        <div className="space-y-6">
          <Card className="bg-card-background border border-card-border backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Thông tin cá nhân</h3>
            <Form
              layout="vertical"
              className="max-w-md"
              onFinish={handleSaveProfile}
              disabled={!isEditing}
            >
              <Form.Item label="Họ và tên" name="name" initialValue={mentorProfile.name}>
                <Input />
              </Form.Item>
              <Form.Item label="Email" name="email" initialValue={mentorProfile.email}>
                <Input />
              </Form.Item>
              <Form.Item label="Điện thoại" name="phone" initialValue={mentorProfile.phone}>
                <Input />
              </Form.Item>
              <Form.Item label="Tổ chức" name="organization" initialValue={mentorProfile.organization}>
                <Input />
              </Form.Item>
              <Form.Item label="Vị trí" name="position" initialValue={mentorProfile.position}>
                <Input />
              </Form.Item>
              <Form.Item label="Địa điểm" name="location" initialValue={mentorProfile.location}>
                <Input />
              </Form.Item>
              <Form.Item label="Giới thiệu" name="bio" initialValue={mentorProfile.bio}>
                <Input.TextArea rows={3} />
              </Form.Item>

              {isEditing && (
                <div className="flex space-x-2">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0"
                  >
                    Lưu thay đổi
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                </div>
              )}
            </Form>
          </Card>

          <Card className="bg-card-background border border-card-border backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Bảo mật</h3>
            <div className="space-y-4">
              <Button
                icon={<LockOutlined />}
                className="w-full justify-start border-white/20 bg-white/5 hover:bg-white/10"
              >
                Đổi mật khẩu
              </Button>
              <Button
                icon={<BellOutlined />}
                className="w-full justify-start border-white/20 bg-white/5 hover:bg-white/10"
              >
                Cài đặt thông báo
              </Button>
            </div>
          </Card>
        </div>
      ),
    },
    {
      key: '6',
      label: 'Xác minh mentor',
      children: (
        <Card className="bg-card-background border border-card-border backdrop-blur-xl">
          <div className="space-y-4">
            {verificationStatus === 'verified' ? (
              <Alert
                type="success"
                message="Bạn đã được xác minh"
                description="Hồ sơ mentor đã được xác thực. Không cần gửi lại."
                showIcon
                className="bg-green-500/10 border-green-500/30 text-white"
              />
            ) : (
              <>
                <Alert
                  type="info"
                  message="Gửi yêu cầu xác minh mentor"
                  description="Cung cấp thông tin và CV để chapter phê duyệt."
                  showIcon
                  className="bg-blue-500/10 border-blue-500/30 text-white"
                />
                <Form
                  layout="vertical"
                  form={form}
                  onFinish={(values) => {
                    const payload = {
                      fullName: values.fullName,
                      email: values.email,
                      phone: values.phone,
                      position: values.position,
                      reasonToBecomeMentor: values.reasonToBecomeMentor,
                      hackathonId: values.hackathonId ? Number(values.hackathonId) : undefined,
                      chapterId: values.chapterId ? Number(values.chapterId) : undefined,
                      cvFile: values.cvFile?.[0]?.originFileObj,
                    };
                    verifyMutation.mutate(payload, {
                      onSuccess: () => {
                        setVerificationStatus('pending');
                        form.resetFields();
                      },
                    });
                  }}
                  className="max-w-2xl"
                >
                  <Form.Item
                    label="Họ tên"
                    name="fullName"
                    rules={[{ required: true, message: 'Nhập họ tên' }]}
                    initialValue={mentorProfile.name}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}
                    initialValue={mentorProfile.email}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Điện thoại"
                    name="phone"
                    rules={[{ required: true, message: 'Nhập điện thoại' }]}
                    initialValue={mentorProfile.phone}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Vị trí / Chức vụ"
                    name="position"
                    rules={[{ required: true, message: 'Nhập vị trí' }]}
                    initialValue={mentorProfile.position}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Lý do muốn làm mentor"
                    name="reasonToBecomeMentor"
                    rules={[{ required: true, message: 'Nhập lý do' }]}
                  >
                    <Input.TextArea rows={3} />
                  </Form.Item>
                  <Form.Item label="HackathonId (tùy chọn)" name="hackathonId">
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item label="Chapter (tùy chọn)" name="chapterId">
                    <Select
                      allowClear
                      placeholder="Chọn chapter"
                      loading={chaptersLoading}
                      optionFilterProp="children"
                      showSearch
                      filterOption={(input, option) =>
                        option?.children?.toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {Array.isArray(chapters) &&
                        chapters.map((ch) => (
                          <Select.Option key={ch.chapterId} value={ch.chapterId}>
                            {ch.name || `Chapter ${ch.chapterId}`}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="CV / Portfolio (PDF)"
                    name="cvFile"
                    rules={[{ required: true, message: 'Tải lên CV/Portfolio' }]}
                    valuePropName="fileList"
                    getValueFromEvent={(e) => e?.fileList}
                  >
                    <Upload
                      beforeUpload={() => false}
                      maxCount={1}
                      accept=".pdf,.doc,.docx"
                      listType="text"
                    >
                      <Button>Tải CV</Button>
                    </Upload>
                  </Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={verifyMutation.isPending}
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0"
                    >
                      Gửi xác minh
                    </Button>
                    <Button onClick={() => form.resetFields()} disabled={verifyMutation.isPending}>
                      Xóa dữ liệu
                    </Button>
                  </Space>
                </Form>
              </>
            )}
          </div>
        </Card>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            Hồ sơ mentor
          </h1>
          <p className="text-muted-foreground mt-2">Quản lý thông tin mentor và hoạt động mentoring</p>
        </div>
        <Button
          icon={<LogoutOutlined />}
          className="border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-all"
          danger
        >
          Đăng xuất
        </Button>
      </div>

      <Tabs
        defaultActiveKey="1"
        items={tabItems}
        className="[&_.ant-tabs-tab]:text-text-secondary [&_.ant-tabs-tab-active]:text-primary [&_.ant-tabs-ink-bar]:bg-primary [&_.ant-tabs-content]:text-white"
      />
    </div>
  );
};

export default MentorProfile;

