import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ConfigProvider, theme, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useTeams } from '../../../hooks/admin/teams/useTeams'; // Đã đổi từ useSeasons
import EntityTable from '../../../components/ui/EntityTable.jsx';

const Teams = () => {
    const navigate = useNavigate();
    const { fetchTeams, deleteTeam } = useTeams(); // Đổi hook
    const { data: teamsData = [], isLoading, error } = fetchTeams;
    const [deletingId, setDeletingId] = useState(null);

    // Model cho bảng Teams
    const tableModel = useMemo(() => ({
        entityName: 'đội',
        rowKey: 'teamId',
        columns: [
            {
                title: 'Tên đội',
                dataIndex: 'teamName',
                key: 'teamName',
                type: 'text',
                className: 'font-medium text-white'
            },
            {
                title: 'Chương',
                dataIndex: 'chapterId',
                key: 'chapterId',
                type: 'tag',
                tagColor: 'blue',
                transform: (val) => `Chương ${val}`
            },
            {
                title: 'Leader ID',
                dataIndex: 'leaderId',
                key: 'leaderId',
                type: 'text',
                transform: (val) => `User #${val}`
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
            view: true,   // Chỉ giữ Xem
            delete: true  // Chỉ giữ Xóa
            // Không có edit
        }
    }), [navigate]);

    const handleDeleteConfirm = (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn xóa đội này không?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            centered: true,
            onOk: () => {
                setDeletingId(id);
                deleteTeam.mutate(id, {
                    onSettled: () => setDeletingId(null)
                });
            }
        });
    };

    const handlers = {
        onView: (record) => navigate(`/admin/team/${record.teamId}`),
        // onEdit: BỎ HOÀN TOÀN
        onDelete: (record) => handleDeleteConfirm(record.teamId),
        isDeleting: (record) => deletingId === record.teamId
    };

    if (error) {
        return (
            <div className="bg-dark-secondary border border-dark-accent rounded-xl p-6 shadow-md text-red-400">
                Lỗi tải dữ liệu Teams.
            </div>
        );
    }

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorBggContainer: '#111111',
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
                    data={teamsData}
                    loading={isLoading}
                    handlers={handlers}
                    emptyText="Không có đội nào"
                    dateFormatter={(value, fmt) => value ? dayjs(value).format(fmt) : '--'}
                />
            </div>
        </ConfigProvider>
    );
};

export default Teams;