import { Spin, ConfigProvider, theme } from 'antd';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import CreateEditForm from '../../../../components/ui/CreateEditForm.jsx';
import { useHackathonPhases } from '../../../../hooks/admin/hackathon-phases/useHackathonPhases';
import { PATH_NAME } from '../../../../constants';

const HackathonPhaseForm = ({ mode = 'create' }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hackathonId = searchParams.get('hackathonId');
  const existingPhaseId = id || searchParams.get('existingPhaseId');

  const { fetchHackathonPhase, createHackathonPhase, updateHackathonPhase } = useHackathonPhases();
  const { data: phase, isLoading } = existingPhaseId > 0 ? fetchHackathonPhase(existingPhaseId) : { data: [], isLoading: false };


  // Định nghĩa model
  const model = useMemo(() => ({
    modelName: 'HackathonPhases',
    fields: [
      {
        key: 'Tên giai đoạn *',
        type: 'input',
        placeholder: 'VD: Round 1, Final Round...',
        name: 'phaseName',
        required: true,
        message: 'Vui lòng nhập tên phase'
      },
      {
        type: 'column',
        items: [
          [
            {
              key: 'Ngày bắt đầu *',
              type: 'datetime',
              placeholder: 'mm/dd/yyyy --:-- --',
              name: 'startDate',
              required: true,
              message: 'Vui lòng chọn ngày bắt đầu',
              rules: [
                { required: true, message: 'Vui lòng chọn ngày bắt đầu' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value) return Promise.resolve();
                    const endDate = getFieldValue('endDate');
                    if (endDate && value.isAfter(endDate)) {
                      return Promise.reject(new Error('Ngày bắt đầu phải trước ngày kết thúc'));
                    }
                    return Promise.resolve();
                  },
                }),
              ],
              dependencies: ['endDate']
            }
          ],
          [
            {
              key: 'Ngày kết thúc *',
              type: 'datetime',
              placeholder: 'mm/dd/yyyy --:-- --',
              name: 'endDate',
              required: true,
              message: 'Vui lòng chọn ngày kết thúc',
              rules: [
                { required: true, message: 'Vui lòng chọn ngày kết thúc' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value) return Promise.resolve();
                    const startDate = getFieldValue('startDate');
                    if (startDate && value.isBefore(startDate)) {
                      return Promise.reject(new Error('Ngày kết thúc phải sau ngày bắt đầu'));
                    }
                    return Promise.resolve();
                  },
                }),
              ],
              dependencies: ['startDate']
            }
          ]
        ]
      }
    ]
  }), []);

  const initialValues = useMemo(() => {
    if (phase) {
      return {
        ...phase,
        startDate: phase.startDate ? dayjs(phase.startDate) : null,
        endDate: phase.endDate ? dayjs(phase.endDate) : null,
      };
    }
    return {};
  }, [phase, mode]);

  // Submit
  const handleSubmit = async (values) => {
    try {
      if (mode === 'create') {
        // values có thể là object đơn hoặc array (nếu batch)
        const isArray = Array.isArray(values);
        const payload = isArray
          ? values.map(v => ({
            hackathonId: parseInt(hackathonId),
            phaseName: v.phaseName,
            startDate: v.startDate?.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            endDate: v.endDate?.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
          }))
          : [{
            hackathonId: parseInt(hackathonId),
            phaseName: values.phaseName,
            startDate: values.startDate?.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            endDate: values.endDate?.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
          }];

        await createHackathonPhase.mutateAsync(payload);
      } else {
        // Edit mode - chỉ hỗ trợ edit 1 đối tượng
        const updatePayload = {
          phaseName: values.phaseName,
          startDate: values.startDate?.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
          endDate: values.endDate?.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        };
        await updateHackathonPhase.mutateAsync({ id, payload: updatePayload, hackathonId: parseInt(hackathonId) });
      }
      navigate(`${PATH_NAME.ADMIN_HACKATHON_PHASES}?hackathonId=${hackathonId}`);
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
          borderRadius: 4
        }
      }}
    >
      <CreateEditForm
        mode={mode}
        entityName="Giai đoạn"
        model={model}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitting={createHackathonPhase.isPending || updateHackathonPhase.isPending}
        submitText={mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
        cancelText="Hủy"
        onCancel={() => navigate(`${PATH_NAME.ADMIN_HACKATHON_PHASES}?hackathonId=${hackathonId}`)}
        onBack={() => navigate(`${PATH_NAME.ADMIN_HACKATHON_PHASES}?hackathonId=${hackathonId}`)}
        isBatch={{modes: ['create']}} // Chỉ cho phép batch khi tạo mới
        batchLimit={2} // Giới hạn tối đa 10 phases
        skip={existingPhaseId > -1 ? 1 : 0}
      />
    </ConfigProvider>
  );
};

export default HackathonPhaseForm;
