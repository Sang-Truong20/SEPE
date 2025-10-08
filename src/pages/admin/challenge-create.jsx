import {
  HomeOutlined,
  InboxOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Divider,
  Form,
  Input,
  Upload,
  message,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../constants';
import { useCreateChallenge } from '../../hooks/admin/challenge/create';

const AdminChallengeCreate = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const createChallengeMutation = useCreateChallenge();

  const handleSubmit = async (values) => {
    try {
      // Submit using mutation - form handling is now in the hook
      await createChallengeMutation.mutateAsync(values);

      // Reset form and navigate on success
      form.resetFields();
      navigate('/admin');
    } catch (error) {
      // Error handling is now done in the hook
      console.error('Form submission error:', error);
    }
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload: () => false, // Prevent auto upload
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    maxCount: 1,
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="mb-10">
        <Breadcrumb
          items={[
            {
              href: PATH_NAME.ADMIN,
              title: <HomeOutlined />,
            },
            {
              href: PATH_NAME.ADMIN_DASHBOARD,
              title: 'Dashboard',
            },
            {
              title: 'Create Challenge',
            },
          ]}
          className="mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-900">
          Create New Challenge
        </h1>
        <p className="text-gray-600 mt-1">
          Fill in the details to create a new challenge
        </p>
      </div>

      {/* Form Section */}
      <div className="">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            Title: '',
            Description: '',
            SeasonId: 0,
            FilePath: '',
          }}
          encType="multipart/form-data"
          className="space-y-8"
        >
          {/* Basic Information Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-1 h-6 bg-green-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800">
                Basic Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Form.Item
                label={
                  <span className="text-sm font-medium text-gray-700">
                    Challenge Title
                  </span>
                }
                name="Title"
                rules={[
                  { required: true, message: 'Please enter a challenge title' },
                ]}
                className="mb-0"
              >
                <Input
                  size="large"
                  placeholder="Enter a compelling challenge title"
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-sm font-medium text-gray-700">
                    Description
                  </span>
                }
                name="Description"
                rules={[
                  { required: true, message: 'Please enter a description' },
                ]}
                className="mb-0"
              >
                <Input.TextArea
                  rows={5}
                  placeholder="Provide a detailed description of the challenge objectives, requirements, and expected outcomes"
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  showCount
                  maxLength={1000}
                />
              </Form.Item>
            </div>
          </div>

          <Divider className="my-8" />

          {/* Configuration Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-1 h-6 bg-green-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800">
                Configuration
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Form.Item
                label={
                  <span className="text-sm font-medium text-gray-700">
                    Season ID
                  </span>
                }
                name="SeasonId"
                rules={[{ required: true, message: 'Please enter Season ID' }]}
                className="mb-0"
                tooltip="Specify the season this challenge belongs to"
              >
                <Input
                  type="number"
                  size="large"
                  placeholder="Enter season identifier"
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-sm font-medium text-gray-700">
                    File Path
                  </span>
                }
                name="FilePath"
                rules={[{ required: true, message: 'Please enter file path' }]}
                className="mb-0"
                tooltip="Specify the location where challenge files will be stored"
              >
                <Input
                  size="large"
                  placeholder="e.g., /challenges/season-1/challenge-1"
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </Form.Item>
            </div>
          </div>

          <Divider className="my-8" />

          {/* File Upload Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-1 h-6 bg-green-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800">
                Challenge Resources
              </h3>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <InfoCircleOutlined className="text-green-600 text-lg" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-green-800 mb-1">
                    File Upload Guidelines
                  </h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Supported formats: ZIP, PDF, DOC, TXT, JSON, XML</li>
                    <li>• Maximum file size: 10MB</li>
                    <li>
                      • Include all necessary challenge materials and
                      documentation
                    </li>
                    <li>
                      • Ensure file names are descriptive and professional
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <Form.Item
              label={
                <span className="text-sm font-medium text-gray-700">
                  Challenge File
                </span>
              }
              name="file"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[
                { required: true, message: 'Please select a challenge file' },
              ]}
              className="mb-0"
              tooltip="Upload the main challenge file (code, documentation, assets, etc.)"
            >
              <Upload.Dragger
                {...uploadProps}
                className="custom-upload-dragger"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined
                    style={{ color: '#10b981', fontSize: '48px' }}
                  />
                </p>
                <p
                  className="ant-upload-text"
                  style={{
                    color: '#374151',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}
                >
                  Click or drag file to this area to upload
                </p>
                <p
                  className="ant-upload-hint"
                  style={{ color: '#6b7280', fontSize: '14px' }}
                >
                  Support for single file upload. Accepted formats: ZIP, PDF,
                  DOC, TXT, JSON, XML. Maximum file size: 10MB.
                </p>
              </Upload.Dragger>
            </Form.Item>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
            <Button
              size="large"
              onClick={handleCancel}
              className="px-8 rounded-lg border-gray-300 hover:border-gray-400 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={createChallengeMutation.isPending}
              className="px-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {createChallengeMutation.isPending
                ? 'Creating...'
                : 'Create Challenge'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AdminChallengeCreate;
