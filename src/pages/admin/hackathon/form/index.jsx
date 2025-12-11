import { Spin, ConfigProvider, theme } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useMemo, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import CreateEditForm from '../../../../components/ui/CreateEditForm.jsx';
import { useHackathons } from '../../../../hooks/admin/hackathons/useHackathons.js';
import { useSeasons } from '../../../../hooks/admin/seasons/useSeasons.js';
import { PATH_NAME } from '../../../../constants/index.js';

const HackathonForm = ({ mode = 'create' }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchHackathon, createHackathon, updateHackathon } = useHackathons();
  const { fetchSeasons } = useSeasons();
  
  const [isReady, setIsReady] = useState(false);
  
  const { data: sessions = [], isLoading: sessionsLoading } = fetchSeasons;
  const { data: hackathon, isLoading: hackathonLoading } = mode === 'edit'
    ? fetchHackathon(id)
    : { data: null, isLoading: false };

  // Đợi data fetch xong
  useEffect(() => {
    if (mode === 'create' && !sessionsLoading) {
      setIsReady(true);
    } else if (mode === 'edit' && !sessionsLoading && !hackathonLoading) {
      setIsReady(true);
    }
  }, [mode, sessionsLoading, hackathonLoading]);

  const selectSessions = useMemo(() => 
    sessions.map(s => ({
      value: String(s.seasonId),
      code: s.seasonCode,
      text: s.name
    })), 
    [sessions]
  );

  // Định nghĩa model - phụ thuộc vào selectSessions
  const model = useMemo(() => ({
    modelName: 'Cuộc thi',
    fields: [
      {
        key: 'Tên Hackathon *',
        type: 'input',
        placeholder: 'VD: SEAL Hackathon 2025',
        name: 'name',
        required: true,
        message: 'Vui lòng nhập tên hackathon'
      },
      {
        key: 'Mùa *',
        type: 'dropdown',
        placeholder: 'Mùa thi...',
        name: 'seasonId',
        required: true,
        message: 'Vui lòng nhập mùa',
        items: selectSessions
      },
      {
        key: 'Mô Tả *',
        type: 'textarea',
        placeholder: 'Mô tả...',
        name: 'description',
        required: true,
        message: 'Vui lòng nhập mô tả'
      },
      {
        type: 'column',
        items: [
          [
            {
              key: 'Ngày bắt đầu *',
              type: 'datetime',
              placeholder: 'dd/mm/yyyy',
              name: 'startDate',
              required: true,
              message: 'Vui lòng chọn ngày bắt đầu'
            }
          ],
          [
            {
              key: 'Ngày kết thúc *',
              type: 'datetime',
              placeholder: 'dd/mm/yyyy',
              name: 'endDate',
              required: true,
              message: 'Vui lòng chọn ngày kết thúc'
            }
          ]
        ]
      },
      {
        key: 'Trạng thái *',
        type: 'dropdown',
        placeholder: 'Chọn trạng thái',
        name: 'status',
        required: true,
        message: 'Vui lòng chọn trạng thái',
        defaultValue: 'Unactive',
        items: [
          { value: 'Pending', text: 'Chờ' },
          { value: 'InProgress', text: 'Đang diễn ra' },
          { value: 'Completed', text: 'Đã hoàn thành' },
          { value: 'Unactive', text: 'Chưa bắt đầu' },
        ]
      }
    ]
  }), [selectSessions]);

  // Initial values cho edit
  const initialValues = useMemo(() => {
    if (mode === 'edit' && hackathon) {
      const matchedSeason = sessions.find(s => s.seasonCode === hackathon.season);
      const seasonId = matchedSeason ? String(matchedSeason.seasonId) : undefined;
      console.log('hackathon initialValues', hackathon, seasonId);
      return {
        ...hackathon,
        startDate: hackathon.startDate ? dayjs(hackathon.startDate) : null,
        seasonId: seasonId,
        endDate: hackathon.endDate ? dayjs(hackathon.endDate) : null,
        registrationDeadline: hackathon.registrationDeadline ? dayjs(hackathon.registrationDeadline) : null
      };
    }
    return { status: 'Unactive' };
  }, [hackathon, mode]);

  // Submit
  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      startDate: values.startDate?.format('YYYY-MM-DD'),
      endDate: values.endDate?.format('YYYY-MM-DD'),
      registrationDeadline: values.registrationDeadline?.format('YYYY-MM-DD'),
    };
    try {
      if (mode === 'create') {
        await createHackathon.mutateAsync(payload);
      } else {
        await updateHackathon.mutateAsync({ id, payload });
      }
      navigate(PATH_NAME.ADMIN_HACKATHONS);
    } catch (e) {
      console.error(e);
    }
  };

  // Loading state
  if (!isReady) {
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
          borderRadius: 4
        }
      }}
    >
      <CreateEditForm
        mode={mode}
        entityName="Hackathon"
        model={model}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitting={createHackathon.isPending || updateHackathon.isPending}
        submitText={mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
        cancelText="Hủy"
        onCancel={() => navigate(PATH_NAME.ADMIN_HACKATHONS)}
        onBack={() => navigate(PATH_NAME.ADMIN_HACKATHONS)}
      />
    </ConfigProvider>
  );
};

export default HackathonForm;