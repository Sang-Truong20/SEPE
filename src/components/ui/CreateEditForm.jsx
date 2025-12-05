import { Form, Input, Button, Select, DatePicker, Card, Space, Divider } from 'antd';
import { ArrowLeftOutlined, FileTextOutlined, SaveOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

// Hỗ trợ các type
const SUPPORTED_TYPES = ['input', 'textarea', 'dropdown', 'datetime', 'column'];
const normalizeFields = (fields = []) =>
  fields.filter(f => !f.type || SUPPORTED_TYPES.includes(f.type));

const CreateEditForm = ({
                          entityName = 'Entity',
                          model,
                          mode = 'create',
                          initialValues = {},
                          onSubmit,
                          submitting = false,
                          submitText = 'Lưu',
                          cancelText = 'Hủy',
                          onCancel,
                          onBack,
                          isBatch,
                          batchLimit = 1,
                          skip = 1,
                        }) => {
  const [form] = Form.useForm();
  const fields = normalizeFields(model?.fields);
  const [batchCount, setBatchCount] = useState(1);
  console.log('Initial Values:', initialValues);


  useEffect(() => {
    if (isBatch && isBatch.modes.includes(mode) && mode === 'create') {
      // Batch create mode: chuyển đổi initialValues thành batch format cho card đầu tiên
      const batchFormValues = {};

      Object.keys(initialValues).forEach(key => {
        // Chuyển field thường thành field_batch0
        batchFormValues[`${key}_batch0`] = initialValues[key];
      });

      form.setFieldsValue(batchFormValues);
    } else {
      // Single mode hoặc edit mode: giữ nguyên
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form, isBatch, mode]);

  const lowerEntity = entityName.toLowerCase();

  // Thêm batch item mới
  const handleAddBatch = () => {
    if (batchCount < batchLimit) {
      setBatchCount(prev => prev + 1);
    }
  };

  // Xóa batch item
  const handleRemoveBatch = (index) => {
    if (batchCount > 1) {
      setBatchCount(prev => prev - 1);
      // Clear form values cho batch item bị xóa
      const formValues = form.getFieldsValue();
      const newValues = {};

      // Giữ lại giá trị của các batch items còn lại
      for (let i = 0; i < batchCount - 1; i++) {
        if (i < index) {
          // Giữ nguyên các item trước index bị xóa
          Object.keys(formValues).forEach(key => {
            const match = key.match(new RegExp(`^(.+)_batch${i}$`));
            if (match) {
              newValues[key] = formValues[key];
            }
          });
        } else {
          // Dịch chuyển các item sau index bị xóa lên trên
          Object.keys(formValues).forEach(key => {
            const match = key.match(new RegExp(`^(.+)_batch${i + 1}$`));
            if (match) {
              const fieldName = match[1];
              newValues[`${fieldName}_batch${i}`] = formValues[key];
            }
          });
        }
      }

      form.setFieldsValue(newValues);
    }
  };

  const renderField = (field, keyPath = [], batchIndex = null) => {
    const fieldName = batchIndex !== null ? `${field.name}_batch${batchIndex}` : field.name;

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
            {left.map((child, idx) => renderField(child, keyPath.concat(['L', idx]), batchIndex))}
          </div>
          <div className="flex flex-col gap-6">
            {right.map((child, idx) => renderField(child, keyPath.concat(['R', idx]), batchIndex))}
          </div>
        </div>
      );
    }

    // Custom validation cho batch items
    const getBatchRules = (baseRules) => {
      if (!isBatch || batchIndex === null) return baseRules;

      // Thêm validation đặc biệt cho startDate và endDate trong batch
      if (field.name === 'startDate' && batchIndex > 0) {
        return [
          ...baseRules,
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value) return Promise.resolve();

              // Validate với endDate của phase trước đó
              const prevEndDate = getFieldValue(`endDate_batch${batchIndex - 1}`);
              if (prevEndDate && value.isBefore(prevEndDate)) {
                return Promise.reject(
                  new Error(`Ngày bắt đầu phase ${lowerEntity} 1 phải sau ngày kết thúc của ${lowerEntity} 2`)
                );
              }

              // Validate với endDate của cùng phase
              const currentEndDate = getFieldValue(`endDate_batch${batchIndex}`);
              if (currentEndDate && value.isAfter(currentEndDate)) {
                return Promise.reject(new Error('Ngày bắt đầu phải trước ngày kết thúc'));
              }

              return Promise.resolve();
            },
          }),
        ];
      }

      if (field.name === 'endDate') {
        return [
          ...baseRules,
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value) return Promise.resolve();

              const currentStartDate = getFieldValue(`startDate_batch${batchIndex}`);
              if (currentStartDate && value.isBefore(currentStartDate)) {
                return Promise.reject(new Error('Ngày kết thúc phải sau ngày bắt đầu'));
              }

              return Promise.resolve();
            },
          }),
        ];
      }

      return baseRules;
    };

    const baseRequiredRule = field.required
      ? [{ required: true, message: field.message || `Vui lòng nhập ${field.key || field.name}` }]
      : [];

    const finalRules = field.rules && field.rules.length > 0
      ? getBatchRules(field.rules)
      : getBatchRules(baseRequiredRule);

    // Dependencies cho batch
    const batchDependencies = field.dependencies?.map(dep =>
      batchIndex !== null ? `${dep}_batch${batchIndex}` : dep
    ) || [];

    // Thêm dependency cho phase trước đó nếu là startDate
    if (isBatch && field.name === 'startDate' && batchIndex > 0) {
      batchDependencies.push(`endDate_batch${batchIndex - 1}`);
    }
    if (isBatch && field.name === 'endDate' && batchIndex !== null) {
      batchDependencies.push(`startDate_batch${batchIndex}`);
    }

    const commonItemProps = {
      name: fieldName,
      rules: finalRules,
      dependencies: batchDependencies,
      className: 'mb-0',
      validateTrigger: 'onChange'
    };

    switch (field.type) {
      case 'input':
        return (
          <div key={fieldName} className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              {field.key}
            </label>
            <Form.Item {...commonItemProps}>
              <Input
                placeholder={field.placeholder || ''}
                disabled={field.disabled}
                maxLength={field.maxLength}
                className="h-10 text-base text-white placeholder:text-gray-400 bg-neutral-900 border border-neutral-700 rounded
                           hover:bg-neutral-800 hover:border-primary focus:bg-neutral-800 focus:border-primary focus:outline-none
                           transition-colors duration-150"
              />
            </Form.Item>
          </div>
        );
      case 'textarea':
        return (
          <div key={fieldName} className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              {field.key}
            </label>
            <Form.Item {...commonItemProps}>
              <Input.TextArea
                rows={field.rows || 6}
                placeholder={field.placeholder || ''}
                disabled={field.disabled}
                maxLength={field.maxLength}
                className="text-base text-white placeholder:text-gray-400 bg-neutral-900 border border-neutral-700 rounded
                           hover:bg-neutral-800 hover:border-primary focus:bg-neutral-800 focus:border-primary focus:outline-none
                           transition-colors duration-150"
              />
            </Form.Item>
          </div>
        );
      case 'dropdown':
        return (
          <div key={fieldName}>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              {field.key}
            </label>
            <Form.Item {...commonItemProps}>
              <Select
                placeholder={field.placeholder || ''}
                disabled={field.disabled}
                allowClear={field.allowClear}
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
                options={(field.items || []).map(opt => ({ value: opt.value, label: opt.text }))}
              />
            </Form.Item>
          </div>
        );
      case 'datetime':
        return (
          <div key={fieldName}>
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
                disabledDate={(current) => {
                  if (!current) return false;

                  const toDayjs = (v) => {
                    if (!v) return null;
                    if (dayjs.isDayjs(v)) return v;
                    return dayjs(v);
                  };

                  const minD = toDayjs(field.minDate);
                  const maxD = toDayjs(field.maxDate);

                  if (minD && current.isBefore(minD.startOf('day'))) return true;
                  if (maxD && current.isAfter(maxD.endOf('day'))) return true;

                  return false;
                }}
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

  const handleFormSubmit = async (values) => {
    if (!isBatch || !isBatch.modes.includes(mode)) {
      // Single item submission
      await onSubmit(values);
      return;
    }

    // Batch submission
    const batchData = [];
    for (let i = 0; i < batchCount; i++) {
      const item = {};
      fields.forEach(field => {
        if (field.type === 'column') {
          field.items.flat().forEach(subField => {
            const fieldName = `${subField.name}_batch${i}`;
            if (values[fieldName] !== undefined) {
              item[subField.name] = values[fieldName];
            }
          });
        } else {
          const fieldName = `${field.name}_batch${i}`;
          if (values[fieldName] !== undefined) {
            item[field.name] = values[fieldName];
          }
        }
      });
      batchData.push(item);
    }

    for (let i = 0; i < skip; i++) {
      batchData.shift()
    }

    await onSubmit(batchData);
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
              {mode === 'create' ? `Tạo ${lowerEntity} Mới` : `Chỉnh sửa ${lowerEntity}`}
            </h1>
            <p className="text-gray-400">
              {mode === 'create'
                ? `Thiết lập và cấu hình ${lowerEntity} mới${isBatch ? ' (hỗ trợ tạo nhiều cùng lúc)' : ''}`
                : `Cập nhật thông tin ${lowerEntity}`}
            </p>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          className="space-y-6"
        >
          {isBatch && isBatch.modes.includes(mode) ? (
            // Batch mode
            <>
              {Array.from({ length: batchCount }).map((_, index) => (
                <Card
                  key={index}
                  className="border border-white/10 bg-white/5 rounded-xl shadow-sm backdrop-blur-sm mx-6 mb-6"
                  title={
                    <div className="flex items-center justify-between">
                      <Space>
                        <FileTextOutlined className="text-primary text-lg" />
                        <span className="text-white font-semibold">
                          {`${entityName} ${index + 1}`}
                        </span>
                      </Space>
                      {batchCount > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveBatch(index)}
                          className="!text-red-400 hover:!text-red-300 hover:!bg-red-400/10"
                        >
                          Xóa
                        </Button>
                      )}
                    </div>
                  }
                >
                  {fields.map((f, idx) => renderField(f, [idx], index))}
                </Card>
              ))}

              {batchCount < batchLimit && (
                <div className="mx-6 mb-6">
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={handleAddBatch}
                    className="w-full h-12 !text-primary !border-primary/50 hover:!border-primary hover:!bg-primary/5"
                  >
                    Thêm {lowerEntity} ({batchCount}/{batchLimit})
                  </Button>
                </div>
              )}
            </>
          ) : (
            // Single mode
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
              {fields.map((f, idx) => renderField(f, [idx]))}
            </Card>
          )}

          <div className="flex justify-end gap-3 pt-6 mx-6 border-t border-neutral-800">
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
      </div>
    </div>
  );
};

export default CreateEditForm;