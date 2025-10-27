import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ConfigProvider, theme, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { PATH_NAME } from '../../../constants';
import { useSeasons } from '../../../hooks/admin/seasons/useSeasons';
import EntityTable from '../../../components/ui/EntityTable.jsx';

const Seasons = () => {
    const navigate = useNavigate();
    const { fetchSeasons, deleteSeason } = useSeasons();
    const { data: seasonsData = [], isLoading, error } = fetchSeasons;
    const [deletingId, setDeletingId] = useState(null);

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
                title: 'Mã Season',
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
        Modal.confirm({
            title: 'Xác nhận xóa',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn xóa season này không?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            centered: true,
            onOk: () => {
                setDeletingId(id);
                deleteSeason.mutate(id, {
                    onSettled: () => setDeletingId(null)
                });
            }
        });
    };

    const handlers = {
        onView: (record) => navigate(`/admin/season/${record.seasonId}`),
        onEdit: (record) => navigate(`/admin/season/edit/${record.seasonId}`),
        onDelete: (record) => handleDeleteConfirm(record.seasonId),
        isDeleting: (record) => deletingId === record.seasonId
    };

    if (error) {
        return (
            <div className="bg-dark-secondary border border-dark-accent rounded-xl p-6 shadow-md text-red-400">
                Lỗi tải dữ liệu Seasons.
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
                    data={seasonsData}
                    loading={isLoading}
                    handlers={handlers}
                    emptyText="Không có mùa nào"
                    dateFormatter={(value, fmt) => value ? dayjs(value).format(fmt) : '--'}
                />
            </div>
        </ConfigProvider>
    );
};

export default Seasons;
