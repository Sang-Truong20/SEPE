import { Spin, ConfigProvider, theme } from 'antd';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useHackathonPhases } from '../../../../hooks/admin/hackathon-phases/useHackathonPhases';
import { PATH_NAME } from '../../../../constants';
import EntityDetail from '../../../../components/ui/EntityDetail.jsx';

const HackathonPhaseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const hackathonId = searchParams.get('hackathonId');

    const { fetchHackathonPhase } = useHackathonPhases();
    const { data: phase, isLoading, error } = fetchHackathonPhase(id);

    const model = {
        modelName: 'HackathonPhases',
        fields: [
            { key: 'Tên Phase', type: 'input', name: 'phaseName' },
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
            },
            { key: 'Hackathon ID', type: 'input', name: 'hackathonId' }
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
                entityName="Giai đoạn"
                model={model}
                data={phase || {}}
                onBack={() => navigate(`${PATH_NAME.ADMIN_HACKATHON_PHASES}?hackathonId=${hackathonId}`)}
                onEdit={(rec) => navigate(`/admin/hackathons/hackathon-phases/edit/${rec.phaseId}?hackathonId=${hackathonId}`)}
                showEdit
            />
        </ConfigProvider>
    );
};

export default HackathonPhaseDetail;
