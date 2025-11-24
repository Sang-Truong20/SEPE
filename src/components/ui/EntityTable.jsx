import { Table, Button, Space, Tag, Tooltip } from 'antd';
import {
    PlusOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

/*
model: {
  entityName: 'Hackathon',
  rowKey: 'hackathonId',
  createButton?: { label, action, icon?:bool },
  columns: [
    {
      title, dataIndex, key, type: 'text'|'tag'|'datetime'|'badge'|'custom',
      className?, tagColor?, format?, transform?, render?(value, record)
    }
  ],
  actions?: {
    view?: true|{ icon, tooltip, className },
    edit?: true|{ ... },
    delete?: true|{ ... }
  }
}

handlers: {
  onView(record),
  onEdit(record),
  onDelete(record),
  isDeleting(record) => boolean
}

Props:
- dateFormatter(value, format) => string (override)
- emptyText: string
*/

const defaultDateFormatter = (val, fmt) =>
    val ? dayjs(val).format(fmt || 'DD/MM/YYYY HH:mm') : '--';

const buildRender = (col, dateFormatter) => {
    const {
        type,
        className,
        tagColor = 'blue',
        format,
        transform,
        render
    } = col;

    if (render && typeof render === 'function') {
        return (value, record) => render(value, record);
    }

    switch (type) {
        case 'text':
            return (value) => (
                <span className={className || 'text-gray-300'}>
                    {transform ? transform(value) : value}
                </span>
            );
        case 'tag':
            return (value) => (
                <Tag color={tagColor} className="m-0">
                    {transform ? transform(value) : value}
                </Tag>
            );
        case 'datetime':
            return (value) => (
                <span className="text-gray-300">
                    {value ? (dateFormatter || defaultDateFormatter)(value, format) : '--'}
                </span>
            );
        case 'badge':
            return (value) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${value === 'active'
                    ? 'bg-green-600/30 text-green-400'
                    : 'bg-gray-600/30 text-gray-300'
                    }`}>
                    {transform ? transform(value) : value}
                </span>
            );
        default:
            return (value) => (
                <span className={className || 'text-gray-300'}>
                    {transform ? transform(value) : (value ?? '--')}
                </span>
            );
    }
};

const EntityTable = ({
    model,
    data = [],
    loading = false,
    handlers = {},
    emptyText = 'Không có dữ liệu',
    dateFormatter
}) => {
    const { columns = [], actions = {}, rowKey = 'id', createButton, entityName } = model || {};

    const builtColumns = columns.map(col => ({
        ...col,
        render: buildRender(col, dateFormatter)
    }));

    if (actions && Object.keys(actions).length) {
        builtColumns.push({
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => {
                const actionNodes = [];

                if (actions.view) {
                    const viewCfg = actions.view === true ? {} : actions.view;
                    actionNodes.push(
                        <Tooltip key="view" title={viewCfg.tooltip || 'Xem chi tiết'}>
                            <Button
                                type="text"
                                className={viewCfg.className || 'text-white hover:text-primary'}
                                icon={viewCfg.icon || <EyeOutlined className="text-white hover:text-primary" />}
                                onClick={() => handlers.onView && handlers.onView(record)}
                            />
                        </Tooltip>
                    );
                }

                if (actions.edit) {
                    const editCfg = actions.edit === true ? {} : actions.edit;
                    actionNodes.push(
                        <Tooltip key="edit" title={editCfg.tooltip || 'Chỉnh sửa'}>
                            <Button
                                type="text"
                                className={editCfg.className || 'text-white hover:text-primary'}
                                icon={editCfg.icon || <EditOutlined className="text-white hover:text-primary" />}
                                onClick={() => handlers.onEdit && handlers.onEdit(record)}
                            />
                        </Tooltip>
                    );
                }

                if (actions.delete) {
                    const deleteCfg = actions.delete === true ? {} : actions.delete;
                    actionNodes.push(
                        <Tooltip key="delete" title={deleteCfg.tooltip || 'Xóa'}>
                            <Button
                                type="text"
                                danger
                                loading={handlers.isDeleting && handlers.isDeleting(record)}
                                className={deleteCfg.className || 'text-white hover:text-red-500'}
                                icon={deleteCfg.icon || <DeleteOutlined className="text-white hover:text-red-500" />}
                                onClick={() => handlers.onDelete && handlers.onDelete(record)}
                            />
                        </Tooltip>
                    );
                }

                return <Space size="middle">{actionNodes}</Space>;
            }
        });
    }

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-text-primary">
                    Quản lý {entityName || 'Danh sách'}
                </h2>
                {createButton && (
                    <Button
                        type="primary"
                        icon={createButton.icon ? <PlusOutlined /> : null}
                        className="bg-primary hover:bg-primary/90 transition-all"
                        onClick={createButton.action}
                    >
                        {createButton.label}
                    </Button>
                )}
            </div>

            <Table
                columns={builtColumns}
                dataSource={data}
                loading={loading}          // CHỈ 1 spinner
                locale={{
                    emptyText: loading ? null : emptyText
                }}
                rowKey={rowKey}
                pagination={false}
                className="[&_.ant-table]:bg-transparent [&_th]:!bg-white/5 [&_th]:!text-white [&_td]:!text-gray-300 [&_td]:border-white/10 [&_th]:border-white/10 [&_tr:hover_td]:!bg-white/[0.03] [&_button]:opacity-100 [&_button:hover]:opacity-100"
            />
        </>
    );
};

export default EntityTable;