import { Spin, ConfigProvider, theme } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import CreateEditForm from '../../../../components/ui/CreateEditForm.jsx';
import { useSeasons } from '../../../../hooks/admin/seasons/useSeasons';
import { PATH_NAME } from '../../../../constants';

const SeasonForm = ({ mode = 'create' }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchSeason, createSeason, updateSeason } = useSeasons();
    const { data: season, isLoading } = mode === 'edit'
        ? fetchSeason(id)
        : { data: null, isLoading: false };

    // Định nghĩa model
    const model = useMemo(() => ({
        modelName: 'Seasons',
        fields: [
            {
                key: 'Tên Season *',
                type: 'input',
                placeholder: 'VD: Spring 2025, Summer 2025...',
                name: 'name',
                required: true,
                message: 'Vui lòng nhập tên season'
            },
            {
                key: 'Mã Season',
                type: 'input',
                placeholder: 'VD: SP2025, SU2025...',
                name: 'seasonCode',
                required: false,
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
        if (mode === 'edit' && season) {
            return {
                ...season,
                startDate: season.startDate ? dayjs(season.startDate) : null,
                endDate: season.endDate ? dayjs(season.endDate) : null,
            };
        }
        return {};
    }, [season, mode]);

    // Submit
    const handleSubmit = async (values) => {
        const payload = {
            ...values,
            startDate: values.startDate?.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            endDate: values.endDate?.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        };

        try {
            if (mode === 'create') {
                await createSeason.mutateAsync(payload);
            } else {
                await updateSeason.mutateAsync({ id, payload });
            }
            navigate(PATH_NAME.ADMIN_SEASON);
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
                entityName="Season"
                model={model}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                submitting={createSeason.isPending || updateSeason.isPending}
                submitText={mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
                cancelText="Hủy"
                onCancel={() => navigate(PATH_NAME.ADMIN_SEASON)}
                onBack={() => navigate(PATH_NAME.ADMIN_SEASON)}
            />
        </ConfigProvider>
    );
};

export default SeasonForm;
