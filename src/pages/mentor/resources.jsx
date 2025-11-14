import {
  BookOutlined,
  SearchOutlined,
  PlusOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  LinkOutlined,
  DownloadOutlined,
  EyeOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Badge, Button, Card, Input, Tag, Modal, Form, Select, Upload } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../constants';

const MentorResources = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form] = Form.useForm();

  // Mock data
  const resources = [
    {
      id: '1',
      title: 'Best Practices for API Design',
      description:
        'Tài liệu hướng dẫn thiết kế RESTful API chuẩn, bao gồm authentication, versioning và error handling.',
      type: 'document',
      category: 'Backend',
      url: '#',
      sharedWith: 'all',
      createdAt: '2024-10-01',
      views: 45,
      downloads: 23,
    },
    {
      id: '2',
      title: 'Introduction to Machine Learning',
      description:
        'Video tutorial về các khái niệm cơ bản của Machine Learning, từ linear regression đến neural networks.',
      type: 'video',
      category: 'AI/ML',
      url: '#',
      sharedWith: ['1', '2'],
      createdAt: '2024-09-28',
      views: 67,
      downloads: 0,
    },
    {
      id: '3',
      title: 'React Hooks Complete Guide',
      description:
        'Hướng dẫn chi tiết về React Hooks, useState, useEffect, useContext và custom hooks.',
      type: 'link',
      category: 'Frontend',
      url: 'https://react.dev/hooks',
      sharedWith: 'all',
      createdAt: '2024-09-25',
      views: 89,
      downloads: 0,
    },
    {
      id: '4',
      title: 'Clean Code Principles',
      description:
        'Coding standards và best practices để viết code dễ đọc, dễ maintain.',
      type: 'document',
      category: 'General',
      url: '#',
      sharedWith: 'all',
      createdAt: '2024-09-20',
      views: 102,
      downloads: 56,
    },
    {
      id: '5',
      title: 'Docker & Kubernetes Tutorial',
      description:
        'Video series về containerization và orchestration cho modern applications.',
      type: 'video',
      category: 'DevOps',
      url: '#',
      sharedWith: ['1'],
      createdAt: '2024-09-15',
      views: 34,
      downloads: 0,
    },
    {
      id: '6',
      title: 'Smart Contract Security',
      description:
        'Best practices và common vulnerabilities trong Solidity smart contracts.',
      type: 'document',
      category: 'Blockchain',
      url: '#',
      sharedWith: ['3'],
      createdAt: '2024-09-10',
      views: 28,
      downloads: 15,
    },
  ];

  const categories = [
    'All',
    'Backend',
    'Frontend',
    'AI/ML',
    'DevOps',
    'Blockchain',
    'Design',
    'Database',
    'General',
  ];

  const teams = [
    { id: 'all', name: 'Tất cả teams' },
    { id: '1', name: 'Tech Innovators' },
    { id: '2', name: 'AI Warriors' },
    { id: '3', name: 'Blockchain Pioneers' },
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || resource.category === filterCategory;
    const matchesType = filterType === 'all' || resource.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const getResourceIcon = (type) => {
    switch (type) {
      case 'document':
        return FileTextOutlined;
      case 'video':
        return VideoCameraOutlined;
      case 'link':
        return LinkOutlined;
      case 'code':
        return FileTextOutlined;
      default:
        return FileTextOutlined;
    }
  };

  const getTypeBadge = (type) => {
    const colors = {
      document: 'blue',
      video: 'purple',
      link: 'green',
      code: 'orange',
    };
    const labels = {
      document: 'Tài liệu',
      video: 'Video',
      link: 'Link',
      code: 'Code',
    };
    return <Tag color={colors[type]}>{labels[type]}</Tag>;
  };

  const stats = [
    {
      label: 'Tổng Tài Nguyên',
      value: resources.length,
      icon: BookOutlined,
      color: 'from-cyan-500/20 to-blue-500/20',
      iconColor: 'text-cyan-400',
    },
    {
      label: 'Lượt Xem',
      value: resources.reduce((sum, r) => sum + r.views, 0),
      icon: EyeOutlined,
      color: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-400',
    },
    {
      label: 'Lượt Tải',
      value: resources.reduce((sum, r) => sum + r.downloads, 0),
      icon: DownloadOutlined,
      color: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-400',
    },
    {
      label: 'Chia Sẻ Công Khai',
      value: resources.filter((r) => r.sharedWith === 'all').length,
      icon: ShareAltOutlined,
      color: 'from-yellow-500/20 to-orange-500/20',
      iconColor: 'text-yellow-400',
    },
  ];

  const handleCreateResource = () => {
    form.validateFields().then(() => {
      setShowCreateModal(false);
      form.resetFields();
      // In real app, save to backend
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Button onClick={() => navigate(PATH_NAME.MENTOR_DASHBOARD)}>
        Quay lại Dashboard
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Tài Nguyên
          </h1>
          <p className="text-gray-400 text-lg mt-2">
            Quản lý và chia sẻ tài nguyên học tập với teams
          </p>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 border-0"
        >
          Thêm Tài Nguyên
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="border-0 bg-white/5 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-2xl text-white mt-1">{stat.value}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-0 bg-white/5 backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Tìm kiếm tài nguyên..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 border-white/10"
            size="large"
          />

          <Select
            value={filterCategory}
            onChange={setFilterCategory}
            placeholder="Lọc theo category"
            className="bg-white/5"
            size="large"
          >
            <Select.Option value="all">Tất cả categories</Select.Option>
            {categories
              .filter((c) => c !== 'All')
              .map((cat) => (
                <Select.Option key={cat} value={cat}>
                  {cat}
                </Select.Option>
              ))}
          </Select>

          <Select
            value={filterType}
            onChange={setFilterType}
            placeholder="Lọc theo loại"
            className="bg-white/5"
            size="large"
          >
            <Select.Option value="all">Tất cả loại</Select.Option>
            <Select.Option value="document">Tài liệu</Select.Option>
            <Select.Option value="video">Video</Select.Option>
            <Select.Option value="link">Link</Select.Option>
            <Select.Option value="code">Code</Select.Option>
          </Select>
        </div>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => {
          const Icon = getResourceIcon(resource.type);
          return (
            <Card
              key={resource.id}
              className="border-0 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-cyan-400" />
                </div>
                {getTypeBadge(resource.type)}
              </div>
              <h3 className="text-lg text-white group-hover:text-cyan-400 transition-colors mb-2">
                {resource.title}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                {resource.description}
              </p>

              <div className="flex items-center gap-2 mb-4">
                <Tag color="purple">{resource.category}</Tag>
                {resource.sharedWith === 'all' ? (
                  <Tag color="success">Công khai</Tag>
                ) : (
                  <Tag color="warning">Riêng tư</Tag>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <EyeOutlined />
                  <span>{resource.views}</span>
                </div>
                {resource.type === 'document' && (
                  <div className="flex items-center gap-1">
                    <DownloadOutlined />
                    <span>{resource.downloads}</span>
                  </div>
                )}
                <span>
                  {new Date(resource.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                <Button
                  type="primary"
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 border-0"
                >
                  <EyeOutlined /> Xem
                </Button>
                <Button
                  icon={<ShareAltOutlined />}
                  className="border-white/20 bg-white/5"
                />
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  className="border-red-500/20 bg-red-500/5"
                />
              </div>
            </Card>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <Card className="border-0 bg-white/5 backdrop-blur-xl">
          <div className="p-12 text-center">
            <BookOutlined className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">
              Không tìm thấy tài nguyên nào phù hợp
            </p>
          </div>
        </Card>
      )}

      {/* Create Resource Modal */}
      <Modal
        title="Thêm Tài Nguyên Mới"
        open={showCreateModal}
        onOk={handleCreateResource}
        onCancel={() => {
          setShowCreateModal(false);
          form.resetFields();
        }}
        okText="Thêm tài nguyên"
        cancelText="Hủy"
        className="[&_.ant-modal-content]:bg-dark-secondary [&_.ant-modal-content]:border-white/10"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="VD: Best Practices for API Design" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea
              placeholder="Mô tả ngắn gọn về tài nguyên..."
              rows={3}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="type"
              label="Loại tài nguyên"
              rules={[
                { required: true, message: 'Vui lòng chọn loại tài nguyên' },
              ]}
            >
              <Select placeholder="Chọn loại" className="bg-white/5">
                <Select.Option value="document">Tài liệu</Select.Option>
                <Select.Option value="video">Video</Select.Option>
                <Select.Option value="link">Link</Select.Option>
                <Select.Option value="code">Code</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
              rules={[
                { required: true, message: 'Vui lòng chọn category' },
              ]}
            >
              <Select placeholder="Chọn category" className="bg-white/5">
                {categories
                  .filter((c) => c !== 'All')
                  .map((cat) => (
                    <Select.Option key={cat} value={cat}>
                      {cat}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="url"
            label="URL hoặc File"
            rules={[
              { required: true, message: 'Vui lòng nhập URL hoặc upload file' },
            ]}
          >
            <div className="flex gap-2">
              <Input placeholder="Nhập URL hoặc upload file" />
              <Upload>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </div>
          </Form.Item>

          <Form.Item
            name="sharedWith"
            label="Chia sẻ với"
            rules={[
              { required: true, message: 'Vui lòng chọn team' },
            ]}
          >
            <Select placeholder="Chọn team" className="bg-white/5">
              {teams.map((team) => (
                <Select.Option key={team.id} value={team.id}>
                  {team.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MentorResources;




