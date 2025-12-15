import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { ConfigProvider, theme, Button, Select, Card, Tag } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons';
import { PATH_NAME } from '../../../constants';
import { usePrizes } from '../../../hooks/admin/prizes/usePrizes';
import { useHackathons } from '../../../hooks/admin/hackathons/useHackathons';
import EntityTable from '../../../components/ui/EntityTable.jsx';
import { useUserData } from '../../../hooks/useUserData.js';

const Prizes = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const hackathonId = searchParams.get('hackathonId');
    const { userInfo } = useUserData();
    const isPartner = userInfo?.roleName?.toLowerCase() === 'partner';

    const { fetchHackathons } = useHackathons();
    const { data: hackathons = [], isLoading: hackathonsLoading } = fetchHackathons;

    const { fetchPrizes } = usePrizes();
    const { data: prizesData = [], isLoading, error } = fetchPrizes(hackathonId);

    const selectedHackathon = hackathons.find(h => h.hackathonId === parseInt(hackathonId));
    const prizeTypes = [
        { value: 'Cash', text: 'Tiền mặt' },
        { value: 'Medal', text: 'Huy chương' },
        { value: 'Gift', text: 'Quà tặng' },
        { value: 'Certificate', text: 'Chứng nhận' },
    ];

    // Model cho bảng prizes (chỉ xem, không có edit/delete)
    const tableModel = useMemo(() => ({
        entityName: 'Giải thưởng',
        rowKey: 'prizeId',
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
                type: 'custom',
                render: (record, _) => (
                    <Tag color="gold" className="font-bold">
                        {prizeTypes.find(p => p.value === record)?.text || record}
                    </Tag>
                ),
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
            }
        ],
        actions: {
            view: true,
        }
    }), []);

    const handlers = {
        onView: (record) => navigate(`${PATH_NAME.PARTNER_PRIZES}/${record.prizeId}?hackathonId=${hackathonId}`),
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
                        onClick={() => navigate(PATH_NAME.PARTNER_HACKATHONS)}
                        type="link"
                        icon={<ArrowLeftOutlined />}
                        className="mb-4 !text-light-primary hover:!text-primary"
                    >
                        Quay lại
                    </Button>

                    {!isPartner && (
                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                Chọn Hackathon
                            </label>
                            <Select
                                placeholder="Chọn hackathon để xem giải thưởng"
                                value={hackathonId}
                                onChange={handleHackathonChange}
                                loading={hackathonsLoading}
                                className="w-full max-w-md"
                                style={{ backgroundColor: '#1f1f1f' }}
                            >
                                {hackathons.map(hackathon => (
                                    <Select.Option key={hackathon.hackathonId} value={hackathon.hackathonId.toString()}>
                                        {hackathon.name} ({hackathon.seasonName})
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                    )}

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
                                    {selectedHackathon.name} - {selectedHackathon.seasonName}
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
        </ConfigProvider>
    );
};

export default Prizes;

