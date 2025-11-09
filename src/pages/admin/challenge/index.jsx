import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ConfigProvider, theme, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import EntityTable from '../../../components/ui/EntityTable.jsx';
import { useChallenges } from '../../../hooks/admin/challanges/useChallenges.js';

const Challenges = () => {
    const navigate = useNavigate();
    const { fetchChallenges, deleteChallenge } = useChallenges();
    const { data: challengesData = [], isLoading, error } = fetchChallenges;
    const [deletingId, setDeletingId] = useState(null);

    console.log("data", challengesData);
    

    // Model cho bảng challenges
    const tableModel = useMemo(() => ({
        entityName: 'thử thách',
        rowKey: 'challengeId',
        columns: [
            {
                title: 'Tiêu đề',
                dataIndex: 'title',
                key: 'title',
                type: 'text',
                className: 'font-medium text-white'
            },
            {
                title: 'Mùa',
                dataIndex: 'seasonName',
                key: 'seasonName',
                type: 'tag',
                tagColor: 'green',
                transform: (val) => val || 'N/A'
            },
            {
                title: 'Người tạo',
                dataIndex: 'userName',
                key: 'userName',
                type: 'text',
                transform: (val) => val || 'Ẩn danh'
            },
            {
                title: 'Trạng thái',
                dataIndex: 'status',
                key: 'status',
                type: 'tag',
                tagColor: (val) => {
                    return val === 'Complete' ? 'success' : 'processing';
                },
                transform: (val) => val || 'N/A'
            },
            {
                title: 'Ngày tạo',
                dataIndex: 'createdAt',
                key: 'createdAt',
                type: 'datetime',
                format: 'DD/MM/YYYY HH:mm'
            }
        ],
        actions: {
            view: true,
            edit: true,
            delete: true,
        }
    }), [navigate]);

    const handleDeleteConfirm = (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn xóa thử thách này không?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            centered: true,
            onOk: () => {
                setDeletingId(id);
                deleteChallenge.mutate(id, {
                    onSettled: () => setDeletingId(null)
                });
            }
        });
    };

    const handlers = {
        onView: (record) => navigate(`/admin/challenges/${record.challengeId}`),
        onEdit: (record) => navigate(`/admin/challenges/edit/${record.challengeId}`),
        onDelete: (record) => handleDeleteConfirm(record.challengeId),
        isDeleting: (record) => deletingId === record.challengeId
    };

    if (error) {
        return (
            <div className="bg-dark-secondary border border-dark-accent rounded-xl p-6 shadow-md text-red-400">
                Lỗi tải dữ liệu thử thách.
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
                    data={challengesData}
                    loading={isLoading}
                    handlers={handlers}
                    emptyText="Không có thử thách nào"
                    dateFormatter={(value, fmt) => value ? dayjs(value).format(fmt) : '--'}
                />
            </div>
        </ConfigProvider>
    );
};

export default Challenges;