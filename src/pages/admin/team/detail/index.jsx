import { Spin, ConfigProvider, theme } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeams } from '../../../../hooks/admin/teams/useTeams'; // Đổi hook
import { PATH_NAME } from '../../../../constants';
import EntityDetail from '../../../../components/ui/EntityDetail.jsx';

const TeamDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchTeam } = useTeams(); // Đổi từ fetchSeason
    const { data: team, isLoading, error } = fetchTeam(id);

    const model = {
        modelName: 'Teams',
        fields: [
            { 
                key: 'Tên đội', 
                type: 'input', 
                name: 'teamName',
                className: 'font-medium text-white'
            },
            { 
                key: 'ID Đội', 
                type: 'id', 
                name: 'teamId'
            },
            { 
                key: 'Chương', 
                type: 'tag', 
                name: 'chapterId',
                tagColor: 'blue',
                transform: (val) => `Chương ${val}`
            },
            { 
                key: 'Leader ID', 
                type: 'tag', 
                name: 'leaderId',
                tagColor: 'purple',
                transform: (val) => `User #${val}`
            },
            {
                key: 'Ngày tạo', 
                type: 'datetime', 
                name: 'createdAt', 
                format: 'DD/MM/YYYY HH:mm'  
            }
        ]
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-400">
                Lỗi tải dữ liệu đội.
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
                entityName="Đội"
                model={model}
                data={team || {}}
                onBack={() => navigate(PATH_NAME.ADMIN_TEAMS)} // Đổi route
                // onEdit: BỎ HOÀN TOÀN → không có nút chỉnh sửa
                showEdit={false}
            />
        </ConfigProvider>
    );
};

export default TeamDetail;