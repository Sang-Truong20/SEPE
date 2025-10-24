import { Spin, ConfigProvider, theme } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import CreateEditForm from '../../../../components/ui/CreateEditForm.jsx';
import { useChallenges } from '../../../../hooks/admin/challanges/useChallenges.js';

const ChallengeStatusForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchChallenge, updateChallengeStatus } = useChallenges();
    
    // Chỉ fetch detail để hiển thị thông tin
    const { data: challenge, isLoading } = fetchChallenge(id);

    const model = useMemo(() => ({
        modelName: 'Challenges',
        fields: [
            {
                key: 'Tiêu đề',
                type: 'input',
                name: 'title',
                disabled: true,
                className: 'text-gray-400'
            },
            {
                key: 'Mùa',
                type: 'input',
                name: 'seasonName',
                disabled: true,
                className: 'text-gray-400'
            },
            {
                key: 'Người tạo',
                type: 'input',
                name: 'userName',
                disabled: true,
                className: 'text-gray-400'
            },
            {
                key: 'Trạng thái *',
                type: 'dropdown',
                name: 'status',
                required: true,
                items: [
                    { text: 'Hoàn thành', value: 'complete' },
                    { text: 'Chờ', value: 'pending' },
                ],
                placeholder: 'Chọn trạng thái'
            }
        ]
    }), []);

    // Initial values
    const initialValues = useMemo(() => {
        if (challenge) {
            return {
                title: challenge.title,
                seasonName: challenge.seasonName || 'N/A',
                userName: challenge.userName || 'Ẩn danh',
                status: challenge.status || 'Active'
            };
        }
        return {};
    }, [challenge]);

    // Submit chỉ update status
    const handleSubmit = async (values) => {
        try {
            await updateChallengeStatus.mutateAsync({ 
                id: id, 
                status: values.status 
            });
            navigate(-1); // Quay lại trang trước
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

    if (!challenge) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white">
                Không tìm thấy thử thách
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
                entityName="Trạng thái thử thách"
                model={model}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                submitting={updateChallengeStatus.isPending}
                submitText="Cập nhật trạng thái"
                cancelText="Hủy"
                onCancel={() => navigate(-1)}
                onBack={() => navigate(-1)}
                hideDeleteButton={true}
            />
        </ConfigProvider>
    );
};

export default ChallengeStatusForm;