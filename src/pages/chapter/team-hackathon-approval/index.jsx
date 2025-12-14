import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  TeamOutlined
} from '@ant-design/icons';
import {
  Alert,
  Avatar,
  Button,
  Card,
  Input,
  message,
  Modal,
  Select,
  Space,
  Spin,
  Table,
  Tag
} from 'antd';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PATH_NAME } from '../../../constants';
import {
  useApproveTeamHackathon,
  useGetPendingTeamHackathonApprovals,
  useRejectTeamHackathon,
} from '../../../hooks/chapter/useTeamHackathonApproval';
import { useHackathons } from '../../../hooks/admin/hackathons/useHackathons';

const { TextArea } = Input;

const ChapterTeamHackathonApproval = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const hackathonId = searchParams.get('hackathonId');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Get hackathons for selection
  const { fetchHackathons } = useHackathons();
  const { data: hackathons = [], isLoading: hackathonsLoading } = fetchHackathons;

  const { data: approvalsData, isLoading } = useGetPendingTeamHackathonApprovals(hackathonId);
  const approveMutation = useApproveTeamHackathon(hackathonId);
  const rejectMutation = useRejectTeamHackathon(hackathonId);

  const approvals = approvalsData || [];

  const filteredApprovals = approvals.filter((approval) => {
    const query = searchQuery.toLowerCase();
    return (
      approval.teamName.toLowerCase().includes(query) ||
      approval.hackathonName.toLowerCase().includes(query) ||
      approval.leader.name.toLowerCase().includes(query) ||
      approval.leader.email.toLowerCase().includes(query)
    );
  });

  const handleApprove = async (approval) => {
    try {
      await approveMutation.mutateAsync({
        teamId: approval.teamId,
        teamid: approval.teamid,
      });
    } catch (error) {
      console.error('Error approving:', error);
    }
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      message.warning('Vui lòng nhập lý do từ chối');
      return;
    }

    rejectMutation.mutate(
      {
        teamId: selectedApproval.teamId,
        teamid: selectedApproval.teamid,
        cancelReason: rejectReason,
      },
      {
        onSuccess: () => {
          setRejectModalVisible(false);
          setSelectedApproval(null);
          setRejectReason('');
        },
      },
    );
  };

  const showRejectModal = (approval) => {
    setSelectedApproval(approval);
    setRejectModalVisible(true);
  };

  const columns = [
    {
      title: 'Đội',
      dataIndex: 'teamName',
      key: 'teamName',
      render: (teamName) => (
        <div className="flex items-center gap-3">
          <Avatar size="small">
            {teamName.charAt(0).toUpperCase()}
              </Avatar>
          <div>
            <div className="font-medium text-white">{teamName}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Hackathon',
      dataIndex: 'hackathonName',
      key: 'hackathonName',
      render: (name) => <span className="text-gray-300">{name}</span>,
    },
    {
      title: 'Link Repository',
      dataIndex: 'link',
      key: 'link',
      render: (link) => (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Xem Repository
        </a>
      ),
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'registeredAt',
      key: 'registeredAt',
      render: (date) => (
        <span className="text-gray-400">
          {new Date(date).toLocaleDateString('vi-VN')}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          'Pending': { color: 'orange', text: 'Chờ duyệt' },
          'Approved': { color: 'green', text: 'Đã duyệt' },
          'Rejected': { color: 'red', text: 'Đã từ chối' },
        };
        const config = statusMap[status] || { color: 'default', text: status };
        return (
          <Tag color={config.color}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status === 'Pending' && (
            <>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleApprove(record)}
            loading={approveMutation.isPending}
            className="bg-green-600 border-green-600"
          >
            Duyệt
          </Button>
          <Button
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => showRejectModal(record)}
            loading={rejectMutation.isPending}
          >
            Từ chối
          </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(PATH_NAME.CHAPTER_DASHBOARD)}
        className="mb-4"
      >
        Quay lại Dashboard
      </Button>

      <div>
        <h1 className="text-4xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Duyệt Team Tham Gia Hackathon
        </h1>
        <p className="text-gray-400 text-lg mt-2">
          Xem xét và phê duyệt các đội đăng ký tham gia hackathon
        </p>
      </div>

      {/* Hackathon Selector */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <span className="text-white font-medium">Chọn Hackathon:</span>
          <Select
            placeholder="Chọn hackathon để xem các yêu cầu duyệt"
            value={hackathonId || undefined}
            onChange={(value) => {
              const params = new URLSearchParams(searchParams);
              if (value) {
                params.set('hackathonId', value);
              } else {
                params.delete('hackathonId');
              }
              setSearchParams(params);
            }}
            className="flex-1"
            loading={hackathonsLoading}
            allowClear
            showSearch
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {hackathons.map((hackathon) => (
              <Select.Option key={hackathon.hackathonId} value={`${hackathon.hackathonId}`}>
                {hackathon.name}
              </Select.Option>
            ))}
          </Select>
        </div>
        {!hackathonId && (
          <Alert
            message="Vui lòng chọn hackathon"
            description="Bạn cần chọn hackathon để xem các yêu cầu duyệt team tham gia."
            type="info"
            showIcon
            className="mt-3"
          />
        )}
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
              <ClockCircleOutlined className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl text-white">{filteredApprovals.length}</p>
              <p className="text-sm text-gray-400">Chờ duyệt</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center">
              <CheckCircleOutlined className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl text-white">0</p>
              <p className="text-sm text-gray-400">Đã duyệt</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-red-500/20 to-pink-500/20 flex items-center justify-center">
              <CloseCircleOutlined className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-2xl text-white">0</p>
              <p className="text-sm text-gray-400">Đã từ chối</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <Input
          placeholder="Tìm kiếm theo tên đội, hackathon, leader..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white/5 border-white/10"
          size="large"
          allowClear
        />
      </Card>

      {/* Approvals Table */}
      {isLoading ? (
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        </Card>
      ) : filteredApprovals.length > 0 ? (
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <Table
            columns={columns}
            dataSource={filteredApprovals}
            rowKey="registrationId"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
            }}
            className="[&_.ant-table]:bg-transparent [&_th]:!bg-white/5 [&_th]:!text-white [&_td]:!text-gray-300 [&_td]:border-white/10 [&_th]:border-white/10 [&_tr:hover_td]:!bg-white/5"
          />
        </Card>
      ) : (
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <div className="text-center py-12">
            <TeamOutlined className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">
              {searchQuery
                ? 'Không tìm thấy yêu cầu nào phù hợp'
                : 'Không có yêu cầu nào chờ duyệt'}
            </p>
          </div>
        </Card>
      )}

      {/* Reject Modal */}
      <Modal
        title="Từ chối team tham gia hackathon"
        open={rejectModalVisible}
        onOk={handleReject}
        onCancel={() => {
          setRejectModalVisible(false);
          setSelectedApproval(null);
          setRejectReason('');
        }}
        okText="Từ chối"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        className="[&_.ant-modal-content]:bg-dark-secondary [&_.ant-modal-content]:border-white/10 [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white"
      >
        {selectedApproval && (
          <div className="space-y-4">
            <div>
              <p className="text-gray-300 mb-2">
                <strong>Team:</strong> {selectedApproval.teamName}
              </p>
              <p className="text-gray-300 mb-2">
                <strong>Hackathon:</strong> {selectedApproval.hackathonName}
              </p>
              <p className="text-gray-300 mb-2">
                <strong>Repository:</strong>{' '}
                <a
                  href={selectedApproval.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  {selectedApproval.link}
                </a>
              </p>
            </div>
            <div>
              <label className="block text-white mb-2">Lý do từ chối *</label>
              <TextArea
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nhập lý do từ chối team tham gia hackathon..."
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ChapterTeamHackathonApproval;

