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
import { Alert, Avatar, Button, Card, Form, Input, Modal, message, Select, Space, Statistic, Tabs, Tag, Upload } from 'antd';
 import { useState } from 'react';
 import { useCreateMentorVerification } from '../../hooks/mentor/verification';
 import { useGetChapters } from '../../hooks/student/chapter';
 import { useGetHackathons } from '../../hooks/student/hackathon';
import { useLogout } from '../../hooks/useLogout';
import { useUpdateUserInfo } from '../../hooks/useUpdateUserInfo';
import { useUserData } from '../../hooks/useUserData';

const MentorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdateNameModalVisible, setIsUpdateNameModalVisible] = useState(false);
  const [updateNameForm] = Form.useForm();
  const [verificationStatus, setVerificationStatus] = useState('unverified'); // 'unverified' | 'pending' | 'verified'
  const [form] = Form.useForm();
  const verifyMutation = useCreateMentorVerification();
  const { data: chapters = [], isLoading: chaptersLoading } = useGetChapters();
  const { data: hackathons = [], isLoading: hackathonsLoading } = useGetHackathons();
  const logout = useLogout();
  const { userInfo, refetch: refetchUserData } = useUserData();
  const updateUserInfoMutation = useUpdateUserInfo();
  const hackathonOptions = Array.isArray(hackathons?.data)
    ? hackathons.data
    : Array.isArray(hackathons)
      ? hackathons
      : [];

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

  // Filter tabs - chỉ hiển thị tab Tổng quan và Cài đặt
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
                    <h2 className="text-2xl font-semibold text-text-primary mb-1">{userInfo?.fullName || userInfo?.name || mentorProfile.name}</h2>
                    <p className="text-muted-foreground mb-1">{userInfo?.email || mentorProfile.email}</p>
                    {userInfo?.roleName && (
                      <p className="text-muted-foreground mb-1">
                        Vai trò: {userInfo.roleName}
                      </p>
                    )}
                    {userInfo?.isVerified !== undefined && (
                      <p className="text-muted-foreground">
                        Trạng thái: {userInfo.isVerified ? 'Đã xác minh' : 'Chưa xác minh'}
                      </p>
                    )}
                  </div>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0"
                    onClick={() => {
                      updateNameForm.setFieldsValue({
                        fullName: userInfo?.fullName || userInfo?.name || mentorProfile.name,
                      });
                      setIsUpdateNameModalVisible(true);
                    }}
                  >
                    Chỉnh sửa hồ sơ
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userInfo?.userId && (
                    <div>
                      <label className="block text-text-secondary mb-1">User ID</label>
                      <p className="text-text-primary">{userInfo.userId}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-text-secondary mb-1">Ngày tham gia</label>
                    <p className="text-text-primary">
                      {userInfo?.createdAt
                        ? new Date(userInfo.createdAt).toLocaleDateString('vi-VN')
                        : 'Chưa có thông tin'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

        </div>
      ),
    },
    {
      key: '2',
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
                  >
                    <Input placeholder="Nhập họ tên" />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}
                  >
                    <Input placeholder="Nhập email" />
                  </Form.Item>
                  <Form.Item
                    label="Điện thoại"
                    name="phone"
                    rules={[{ required: true, message: 'Nhập điện thoại' }]}
                    initialValue={mentorProfile.phone}
                  >
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                  <Form.Item
                    label="Vị trí / Chức vụ"
                    name="position"
                    rules={[{ required: true, message: 'Nhập vị trí' }]}
                    initialValue={mentorProfile.position}
                  >
                    <Input placeholder="Nhập vị trí / chức vụ" />
                  </Form.Item>
                  <Form.Item
                    label="Lý do muốn làm mentor"
                    name="reasonToBecomeMentor"
                    rules={[{ required: true, message: 'Nhập lý do' }]}
                  >
                    <Input.TextArea rows={3} placeholder="Mô tả ngắn lý do bạn muốn trở thành mentor" />
                  </Form.Item>
                  <Form.Item
                    label="Giải Hackathon"
                    name="hackathonId"
                    rules={[{ required: true, message: 'Chọn giải hackathon' }]}
                  >
                    <Select
                      placeholder="Chọn giải hackathon"
                      loading={hackathonsLoading}
                      optionFilterProp="children"
                      showSearch
                      filterOption={(input, option) =>
                        option?.children?.toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {hackathonOptions.map((item) => (
                        <Select.Option key={item.hackathonId} value={item.hackathonId}>
                          {item.name || `Hackathon ${item.hackathonId}`}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Chapter"
                    name="chapterId"
                    rules={[{ required: true, message: 'Chọn chapter' }]}
                  >
                    <Select
                      placeholder="Chọn chapter"
                      loading={chaptersLoading}
                      optionFilterProp="children"
                      showSearch
                      filterOption={(input, option) =>
                        option?.children?.toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {Array.isArray(chapters) &&
                        chapters.map((ch) => {
                          const id = ch.chapterId ?? ch.id;
                          const chapterName = ch.chapterName || ch.name || `Chapter ${id}`;
                          return (
                            <Select.Option key={id} value={id}>
                              {chapterName}
                            </Select.Option>
                          );
                        })}
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
          onClick={() => logout()}
        >
          Đăng xuất
        </Button>
      </div>

      <Tabs
        defaultActiveKey="1"
        items={tabItems}
        className="[&_.ant-tabs-tab]:text-text-secondary [&_.ant-tabs-tab-active]:text-primary [&_.ant-tabs-ink-bar]:bg-primary [&_.ant-tabs-content]:text-white"
      />

      {/* Modal cập nhật tên */}
      <Modal
        title="Cập nhật tên"
        open={isUpdateNameModalVisible}
        onCancel={() => {
          setIsUpdateNameModalVisible(false);
          updateNameForm.resetFields();
        }}
        onOk={() => {
          updateNameForm.submit();
        }}
        okText="Cập nhật"
        cancelText="Hủy"
        confirmLoading={updateUserInfoMutation.isPending}
        className="[&_.ant-modal-content]:bg-dark-secondary [&_.ant-modal-content]:border-white/10 [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white"
      >
        <Form
          form={updateNameForm}
          layout="vertical"
          onFinish={(values) => {
            updateUserInfoMutation.mutate(
              { fullName: values.fullName },
              {
                onSuccess: async () => {
                  setIsUpdateNameModalVisible(false);
                  updateNameForm.resetFields();
                  // Refetch user data to update UI
                  await refetchUserData();
                },
              },
            );
          }}
        >
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input placeholder="Nhập họ và tên" className="bg-white/5 border-white/10 text-white" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MentorProfile;

