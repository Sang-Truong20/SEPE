import {
  FileTextOutlined,
  UploadOutlined,
  EyeOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Input, Row, Tag, Table, Space, Tooltip, Upload, Modal, Form, Select, Progress } from 'antd';
import { useState } from 'react';

const { Search } = Input;
const { Option } = Select;

const StudentSubmissions = () => {
  const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const submissions = [
    {
      id: '1',
      projectName: 'AI-Powered Code Assistant',
      hackathon: 'AI Revolution 2024',
      team: 'Code Crusaders',
      submittedAt: '2024-03-16 14:30',
      status: 'submitted',
      score: '92.3/100',
      feedback: 'Excellent work! The AI integration is seamless and the code quality is outstanding.',
      files: [
        { name: 'source-code.zip', size: '2.3 MB', type: 'application/zip' },
        { name: 'demo-video.mp4', size: '45.2 MB', type: 'video/mp4' },
        { name: 'presentation.pdf', size: '1.8 MB', type: 'application/pdf' },
      ],
    },
    {
      id: '2',
      projectName: 'Smart City Dashboard',
      hackathon: 'AI Revolution 2024',
      team: 'Code Crusaders',
      submittedAt: '2024-03-15 18:45',
      status: 'under_review',
      score: null,
      feedback: null,
      files: [
        { name: 'smart-city-app.zip', size: '5.1 MB', type: 'application/zip' },
        { name: 'architecture-diagram.png', size: '890 KB', type: 'image/png' },
      ],
    },
    {
      id: '3',
      projectName: 'Blockchain Voting System',
      hackathon: 'Web3 Future Hackathon',
      team: 'Blockchain Heroes',
      submittedAt: null,
      status: 'draft',
      score: null,
      feedback: null,
      files: [],
    },
  ];

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
  };

  const handleDownloadFile = (fileName) => {
    console.log('Downloading file:', fileName);
    // Handle file download
  };

  const handleSubmitProject = (values) => {
    console.log('Submitting project:', values);
    setIsSubmitModalVisible(false);
    // Handle project submission
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'green';
      case 'under_review':
        return 'gold';
      case 'draft':
        return 'default';
      case 'graded':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted':
        return <CheckCircleOutlined />;
      case 'under_review':
        return <ClockCircleOutlined />;
      case 'draft':
        return <ExclamationCircleOutlined />;
      case 'graded':
        return <CheckCircleOutlined />;
      default:
        return <ExclamationCircleOutlined />;
    }
  };

  const submissionColumns = [
    {
      title: 'Dự án',
      dataIndex: 'projectName',
      key: 'projectName',
      render: (text) => (
        <span className="font-medium text-text-primary">{text}</span>
      ),
    },
    {
      title: 'Hackathon',
      dataIndex: 'hackathon',
      key: 'hackathon',
    },
    {
      title: 'Đội',
      dataIndex: 'team',
      key: 'team',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Tag
          color={getStatusColor(status)}
          icon={getStatusIcon(status)}
        >
          {status === 'submitted' && 'Đã nộp'}
          {status === 'under_review' && 'Đang đánh giá'}
          {status === 'draft' && 'Bản nháp'}
          {status === 'graded' && 'Đã chấm điểm'}
        </Tag>
      ),
    },
    {
      title: 'Điểm',
      dataIndex: 'score',
      key: 'score',
      render: (score) => (
        <span className={score ? 'text-primary' : 'text-gray-500'}>
          {score || 'Chưa có điểm'}
        </span>
      ),
    },
    {
      title: 'Đã nộp',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date) => (
        <span className="text-gray-400">
          {date || 'Chưa nộp'}
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
          {record.files.length > 0 && (
            <Tooltip title="Tải xuống tất cả files">
              <Button
                type="text"
                className="text-white hover:text-primary"
                icon={<DownloadOutlined />}
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
        <Table
          columns={submissionColumns}
          dataSource={submissions}
          pagination={false}
          className="[&_.ant-table]:bg-transparent [&_th]:!bg-card-background [&_th]:!text-text-primary [&_td]:!text-text-secondary [&_td]:border-card-border [&_th]:border-card-border [&_tr:hover_td]:!bg-card-background/50"
        />
      </Card>

      {/* Submission Details Modal */}
      <Modal
        title={
          selectedSubmission && (
            <span className="text-xl font-semibold text-text-primary">
              Chi tiết bài nộp: {selectedSubmission.projectName}
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
                <label className="block text-text-secondary mb-1">Hackathon</label>
                <p className="text-text-primary">{selectedSubmission.hackathon}</p>
              </div>
              <div>
                <label className="block text-text-secondary mb-1">Đội</label>
                <p className="text-text-primary">{selectedSubmission.team}</p>
              </div>
              <div>
                <label className="block text-text-secondary mb-1">Trạng thái</label>
                <Tag color={getStatusColor(selectedSubmission.status)}>
                  {selectedSubmission.status === 'submitted' && 'Đã nộp'}
                  {selectedSubmission.status === 'under_review' && 'Đang đánh giá'}
                  {selectedSubmission.status === 'draft' && 'Bản nháp'}
                  {selectedSubmission.status === 'graded' && 'Đã chấm điểm'}
                </Tag>
              </div>
              <div>
                <label className="block text-text-secondary mb-1">Điểm</label>
                <p className={selectedSubmission.score ? 'text-primary' : 'text-muted-foreground'}>
                  {selectedSubmission.score || 'Chưa có điểm'}
                </p>
              </div>
            </div>

            {/* Feedback */}
            {selectedSubmission.feedback && (
              <div>
                <label className="block text-text-secondary mb-2">Phản hồi từ ban giám khảo</label>
                <div className="bg-card-background/50 p-4 rounded-lg border border-card-border">
                  <p className="text-text-primary">{selectedSubmission.feedback}</p>
                </div>
              </div>
            )}

            {/* Files */}
            {selectedSubmission.files.length > 0 && (
              <div>
                <label className="block text-text-secondary mb-2">Files đã nộp</label>
                <div className="space-y-2">
                  {selectedSubmission.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-card-background/50 rounded-lg border border-card-border"
                    >
                      <div className="flex items-center gap-3">
                        <FileTextOutlined className="text-primary text-lg" />
                        <div>
                          <p className="text-text-primary m-0">{file.name}</p>
                          <p className="text-gray-400 text-sm m-0">{file.size}</p>
                        </div>
                      </div>
                      <Button
                        type="text"
                        className="text-white hover:text-primary"
                        icon={<DownloadOutlined />}
                        onClick={() => handleDownloadFile(file.name)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress for draft submissions */}
            {selectedSubmission.status === 'draft' && (
              <div>
                <label className="block text-text-secondary mb-2">Tiến độ hoàn thành</label>
                <Progress
                  percent={75}
                  strokeColor="#1890ff"
                  trailColor="#374151"
                  className="[&_.ant-progress-bg]:bg-primary"
                />
                <p className="text-gray-400 text-sm mt-1">
                  Hoàn thành 3/4 bước nộp bài
                </p>
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

          <Form.Item
            label="Files dự án"
            name="files"
          >
            <Upload.Dragger
              multiple
              className="[&_.ant-upload]:bg-dark-accent [&_.ant-upload]:border-dark-accent [&_.ant-upload]:text-text-primary hover:[&_.ant-upload]:border-primary"
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined className="text-2xl text-primary" />
              </p>
              <p className="ant-upload-text text-text-primary">
                Nhấp hoặc kéo thả files vào đây
              </p>
              <p className="ant-upload-hint text-gray-400">
                Hỗ trợ: ZIP, PDF, Video, Image files
              </p>
            </Upload.Dragger>
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
