// src/pages/admin/tracks/TrackDetail.jsx (ĐÃ TỐI ƯU HOÀN HẢO)
import { Spin, ConfigProvider, theme, Card, Modal, Button } from 'antd';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTracks } from '../../../../hooks/admin/tracks/useTracks';
import { useChallenges } from '../../../../hooks/admin/challanges/useChallenges.js';
import EntityDetail from '../../../../components/ui/EntityDetail.jsx';
import EntityTable from '../../../../components/ui/EntityTable.jsx';
import { PATH_NAME } from '../../../../constants';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useCriteria } from '../../../../hooks/admin/criterias/useCriteria.js';

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

  // Lấy challenge nếu có
  const { fetchChallenge } = useChallenges();
  const { data: challenge, isLoading: challengeLoading } = fetchChallenge(
    track?.challengeId,
  );

  // Lấy tiêu chí chỉ của phase này → sau đó filter theo trackId ở client (vì backend chưa hỗ trợ filter trackId)
  const { fetchCriteria, deleteCriterion } = useCriteria();
  const { data: phaseCriteria = [], isLoading: criteriaLoading } =
    fetchCriteria(phaseId);

  // Chỉ lấy tiêu chí thuộc track hiện tại
  const trackCriteria = phaseCriteria.filter(
    (c) =>
      String(c.trackId) === String(trackId) ||
      (c.trackId === null && trackId === null),
  );

  const model = {
    modelName: 'Tracks',
    fields: [
      { key: 'Tên Track', type: 'input', name: 'name' },
      { key: 'Mô tả', type: 'textarea', name: 'description' },
      {
        key: 'Challenge',
        type: 'url',
        name: 'challengeId',
        href: `${PATH_NAME.ADMIN_CHALLENGES}/${track?.challengeId}`,
        linkText: challenge?.title || track?.challengeId || '--',
      },
    ],
  };

  const criteriaTableModel = {
    entityName: 'Tiêu chí chấm điểm',
    rowKey: 'criteriaId',
    createButton: {
      label: 'Thêm tiêu chí',
      action: () =>
        navigate(
          `${PATH_NAME.ADMIN_CRITERIAS}/create?phaseId=${phaseId}&trackId=${trackId}&hackathonId=${hackathonId}`,
        ),
    },
    columns: [
      {
        title: 'Tên tiêu chí',
        dataIndex: 'name',
        key: 'name',
        className: 'font-medium',
      },
      {
        title: 'Trọng số',
        dataIndex: 'weight',
        key: 'weight',
        className: 'text-gray-400',
      },
    ],
    actions: { view: true, edit: true, delete: true },
  };

  const criteriaHandlers = {
    onView: (record) =>
      navigate(
        `${PATH_NAME.ADMIN_CRITERIAS}/${record.criteriaId}?phaseId=${phaseId}&trackId=${trackId}&hackathonId=${hackathonId}`,
      ),
    onEdit: (record) =>
      navigate(
        `${PATH_NAME.ADMIN_CRITERIAS}/edit/${record.criteriaId}?phaseId=${phaseId}&trackId=${trackId}&hackathonId=${hackathonId}`,
      ),
    onDelete: (record) => {
      Modal.confirm({
        title: 'Xóa tiêu chí',
        icon: <ExclamationCircleOutlined />,
        content: `Xóa tiêu chí "${record.name}"? Hành động này không thể hoàn tác.`,
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk: () => {
          deleteCriterion.mutate(record.criteriaId);
        },
      });
    },
    isDeleting: (record) =>
      deleteCriterion.isPending &&
      deleteCriterion.variables === record.criteriaId,
  };

  if (trackError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Lỗi tải track
      </div>
    );
  if (trackLoading || challengeLoading || criteriaLoading) {
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
        entityName="Track"
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
        <Card className="mt-16 border border-white/10 bg-white/5 rounded-xl">
          <EntityTable
            model={criteriaTableModel}
            data={trackCriteria}
            loading={criteriaLoading}
            handlers={criteriaHandlers}
            emptyText="Chưa có tiêu chí chấm điểm nào cho track này"
          />
        </Card>
      </EntityDetail>
    </ConfigProvider>
  );
};

export default TrackDetail;
