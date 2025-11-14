import { Spin, ConfigProvider, theme } from 'antd';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import CreateEditForm from '../../../../components/ui/CreateEditForm.jsx';
import { useTracks } from '../../../../hooks/admin/tracks/useTracks'; // Giả sử path hook
import { PATH_NAME } from '../../../../constants';

const TrackForm = ({ mode = 'create' }) => {
  const { id: trackId } = useParams(); // trackId cho edit
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phaseId = searchParams.get('phaseId');
  const hackathonId = searchParams.get('hackathonId');

  const { fetchTrackById, createTrack, updateTrack } = useTracks();
  const { data: track, isLoading } =
    mode === 'edit'
      ? fetchTrackById(trackId)
      : { data: null, isLoading: false };

  // Định nghĩa model
  const model = useMemo(
    () => ({
      modelName: 'Tracks',
      fields: [
        {
          key: 'Tên Track *',
          type: 'input',
          placeholder: 'VD: AI Track, Web3 Track...',
          name: 'name',
          required: true,
          message: 'Vui lòng nhập tên track',
        },
        {
          key: 'Mô tả',
          type: 'textarea',
          placeholder: 'Mô tả chi tiết về track...',
          name: 'description',
          rows: 4,
        },
      ],
    }),
    [],
  );

  // Initial values cho edit
  const initialValues = useMemo(() => {
    if (mode === 'edit' && track) {
      return {
        ...track,
      };
    }
    return {};
  }, [track, mode]);

  // Submit
  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      phaseId: parseInt(phaseId),
    };

    try {
      if (mode === 'create') {
        await createTrack.mutateAsync(payload);
      } else {
        await updateTrack.mutateAsync({ id: trackId, payload });
      }
      navigate(
        `${PATH_NAME.ADMIN_HACKATHON_PHASES}/${phaseId}?hackathonId=${hackathonId}`,
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
        entityName="Track"
        model={model}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitting={createTrack.isPending || updateTrack.isPending}
        submitText={mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
        cancelText="Hủy"
        onCancel={() =>
          navigate(
            `${PATH_NAME.ADMIN_HACKATHON_PHASES}/${phaseId}?hackathonId=${hackathonId}`,
          )
        }
        onBack={() =>
          navigate(
            `${PATH_NAME.ADMIN_HACKATHON_PHASES}/${phaseId}?hackathonId=${hackathonId}`,
          )
        }
      />
    </ConfigProvider>
  );
};

export default TrackForm;
