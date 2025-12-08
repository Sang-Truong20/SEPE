// components/ui/EntityTable.jsx
import React from 'react';
import { Table, Button, Space, Tag, Tooltip } from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const defaultDateFormatter = (val, fmt) =>
  val ? dayjs(val).format(fmt || 'DD/MM/YYYY') : '--';

const buildRender = (col, dateFormatter) => {
  const {
    type,
    className,
    tagColor = 'blue',
    format,
    transform,
    render,
    statusMap,
  } = col;

  if (render && typeof render === 'function') {
    return (value, record) => render(value, record);
  }

  switch (type) {
    case 'text':
      return (value) => (
        <span className={className || 'text-gray-300'}>
          {transform ? transform(value) : (value ?? '--')}
        </span>
      );

    case 'tag':
      return (value) => (
        <Tag color={tagColor} className="m-0">
          {transform ? transform(value) : (value ?? '--')}
        </Tag>
      );

    case 'datetime':
      return (value) => (
        <span className="text-gray-300">
          {value
            ? (dateFormatter || defaultDateFormatter)(value, format)
            : '--'}
        </span>
      );

    case 'status':
      return (value) => {
        const raw = transform ? transform(value) : value;
        const key = value?.toString().toLowerCase();
        const matched = Object.keys(statusMap || {}).find(
          (k) => k.toLowerCase() === key,
        );
        const config = matched ? statusMap[matched] : null;

        return (
          <Tag
            color={config?.color || 'default'}
            className="m-0 px-2 py-1 text-sm"
          >
            {config?.text || raw || '--'}
          </Tag>
        );
      };

    case 'badge':
      return (value) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            value === 'active'
              ? 'bg-green-600/30 text-green-400'
              : 'bg-gray-600/30 text-gray-300'
          }`}
        >
          {transform ? transform(value) : (value ?? '--')}
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
  dateFormatter,
}) => {
  const {
    columns = [],
    actions = {},
    rowKey = 'id',
    createButton,
    entityName,
  } = model || {};

  const columnsWithAutoScroll = columns.map(col => {
    if (col.dataIndex && data.length > 0) {
      const sampleValues = data.slice(0, 10).map(row => String(row[col.dataIndex] || ''));
      const avgLength = sampleValues.reduce((sum, v) => sum + v.length, 0) / sampleValues.length;

      if (avgLength > 50 && !col.width) {
        return { ...col, scrollable: true, width: 250 };
      }
    }
    return col;
  });

  const builtColumns = columnsWithAutoScroll.map((col) => ({
    ...col,
    render: buildRender(col, dateFormatter),
  }));

  const hasActions =
    actions.view ||
    actions.edit ||
    actions.delete ||
    (actions.extra && actions.extra.length > 0);

  if (hasActions) {
    builtColumns.push({
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      align: 'center',
      render: (_, record) => {
        const actionNodes = [];

        if (actions.view) {
          const cfg = actions.view === true ? {} : actions.view;
          actionNodes.push(
            <Tooltip key="view" title={cfg.tooltip || 'Xem chi tiết'}>
              <Button
                type="text"
                size="small"
                className={cfg.className || 'text-white hover:text-primary'}
                icon={cfg.icon || <EyeOutlined />}
                onClick={() => handlers.onView?.(record)}
              />
            </Tooltip>,
          );
        }

        if (actions.edit) {
          const cfg = actions.edit === true ? {} : actions.edit;
          actionNodes.push(
            <Tooltip key="edit" title={cfg.tooltip || 'Chỉnh sửa'}>
              <Button
                type="text"
                size="small"
                className={cfg.className || 'text-white hover:text-primary'}
                icon={cfg.icon || <EditOutlined />}
                onClick={() => handlers.onEdit?.(record)}
              />
            </Tooltip>,
          );
        }

        if (actions.delete) {
          const cfg = actions.delete === true ? {} : actions.delete;
          actionNodes.push(
            <Tooltip key="delete" title={cfg.tooltip || 'Xóa'}>
              <Button
                type="text"
                size="small"
                danger
                loading={handlers.isDeleting?.(record)}
                className={cfg.className || 'text-white hover:text-red-500'}
                icon={cfg.icon || <DeleteOutlined />}
                onClick={() => handlers.onDelete?.(record)}
              />
            </Tooltip>,
          );
        }

        if (actions.extra?.length) {
          actions.extra.forEach((act) => {
            if (act.render) {
              actionNodes.push(<span key={act.key}>{act.render(record)}</span>);
              return;
            }

            const extraProps =
              handlers.getExtraActionProps?.(act.key, record) || {};
            const isLoading =
              extraProps.loading ??
              (typeof act.loading === 'function' ? act.loading(record) : false);
            const isDisabled =
              extraProps.disabled ??
              (typeof act.disabled === 'function'
                ? act.disabled(record)
                : false);
            const tooltip =
              extraProps.tooltip ??
              (typeof act.tooltip === 'function'
                ? act.tooltip(record)
                : act.tooltip);

            const button = (
              <Button
                key={act.key}
                type="text"
                size="small"
                danger={act.danger}
                loading={isLoading}
                disabled={isDisabled}
                className={act.className}
                icon={act.icon}
                onClick={() =>
                  handlers.onExtraAction?.(act.key, record) ??
                  act.onClick?.(record)
                }
              >
                {act.icon ? null : act.label}
              </Button>
            );

            actionNodes.push(
              tooltip ? (
                <Tooltip key={act.key} title={tooltip}>
                  {button}
                </Tooltip>
              ) : (
                button
              ),
            );
          });
        }

        return <Space size={8}>{actionNodes}</Space>;
      },
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
            icon={<PlusOutlined />}
            className="bg-primary hover:bg-primary/90 transition-all"
            onClick={createButton.action}
            loading={createButton.loading}
            disabled={createButton.disabled}
          >
            {createButton.label || 'Thêm mới'}
          </Button>
        )}
      </div>

      <Table
        columns={builtColumns}
        dataSource={data}
        loading={loading}
        locale={{ emptyText: loading ? ' ' : emptyText }}
        rowKey={rowKey}
        pagination={false}
        scroll={{ x: 'max-content' }}
        className="[&_.ant-table]:bg-transparent [&_th]:!bg-white/5 [&_th]:!text-white [&_td]:!text-gray-300 [&_td]:border-white/10 [&_th]:border-white/10 [&_tr:hover_td]:!bg-white/[0.03] [&_.ant-table-tbody_tr]:transition-colors"
      />
    </>
  );
};

export default EntityTable;