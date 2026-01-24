import {
    EditOutlined,
    LogoutOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Form, Input, Modal, Tabs } from 'antd';
import { useState } from 'react';
import { useLogout } from '../../hooks/useLogout';
import { useUpdateUserInfo } from '../../hooks/useUpdateUserInfo';
import { useUserData } from '../../hooks/useUserData';

const ChapterProfile = () => {
  const [isUpdateNameModalVisible, setIsUpdateNameModalVisible] = useState(false);
  const [updateNameForm] = Form.useForm();
  const logout = useLogout();
  const { userInfo, refetch: refetchUserData } = useUserData();
  const updateUserInfoMutation = useUpdateUserInfo();

  // Filter tabs - chỉ hiển thị tab Tổng quan
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
                    <h2 className="text-2xl font-semibold text-text-primary mb-1">
                      {userInfo?.fullName || userInfo?.name || 'Chapter Leader'}
                    </h2>
                    <p className="text-muted-foreground mb-1">
                      {userInfo?.email || 'Chưa có email'}
                    </p>
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
                        fullName: userInfo?.fullName || userInfo?.name || '',
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
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            Hồ sơ Chapter Leader
          </h1>
          <p className="text-muted-foreground mt-2">Quản lý thông tin Chapter Leader</p>
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

export default ChapterProfile;

