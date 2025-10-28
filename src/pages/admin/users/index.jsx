import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ConfigProvider, theme, Modal, Tag, Switch } from 'antd';
import { ExclamationCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useUsers } from '../../../hooks/admin/users/useUsers';
import EntityTable from '../../../components/ui/EntityTable.jsx';

const Users = () => {
    const navigate = useNavigate();
    const { fetchUsers, toggleBlockUser } = useUsers();
    const { data: usersData = [], isLoading, error } = fetchUsers;
    const [blockingId, setBlockingId] = useState(null);

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
        }
    }), [blockingId]);

    const handleToggleBlock = (id, isBlocked) => {
        Modal.confirm({
            title: isBlocked ? 'Xác nhận khóa tài khoản' : 'Xác nhận mở khóa tài khoản',
            icon: <ExclamationCircleOutlined />,
            content: isBlocked
                ? 'Bạn có chắc chắn muốn khóa tài khoản người dùng này không?'
                : 'Bạn có chắc chắn muốn mở khóa tài khoản người dùng này không?',
            okText: isBlocked ? 'Khóa' : 'Mở khóa',
            okType: isBlocked ? 'danger' : 'primary',
            cancelText: 'Hủy',
            centered: true,
            onOk: () => {
                setBlockingId(id);
                toggleBlockUser.mutate({ id, isBlocked }, {
                    onSettled: () => setBlockingId(null)
                });
            }
        });
    };

    const handlers = {
        onEdit: (record) => navigate(`/admin/users/edit/${record.userId}`),
    };

    if (error) {
        return (
            <div className="bg-dark-secondary border border-dark-accent rounded-xl p-6 shadow-md text-red-400">
                Lỗi tải dữ liệu Users.
            </div>
        );
    }

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
        </ConfigProvider>
    );
};

export default Users;
