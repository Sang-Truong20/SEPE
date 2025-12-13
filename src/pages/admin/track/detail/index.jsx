// src/pages/admin/tracks/TrackDetail.jsx
import { Spin, ConfigProvider, theme, Tag, Space, Button } from 'antd';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTracks } from '../../../../hooks/admin/tracks/useTracks';
import EntityDetail from '../../../../components/ui/EntityDetail.jsx';
import { PATH_NAME } from '../../../../constants';

const TrackDetail = () => {
  const { id: trackId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phaseId = searchParams.get('phaseId');
  const hackathonId = searchParams.get('hackathonId');

  // Lấy dữ liệu track
  const { fetchTrackById } = useTracks();
  const {
    data: track,
    isLoading: trackLoading,
    error: trackError,
  } = fetchTrackById(trackId);


  const model = {
    modelName: 'Hạng mục',
    fields: [
      { key: 'Tên hạng mục', type: 'input', name: 'name' },
      { key: 'Mô tả', type: 'textarea', name: 'description' },
      {
        key: 'Thử thách',
        name: 'challenges',
        type: 'custom',
        ellipsis: true,
        width: 500,
        render: (record) => {
          const challenges = record.challenges || [];
          if (challenges.length === 0) {
            return <Tag color="default">Chưa có thử thách</Tag>;
          }
          return (
            <Space wrap>
              {challenges.map((ch) => {
                return (
                  <Button
                    key={ch.challengeId}
                    size="small"
                    type="primary"
                    ghost
                    className="text-xs"
                    onClick={() =>
                      navigate(`${PATH_NAME.ADMIN_CHALLENGES}/${ch.challengeId}`)
                    }
                  >
                    {ch.title}
                  </Button>
                );
              })}
            </Space>
          );
        },
      },
    ],
  };


    if (trackError)
      return (
        <div className="min-h-screen flex items-center justify-center text-red-500">
          Lỗi tải hạng mục
        </div>
      );
  if (trackLoading) {
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
          colorPrimary: '#10b981',
        },
      }}
    >
      <EntityDetail
        entityName="Hạng mục"
        model={model}
        data={track || {}}
        onBack={() =>
          navigate(
            `${PATH_NAME.ADMIN_HACKATHON_PHASES}/${phaseId}?hackathonId=${hackathonId}`,
          )
        }
        onEdit={() =>
          navigate(
            `${PATH_NAME.ADMIN_TRACKS}/edit/${trackId}?phaseId=${phaseId}&hackathonId=${hackathonId}`,
          )
        }
        showEdit
      >
      </EntityDetail>
    </ConfigProvider>
  );
};

export default TrackDetail;
