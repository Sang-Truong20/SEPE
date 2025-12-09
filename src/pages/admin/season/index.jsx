import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ConfigProvider, theme, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useSeasons } from '../../../hooks/admin/seasons/useSeasons';
import EntityTable from '../../../components/ui/EntityTable.jsx';

const Seasons = () => {
    const navigate = useNavigate();
    const { fetchSeasons, deleteSeason } = useSeasons();
    const { data: seasonsData = [], isLoading, error } = fetchSeasons;
    const [deletingId, setDeletingId] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ open: false, seasonId: null });

    // Model cho bảng seasons
    const tableModel = useMemo(() => ({
        entityName: 'mùa',
        rowKey: 'seasonId',
        createButton: {
            label: 'Tạo mới mùa',
            action: () => navigate('/admin/season/create'),
            icon: true
        },
        columns: [
            {
                title: 'Tên mùa',
                dataIndex: 'name',
                key: 'name',
                type: 'text',
                className: 'font-medium text-white'
            },
            {
                title: 'Mã',
                dataIndex: 'seasonCode',
                key: 'seasonCode',
                type: 'tag',
                tagColor: 'blue',
                transform: (val) => val || 'N/A'
            },
            {
                title: 'Ngày bắt đầu',
                dataIndex: 'startDate',
                key: 'startDate',
                type: 'datetime',
                format: 'DD/MM/YYYY HH:mm'
            },
            {
                title: 'Ngày kết thúc',
                dataIndex: 'endDate',
                key: 'endDate',
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
        setConfirmModal({ open: true, seasonId: id });
    };

    const handleConfirmOk = () => {
        const { seasonId } = confirmModal;
        setDeletingId(seasonId);
        deleteSeason.mutate(seasonId, {
            onSettled: () => {
                setDeletingId(null);
                setConfirmModal({ open: false, seasonId: null });
            }
        });
    };

    const handleConfirmCancel = () => {
        setConfirmModal({ open: false, seasonId: null });
    };

    const handlers = {
        onView: (record) => navigate(`/admin/season/${record.seasonId}`),
        onEdit: (record) => navigate(`/admin/season/edit/${record.seasonId}`),
        onDelete: (record) => handleDeleteConfirm(record.seasonId),
        isDeleting: (record) => deletingId === record.seasonId
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
                    data={seasonsData}
                    loading={isLoading}
                    handlers={handlers}
                    emptyText="Không có mùa nào"
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
                    <span>Bạn có chắc chắn muốn xóa mùa này không?</span>
                </div>
            </Modal>
        </ConfigProvider>
    );
};

export default Seasons;
