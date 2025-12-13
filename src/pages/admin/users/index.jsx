import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ConfigProvider, theme, Modal, Tag, Switch, Select, Form, Button, Space } from 'antd';
import { ExclamationCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useUsers } from '../../../hooks/admin/users/useUsers';
import EntityTable from '../../../components/ui/EntityTable.jsx';

const Users = () => {
    const navigate = useNavigate();
    const { fetchUsers, toggleBlockUser, fetchRoles, changeUserRole } = useUsers();
    const { data: usersData = [], isLoading, error } = fetchUsers;
    const { data: rolesData = [], isLoading: rolesLoading } = fetchRoles;
    const [blockingId, setBlockingId] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ open: false, userId: null, isBlocked: false });
    const [roleModal, setRoleModal] = useState({ open: false, userId: null, userName: '', currentRole: null });
    const [roleForm] = Form.useForm();

    // Model cho bảng users
    const tableModel = useMemo(() => ({
        entityName: 'Người dùng',
        rowKey: 'userId',
        columns: [
            {
                title: 'Tên đầy đủ',
                dataIndex: 'fullName',
                key: 'fullName',
                type: 'text',
                className: 'font-medium text-white'
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                type: 'text',
                className: 'text-gray-300'
            },
            {
                title: 'Vai trò',
                dataIndex: 'roleName',
                key: 'roleName',
                type: 'custom',
                render: (value) => (
                    <Tag color={value === 'Admin' ? 'red' : value === 'Member' ? 'blue' : 'default'}>
                        {value}
                    </Tag>
                )
            },
            {
                title: 'Trạng thái xác thực',
                dataIndex: 'isVerified',
                key: 'isVerified',
                type: 'custom',
                render: (value) => (
                    value ? (
                        <Tag icon={<CheckCircleOutlined />} color="success">
                            Đã xác thực
                        </Tag>
                    ) : (
                        <Tag icon={<CloseCircleOutlined />} color="warning">
                            Chưa xác thực
                        </Tag>
                    )
                )
            },
            {
                title: 'Ngày tạo',
                dataIndex: 'createdAt',
                key: 'createdAt',
                type: 'datetime',
                format: 'DD/MM/YYYY HH:mm'
            },
            {
                title: 'Khóa tài khoản',
                key: 'block',
                type: 'custom',
                render: (value, record) => (
                    <Switch
                        checked={record.isBlocked || false}
                        loading={blockingId === record.userId}
                        onChange={(checked) => handleToggleBlock(record.userId, checked)}
                        checkedChildren="Đã khóa"
                        unCheckedChildren="Hoạt động"
                    />
                )
            }
        ],
        actions: {
            edit: true,
            extra: [
                {
                    key: 'editRole',
                    icon: <UserOutlined />,
                    tooltip: 'Chỉnh sửa vai trò',
                    render: (record) => (
                        <Button
                            type="text"
                            size="small"
                            className="text-white hover:text-primary"
                            icon={<UserOutlined />}
                            onClick={() => handleEditRole(record)}
                        />
                    ),
                },
            ],
        }
    }), [blockingId]);

    const handleToggleBlock = (id, isBlocked) => {
        setConfirmModal({ open: true, userId: id, isBlocked });
    };

    const handleConfirmOk = () => {
        const { userId, isBlocked } = confirmModal;
        setBlockingId(userId);
        toggleBlockUser.mutate({ id: userId, isBlocked }, {
            onSettled: () => {
                setBlockingId(null);
                setConfirmModal({ open: false, userId: null, isBlocked: false });
            }
        });
    };

    const handleConfirmCancel = () => {
        setConfirmModal({ open: false, userId: null, isBlocked: false });
    };

    const handleEditRole = (record) => {
        const currentRole = rolesData.find(r => r.roleName === record.roleName);
        setRoleModal({
            open: true,
            userId: record.userId,
            userName: record.fullName,
            currentRole: currentRole?.roleId || null,
        });
        roleForm.setFieldsValue({ roleId: currentRole?.roleId || null });
    };

    const handleRoleModalOk = async () => {
        try {
            const values = await roleForm.validateFields();
            await changeUserRole.mutateAsync({
                id: roleModal.userId,
                roleId: values.roleId,
            });
            setRoleModal({ open: false, userId: null, userName: '', currentRole: null });
            roleForm.resetFields();
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    const handleRoleModalCancel = () => {
        setRoleModal({ open: false, userId: null, userName: '', currentRole: null });
        roleForm.resetFields();
    };

    const handlers = {
        onEdit: (record) => navigate(`/admin/users/edit/${record.userId}`),
    };


    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorBgContainer: '#111111',
                    colorBorder: '#2f2f2f',
                    colorText: '#ffffff',
                    colorTextPlaceholder: '#9ca3af',
                    colorPrimary: '#10b981',
                    borderRadius: 6
                }
            }}
        >
            <div className="bg-dark-secondary border border-dark-accent rounded-xl p-6 shadow-md">
                <EntityTable
                    model={tableModel}
                    data={usersData}
                    loading={isLoading}
                    handlers={handlers}
                    emptyText="Không có người dùng nào"
                    dateFormatter={(value, fmt) => value ? dayjs(value).format(fmt) : '--'}
                />
            </div>
            <Modal
                title={confirmModal.isBlocked ? 'Xác nhận khóa tài khoản' : 'Xác nhận mở khóa tài khoản'}
                open={confirmModal.open}
                onOk={handleConfirmOk}
                onCancel={handleConfirmCancel}
                okText={confirmModal.isBlocked ? 'Khóa' : 'Mở khóa'}
                okButtonProps={{ danger: confirmModal.isBlocked }}
                cancelText="Hủy"
                centered
            >
                <div className="flex items-start gap-3">
                    <ExclamationCircleOutlined className="text-yellow-500 text-xl mt-1" />
                    <span>
                        {confirmModal.isBlocked
                            ? 'Bạn có chắc chắn muốn khóa tài khoản người dùng này không?'
                            : 'Bạn có chắc chắn muốn mở khóa tài khoản người dùng này không?'}
                    </span>
                </div>
            </Modal>

            <Modal
                title="Chỉnh sửa vai trò"
                open={roleModal.open}
                onOk={handleRoleModalOk}
                onCancel={handleRoleModalCancel}
                okText="Cập nhật"
                cancelText="Hủy"
                confirmLoading={changeUserRole.isPending}
                centered
            >
                <Form form={roleForm} layout="vertical">
                    <div className="mb-4">
                        <p className="text-gray-300 text-sm mb-2">
                            Người dùng: <span className="font-semibold text-white">{roleModal.userName}</span>
                        </p>
                    </div>
                    <Form.Item
                        name="roleId"
                        label="Vai trò"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                    >
                        <Select
                            placeholder="Chọn vai trò"
                            loading={rolesLoading}
                            className="w-full"
                            style={{ backgroundColor: '#1f1f1f' }}
                        >
                            {rolesData.map((role) => (
                                <Select.Option key={role.roleId} value={role.roleId}>
                                    {role.roleName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </ConfigProvider>
    );
};

export default Users;
