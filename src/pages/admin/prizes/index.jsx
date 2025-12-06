import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ConfigProvider, theme, Modal, Button, Select, Card, Tag } from 'antd';
import { ExclamationCircleOutlined, ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons';
import { PATH_NAME } from '../../../constants';
import { usePrizes } from '../../../hooks/admin/prizes/usePrizes';
import { useHackathons } from '../../../hooks/admin/hackathons/useHackathons';
import EntityTable from '../../../components/ui/EntityTable.jsx';

const Prizes = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const hackathonId = searchParams.get('hackathonId');
    const [deletingId, setDeletingId] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ open: false, prizeId: null });

    const { fetchHackathons } = useHackathons();
    const { data: hackathons = [], isLoading: hackathonsLoading } = fetchHackathons;

    const { fetchPrizes, deletePrize } = usePrizes();
    const { data: prizesData = [], isLoading, error } = fetchPrizes(hackathonId);

    const selectedHackathon = hackathons.find(h => h.hackathonId === parseInt(hackathonId));
    

    // Model cho bảng prizes
    const tableModel = useMemo(() => ({
        entityName: 'Giải thưởng',
        rowKey: 'prizeId',
        createButton: hackathonId ? {
            label: 'Tạo mới Prize',
            action: () => navigate(`/admin/hackathons/prizes/create?hackathonId=${hackathonId}`),
            icon: true
        } : null,
        columns: [
            {
                title: 'Tên Giải',
                dataIndex: 'prizeName',
                key: 'prizeName',
                type: 'text',
                className: 'font-medium text-white'
            },
            {
                title: 'Loại Giải',
                dataIndex: 'prizeType',
                key: 'prizeType',
                type: 'tag',
                tagColor: 'blue',
            },
            {
                title: 'Hạng',
                dataIndex: 'rank',
                key: 'rank',
                type: 'badge',
                transform: (val) => `Hạng ${val}`
            },
            {
                title: 'Phần Thưởng',
                dataIndex: 'reward',
                key: 'reward',
                type: 'text',
                className: 'text-green-400 font-medium'
            },
            {
                title: 'Hackathon',
                dataIndex: 'hackathonName',
                key: 'hackathonName',
                type: 'text',
                className: 'text-gray-300'
            }
        ],
        actions: hackathonId ? {
            view: true,
            edit: true,
            delete: true,
        } : {}
    }), [hackathonId, navigate]);

    const handleDeleteConfirm = (id) => {
        setConfirmModal({ open: true, prizeId: id });
    };

    const handleConfirmOk = () => {
        const { prizeId } = confirmModal;
        setDeletingId(prizeId);
        deletePrize.mutate(prizeId, {
            onSettled: () => {
                setDeletingId(null);
                setConfirmModal({ open: false, prizeId: null });
            }
        });
    };

    const handleConfirmCancel = () => {
        setConfirmModal({ open: false, prizeId: null });
    };

    const handlers = {
        onView: (record) => navigate(`/admin/hackathons/prizes/${record.prizeId}?hackathonId=${hackathonId}`),
        onEdit: (record) => navigate(`/admin/hackathons/prizes/edit/${record.prizeId}?hackathonId=${hackathonId}`),
        onDelete: (record) => handleDeleteConfirm(record.prizeId),
        isDeleting: (record) => deletingId === record.prizeId
    };

    const handleHackathonChange = (newHackathonId) => {
        setSearchParams({ hackathonId: newHackathonId });
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
                <div className="mb-6">
                    <Button
                        onClick={() => navigate(PATH_NAME.ADMIN_HACKATHONS)}
                        type="link"
                        icon={<ArrowLeftOutlined />}
                        className="mb-4 !text-light-primary hover:!text-primary"
                    >
                        Quay lại danh sách Hackathons
                    </Button>

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Chọn Hackathon
                        </label>
                        <Select
                            placeholder="Chọn hackathon để xem prizes"
                            value={hackathonId}
                            onChange={handleHackathonChange}
                            loading={hackathonsLoading}
                            className="w-full max-w-md"
                            style={{ backgroundColor: '#1f1f1f' }}
                        >
                            {hackathons.map(hackathon => (
                                <Select.Option key={hackathon.hackathonId} value={hackathon.hackathonId.toString()}>
                                    {hackathon.name} ({hackathon.season})
                                </Select.Option>
                            ))}
                        </Select>
                    </div>

                    {selectedHackathon && (
                        <Card
                            bordered={false}
                            className="bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg"
                            title={
                            <h3 className="text-white font-semibold text-lg">
                                Hackathon đã chọn
                            </h3>
                            }
                        >
                            <div className="space-y-2">
                            <p className="text-gray-200 text-base font-medium">
                                {selectedHackathon.name} - {selectedHackathon.season}
                            </p>
                            <p className="text-gray-400 text-sm italic">
                                {selectedHackathon.theme}
                            </p>

                            <div className="flex items-center gap-3 pt-2">
                                <Tag
                                color="green"
                                icon={<CalendarOutlined />}
                                className="flex items-center gap-1"
                                >
                                <span className="text-sm text-gray-100">
                                    {selectedHackathon.startDate}
                                </span>
                                </Tag>
                                <Tag
                                color="geekblue"
                                icon={<CalendarOutlined />}
                                className="flex items-center gap-1"
                                >
                                <span className="text-sm text-gray-100">
                                    {selectedHackathon.endDate}
                                </span>
                                </Tag>
                            </div>
                            </div>
                        </Card>
                    )}
                </div>

                {hackathonId ? (
                    <EntityTable
                        model={tableModel}
                        data={prizesData}
                        loading={isLoading}
                        handlers={handlers}
                        emptyText="Không có giải thưởng nào cho hackathon này"
                    />
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-400">Vui lòng chọn một hackathon để xem các giải thưởng</p>
                    </div>
                )}
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
                    <span>Bạn có chắc chắn muốn xóa giải thưởng này không?</span>
                </div>
            </Modal>
        </ConfigProvider>
    );
};

export default Prizes;
