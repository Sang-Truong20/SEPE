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

    const PrizeType = [
      { value: 'Cash', text: 'Tiền mặt' },      // index 0 -> enum 1
      { value: 'Medal', text: 'Huy chương' },   // index 1 -> enum 2
      { value: 'Gift', text: 'Quà tặng' },      // index 2 -> enum 3
      { value: 'Certificate', text: 'Chứng nhận' }, // index 3 -> enum 4
    ]

    const PrizeTypeEnum = PrizeType.reduce((acc, p, index) => {
      acc[p.value] = { ...p, index: index + 1 };
      return acc;
    }, {});

    // Reverse mapping: index -> value (for edit mode)
    const PrizeTypeIndexToValue = PrizeType.reduce((acc, p, index) => {
      acc[index + 1] = p.value;
      return acc;
    }, {});

    // For edit mode, get the prize from the list
    const { data: prizes = [], isLoading } = mode === 'edit'
        ? fetchPrizes(hackathonId)
        : { data: [], isLoading: false };

    const prize = mode === 'edit' ? prizes.find(p => p.prizeId === parseInt(id)) : null;

    // Định nghĩa model
    const model = useMemo(() => ({
        modelName: 'Prizes',
        fields: [
            {
                key: 'Tên Giải *',
                type: 'input',
                placeholder: 'VD: Giải nhất, Giải khuyến khích...',
                name: 'prizeName',
                required: true,
                message: 'Vui lòng nhập tên giải'
            },
            {
                key: 'Loại Giải *',
                type: 'dropdown',
                placeholder: 'Chọn loại giải',
                name: 'prizeType',
                required: true,
                message: 'Vui lòng chọn loại giải',
                items: [
                  { value: 'Cash', text: 'Tiền mặt' },
                  { value: 'Medal', text: 'Huy chương' },
                  { value: 'Gift', text: 'Quà tặng' },
                  { value: 'Certificate', text: 'Chứng nhận' },
                ]
            },
            {
                type: 'column',
                items: [
                    [
                        {
                            key: 'Hạng *',
                            type: 'input',
                            placeholder: 'VD: 1, 2, 3...',
                            name: 'rank',
                            required: true,
                            message: 'Vui lòng nhập hạng'
                        }
                    ],
                    [
                        {
                            key: 'Phần Thưởng *',
                            type: 'input',
                            placeholder: 'VD: 1000 USD, Cúp vàng...',
                            name: 'reward',
                            required: true,
                            message: 'Vui lòng nhập phần thưởng'
                        }
                    ]
                ]
            }
        ]
    }), []);

    // Initial values cho edit
    const initialValues = useMemo(() => {
        if (mode === 'edit' && prize) {
            // Convert prizeType from number (1,2,3,4) to string ('Cash', 'Medal', etc.)
            const prizeTypeValue = typeof prize.prizeType === 'number'
                ? PrizeTypeIndexToValue[prize.prizeType]
                : prize.prizeType;

            return {
                prizeName: prize.prizeName,
                prizeType: prizeTypeValue,
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
              values.prizeType = PrizeTypeEnum[values.prizeType].index;
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
                    prizeType: PrizeTypeEnum[values.prizeType]?.index,
                    rank: parseInt(values.rank),
                    reward: values.reward,
                };
                await updatePrize.mutateAsync(payload);
            }
            navigate(`${PATH_NAME.ADMIN_PRIZES}?hackathonId=${hackathonId}`);
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
                    borderRadius: 4
                }
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
                onCancel={() => navigate(`${PATH_NAME.ADMIN_PRIZES}?hackathonId=${hackathonId}`)}
                onBack={() => navigate(`${PATH_NAME.ADMIN_PRIZES}?hackathonId=${hackathonId}`)}
            />
        </ConfigProvider>
    );
};

export default PrizeForm;
