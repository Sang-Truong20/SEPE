import { ConfigProvider, theme } from 'antd';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import CreateEditForm from '../../../../components/ui/CreateEditForm.jsx';
import { useChallenges } from '../../../../hooks/admin/challanges/useChallenges.js';
import { PATH_NAME } from '../../../../constants';

const ChallangeForm = ({ mode = 'create' }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hackathonId = searchParams.get('hackathonId');

  const { fetchChallenge, createChallenge, updateChallenge } = useChallenges();

  const { data: challenge = [], isLoading } =
    mode === 'edit' ? fetchChallenge(id) : { data: [], isLoading: false };

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
  const initialValues =
    mode === 'edit' && challenge
      ? {
          title: challenge.title,
          seasonName: challenge.seasonName,
          userName: challenge.userName,
          status: challenge.status,
        }
      : {};

  // Submit
  const handleSubmit = async (values) => {
    try {
      if (mode === 'create') {
        await createChallenge.mutateAsync(values);
      } else {
        await updateChallenge.mutateAsync({
          id,
          payload: values,
        });
      }

      navigate(PATH_NAME.PARTNER_CHALLENGES);
    } catch (error) {
      console.error(error);
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
        entityName="Thử thách"
        model={model}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitting={createChallenge.isPending || updateChallenge.isPending}
        submitText={mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
        cancelText="Hủy"
        onCancel={() => navigate(`${PATH_NAME.PARTNER_CHALLENGES}`)}
        onBack={() => navigate(`${PATH_NAME.PARTNER_CHALLENGES}`)}
      />
    </ConfigProvider>
  );
};

export default ChallangeForm;
