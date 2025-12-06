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
    const [confirmModal, setConfirmModal] = useState({ open: false, teamId: null });

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
                title: 'Leader',
                dataIndex: 'teamLeaderName',
                key: 'leaderId',
                type: 'tag',
                tagColor: 'green',
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
        setConfirmModal({ open: true, teamId: id });
    };

    const handleConfirmOk = () => {
        setDeletingId(confirmModal.teamId);
        deleteTeam.mutate(confirmModal.teamId, {
            onSettled: () => {
                setDeletingId(null);
                setConfirmModal({ open: false, teamId: null });
            }
        });
    };

    const handleConfirmCancel = () => {
        setConfirmModal({ open: false, teamId: null });
    };

    const handlers = {
        onView: (record) => navigate(`/admin/team/${record.teamId}`),
        // onEdit: BỎ HOÀN TOÀN
        onDelete: (record) => handleDeleteConfirm(record.teamId),
        isDeleting: (record) => deletingId === record.teamId
    };


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
            <Modal
                title="Xác nhận xóa"
                open={confirmModal.open}
                onOk={handleConfirmOk}
                onCancel={handleConfirmCancel}
                okText="Xóa"
                okButtonProps={{ danger: true }}
                cancelText="Hủy"
                centered
            >
                <div className="flex items-start gap-3">
                    <ExclamationCircleOutlined className="text-yellow-500 text-xl mt-1" />
                    <span>Bạn có chắc chắn muốn xóa đội này không?</span>
                </div>
            </Modal>
        </ConfigProvider>
    );
};

export default Teams;