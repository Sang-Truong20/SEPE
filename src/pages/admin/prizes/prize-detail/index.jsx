import { ConfigProvider, theme } from 'antd';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { PATH_NAME } from '../../../../constants';
import EntityDetail from '../../../../components/ui/EntityDetail.jsx';
import { usePrizes } from '../../../../hooks/admin/prizes/usePrizes';

const PrizeDetail = () => {
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
            { key: 'Loại Giải', type: 'input', name: 'prizeType' },
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
            },
            { key: 'Hackathon', type: 'input', name: 'hackathonName' }
        ]
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-400">
                Lỗi tải dữ liệu.
            </div>
        );
    }

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
                entityName="Giải thuởng"
                model={model}
                data={prize || {}}
                onBack={() => navigate(`${PATH_NAME.ADMIN_PRIZES}?hackathonId=${hackathonId}`)}
                onEdit={(rec) => navigate(`/admin/hackathons/prizes/edit/${rec.prizeId}?hackathonId=${hackathonId}`)}
                showEdit
            />
        </ConfigProvider>
    );
};

export default PrizeDetail;
