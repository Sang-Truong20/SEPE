import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ConfigProvider, theme, Tooltip, Drawer, Form, Button, Space, Select } from 'antd';
import dayjs from 'dayjs';
import { useAppeal } from '../../../hooks/admin/appeal/useAppeal';
import EntityTable from '../../../components/ui/EntityTable.jsx';

const Appeals = () => {
    const navigate = useNavigate();
    const { fetchAppeals, updateAppeal } = useAppeal();
    const { data: appealsData = [], isLoading, error } = fetchAppeals;
    const [selectedAppeal, setSelectedAppeal] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [form] = Form.useForm();
    const [updating, setUpdating] = useState(false);

    // Status map for appeal status
    const statusMap = {
        'Pending': { color: 'orange', text: 'Chờ xử lý' },
        'Approved': { color: 'green', text: 'Đã phê duyệt' },
        'Rejected': { color: 'red', text: 'Từ chối' },
    };

    // Appeal type map
    const appealTypeMap = {
        'Penalty': { color: 'red', text: 'Penalty' },
        'Submission': { color: 'blue', text: 'Submission' },
        'Score': { color: 'purple', text: 'Score' },
    };

    // Model cho bảng appeals
    const tableModel = useMemo(() => ({
        entityName: 'khiếu nại',
        rowKey: 'appealId',
        columns: [
            {
                title: 'Tên team',
                dataIndex: 'teamName',
                key: 'teamName',
                type: 'text',
                className: 'font-medium text-white',
                render: (text, record) => (
                    <Tooltip title={text}>
                        <div className="truncate cursor-pointer text-blue-400 hover:text-blue-300" onClick={() => navigate(`/admin/team/${record.teamId}`)}>
                            {text || '--'}
                        </div>
                    </Tooltip>
                ),
            },
            {
                title: 'Loại',
                dataIndex: 'appealType',
                key: 'appealType',
                type: 'tag',
                transform: (val) => val || 'N/A',
                render: (text) => {
                    const config = appealTypeMap[text];
                    return (
                        <Tooltip title={text}>
                            <span style={{
                                display: 'inline-block',
                                backgroundColor: `var(--ant-${config?.color || 'default'})`,
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px'
                            }}>
                                {config?.text || text || '--'}
                            </span>
                        </Tooltip>
                    );
                },
            },
            {
                title: 'Lý do',
                dataIndex: 'reason',
                key: 'reason',
                type: 'text',
                width: 250,
                render: (text) => (
                    <Tooltip title={text}>
                        <div className="truncate text-gray-300">
                            {text || '--'}
                        </div>
                    </Tooltip>
                ),
            },
            {
                title: 'Tin nhắn',
                dataIndex: 'message',
                key: 'message',
                type: 'text',
                width: 250,
                ellipsis: { tooltip: true },
                render: (text) => (
                    <Tooltip title={text}>
                        <div className="truncate text-gray-300">
                            {text || '--'}
                        </div>
                    </Tooltip>
                ),
            },
            {
                title: 'Trạng thái',
                dataIndex: 'status',
                key: 'status',
                type: 'status',
                statusType: 'appeal',
                statusMap: statusMap,
                transform: (val) => val || 'Pending',
            },
            {
                title: 'Phản hồi Admin',
                dataIndex: 'adminResponse',
                key: 'adminResponse',
                type: 'text',
                width: 200,
                ellipsis: { tooltip: true },
                render: (text) => (
                    <Tooltip title={text}>
                        <div className="truncate text-gray-400 text-sm">
                            {text || '--'}
                        </div>
                    </Tooltip>
                ),
            },
            {
                title: 'Người review',
                dataIndex: 'reviewedByName',
                key: 'reviewedByName',
                type: 'text',
                // width: 150,
                render: (text) => (
                    <Tooltip title={text}>
                        <div className="truncate text-gray-300">
                            {text || '--'}
                        </div>
                    </Tooltip>
                ),
            },
            {
                title: 'Ngày tạo',
                dataIndex: 'createdAt',
                key: 'createdAt',
                type: 'datetime',
                format: 'DD/MM/YYYY HH:mm',
                // width: 150,
            },
            {
                title: 'Ngày review',
                dataIndex: 'reviewedAt',
                key: 'reviewedAt',
                type: 'datetime',
                format: 'DD/MM/YYYY HH:mm',
                // width: 150,
                render: (text) => (
                    <span className="text-gray-300">
                        {text ? dayjs(text).format('DD/MM/YYYY HH:mm') : '--'}
                    </span>
                ),
            },
        ],
        actions: {
            edit: true,
        }
    }), [navigate]);

    const handlers = {
        onEdit: (record) => {
            setSelectedAppeal(record);
            form.setFieldsValue({
                status: record.status,
                adminResponse: record.adminResponse || '',
            });
            setDrawerOpen(true);
        },
    };

    const handleUpdateAppeal = async (values) => {
        if (!selectedAppeal) return;

        setUpdating(true);
        try {
            await updateAppeal.mutateAsync({
                id: selectedAppeal.appealId,
                payload: {
                    status: values.status,
                    adminResponse: values.adminResponse,
                },
            });
            setDrawerOpen(false);
            form.resetFields();
            setSelectedAppeal(null);
        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setUpdating(false);
        }
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        form.resetFields();
        setSelectedAppeal(null);
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
                    data={appealsData}
                    loading={isLoading}
                    handlers={handlers}
                    emptyText="Không có khiếu nại nào"
                    dateFormatter={(value, fmt) => value ? dayjs(value).format(fmt) : '--'}
                />
            </div>

            {/* Update Appeal Drawer */}
            <Drawer
                title={`Xử lý khiếu nại - ${selectedAppeal?.teamName || ''}`}
                placement="right"
                onClose={handleDrawerClose}
                open={drawerOpen}
                width={600}
                styles={{
                    body: { backgroundColor: '#111111' }
                }}
            >
                {selectedAppeal && (
                    <div className="space-y-6">
                        {/* Display appeal info */}
                        <div className="space-y-3 bg-dark-primary p-4 rounded-lg">
                            <div>
                                <p className="text-gray-400 text-sm">Loại khiếu nại</p>
                                <p className="text-white font-medium">{selectedAppeal.appealType}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Lý do</p>
                                <p className="text-gray-300">{selectedAppeal.reason || '--'}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Tin nhắn</p>
                                <p className="text-gray-300">{selectedAppeal.message || '--'}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Ngày tạo</p>
                                <p className="text-gray-300">{dayjs(selectedAppeal.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                            </div>
                        </div>

                        {/* Update form */}
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleUpdateAppeal}
                            className="space-y-4"
                        >
                            <Form.Item
                                label="Trạng thái"
                                name="status"
                                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                            >
                                <Select
                                    placeholder="Chọn trạng thái"
                                    options={[
                                        { label: 'Chờ xử lý', value: 'Pending' },
                                        { label: 'Đã phê duyệt', value: 'Approved' },
                                        { label: 'Từ chối', value: 'Rejected' },
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Phản hồi Admin"
                                name="adminResponse"
                                rules={[{ required: true, message: 'Vui lòng nhập phản hồi' }]}
                            >
                                <input
                                    type="text"
                                    placeholder="Nhập phản hồi..."
                                    className="w-full px-3 py-2 bg-dark-secondary border border-dark-accent rounded text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                                />
                            </Form.Item>
                        </Form>

                        {/* Action buttons */}
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={handleDrawerClose}>Hủy</Button>
                            <Button
                                type="primary"
                                loading={updating}
                                onClick={() => form.submit()}
                            >
                                Cập nhật
                            </Button>
                        </Space>
                    </div>
                )}
            </Drawer>
        </ConfigProvider>
    );
};

export default Appeals;

