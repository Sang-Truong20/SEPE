import { Spin, ConfigProvider, theme } from 'antd';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import CreateEditForm from '../../../../components/ui/CreateEditForm.jsx';
import { useHackathonPhases } from '../../../../hooks/admin/hackathon-phases/useHackathonPhases';
import { PATH_NAME } from '../../../../constants';

const HackathonPhaseForm = ({ mode = 'create' }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const hackathonId = searchParams.get('hackathonId');

    const { fetchHackathonPhase, createHackathonPhase, updateHackathonPhase } = useHackathonPhases();
    const { data: phase, isLoading } = mode === 'edit'
        ? fetchHackathonPhase(id)
        : { data: null, isLoading: false };

    // Định nghĩa model
    const model = useMemo(() => ({
        modelName: 'HackathonPhases',
        fields: [
            {
                key: 'Tên Phase *',
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
                            message: 'Vui lòng chọn ngày bắt đầu'
                        }
                    ],
                    [
                        {
                            key: 'Ngày kết thúc *',
                            type: 'datetime',
                            placeholder: 'mm/dd/yyyy --:-- --',
                            name: 'endDate',
                            required: true,
                            message: 'Vui lòng chọn ngày kết thúc'
                        }
                    ]
                ]
            }
        ]
    }), []);

    // Initial values cho edit
    const initialValues = useMemo(() => {
        if (mode === 'edit' && phase) {
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
        const payload = {
            ...values,
            hackathonId: parseInt(hackathonId),
            startDate: values.startDate?.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            endDate: values.endDate?.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        };

        try {
            if (mode === 'create') {
                await createHackathonPhase.mutateAsync(payload);
            } else {
                const updatePayload = {
                    phaseName: payload.phaseName,
                    startDate: payload.startDate,
                    endDate: payload.endDate,
                };
                await updateHackathonPhase.mutateAsync({ id, payload: updatePayload });
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
                entityName="Hackathon Phase"
                model={model}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                submitting={createHackathonPhase.isPending || updateHackathonPhase.isPending}
                submitText={mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
                cancelText="Hủy"
                onCancel={() => navigate(`${PATH_NAME.ADMIN_HACKATHON_PHASES}?hackathonId=${hackathonId}`)}
                onBack={() => navigate(`${PATH_NAME.ADMIN_HACKATHON_PHASES}?hackathonId=${hackathonId}`)}
            />
        </ConfigProvider>
    );
};

export default HackathonPhaseForm;
