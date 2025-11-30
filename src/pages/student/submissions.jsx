import {
  FileTextOutlined,
  EyeOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Card, Input, Tag, Table, Space, Tooltip, Modal, Form, Select, Spin, Alert, message } from 'antd';
import { useState } from 'react';
import { useGetAllSubmissions } from '../../hooks/student/submission';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

const StudentSubmissions = () => {
  const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Fetch all submissions
  const {
    data: submissionsData = [],
    isLoading: submissionsLoading,
    error: submissionsError,
  } = useGetAllSubmissions();

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
  };

  const handleDownloadFile = (filePath) => {
    if (filePath) {
      window.open(filePath, '_blank');
    } else {
      message.warning('Không có file để tải xuống');
    }
  };

  const handleSubmitProject = (values) => {
    console.log('Submitting project:', values);
    setIsSubmitModalVisible(false);
    // Handle project submission
  };

  const getStatusColor = (isFinal) => {
    return isFinal ? 'green' : 'default';
  };

  const getStatusIcon = (isFinal) => {
    return isFinal ? <CheckCircleOutlined /> : <ClockCircleOutlined />;
  };

  const getStatusText = (isFinal) => {
    return isFinal ? 'Đã nộp' : 'Bản nháp';
  };

  const submissionColumns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (
        <span className="font-medium text-text-primary">{text || 'Chưa có tiêu đề'}</span>
      ),
    },
    {
      title: 'Phase',
      dataIndex: 'phaseName',
      key: 'phaseName',
    },
    {
      title: 'Track',
      dataIndex: 'trackName',
      key: 'trackName',
    },
    {
      title: 'Đội',
      dataIndex: 'teamName',
      key: 'teamName',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isFinal',
      key: 'isFinal',
      render: (isFinal) => (
        <Tag
          color={getStatusColor(isFinal)}
          icon={getStatusIcon(isFinal)}
        >
          {getStatusText(isFinal)}
        </Tag>
      ),
    },
    {
      title: 'Đã nộp',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date) => (
        <span className="text-gray-400">
          {date ? dayjs(date).format('DD/MM/YYYY HH:mm') : 'Chưa nộp'}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              className="text-white hover:text-primary"
              icon={<EyeOutlined />}
              onClick={() => handleViewSubmission(record)}
            />
          </Tooltip>
          {record.filePath && (
            <Tooltip title="Tải xuống file">
              <Button
                type="text"
                className="text-white hover:text-primary"
                icon={<DownloadOutlined />}
                onClick={() => handleDownloadFile(record.filePath)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            Bài nộp của tôi
          </h1>
          <p className="text-muted-foreground mt-2">
            Quản lý và theo dõi các bài nộp dự án của bạn
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            icon={<PlusOutlined />}
            className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 transition-all"
            onClick={() => setIsSubmitModalVisible(true)}
          >
            Nộp dự án mới
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <Search
          placeholder="Tìm kiếm bài nộp..."
          allowClear
          className="w-64"
          prefix={<SearchOutlined />}
        />
      </div>

      {/* Submissions Table */}
      <Card className="bg-card-background border border-card-border backdrop-blur-xl">
        {submissionsLoading ? (
          <div className="flex justify-center py-8">
            <Spin />
          </div>
        ) : submissionsError ? (
          <Alert
            message="Lỗi tải dữ liệu"
            description="Không thể tải danh sách bài nộp. Vui lòng thử lại sau."
            type="error"
            showIcon
          />
        ) : submissionsData && submissionsData.length > 0 ? (
          <Table
            columns={submissionColumns}
            dataSource={submissionsData}
            rowKey="submissionId"
            pagination={false}
            className="[&_.ant-table]:bg-transparent [&_th]:!bg-card-background [&_th]:!text-text-primary [&_td]:!text-text-secondary [&_td]:border-card-border [&_th]:border-card-border [&_tr:hover_td]:!bg-card-background/50"
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">Chưa có bài nộp nào</p>
          </div>
        )}
      </Card>

      {/* Submission Details Modal */}
      <Modal
        title={
          selectedSubmission && (
            <span className="text-xl font-semibold text-text-primary">
              Chi tiết bài nộp: {selectedSubmission.title || 'Chưa có tiêu đề'}
            </span>
          )
        }
        open={!!selectedSubmission}
        onCancel={() => setSelectedSubmission(null)}
        footer={null}
        width={800}
        className="[&_.ant-modal-content]:bg-card-background [&_.ant-modal-header]:border-card-border [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white"
      >
        {selectedSubmission && (
          <div className="space-y-6">
            {/* Project Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-text-secondary mb-1">Phase</label>
                <p className="text-text-primary">{selectedSubmission.phaseName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-text-secondary mb-1">Track</label>
                <p className="text-text-primary">{selectedSubmission.trackName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-text-secondary mb-1">Đội</label>
                <p className="text-text-primary">{selectedSubmission.teamName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-text-secondary mb-1">Trạng thái</label>
                <Tag color={getStatusColor(selectedSubmission.isFinal)}>
                  {getStatusText(selectedSubmission.isFinal)}
                </Tag>
              </div>
              <div>
                <label className="block text-text-secondary mb-1">Đã nộp</label>
                <p className="text-text-primary">
                  {selectedSubmission.submittedAt 
                    ? dayjs(selectedSubmission.submittedAt).format('DD/MM/YYYY HH:mm')
                    : 'Chưa nộp'}
                </p>
              </div>
            </div>

            {/* File */}
            {selectedSubmission.filePath && (
              <div>
                <label className="block text-text-secondary mb-2">File đã nộp</label>
                <div className="flex items-center justify-between p-3 bg-card-background/50 rounded-lg border border-card-border">
                  <div className="flex items-center gap-3">
                    <FileTextOutlined className="text-primary text-lg" />
                    <div>
                      <p className="text-text-primary m-0">
                        {selectedSubmission.filePath.split('/').pop() || 'File'}
                      </p>
                      <p className="text-gray-400 text-sm m-0">
                        {selectedSubmission.filePath}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="text"
                    className="text-white hover:text-primary"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownloadFile(selectedSubmission.filePath)}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Submit Project Modal */}
      <Modal
        title="Nộp dự án mới"
        open={isSubmitModalVisible}
        onCancel={() => setIsSubmitModalVisible(false)}
        footer={null}
        className="[&_.ant-modal-content]:bg-dark-secondary [&_.ant-modal-header]:border-dark-accent [&_.ant-modal-body]:text-white"
      >
        <Form onFinish={handleSubmitProject} layout="vertical">
          <Form.Item
            label="Chọn hackathon"
            name="hackathon"
            rules={[{ required: true, message: 'Vui lòng chọn hackathon!' }]}
          >
            <Select placeholder="Chọn hackathon">
              <Option value="ai-revolution">AI Revolution 2024</Option>
              <Option value="web3-hackathon">Web3 Future Hackathon</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Tên dự án"
            name="projectName"
            rules={[{ required: true, message: 'Vui lòng nhập tên dự án!' }]}
          >
            <Input placeholder="Nhập tên dự án của bạn" />
          </Form.Item>

          <Form.Item
            label="Mô tả dự án"
            name="description"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả dự án!' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Mô tả ngắn gọn về dự án của bạn..."
            />
          </Form.Item>


          <Form.Item>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsSubmitModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Nộp dự án
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentSubmissions;

