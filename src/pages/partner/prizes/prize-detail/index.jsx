import { ConfigProvider, Tag, theme } from 'antd';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { PATH_NAME } from '../../../../constants';
import EntityDetail from '../../../../components/ui/EntityDetail.jsx';
import { usePrizes } from '../../../../hooks/admin/prizes/usePrizes';

const PrizeDetail = () => {
    const prizeTypes = [
        { value: 'Cash', text: 'Tiền mặt' },
        { value: 'Certificate', text: 'Chứng nhận' },
        { value: 'Medal', text: 'Huy chương' },
        { value: 'Gift', text: 'Quà tặng' },
    ];
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const hackathonId = searchParams.get('hackathonId');

    // Since we don't have a single prize endpoint, we'll get it from the list
    const { fetchPrizes } = usePrizes();
    const { data: prizes = [], isLoading, error } = fetchPrizes(hackathonId);

    const prize = prizes.find(p => p.prizeId === parseInt(id));

    const model = {
        modelName: 'Prizes',
        fields: [
            { key: 'Tên Giải', type: 'input', name: 'prizeName' },
            {
                key: 'Loại Giải',
                type: 'custom',
                name: 'prizeType',
                render: (record) => (
                    <Tag color="gold" className="font-bold">
                        {prizeTypes.find(p => p.value === record.prizeType)?.text || record.prizeType}
                    </Tag>
                ),
            },
            {
                type: 'column',
                items: [
                    [
                        { key: 'Hạng', type: 'input', name: 'rank' }
                    ],
                    [
                        { key: 'Phần Thưởng', type: 'input', name: 'reward' }
                    ]
                ]
            }
        ]
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!prize) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-400">
                Không tìm thấy giải thưởng.
            </div>
        );
    }

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorBgContainer: '#111111',
                    colorBgElevated: '#181818',
                    colorBorder: '#2f2f2f',
                    colorText: '#ffffff',
                    colorTextPlaceholder: '#9ca3af',
                    colorPrimary: '#10b981',
                    borderRadius: 4
                }
            }}
        >
            <EntityDetail
                entityName="Giải thưởng"
                model={model}
                data={prize || {}}
                onBack={() => navigate(`${PATH_NAME.PARTNER_PRIZES}?hackathonId=${hackathonId}`)}
                showEdit={false}
            />
        </ConfigProvider>
    );
};

export default PrizeDetail;

