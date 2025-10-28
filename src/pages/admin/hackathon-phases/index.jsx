import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ConfigProvider, theme, Modal, Button, Select, Card, Tag } from 'antd';
import { ExclamationCircleOutlined, ArrowLeftOutlined, CalendarOutlined  } from '@ant-design/icons';
import dayjs from 'dayjs';
import { PATH_NAME } from '../../../constants';
import { useHackathonPhases } from '../../../hooks/admin/hackathon-phases/useHackathonPhases';
import { useHackathons } from '../../../hooks/admin/hackathons/useHackathons';
import EntityTable from '../../../components/ui/EntityTable.jsx';

const HackathonPhases = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const hackathonId = searchParams.get('hackathonId');
    const [deletingId, setDeletingId] = useState(null);

    const { fetchHackathons } = useHackathons();
    const { data: hackathons = [], isLoading: hackathonsLoading } = fetchHackathons;

    const { fetchHackathonPhases, deleteHackathonPhase } = useHackathonPhases();
    const { data: phasesData = [], isLoading, error } = fetchHackathonPhases(hackathonId);

    const selectedHackathon = hackathons.find(h => h.hackathonId === parseInt(hackathonId));

    // Model cho bảng phases
    const tableModel = useMemo(() => ({
        entityName: 'giai đoạn',
        rowKey: 'phaseId',
        createButton: hackathonId ? {
            label: 'Tạo mới Phase',
            action: () => navigate(`/admin/hackathons/hackathon-phases/create?hackathonId=${hackathonId}`),
            icon: true
        } : null,
        columns: [
            {
                title: 'Tên Phase',
                dataIndex: 'phaseName',
                key: 'phaseName',
                type: 'text',
                className: 'font-medium text-white'
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
        actions: hackathonId ? {
            view: true,
            edit: true,
            delete: true,
        } : {}
    }), [hackathonId, navigate]);

    const handleDeleteConfirm = (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn xóa phase này không?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            centered: true,
            onOk: () => {
                setDeletingId(id);
                deleteHackathonPhase.mutate(id, {
                    onSettled: () => setDeletingId(null)
                });
            }
        });
    };

    const handlers = {
        onView: (record) => navigate(`/admin/hackathons/hackathon-phases/${record.phaseId}?hackathonId=${hackathonId}`),
        onEdit: (record) => navigate(`/admin/hackathons/hackathon-phases/edit/${record.phaseId}?hackathonId=${hackathonId}`),
        onDelete: (record) => handleDeleteConfirm(record.phaseId),
        isDeleting: (record) => deletingId === record.phaseId
    };

    const handleHackathonChange = (newHackathonId) => {
        setSearchParams({ hackathonId: newHackathonId });
    };

    if (error) {
        return (
            <div className="bg-dark-secondary border border-dark-accent rounded-xl p-6 shadow-md text-red-400">
                Lỗi tải dữ liệu Hackathon Phases.
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
                            placeholder="Chọn hackathon để xem phases"
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
                        data={phasesData}
                        loading={isLoading}
                        handlers={handlers}
                        emptyText="Không có giai đoạn nào cho hackathon này"
                        dateFormatter={(value, fmt) => value ? dayjs(value).format(fmt) : '--'}
                    />
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-400">Vui lòng chọn một hackathon để xem các phases</p>
                    </div>
                )}
            </div>
        </ConfigProvider>
    );
};

export default HackathonPhases;
