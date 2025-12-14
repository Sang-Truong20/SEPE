import {
  Spin,
  ConfigProvider,
  theme,
  Form,
  Input,
  InputNumber,
  Button,
  Space,
  Card,
} from 'antd';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import CreateEditForm from '../../../../components/ui/CreateEditForm.jsx';
import { useCriteria } from '../../../../hooks/admin/criterias/useCriteria.js';
import { PATH_NAME } from '../../../../constants';
import {
  PlusOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  FileTextOutlined,
  SaveOutlined,
} from '@ant-design/icons';

const CriterionForm = ({ mode = 'create' }) => {
  const { id: criterionId } = useParams(); // for edit
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phaseId = searchParams.get('phaseId');
  const hackathonId = searchParams.get('hackathonId');

  const { fetchCriterionById, createCriterion, updateCriterion } =
    useCriteria();
  const { data: criterion, isLoading } =
    mode === 'edit'
      ? fetchCriterionById(criterionId)
      : { data: null, isLoading: false };

  const [criteriaList, setCriteriaList] = useState([{ name: '', weight: 1 }]);

  // Model for create (batch) and edit (single)
  const model = useMemo(() => {
    if (mode === 'create') {
      return {
        modelName: 'Criteria',
        fields: [
          {
            key: 'Danh sách tiêu chí',
            type: 'custom',
            name: 'criteria',
          },
        ],
      };
    } else {
      return {
        modelName: 'Criteria',
        fields: [
          {
            key: 'Tên Tiêu chí *',
            type: 'input',
            placeholder: 'VD: Sáng tạo, Thuyết trình...',
            name: 'name',
            required: true,
            message: 'Vui lòng nhập tên',
          },
          {
            key: 'Trọng số *',
            type: 'inputNumber',
            placeholder: 'VD: 1, 2, 3, 4, 5',
            name: 'weight',
            required: true,
            message: 'Vui lòng nhập trọng số',
            min: 1,
            max: 5,
            step: 1,
            rules: [
              { required: true, message: 'Vui lòng nhập trọng số' },
              {
                type: 'number',
                min: 1,
                max: 5,
                message: 'Trọng số phải từ 1 đến 5',
              },
            ],
          },
        ],
      };
    }
  }, [mode]);

  const initialValues = useMemo(() => {
    if (mode === 'edit' && criterion) {
      return { ...criterion };
    }
    return {};
  }, [criterion, mode]);

  const handleAddCriteria = () => {
    setCriteriaList([...criteriaList, { name: '', weight: 1 }]);
  };

  const handleRemoveCriteria = (index) => {
    if (criteriaList.length > 1) {
      setCriteriaList(criteriaList.filter((_, i) => i !== index));
    }
  };

  const handleCriteriaChange = (index, field, value) => {
    const newList = [...criteriaList];
    newList[index] = { ...newList[index], [field]: value };
    setCriteriaList(newList);
  };

  const handleSubmit = async (values) => {
    if (mode === 'create') {
      // Validate criteria list
      const validCriteria = criteriaList.filter(
        (c) =>
          c.name &&
          c.name.trim() !== '' &&
          c.weight != null &&
          c.weight >= 1 &&
          c.weight <= 5,
      );

      if (validCriteria.length === 0) {
        return;
      }

      const payload = {
        phaseId: parseInt(phaseId),
        criteria: validCriteria.map((c) => ({
          name: c.name.trim(),
          weight: parseFloat(c.weight) || 1,
        })),
      };

      try {
        await createCriterion.mutateAsync(payload);
        navigate(
          `${PATH_NAME.ADMIN_HACKATHON_PHASES}/${phaseId}?hackathonId=${hackathonId}`,
        );
      } catch (e) {
        console.error(e);
      }
    } else {
      const payload = { ...values };
      try {
        await updateCriterion.mutateAsync({ id: criterionId, payload });
        navigate(
          `${PATH_NAME.ADMIN_HACKATHON_PHASES}/${phaseId}?hackathonId=${hackathonId}`,
        );
      } catch (e) {
        console.error(e);
      }
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
          borderRadius: 4,
        },
      }}
    >
      {mode === 'create' ? (
        <div className="min-h-full bg-white/5 p-6 rounded-xl">
          <div className="m-auto">
            <div className="mb-8">
              <Button
                onClick={() =>
                  navigate(
                    `${PATH_NAME.ADMIN_HACKATHON_PHASES}/${phaseId}?hackathonId=${hackathonId}`,
                  )
                }
                type="link"
                icon={<ArrowLeftOutlined />}
                className="mb-4 !text-light-primary hover:!text-primary"
              >
                Quay lại
              </Button>

              <div className="px-6">
                <h1 className="text-3xl font-bold mb-2 text-white">
                  Tạo tiêu chí mới
                </h1>
                <p className="text-gray-400">
                  Thêm các tiêu chí chấm điểm cho giai đoạn này
                </p>
              </div>
            </div>

            <Form
              layout="vertical"
              onFinish={handleSubmit}
              className="space-y-6"
            >
              <Card
                className="border border-white/10 bg-white/5 rounded-xl shadow-sm backdrop-blur-sm mx-6"
                title={
                  <Space>
                    <FileTextOutlined className="text-primary text-lg" />
                    <span className="text-white font-semibold">
                      Danh sách tiêu chí
                    </span>
                  </Space>
                }
              >
                {criteriaList.map((item, index) => (
                  <div
                    key={index}
                    className="mb-4 p-4 border border-white/10 rounded-lg bg-white/5"
                  >
                    <Space
                      direction="vertical"
                      className="w-full"
                      size="middle"
                    >
                      <Form.Item
                        label="Tên tiêu chí *"
                        required
                        className="mb-0"
                        validateStatus={
                          item.name && item.name.trim() ? '' : 'error'
                        }
                        help={
                          item.name && item.name.trim()
                            ? ''
                            : 'Vui lòng nhập tên tiêu chí'
                        }
                      >
                        <Input
                          value={item.name}
                          onChange={(e) =>
                            handleCriteriaChange(index, 'name', e.target.value)
                          }
                          placeholder="VD: Sáng tạo, Thuyết trình..."
                          className="bg-white/5 border-white/10"
                        />
                      </Form.Item>
                      <Form.Item
                        label="Trọng số *"
                        required
                        className="mb-0"
                        validateStatus={
                          item.weight != null &&
                          item.weight >= 1 &&
                          item.weight <= 5
                            ? ''
                            : 'error'
                        }
                        help={
                          item.weight == null
                            ? 'Vui lòng nhập trọng số'
                            : item.weight < 1 || item.weight > 5
                              ? 'Trọng số phải từ 1 đến 5'
                              : ''
                        }
                      >
                        <InputNumber
                          value={item.weight}
                          onChange={(value) =>
                            handleCriteriaChange(index, 'weight', value)
                          }
                          placeholder="VD: 1, 2, 3, 4, 5"
                          min={1}
                          max={5}
                          step={1}
                          className="w-full"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                      {criteriaList.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveCriteria(index)}
                          className="!text-red-400 hover:!text-red-300"
                        >
                          Xóa tiêu chí này
                        </Button>
                      )}
                    </Space>
                  </div>
                ))}
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={handleAddCriteria}
                  className="w-full h-12 !text-primary !border-primary/50 hover:!border-primary hover:!bg-primary/5"
                >
                  Thêm tiêu chí
                </Button>
              </Card>

              <div className="flex justify-end gap-3 pt-6 mx-6 border-t border-neutral-800">
                <Button
                  size="large"
                  onClick={() =>
                    navigate(
                      `${PATH_NAME.ADMIN_HACKATHON_PHASES}/${phaseId}?hackathonId=${hackathonId}`,
                    )
                  }
                  className="!text-text-primary !bg-dark-accent/30 hover:!bg-dark-accent/60 !border !border-dark-accent rounded-md transition-colors duration-200"
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={createCriterion.isPending}
                  className="bg-primary hover:bg-primary/90 transition-colors duration-150"
                >
                  Tạo mới
                </Button>
              </div>
            </Form>
          </div>
        </div>
      ) : (
        <CreateEditForm
          mode={mode}
          entityName="Tiêu chí"
          model={model}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitting={createCriterion.isPending || updateCriterion.isPending}
          submitText="Cập nhật"
          cancelText="Hủy"
          onCancel={() =>
            navigate(
              `${PATH_NAME.ADMIN_HACKATHON_PHASES}/${phaseId}?hackathonId=${hackathonId}`,
            )
          }
          onBack={() =>
            navigate(
              `${PATH_NAME.ADMIN_HACKATHON_PHASES}/${phaseId}?hackathonId=${hackathonId}`,
            )
          }
        />
      )}
    </ConfigProvider>
  );
};

export default CriterionForm;
