import { Spin, ConfigProvider, theme } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useSeasons } from '../../../../hooks/admin/seasons/useSeasons';
import { PATH_NAME } from '../../../../constants';
import EntityDetail from '../../../../components/ui/EntityDetail.jsx';

const SeasonDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchSeason } = useSeasons();
    const { data: season, isLoading, error } = fetchSeason(id);

    const model = {
        modelName: 'Seasons',
        fields: [
            { key: 'Tên Season', type: 'input', name: 'name' },
            { key: 'Mã Season', type: 'input', name: 'seasonCode' },
            {
                type: 'column',
                items: [
                    [
                        { key: 'Ngày bắt đầu', type: 'datetime', name: 'startDate', format: 'DD/MM/YYYY HH:mm' }
                    ],
                    [
                        { key: 'Ngày kết thúc', type: 'datetime', name: 'endDate', format: 'DD/MM/YYYY HH:mm' }
                    ]
                ]
            }
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
                <Spin size="large" />
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
                entityName="Season"
                model={model}
                data={season || {}}
                onBack={() => navigate(PATH_NAME.ADMIN_SEASON)}
                onEdit={(rec) => navigate(`/admin/season/edit/${rec.seasonId}`)}
                showEdit
            />
        </ConfigProvider>
    );
};

export default SeasonDetail;
