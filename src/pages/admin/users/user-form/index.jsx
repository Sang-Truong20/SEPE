import { ConfigProvider, theme, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import CreateEditForm from '../../../../components/ui/CreateEditForm.jsx';
import { useUsers } from '../../../../hooks/admin/users/useUsers.js';
import { PATH_NAME } from '../../../../constants/index.js';

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchUsers, updateUser } = useUsers();

    // Get user from list
    const { data: users = [], isLoading } = fetchUsers;
    const user = users.find(u => u.userId === parseInt(id));

    // Định nghĩa model
    const model = useMemo(() => ({
        modelName: 'Users',
        fields: [
            {
                key: 'Tên đầy đủ *',
                type: 'input',
                placeholder: 'Nhập tên đầy đủ',
                name: 'fullName',
                required: true,
                message: 'Vui lòng nhập tên đầy đủ'
            },
        ]
    }), []);

    // Initial values
    const initialValues = useMemo(() => {
        if (user) {
            return {
                fullName: user.fullName,
            };
        }
        return {};
    }, [user]);

    // Submit
    const handleSubmit = async (values) => {
        try {
            await updateUser.mutateAsync({ id, payload: values });
            navigate(PATH_NAME.ADMIN_USERS);
        } catch (e) {
            console.error(e);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-400">
                Không tìm thấy người dùng.
            </div>
        );
    }

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorBgContainer: '#111111',
                    colorBgElevated: '#181818',
                    colorBorder: '#2f2f2f',
                    colorText: '#ffffff',
                    colorTextPlaceholder: '#9ca3af',
                    colorPrimary: '#10b981',
                    borderRadius: 4
                }
            }}
        >
            <CreateEditForm
                mode="edit"
                entityName="User"
                model={model}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                submitting={updateUser.isPending}
                submitText="Cập nhật"
                cancelText="Hủy"
                onCancel={() => navigate(PATH_NAME.ADMIN_USERS)}
                onBack={() => navigate(PATH_NAME.ADMIN_USERS)}
            />
        </ConfigProvider>
    );
};

export default UserForm;
