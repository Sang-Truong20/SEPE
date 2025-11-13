import { Spin, ConfigProvider, theme, Form, Input, InputNumber } from 'antd';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import CreateEditForm from '../../../../components/ui/CreateEditForm.jsx';
import { useCriteria } from '../../../../hooks/admin/criterias/useCriteria.js';
import { PATH_NAME } from '../../../../constants';

const CriterionForm = ({ mode = 'create' }) => {
  const { id: criterionId } = useParams(); // for edit
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phaseId = searchParams.get('phaseId');
  const trackId = searchParams.get('trackId');
  const hackathonId = searchParams.get('hackathonId');

  const { fetchCriterionById, createCriterion, updateCriterion } =
    useCriteria();
  const { data: criterion, isLoading } =
    mode === 'edit'
      ? fetchCriterionById(criterionId)
      : { data: null, isLoading: false };

  // Model for create (batch) and edit (single)
  const model = useMemo(() => {
    if (mode === 'create') {
      return {
        modelName: 'Criteria',
        fields: [
          {
            key: 'Tên Tiêu chí *',
            type: 'input',
            name: 'name',
            required: true,
            message: 'Vui lòng nhập tên',
          },
          {
            key: 'Trọng số *',
            type: 'input',
            name: 'weight',
            required: true,
            message: 'Vui lòng nhập trọng số',
          },
        ],
      };
    } else {
      return {
        modelName: 'Criteria',
        fields: [
          {
            key: 'Tên Tiêu chí *',
            type: 'input',
            placeholder: 'VD: Sáng tạo, Thuyết trình...',
            name: 'name',
            required: true,
            message: 'Vui lòng nhập tên',
          },
          {
            key: 'Trọng số *',
            type: 'input',
            placeholder: 'VD: 0.5',
            name: 'weight',
            required: true,
            message: 'Vui lòng nhập trọng số',
          },
        ],
      };
    }
  }, [mode]);

  const initialValues = useMemo(() => {
    if (mode === 'edit' && criterion) {
      return { ...criterion };
    }
    return { criteria: [{ name: '', weight: 1 }] }; // Default one item for create
  }, [criterion, mode]);

  const handleSubmit = async (values) => {
    const payload =
      mode === 'create'
        ? {
            phaseId: parseInt(phaseId),
            trackId: trackId ? parseInt(trackId) : null,
            ...values,
          }
        : { ...values, trackId: trackId ? parseInt(trackId) : null };

    try {
      if (mode === 'create') {
        await createCriterion.mutateAsync(payload);
      } else {
        await updateCriterion.mutateAsync({ id: criterionId, payload });
      }
      navigate(
        `${PATH_NAME.ADMIN_TRACKS}/${trackId}?phaseId=${phaseId}&hackathonId=${hackathonId}`,
      );
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading && mode === 'edit') {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
      <CreateEditForm
        mode={mode}
        entityName="Tiêu chí"
        model={model}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitting={createCriterion.isPending || updateCriterion.isPending}
        submitText={mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
        cancelText="Hủy"
        onCancel={() =>
          navigate(
            `${PATH_NAME.ADMIN_TRACKS}/${trackId}?phaseId=${phaseId}&hackathonId=${hackathonId}`,
          )
        }
        onBack={() =>
          navigate(
            `${PATH_NAME.ADMIN_TRACKS}/${trackId}?phaseId=${phaseId}&hackathonId=${hackathonId}`,
          )
        }
      />
    </ConfigProvider>
  );
};

export default CriterionForm;
