import { ConfigProvider, theme } from 'antd';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import CreateEditForm from '../../../../components/ui/CreateEditForm.jsx';
import { usePrizes } from '../../../../hooks/admin/prizes/usePrizes';
import { PATH_NAME } from '../../../../constants';

const PrizeForm = ({ mode = 'create' }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hackathonId = searchParams.get('hackathonId');

  const { fetchPrizes, createPrize, updatePrize } = usePrizes();

  // For edit mode, get the prize from the list
  const { data: prizes = [], isLoading } =
    mode === 'edit' ? fetchPrizes(hackathonId) : { data: [], isLoading: false };

  const prize =
    mode === 'edit' ? prizes.find((p) => p.prizeId === parseInt(id)) : null;

  // Định nghĩa model
  const model = useMemo(
    () => ({
      modelName: 'Challenges',
      fields: [
        {
          key: 'Tiêu đề',
          type: 'input',
          name: 'title',
          required: true,
          className: 'text-gray-400',
        },
        {
          key: 'Mùa',
          type: 'input',
          name: 'seasonName',
          required: true,
          className: 'text-gray-400',
        },
        {
          key: 'Người tạo',
          type: 'input',
          name: 'userName',
          required: true,
          className: 'text-gray-400',
        },
        {
          key: 'Trạng thái *',
          type: 'dropdown',
          name: 'status',
          required: true,
          items: [
            { text: 'Hoàn thành', value: 'Complete' },
            { text: 'Chờ', value: 'Pending' },
            { text: 'Hủy', value: 'Cancel' },
          ],
          placeholder: 'Chọn trạng thái',
        },
      ],
    }),
    [],
  );

  // Initial values cho edit
  const initialValues = useMemo(() => {
    if (mode === 'edit' && prize) {
      return {
        prizeName: prize.prizeName,
        prizeType: prize.prizeType,
        rank: prize.rank,
        reward: prize.reward,
      };
    }
    return {};
  }, [prize, mode]);

  // Submit
  const handleSubmit = async (values) => {
    try {
      if (mode === 'create') {
        const payload = {
          ...values,
          hackathonId: parseInt(hackathonId),
          rank: parseInt(values.rank),
        };
        await createPrize.mutateAsync(payload);
      } else {
        const payload = {
          prizeId: parseInt(id),
          prizeName: values.prizeName,
          prizeType: values.prizeType,
          rank: parseInt(values.rank),
          reward: values.reward,
        };
        await updatePrize.mutateAsync(payload);
      }
      navigate(`${PATH_NAME.PARTNER_CHALLENGES}`);
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading && mode === 'edit') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
        entityName="Giải thưởng"
        model={model}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitting={createPrize.isPending || updatePrize.isPending}
        submitText={mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
        cancelText="Hủy"
        onCancel={() => navigate(`${PATH_NAME.PARTNER_CHALLENGES}`)}
        onBack={() => navigate(`${PATH_NAME.PARTNER_CHALLENGES}`)}
      />
    </ConfigProvider>
  );
};

export default PrizeForm;
