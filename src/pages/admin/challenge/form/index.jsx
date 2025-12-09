import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Upload, Button, ConfigProvider, theme, Spin, Card, message } from 'antd';
import { UploadOutlined, SaveOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useHackathons } from '../../../../hooks/admin/hackathons/useHackathons.js';
import { useChallenges } from '../../../../hooks/admin/challanges/useChallenges.js';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const ChallengeForm = ({ mode = 'create', challengeId = null }) => {
  const navigate = useNavigate(); // Đã sửa: thêm ()

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const { createChallenge, updateChallenge, fetchChallenge } = useChallenges();
  const { fetchHackathons } = useHackathons();
  const { data: hackathons = [], isLoading: hackathonsLoading } = fetchHackathons;

  const challengeQuery = mode === 'edit' ? fetchChallenge(challengeId) : { data: null, isLoading: false };
  const { data: challengeData, isLoading: challengeLoading } = challengeQuery;

  const isEdit = mode === 'edit';
  const isLoading = challengeLoading || hackathonsLoading;

  useEffect(() => {
    if (isEdit && challengeData) {
      form.setFieldsValue({
        title: challengeData.title,
        description: challengeData.description,
        hackathonId: challengeData.hackathonId,
      });

      if (challengeData.fileUrl) {
        setFileList([
          {
            uid: '-1',
            name: challengeData.fileName || 'Tệp hiện tại',
            status: 'done',
            url: challengeData.fileUrl,
          },
        ]);
      }
    }
  }, [isEdit, challengeData, form]);

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSubmit = async (values) => {
    setUploading(true);

    // Lấy file từ Upload (values.attachment là mảng fileList)
    const file = values.attachment?.[0]?.originFileObj;

    if (!file && !isEdit) {
      message.error('Vui lòng tải lên tệp đính kèm!');
      setUploading(false);
      return;
    }

    // Nếu là edit và người dùng xóa file cũ → vẫn cho phép (hoặc bạn có thể bắt buộc giữ file cũ)
    // Ở đây mình bắt buộc luôn có file mới hoặc giữ file cũ
    if (isEdit && !file && fileList.length === 0) {
      message.error('Vui lòng giữ lại hoặc tải lên tệp mới!');
      setUploading(false);
      return;
    }

    try {
      if (isEdit) {
        const formData = new FormData();
        formData.append('Title', values.title);
        formData.append('Description', values.description);
        formData.append('HackathonId', values.hackathonId);
        if (file) {
          formData.append('File', file);
        }
        // Nếu không có file mới → backend sẽ giữ nguyên file cũ (tùy API của bạn)

        await updateChallenge.mutateAsync({ id: challengeId, payload: formData });
        message.success('Cập nhật thử thách thành công!');
      } else {
        const payload = {
          title: values.title,
          description: values.description,
          hackathonId: values.hackathonId,
          file: file, // bắt buộc có
        };
        await createChallenge.mutateAsync(payload);
        message.success('Tạo thử thách thành công!');
      }

      navigate(-1);
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    fileList,
    onChange: handleFileChange,
    beforeUpload: () => false, // Ngăn upload tự động
    maxCount: 1,
    accept: '.pdf,.doc,.docx,.txt,.zip',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-primary">
        <Spin size="large" tip="Đang tải dữ liệu..." />
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
          borderRadius: 6,
        },
      }}
    >
      <div className="min-h-screen bg-dark-primary py-8 px-4">
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)} // Đã sửa: bọc trong arrow function
              className="mb-4 border-dark-accent hover:border-primary"
            >
              Quay lại danh sách thử thách
            </Button>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              {isEdit ? 'Chỉnh sửa thử thách' : 'Tạo thử thách mới'}
            </h1>
            <p className="text-text-secondary">
              {isEdit
                ? 'Cập nhật thông tin và yêu cầu của thử thách'
                : 'Tạo một thử thách mới cho cuộc thi hackathon'}
            </p>
          </div>

          {/* Form Card */}
          <Card
            className="bg-dark-secondary border-dark-accent shadow-xl"
            bordered={false}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
              className="space-y-6"
            >
              {/* Tiêu đề */}
              <Form.Item
                label={<span className="text-text-primary font-semibold text-base">Tên thử thách</span>}
                name="title"
                rules={[{ required: true, message: 'Vui lòng nhập tên thử thách' }]}
              >
                <Input
                  placeholder="Nhập tiêu đề hấp dẫn cho thử thách"
                  size="large"
                  className="border-dark-accent text-text-primary hover:border-primary focus:border-primary"
                />
              </Form.Item>

              {/* Hackathon */}
              <Form.Item
                label={<span className="text-text-primary font-semibold text-base">Hackathon</span>}
                name="hackathonId"
                rules={[{ required: true, message: 'Vui lòng chọn hackathon' }]}
              >
                <Select
                  placeholder="Chọn hackathon"
                  size="large"
                  loading={hackathonsLoading}
                  options={hackathons.map((h) => ({
                    value: h.hackathonId,
                    label: h.name,
                  }))}
                  className="custom-select"
                  dropdownStyle={{ backgroundColor: '#181818' }}
                />
              </Form.Item>

              {/* Mô tả */}
              <Form.Item
                label={<span className="text-text-primary font-semibold text-base">Mô tả chi tiết</span>}
                name="description"
              >
                <TextArea
                  placeholder="Mô tả mục tiêu, yêu cầu, tiêu chí đánh giá của thử thách..."
                  rows={8}
                  showCount
                  maxLength={5000}
                  className="border-dark-accent text-text-primary hover:border-primary focus:border-primary"
                />
              </Form.Item>

              {/* Tệp đính kèm */}
              <Form.Item
                label={<span className="text-text-primary font-semibold text-base">Tệp đính kèm</span>}
                extra={<span className="text-text-muted text-sm">Bắt buộc: tài liệu hướng dẫn, dataset, tài nguyên...</span>}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng tải lên ít nhất một tệp!',
                  },
                ]}
                // Quan trọng: dùng valuePropName và getValueFromEvent để Antd hiểu Upload có giá trị
                name="attachment"
                valuePropName="fileList"
                getValueFromEvent={(e) => e?.fileList}
              >
                <Upload
                  {...uploadProps}
                  listType="text"
                  className="upload-list-inline"
                >
                  <Button icon={<UploadOutlined />} size="large">
                    Chọn tệp (PDF, DOC, ZIP...)
                  </Button>
                </Upload>
              </Form.Item>

              {/* Nút hành động */}
              <div className="flex items-center gap-4 pt-6 border-t border-dark-accent">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={isEdit ? <SaveOutlined /> : <PlusOutlined />}
                  loading={uploading || createChallenge.isPending || updateChallenge.isPending}
                  className="bg-primary hover:bg-secondary border-none text-white font-semibold px-8"
                >
                  {isEdit ? 'Cập nhật thử thách' : 'Tạo thử thách'}
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default ChallengeForm;