import { Spin, ConfigProvider, theme } from 'antd';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useCriteria } from '../../../../hooks/admin/criterias/useCriteria.js';
import EntityDetail from '../../../../components/ui/EntityDetail.jsx';
import { PATH_NAME } from '../../../../constants';

const CriterionDetail = () => {
  const { id: criterionId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phaseId = searchParams.get('phaseId');
  const trackId = searchParams.get('trackId');
  const hackathonId = searchParams.get('hackathonId');

  const { fetchCriterionById } = useCriteria();
  const {
    data: criterion,
    isLoading: criterionLoading,
    error: criterionError,
  } = fetchCriterionById(criterionId);

  const model = {
    modelName: 'Criteria',
    fields: [
      { key: 'Tên Tiêu chí', type: 'input', name: 'name' },
      { key: 'Trọng số', type: 'input', name: 'weight' },
    ],
  };

  if (criterionError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Lỗi tải dữ liệu.
      </div>
    );
  }

  if (criterionLoading) {
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
          borderRadius: 4,
        },
      }}
    >
      <EntityDetail
        entityName="Tiêu chí"
        model={model}
        data={criterion || {}}
        onBack={() =>
          navigate(
            `${PATH_NAME.ADMIN_TRACKS}/${trackId}?phaseId=${phaseId}&hackathonId=${hackathonId}`,
          )
        }
        onEdit={(rec) =>
          navigate(
            `${PATH_NAME.ADMIN_CRITERIAS}/edit/${rec.criteriaId}?phaseId=${phaseId}&trackId=${trackId}&hackathonId=${hackathonId}`,
          )
        }
        showEdit
      />
    </ConfigProvider>
  );
};

export default CriterionDetail;
