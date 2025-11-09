import React, { useState } from 'react';
import { Card, Space, Button, Tag, Badge, List, Tooltip, Empty, Checkbox } from 'antd';
import { ArrowLeftOutlined, FileTextOutlined, EditOutlined, DownloadOutlined, LinkOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useMemo, useCallback } from 'react';

const SUPPORTED_TYPES = ['input', 'textarea', 'dropdown', 'datetime', 'column', 'tag', 'file', 'status', 'boolean', 'array', 'object', 'url', 'custom', 'id'];

const normalizeFields = (fields = []) =>
    fields.filter(f => !f.type || SUPPORTED_TYPES.includes(f.type));

const formatDate = (val, fmt = 'DD/MM/YYYY HH:mm') => {
    if (!val) return '--';
    const d = dayjs(val);
    return d.isValid() ? d.format(fmt) : val;
};

const getFileName = (path) => {
    if (!path) return null;
    return path.split('/').pop().split('?')[0];
};

const EntityDetail = ({
    entityName = 'Entity',
    model,
    data = {},
    onBack,
    onEdit,
    showEdit = true,
    headerExtra,
    dateFormatMap = {},
    valueTransforms = {},
    valueRenders = {},
}) => {
    const fields = useMemo(() => normalizeFields(model?.fields), [model?.fields]);
    const lowerEntity = entityName.toLowerCase();

    const getValue = useCallback((field) => data[field.name] ?? null, [data]);

    const renderValue = useCallback((field) => {
        const raw = getValue(field);
        const fieldName = field.name;

        if (valueRenders[fieldName]) {
            return valueRenders[fieldName](raw, field, data);
        }

        if (valueTransforms[fieldName]) {
            return <span className="text-gray-300">{valueTransforms[fieldName](raw, field, data)}</span>;
        }

        switch (field.type) {
            case 'id':
                return raw ? <Tag color="purple">#{raw}</Tag> : <span className="text-gray-500">--</span>;

            case 'tag':
                const tagText = field.transform ? field.transform(raw) : (raw ?? 'N/A');
                const tagColor = typeof field.tagColor === 'function' ? field.tagColor(raw) : field.tagColor || 'default';
                return <Tag color={tagColor}>{tagText}</Tag>;

            case 'status':
                const statusMap = field.statusMap || {
                    'Complete': { text: 'Hoàn thành', color: 'success' },
                    'Pending': { text: 'Chờ xử lý', color: 'warning' },
                    'Failed': { text: 'Thất bại', color: 'error' },
                };
                const status = statusMap[raw] || { text: raw || 'N/A', color: 'default' };
                return <Badge status={status.color} text={status.text} />;

            case 'boolean':
                return (
                    <Checkbox checked={!!raw} disabled>
                        {field.label || (raw ? 'Có' : 'Không')}
                    </Checkbox>
                );

            case 'datetime':
                const fmt = dateFormatMap[fieldName] || field.format || 'DD/MM/YYYY HH:mm';
                return <span className="text-gray-300">{formatDate(raw, fmt)}</span>;

            case 'file':
                if (!raw) return <span className="text-gray-500">Không có file</span>;
                const fileName = getFileName(raw);
                const fileUrl = raw.startsWith('http') ? raw : `https://www.sealfall25.somee.com${raw}`;
                return (
                    <Space>
                        <Button
                            size="small"
                            icon={<DownloadOutlined />}
                            href={fileUrl}
                            target="_blank"
                            type="link"
                            className="text-emerald-400 p-0 h-auto"
                        >
                            {fileName}
                        </Button>
                        {field.preview && (
                            <Tooltip title="Xem trước">
                                <Button size="small" icon={<EyeOutlined />} type="link" href={fileUrl} target="_blank" />
                            </Tooltip>
                        )}
                    </Space>
                );

            case 'url':
                if (!raw) return <span className="text-gray-500">--</span>;
                return (
                    <a href={raw} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1">
                        <LinkOutlined />
                        {field.linkText || raw}
                    </a>
                );

            case 'array':
                if (!Array.isArray(raw) || raw.length === 0) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Trống" />;
                return (
                    <List
                        size="small"
                        dataSource={raw}
                        renderItem={(item, idx) => (
                            <List.Item className="border-b border-neutral-700 py-1">
                                <span className="text-gray-300">
                                    {field.renderItem ? field.renderItem(item, idx) : item}
                                </span>
                            </List.Item>
                        )}
                    />
                );

            case 'object':
                if (!raw || typeof raw !== 'object') return <span className="text-gray-500">--</span>;
                return (
                    <div className="bg-neutral-900 p-3 rounded border border-neutral-700 text-xs font-mono text-gray-400 max-h-48 overflow-auto">
                        <pre>{JSON.stringify(raw, null, 2)}</pre>
                    </div>
                );

            case 'textarea':
                return <div className="text-gray-300 whitespace-pre-wrap">{raw ?? '--'}</div>;

            case 'dropdown':
            case 'input':
            default:
                return <span className="text-gray-300">{raw ?? '--'}</span>;
        }
    }, [getValue, valueRenders, valueTransforms, dateFormatMap, data]);

    const renderFieldBlock = useCallback((field, keyPath = []) => {
        if (field.type === 'column') {
            const rawItems = field.items || [];
            let left = [], right = [];

            if (rawItems.length === 2 && Array.isArray(rawItems[0]) && Array.isArray(rawItems[1])) {
                [left, right] = rawItems;
            } else {
                const half = Math.ceil(rawItems.length / 2);
                left = rawItems.slice(0, half);
                right = rawItems.slice(half);
            }

            return (
                <div key={keyPath.join('.')} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-6">
                        {left.map((c, i) => renderFieldBlock(c, [...keyPath, 'L', i]))}
                    </div>
                    <div className="flex flex-col gap-6">
                        {right.map((c, i) => renderFieldBlock(c, [...keyPath, 'R', i]))}
                    </div>
                </div>
            );
        }

        if (field.type === 'custom' && field.render) {
            return (
                <div key={keyPath.join('.')} className="mb-6">
                    {field.render(data)}
                </div>
            );
        }

        return (
            <div key={field.name || keyPath.join('.')} className="mb-2">
                <p className="text-gray-300 text-sm font-medium mb-1">{field.key}</p>
                <div className="min-h-[42px] px-4 py-3 bg-neutral-900 border border-neutral-700 rounded text-sm flex items-center">
                    {renderValue(field)}
                </div>
            </div>
        );
    }, [renderValue]);

    return (
        <div className="min-h-full bg-white/5 p-6 rounded-xl">
            <div className="m-auto w-full">
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
                                Chi tiết {entityName}
                            </h1>
                            <p className="text-gray-400">
                                Xem thông tin đầy đủ của {lowerEntity}
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
                                Thông tin {entityName}
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

export default React.memo(EntityDetail);