import { Form, Input, Button, Select, DatePicker, Card, Space } from 'antd';
import { ArrowLeftOutlined, FileTextOutlined, SaveOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

// Hỗ trợ các type
const SUPPORTED_TYPES = ['input', 'textarea', 'dropdown', 'datetime', 'column'];
const normalizeFields = (fields = []) =>
  fields.filter(f => !f.type || SUPPORTED_TYPES.includes(f.type));

const CreateEditForm = ({
  entityName = 'Entity', // dùng cho header
  model,
  mode = 'create',
  initialValues = {},
  onSubmit,
  submitting = false,
  submitText = 'Lưu',
  cancelText = 'Hủy',
  onCancel,
  onBack
}) => {
  const [form] = Form.useForm();
  const fields = normalizeFields(model?.fields);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const lowerEntity = entityName.toLowerCase();

  const renderField = (field, keyPath = []) => {
    if (field.type === 'column') {
      const raw = field.items || [];
      let left = [];
      let right = [];
      if (raw.length === 2 && Array.isArray(raw[0]) && Array.isArray(raw[1])) {
        left = raw[0];
        right = raw[1];
      } else {
        const half = Math.ceil(raw.length / 2);
        left = raw.slice(0, half);
        right = raw.slice(half);
      }
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" key={keyPath.join('.') || Math.random()}>
          <div className="flex flex-col gap-6">
            {left.map((child, idx) => renderField(child, keyPath.concat(['L', idx])))}
          </div>
          <div className="flex flex-col gap-6">
            {right.map((child, idx) => renderField(child, keyPath.concat(['R', idx])))}
          </div>
        </div>
      );
    }

    const commonItemProps = {
      name: field.name,
      rules: field.required
        ? [{ required: true, message: field.message || `Vui lòng nhập ${field.key || field.name}` }]
        : [],
      className: 'mb-0'
    };

    switch (field.type) {
      case 'input':
        return (
          <div key={field.name} className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              {field.key}
            </label>
            <Form.Item {...commonItemProps}>
              <Input
                placeholder={field.placeholder || ''}
                disabled={field.disabled}
                className="h-10 text-base text-white placeholder:text-gray-400 bg-neutral-900 border border-neutral-700 rounded
                           hover:bg-neutral-800 hover:border-primary focus:bg-neutral-800 focus:border-primary focus:outline-none
                           transition-colors duration-150"
              />
            </Form.Item>
          </div>
        );
      case 'textarea':
        return (
          <div key={field.name} className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              {field.key}
            </label>
            <Form.Item {...commonItemProps}>
              <Input.TextArea
                rows={field.rows || 6}
                placeholder={field.placeholder || ''}
                disabled={field.disabled}
                className="text-base text-white placeholder:text-gray-400 bg-neutral-900 border border-neutral-700 rounded
                           hover:bg-neutral-800 hover:border-primary focus:bg-neutral-800 focus:border-primary focus:outline-none
                           transition-colors duration-150"
              />
            </Form.Item>
          </div>
        );
      case 'dropdown':
        return (
          <div key={field.name}>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              {field.key}
            </label>
            <Form.Item {...commonItemProps}>
              <Select
                placeholder={field.placeholder || ''}
                disabled={field.disabled}
                className="w-full h-10 text-white bg-transparent
                           [&_.ant-select-selector]:!bg-neutral-900
                           [&_.ant-select-selector]:!border-neutral-700
                           [&_.ant-select-selector]:rounded
                           [&_.ant-select-selection-item]:!text-white
                           [&_.ant-select-selection-placeholder]:text-gray-400
                           [&_.ant-select-arrow]:text-white
                           [&_.ant-select-selector:hover]:!bg-neutral-800
                           [&_.ant-select-selector:hover]:!border-primary
                           [&_.ant-select-selector:focus]:!bg-neutral-800
                           [&_.ant-select-selector:focus]:!border-primary
                           transition-colors duration-150"
                popupClassName="bg-neutral-900/95 backdrop-blur-md border border-neutral-700 rounded-md p-1 text-white
                                [&_.ant-select-item]:text-white
                                [&_.ant-select-item-option]:bg-neutral-900
                                [&_.ant-select-item-option-active]:!bg-neutral-800
                                [&_.ant-select-item-option-selected]:!bg-primary/40
                                [&_.ant-select-item-option-selected]:!text-white
                                [&_.ant-select-item-option:hover]:!bg-neutral-800"
                dropdownStyle={{ backgroundColor: '#111111' }}
                style={{ width: '100%' }}
              >
                {(field.items || []).map(opt => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        );
      case 'datetime':
        return (
          <div key={field.name}>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              {field.key}
            </label>
            <Form.Item {...commonItemProps}>
              <DatePicker
                showTime
                disabled={field.disabled}
                placeholder={field.placeholder || ''}
                format={field.format || 'DD/MM/YYYY HH:mm'}
                className="w-full h-10 text-white !bg-neutral-900 !border-neutral-700 rounded
                           hover:!bg-neutral-800 hover:!border-primary
                           focus:!bg-neutral-800 focus:!border-primary
                           [&_.ant-picker-input>input]:text-white
                           [&_.ant-picker-suffix]:text-gray-300
                           [&_.ant-picker-input>input::placeholder]:text-gray-400
                           transition-colors duration-150"
                style={{ width: '100%' }}
                panelRender={(panel) => (
                  <div className="dark-picker-panel
                                  [&_.ant-picker-panel]:bg-neutral-900
                                  [&_.ant-picker-content]:bg-neutral-900
                                  [&_.ant-picker-header]:bg-neutral-900 [&_.ant-picker-header]:text-gray-200
                                  [&_.ant-picker-footer]:bg-neutral-900
                                  [&_.ant-picker-time-panel]:bg-neutral-900
                                  [&_.ant-picker-cell-inner]:text-gray-300
                                  [&_.ant-picker-cell-in-view_.ant-picker-cell-inner]:text-gray-200
                                  [&_.ant-picker-cell-in-view:not(.ant-picker-cell-selected):not(.ant-picker-cell-disabled)_.ant-picker-cell-inner:hover]:bg-neutral-800
                                  [&_.ant-picker-cell-in-view.ant-picker-cell-selected_.ant-picker-cell-inner]:!bg-primary/40 !text-white
                                  [&_.ant-picker-cell-in-view.ant-picker-cell-today:not(.ant-picker-cell-selected)_.ant-picker-cell-inner]:ring-1 ring-primary
                                  [&_.ant-picker-time-panel-cell-inner]:bg-neutral-900 [&_.ant-picker-time-panel-cell-inner]:text-gray-300
                                  [&_.ant-picker-time-panel-cell-inner:hover]:bg-neutral-800
                                  [&_.ant-picker-time-panel-cell-selected_.ant-picker-time-panel-cell-inner]:!bg-primary/40 !text-white">
                    {panel}
                  </div>
                )}
              />
            </Form.Item>
          </div>
        );
      default:
        return null;
    }
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

          <div className="px-6">
            <h1 className="text-3xl font-bold mb-2 text-white">
              {mode === 'create' ? `Tạo ${entityName} Mới` : `Chỉnh sửa ${entityName}`}
            </h1>
            <p className="text-gray-400">
              {mode === 'create'
                ? `Thiết lập và cấu hình ${lowerEntity} mới`
                : `Cập nhật thông tin ${lowerEntity}`}
            </p>
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
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            className="space-y-6"
          >
            {fields.map((f, idx) => renderField(f, [idx]))}

            <div className="flex justify-end gap-3 pt-6 mt-8 border-t border-neutral-800">
              <Button
                size="large"
                onClick={onCancel}
                className="!text-text-primary !bg-dark-accent/30 hover:!bg-dark-accent/60 !border !border-dark-accent rounded-md transition-colors duration-200"
              >
                {cancelText}
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={submitting}
                className="bg-primary hover:bg-primary/90 transition-colors duration-150"
              >
                {submitText}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CreateEditForm;