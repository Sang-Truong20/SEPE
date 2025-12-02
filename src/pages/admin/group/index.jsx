import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ConfigProvider, theme, Modal, Button, InputNumber, Select, Card, Tag } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useGroups } from '../../../hooks/admin/groups/useGroups';
import EntityTable from '../../../components/ui/EntityTable.jsx';
import { useHackathons } from '../../../hooks/admin/hackathons/useHackathons.js';

const Groups = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const hackathonId = searchParams.get('hackathonId');
    
    const { fetchGroupsByHackathon, autoCreateGroups } = useGroups();
    const { data: groupsData = [], isLoading, error } = fetchGroupsByHackathon(hackathonId);

    // fetch hackathons for select
    const { fetchHackathons } = useHackathons();
    const { data: hackathons = [], isLoading: hackathonsLoading } = fetchHackathons;

    const selectedHackathon = hackathons.find(h => h.hackathonId === parseInt(hackathonId));

    const [teamsPerGroup, setTeamsPerGroup] = useState(1);

    // Model cho bảng groups
    const tableModel = useMemo(() => ({
        entityName: 'bảng đấu',
        rowKey: 'groupId',
        columns: [
            {
                title: 'Tên bảng đấu',
                dataIndex: 'groupName',
                key: 'groupName',
                type: 'text',
                className: 'font-medium text-white'
            },
            {
                title: 'Track ID',
                dataIndex: 'trackId',
                key: 'trackId',
                type: 'tag',
                tagColor: 'blue',
                transform: (val) => val || 'N/A'
            },
            {
                title: 'Số Teams',
                dataIndex: 'teamIds',
                key: 'teamIds',
                type: 'text',
                transform: (val) => Array.isArray(val) ? val.length : 0
            },
            {
                title: 'Ngày Tạo',
                dataIndex: 'createdAt',
                key: 'createdAt',
                type: 'datetime',
                format: 'DD/MM/YYYY HH:mm'
            }
        ],
        actions: {
            view: true,
            edit: false,
            delete: false,
        }
    }), [hackathonId, navigate]);

    const handleAutoCreateGroups = () => {
        Modal.confirm({
            title: 'Tạo bảng đấu Tự Động',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div className="space-y-4">
                    <p>Nhập số lượng teams trong mỗi bảng đấu:</p>
                    <InputNumber
                        min={1}
                        value={teamsPerGroup}
                        onChange={(value) => setTeamsPerGroup(value)}
                        className="w-full"
                        placeholder="Số teams/bảng đấu"
                    />
                </div>
            ),
            okText: 'Tạo',
            cancelText: 'Hủy',
            centered: true,
            onOk: () => {
                autoCreateGroups.mutate({
                    teamsPerGroup: teamsPerGroup,
                    hackathonId: hackathonId
                }, {
                    onSuccess: () => {
                        // nothing extra to do here
                    }
                });
            }
        });
    };

    const handlers = {
        onView: (record) => navigate(`/admin/groups/${record.groupId}?trackId=${record.trackId}`),
    };

    const handleHackathonChange = (newHackathonId) => {
        if (newHackathonId) {
            setSearchParams({ hackathonId: newHackathonId });
        }
    };

    if (!hackathonId) {
        // when no hackathon selected, show a prompt to choose one (like HackathonPhases)
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
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-medium mb-2">Chọn Hackathon</label>
                        <Select
                            placeholder="Chọn hackathon để xem bảng đấu"
                            value={hackathonId}
                            onChange={handleHackathonChange}
                            loading={hackathonsLoading}
                            className="w-full max-w-md"
                            style={{ backgroundColor: '#1f1f1f' }}
                        >
                            {hackathons.map((hackathon) => (
                                <Select.Option
                                    key={hackathon.hackathonId}
                                    value={hackathon.hackathonId.toString()}
                                >
                                    {hackathon.name} ({hackathon.season})
                                </Select.Option>
                            ))}
                        </Select>
                    </div>

                    <div className="text-center py-8">
                        <p className="text-gray-400">Vui lòng chọn một hackathon để xem các bảng đấu.</p>
                    </div>
                </div>
            </ConfigProvider>
        );
    }

    if (error) {
        return (
            <div className="bg-dark-secondary border border-dark-accent rounded-xl p-6 shadow-md text-red-400">
                Lỗi tải dữ liệu Groups.
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
            <div className="space-y-4">
                <div className="flex justify-end">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAutoCreateGroups}
                        size="large"
                        loading={autoCreateGroups.isPending}
                        disabled={!hackathonId}
                    >
                        Tạo bảng đấu Tự Động
                    </Button>
                </div>

                <div className="bg-dark-secondary border border-dark-accent rounded-xl p-6 shadow-md">
                    {/* Selected hackathon info (optional) */}
                    {selectedHackathon && (
                        <Card
                            bordered={false}
                            className="bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg mb-4"
                            title={<h3 className="text-white font-semibold text-lg">Hackathon đã chọn</h3>}
                        >
                            <div className="space-y-2">
                                <p className="text-gray-200 text-base font-medium">{selectedHackathon.name} - {selectedHackathon.season}</p>
                                <p className="text-gray-400 text-sm italic">{selectedHackathon.theme}</p>

                                <div className="flex items-center gap-3 pt-2">
                                    <Tag color="green" icon={<CalendarOutlined />} className="flex items-center gap-1">
                                        <span className="text-sm text-gray-100">{selectedHackathon.startDate}</span>
                                    </Tag>
                                    <Tag color="geekblue" icon={<CalendarOutlined />} className="flex items-center gap-1">
                                        <span className="text-sm text-gray-100">{selectedHackathon.endDate}</span>
                                    </Tag>
                                </div>
                            </div>
                        </Card>
                    )}

                    <EntityTable
                        model={tableModel}
                        data={groupsData}
                        loading={isLoading}
                        handlers={handlers}
                        emptyText="Không có bảng đấu nào"
                        dateFormatter={(value, fmt) => value ? dayjs(value).format(fmt) : '--'}
                    />
                </div>
            </div>
        </ConfigProvider>
    );
};

export default Groups;
