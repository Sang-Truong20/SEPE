import { Card, Space, Button } from 'antd';
import { ArrowLeftOutlined, FileTextOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const SUPPORTED_TYPES = ['input', 'textarea', 'dropdown', 'datetime', 'column'];

const normalizeFields = (fields = []) =>
    fields.filter(f => !f.type || SUPPORTED_TYPES.includes(f.type));

const formatDate = (val, fmt = 'DD/MM/YYYY HH:mm') => {
    if (!val) return '--';
    // Nếu chỉ có ngày (YYYY-MM-DD) vẫn parse được
    const d = dayjs(val);
    return d.isValid() ? d.format(fmt) : val;
};

const EntityDetail = ({
    entityName = 'Entity',
    model,
    data = {},
    onBack,
    onEdit,
    showEdit = true,
    headerExtra, // có thể truyền thêm JSX (stats, nút phụ)
    dateFormatMap = {}, // { fieldName: 'DD/MM/YYYY' }
    valueTransforms = {}, // { fieldName: (value, field, data) => string|JSX }
    valueRenders = {}, // { fieldName: (value, field, data) => JSX } (ưu tiên hơn transform)
}) => {
    const fields = normalizeFields(model?.fields);
    const lowerEntity = entityName.toLowerCase();

    const renderValue = (field) => {
        const raw = data[field.name];
        if (valueRenders[field.name]) {
            return valueRenders[field.name](raw, field, data);
        }
        if (valueTransforms[field.name]) {
            return valueTransforms[field.name](raw, field, data);
        }
        switch (field.type) {
            case 'datetime':
                return <span className="text-gray-300">{formatDate(raw, dateFormatMap[field.name] || field.format || 'DD/MM/YYYY HH:mm')}</span>;
            case 'dropdown':
            case 'input':
            case 'textarea':
                return <span className="text-gray-300">{raw ?? '--'}</span>;
            default:
                return <span className="text-gray-300">{raw ?? '--'}</span>;
        }
    };

    const renderFieldBlock = (field, keyPath = []) => {
        if (field.type === 'column') {
            const rawItems = field.items || [];
            let left = [];
            let right = [];
            if (rawItems.length === 2 && Array.isArray(rawItems[0]) && Array.isArray(rawItems[1])) {
                left = rawItems[0];
                right = rawItems[1];
            } else {
                const half = Math.ceil(rawItems.length / 2);
                left = rawItems.slice(0, half);
                right = rawItems.slice(half);
            }
            return (
                <div
                    key={keyPath.join('.') || Math.random()}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <div className="flex flex-col gap-6">
                        {left.map((c, i) => renderFieldBlock(c, keyPath.concat(['L', i])))}
                    </div>
                    <div className="flex flex-col gap-6">
                        {right.map((c, i) => renderFieldBlock(c, keyPath.concat(['R', i])))}
                    </div>
                </div>
            );
        }

        return (
            <div key={field.name} className="mb-2">
                <p className="text-gray-300 text-sm font-medium mb-1">
                    {field.key}
                </p>
                <div
                    className="min-h-[42px] px-4 py-3 bg-neutral-900 border border-neutral-700 rounded
                     text-sm flex items-center"
                >
                    {renderValue(field)}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-full bg-white/5 p-6 rounded-xl">
            <div className="m-auto">
                <div className="mb-8">
                    <Button
                        onClick={onBack}
                        type="link"
                        icon={<ArrowLeftOutlined />}
                        className="mb-4 !text-light-primary hover:!text-primary"
                    >
                        Quay lại
                    </Button>

                    <div className="px-6 flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 text-white">
                                {`Chi tiết ${entityName}`}
                            </h1>
                            <p className="text-gray-400">
                                {`Xem thông tin đầy đủ của ${lowerEntity}`}
                            </p>
                        </div>
                        {headerExtra}
                    </div>
                </div>

                <Card
                    className="border border-white/10 bg-white/5 rounded-xl shadow-sm backdrop-blur-sm mx-6"
                    title={
                        <Space>
                            <FileTextOutlined className="text-primary text-lg" />
                            <span className="text-white font-semibold">
                                {`Thông tin ${entityName}`}
                            </span>
                        </Space>
                    }
                    extra={
                        showEdit && onEdit ? (
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                className="bg-primary hover:bg-primary/90 transition-colors duration-150"
                                onClick={() => onEdit(data)}
                            >
                                Chỉnh sửa
                            </Button>
                        ) : null
                    }
                >
                    <div className="space-y-6">
                        {fields.map((f, idx) => renderFieldBlock(f, [idx]))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default EntityDetail;