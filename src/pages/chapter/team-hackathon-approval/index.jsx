import {
  TeamOutlined,
  SearchOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MailOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  Card,
  Button,
  Input,
  Select,
  Badge,
  Tag,
  Avatar,
  Modal,
  Table,
  Space,
  message,
  Spin,
  Empty,
} from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../../constants';
import {
  useGetPendingTeamHackathonApprovals,
  useApproveTeamHackathon,
  useRejectTeamHackathon,
} from '../../../hooks/chapter/useTeamHackathonApproval';

const { TextArea } = Input;

const ChapterTeamHackathonApproval = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const { data: approvalsData, isLoading } = useGetPendingTeamHackathonApprovals();
  const approveMutation = useApproveTeamHackathon();
  const rejectMutation = useRejectTeamHackathon();

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
        approvalId: approval.id,
        teamId: approval.teamId,
        hackathonId: approval.hackathonId,
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
        approvalId: selectedApproval.id,
        reason: rejectReason,
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
      render: (teamName, record) => (
        <div className="flex items-center gap-3">
          <Avatar.Group maxCount={3}>
            {record.members.map((member, idx) => (
              <Avatar key={member.id || idx} size="small">
                {member.name.charAt(0).toUpperCase()}
              </Avatar>
            ))}
          </Avatar.Group>
          <div>
            <div className="font-medium text-white">{teamName}</div>
            <div className="text-gray-400 text-xs">
              {record.members.length} thành viên
            </div>
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
      title: 'Trưởng nhóm',
      key: 'leader',
      render: (_, record) => (
        <div>
          <div className="text-white">{record.leader.name}</div>
          <div className="text-gray-400 text-xs">{record.leader.email}</div>
        </div>
      ),
    },
    {
      title: 'Thành viên',
      key: 'members',
      render: (_, record) => (
        <div className="space-y-1">
          {record.members.map((member) => (
            <div key={member.id} className="flex items-center gap-2 text-xs">
              <span className="text-gray-300">{member.name}</span>
              {member.verified ? (
                <Tag color="green" size="small">
                  Đã xác thực
                </Tag>
              ) : (
                <Tag color="orange" size="small">
                  Chưa xác thực
                </Tag>
              )}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date) => (
        <span className="text-gray-400">
          {new Date(date).toLocaleDateString('vi-VN')}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
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
            rowKey="id"
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

