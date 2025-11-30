import { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Avatar,
  Badge,
  Modal,
  Form,
  Input,
  message,
  Tabs,
  Space,
  Alert,
  Tag,
  Spin,
} from 'antd';
import {
  UserPlus,
  Crown,
  Mail,
  Github,
  Linkedin,
  XCircle,
  CheckCircle,
  Clock,
  Users,
  AlertTriangle,
  X,
  FileText,
  Award,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_NAME } from '../../constants';
import { useGetTeam } from '../../hooks/student/team';
import { useGetPendingMembers, useApproveTeamMember, useRejectTeamMember } from '../../hooks/student/team-member-approval';
import { useGetTeamPenalties, useAppealTeamPenalty } from '../../hooks/student/team-penalty';
import { useUserData } from '../../hooks/useUserData';
import { useGetSubmissionsByTeam } from '../../hooks/student/submission';
import { Table, Tooltip, Button as AntButton } from 'antd';
import { EyeOutlined, DownloadOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TabPane } = Tabs;

const mapApiTeamToView = (apiTeam) => {
  if (!apiTeam) return null;
  return {
    id: apiTeam.teamId || apiTeam.id,
    teamName: apiTeam.teamName || apiTeam.name,
    description: apiTeam.description || '',
    hackathon: apiTeam.hackathonName || apiTeam.hackathon,
    leaderId: apiTeam.teamLeaderId || apiTeam.leaderId,
    leaderName: apiTeam.teamLeaderName || apiTeam.leaderName,
    chapterName: apiTeam.chapterName,
    createdAt: apiTeam.createdAt,
    members: apiTeam.members || [],
    tasks: apiTeam.tasks || [],
  };
};

const MyTeamPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('members');
  const {
    data: apiTeam,
    isLoading: teamLoading,
    error: teamError,
  } = useGetTeam(id, {
    enabled: !!id,
  });

  const [teamData, setTeamData] = useState(null);
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    if (apiTeam) {
      setTeamData(mapApiTeamToView(apiTeam));
    } else {
      setTeamData(null);
    }
    setActiveTab('members');
  }, [apiTeam]);

  // Get current user from auth context
  const { userInfo } = useUserData();
  const currentUserId = userInfo?.id || userInfo?.userId || 'user-1';
  const isLeader = teamData?.leaderId === currentUserId;

  // Member approval hooks
  const { data: pendingMembers = [] } = useGetPendingMembers(id, {
    enabled: isLeader && !!id,
  });
  const approveMemberMutation = useApproveTeamMember();
  const rejectMemberMutation = useRejectTeamMember();

  // Team penalty hooks
  const { data: teamPenalties = [], isLoading: penaltiesLoading } = useGetTeamPenalties(id, {
    enabled: !!id,
  });
  const appealPenaltyMutation = useAppealTeamPenalty();
  const [appealModalVisible, setAppealModalVisible] = useState(false);
  const [selectedPenalty, setSelectedPenalty] = useState(null);
  const [appealForm] = Form.useForm();
  const displayPenalties = teamPenalties || [];

  // Submissions hooks
  const {
    data: submissionsData = [],
    isLoading: submissionsLoading,
  } = useGetSubmissionsByTeam(id, {
    enabled: !!id,
  });
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const getSubmissionStatusColor = (isFinal) => {
    return isFinal ? 'green' : 'default';
  };

  const getSubmissionStatusIcon = (isFinal) => {
    return isFinal ? <CheckCircleOutlined /> : <ClockCircleOutlined />;
  };

  const getSubmissionStatusText = (isFinal) => {
    return isFinal ? 'Đã nộp' : 'Bản nháp';
  };

  const handleDownloadFile = (filePath) => {
    if (filePath) {
      window.open(filePath, '_blank');
    } else {
      message.warning('Không có file để tải xuống');
    }
  };

  const submissionColumns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (
        <span className="font-medium text-white">{text || 'Chưa có tiêu đề'}</span>
      ),
    },
    {
      title: 'Phase',
      dataIndex: 'phaseName',
      key: 'phaseName',
      render: (text) => <span className="text-gray-300">{text || 'N/A'}</span>,
    },
    {
      title: 'Track',
      dataIndex: 'trackName',
      key: 'trackName',
      render: (text) => <span className="text-gray-300">{text || 'N/A'}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isFinal',
      key: 'isFinal',
      render: (isFinal) => (
        <Tag
          color={getSubmissionStatusColor(isFinal)}
          icon={getSubmissionStatusIcon(isFinal)}
        >
          {getSubmissionStatusText(isFinal)}
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
            <AntButton
              type="text"
              className="text-white hover:text-green-400"
              icon={<EyeOutlined />}
              onClick={() => setSelectedSubmission(record)}
            />
          </Tooltip>
          {record.filePath && (
            <Tooltip title="Tải xuống file">
              <AntButton
                type="text"
                className="text-white hover:text-green-400"
                icon={<DownloadOutlined />}
                onClick={() => handleDownloadFile(record.filePath)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const handleInvite = async (values) => {
    setIsInviting(true);
    // Simulate API call
    setTimeout(() => {
      const currentMembers = teamData.members || [];
      const newMember = {
        id: currentMembers.length + 1,
        userId: `user-${currentMembers.length + 1}`,
        name: values.email.split('@')[0],
        email: values.email,
        role: 'Thành viên',
        skills: [],
        avatar: values.email.substring(0, 2).toUpperCase(),
        status: 'pending',
        github: '',
        linkedin: '',
        isLeader: false,
        penalty: null,
      };

      setTeamData({
        ...teamData,
        members: [...currentMembers, newMember],
      });

      message.success('Lời mời đã được gửi thành công!');
      form.resetFields();
      setInviteModalVisible(false);
      setIsInviting(false);
    }, 1000);
  };

  const handleKickMember = (memberId) => {
    Modal.confirm({
      title: 'Xác nhận loại thành viên',
      content: 'Bạn có chắc chắn muốn loại thành viên này khỏi đội?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => {
        const currentMembers = teamData.members || [];
        setTeamData({
          ...teamData,
          members: currentMembers.filter(
            (m) => m.id !== memberId && m.userId !== memberId,
          ),
        });
        message.success('Đã loại thành viên khỏi đội');
      },
    });
  };

  const handleApproveMember = async (memberId) => {
    try {
      await approveMemberMutation.mutateAsync({ teamId: id, memberId });
    } catch (error) {
      console.error('Approve member error:', error);
    }
  };

  const handleRejectMember = async (memberId) => {
    Modal.confirm({
      title: 'Từ chối thành viên',
      content: 'Bạn có chắc chắn muốn từ chối thành viên này?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await rejectMemberMutation.mutateAsync({ teamId: id, memberId, reason: 'Từ chối bởi leader' });
        } catch (error) {
          console.error('Reject member error:', error);
        }
      },
    });
  };

  const handleAppealPenalty = async (values) => {
    try {
      await appealPenaltyMutation.mutateAsync({
        penaltyId: selectedPenalty.id,
        teamId: id,
        message: values.message,
      });
      setAppealModalVisible(false);
      appealForm.resetFields();
      setSelectedPenalty(null);
    } catch (error) {
      console.error('Appeal penalty error:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
      case 'active':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      default:
        return status;
    }
  };

  if (teamLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (teamError) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert
          message="Không tải được thông tin đội"
          description="Vui lòng thử lại sau hoặc liên hệ quản trị viên."
          type="error"
          showIcon
          action={
            <Button onClick={() => navigate(PATH_NAME.STUDENT_TEAMS)}>
              Quay về danh sách đội
            </Button>
          }
        />
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert
          message="Không tìm thấy đội"
          description={`Đội với ID "${id}" không tồn tại. Vui lòng kiểm tra lại hoặc quay về danh sách đội.`}
          type="error"
          showIcon
          action={
            <Button onClick={() => navigate(PATH_NAME.STUDENT_TEAMS)}>
              Xem danh sách đội
            </Button>
          }
        />
      </div>
    );
  }

  const members = teamData.members || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            {teamData.teamName || 'Đội của tôi'}
          </h1>
          <p className="text-gray-400 mt-2">
            {teamData.hackathon || 'Quản lý đội và thành viên của bạn'}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl text-white">{members.length}</p>
              <p className="text-sm text-gray-400">Thành viên</p>
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl text-white">
                {
                  members.filter(
                    (m) => m.status === 'confirmed' || m.status === 'active',
                  ).length
                }
              </p>
              <p className="text-sm text-gray-400">Đã xác nhận</p>
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl text-white">
                {members.filter((m) => m.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-400">Chờ xác nhận</p>
            </div>
      </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="[&_.ant-tabs-tab]:text-gray-400 [&_.ant-tabs-tab-active]:text-white [&_.ant-tabs-ink-bar]:bg-gradient-to-r [&_.ant-tabs-ink-bar]:from-green-500 [&_.ant-tabs-ink-bar]:to-emerald-400"
      >
        {isLeader && pendingMembers.length > 0 && (
          <TabPane 
            tab={
              <Badge count={pendingMembers.length} size="small">
                <span>Duyệt thành viên</span>
              </Badge>
            } 
            key="approval"
          >
            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <h3 className="text-xl text-white mb-4">
                Thành viên chờ duyệt ({pendingMembers.length})
              </h3>
              <div className="space-y-4">
                {pendingMembers.map((member) => (
                  <Card
                    key={member.id || member.userId}
                    className="bg-white/5 border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <Avatar
                          size={48}
                          className="bg-gradient-to-r from-green-400 to-emerald-400 text-white"
                        >
                          {member.avatar || member.name?.substring(0, 2).toUpperCase()}
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-white font-medium">{member.name}</h4>
                            <Badge status="warning" text="Chờ duyệt" />
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{member.email}</p>
                          {member.role && (
                            <p className="text-sm text-gray-400 mb-2">{member.role}</p>
                          )}
                          {member.message && (
                            <p className="text-sm text-gray-300 italic">&quot;{member.message}&quot;</p>
                          )}
                          {member.skills && member.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {member.skills.slice(0, 4).map((skill, idx) => (
                                <Tag key={idx} className="text-xs bg-white/5 border-white/10 text-gray-300">
                                  {skill}
                                </Tag>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="primary"
                          icon={<CheckCircle className="w-4 h-4" />}
                          onClick={() => handleApproveMember(member.id || member.userId)}
                          loading={approveMemberMutation.isPending}
                          className="bg-green-500 hover:bg-green-600 border-0"
                        >
                          Chấp nhận
                        </Button>
                        <Button
                          danger
                          icon={<X className="w-4 h-4" />}
                          onClick={() => handleRejectMember(member.id || member.userId)}
                          loading={rejectMemberMutation.isPending}
                        >
                          Từ chối
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabPane>
        )}
        <TabPane tab="Thành viên" key="members">
          <Card className="backdrop-blur-xl bg-white/5 border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl text-white">
                Thành Viên Đội ({members.length}/5)
              </h3>
              {isLeader ? (
                <Button
                  type="primary"
                  icon={<UserPlus className="w-4 h-4" />}
                  onClick={() => setInviteModalVisible(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 border-0"
                  disabled={members.length >= 5}
                >
                  Mời Thành Viên {members.length >= 5 && '(Đã đủ 5 thành viên)'}
                </Button>
              ) : (
                <Badge
                  variant="outline"
                  className="border-orange-500/30 text-orange-300 px-3 py-1 rounded"
                >
                  Chỉ trưởng nhóm mới có thể mời thành viên
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map((member) => {
                const isMemberLeader =
                  member.isLeader ||
                  member.id === teamData.leaderId ||
                  member.userId === teamData.leaderId;
                const memberName = member.name || member.user?.name || 'N/A';
                const memberEmail = member.email || member.user?.email || '';
                const memberSkills = member.skills || [];
                const avatarInitials =
                  member.avatar ||
                  memberName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                return (
                  <Card
                    key={member.id || member.userId}
                    className="bg-white/5 border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start space-x-4">
                      <Avatar
                        size={48}
                        className="bg-gradient-to-r from-green-400 to-emerald-400 text-white"
                      >
                        {avatarInitials}
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-white font-medium">
                            {memberName}
                          </h4>
                          {isMemberLeader && (
                            <Crown className="w-4 h-4 text-yellow-400" />
                          )}
                          <Badge
                            status={getStatusColor(member.status)}
                            text={getStatusText(member.status)}
                            className="text-xs"
                          />
                        </div>

                        <p className="text-sm text-gray-400 mb-3">
                          {member.role || 'Thành viên'}
                        </p>

                        {member.penalty && (
                          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 mb-3">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="w-4 h-4 text-red-400" />
                              <span className="text-red-300 text-xs">
                                Cảnh báo
                              </span>
                            </div>
                            <p className="text-xs text-red-200 mt-1">
                              {member.penalty.reason}
                            </p>
                          </div>
                        )}

                        {memberSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {memberSkills.slice(0, 4).map((skill, idx) => (
                              <Tag
                                key={idx}
                                className="text-xs bg-white/5 border-white/10 text-gray-300"
                              >
                                {skill}
                              </Tag>
                            ))}
                            {memberSkills.length > 4 && (
                              <Tag className="text-xs bg-white/5 border-white/10 text-gray-300">
                                +{memberSkills.length - 4}
                              </Tag>
                            )}
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          {memberEmail && (
                            <Button
                              type="text"
                              size="small"
                              icon={<Mail className="w-4 h-4" />}
                              className="text-gray-400 hover:text-white"
                              href={`mailto:${memberEmail}`}
                            />
                          )}
                          {member.github && (
                            <Button
                              type="text"
                              size="small"
                              icon={<Github className="w-4 h-4" />}
                              className="text-gray-400 hover:text-white"
                              href={member.github}
                              target="_blank"
                            />
                          )}
                          {member.linkedin && (
                            <Button
                              type="text"
                              size="small"
                              icon={<Linkedin className="w-4 h-4" />}
                              className="text-gray-400 hover:text-white"
                              href={member.linkedin}
                              target="_blank"
                            />
                          )}
                          {isLeader && !isMemberLeader && (
                            <Button
                              type="text"
                              size="small"
                              danger
                              icon={<XCircle className="w-4 h-4" />}
                              onClick={() =>
                                handleKickMember(member.id || member.userId)
                              }
                              className="text-red-400 hover:text-red-300"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {members.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Chưa có thành viên nào</p>
              </div>
            )}
          </Card>
        </TabPane>

        <TabPane tab="Penalty đội" key="penalties">
          <Card className="backdrop-blur-xl bg-white/5 border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl text-white">
                Penalty của đội ({displayPenalties.length})
              </h3>
            </div>
            {penaltiesLoading ? (
              <div className="text-center py-8">
                <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin" />
                <p className="text-gray-400">Đang tải...</p>
              </div>
            ) : displayPenalties.length > 0 ? (
              <div className="space-y-4">
                {displayPenalties.map((penalty) => (
                  <Card
                    key={penalty.id}
                    className="bg-white/5 border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                          <h4 className="text-white font-medium">
                            {penalty.type === 'late_submission' && 'Nộp bài muộn'}
                            {penalty.type === 'rule_violation' && 'Vi phạm quy tắc'}
                            {penalty.type === 'abandonment' && 'Bỏ thi giữa chừng'}
                          </h4>
                          <Tag color="red">-{Math.abs(penalty.points)} điểm</Tag>
                          {penalty.status === 'appealed' && (
                            <Tag color="orange">
                              {penalty.appealStatus === 'pending' && 'Đang phúc khảo'}
                              {penalty.appealStatus === 'approved' && 'Phúc khảo thành công'}
                              {penalty.appealStatus === 'rejected' && 'Phúc khảo bị từ chối'}
                            </Tag>
                          )}
                        </div>
                        <p className="text-gray-300 mb-2">{penalty.reason}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>Giai đoạn: {penalty.hackathonPhase}</span>
                          <span>•</span>
                          <span>
                            {new Date(penalty.date).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                      {penalty.canAppeal && (
                        <Button
                          type="primary"
                          icon={<FileText className="w-4 h-4" />}
                          onClick={() => {
                            setSelectedPenalty(penalty);
                            setAppealModalVisible(true);
                          }}
                          className="bg-orange-500 hover:bg-orange-600 border-0"
                        >
                          Phúc khảo
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Đội không có penalty nào</p>
              </div>
            )}
          </Card>
        </TabPane>

        <TabPane tab="Nộp bài" key="submissions">
          <Card className="backdrop-blur-xl bg-white/5 border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl text-white">
                Bài nộp của đội ({submissionsData.length})
              </h3>
            </div>
            {submissionsLoading ? (
              <div className="text-center py-8">
                <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin" />
                <p className="text-gray-400">Đang tải...</p>
              </div>
            ) : submissionsData.length > 0 ? (
              <Table
                columns={submissionColumns}
                dataSource={submissionsData}
                rowKey="submissionId"
                pagination={false}
                className="[&_.ant-table]:bg-transparent [&_th]:!bg-white/5 [&_th]:!text-white [&_td]:!text-gray-300 [&_td]:border-white/10 [&_th]:border-white/10 [&_tr:hover_td]:!bg-white/10"
              />
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Chưa có bài nộp nào</p>
              </div>
            )}
          </Card>
        </TabPane>
      </Tabs>

      {/* Invite Modal */}
      <Modal
        title="Mời Thành Viên Mới"
        open={inviteModalVisible}
        onCancel={() => {
          setInviteModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        className="[&_.ant-modal-content]:bg-gray-900/95 [&_.ant-modal-content]:backdrop-blur-xl [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white [&_.ant-modal-mask]:bg-black/50"
      >
        <p className="text-gray-400 mb-4">
          Chỉ trưởng nhóm mới có quyền mời thành viên vào đội thi
        </p>
        <Form form={form} onFinish={handleInvite} layout="vertical">
          <Form.Item
            label={<span className="text-white">Email thành viên</span>}
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input
              placeholder="example@email.com"
              prefix={<Mail className="w-4 h-4 text-gray-400" />}
            />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setInviteModalVisible(false);
                  form.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isInviting}
                className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 border-0"
              >
                {isInviting ? 'Đang gửi...' : 'Gửi Lời Mời'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Appeal Penalty Modal */}
      <Modal
        title="Phúc khảo Penalty"
        open={appealModalVisible}
        onCancel={() => {
          setAppealModalVisible(false);
          appealForm.resetFields();
          setSelectedPenalty(null);
        }}
        footer={null}
        className="[&_.ant-modal-content]:bg-gray-900/95 [&_.ant-modal-content]:backdrop-blur-xl [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white [&_.ant-modal-mask]:bg-black/50"
      >
        {selectedPenalty && (
          <div className="mb-4">
            <Alert
              message={
                <div>
                  <p className="text-white font-medium mb-1">
                    {selectedPenalty.type === 'late_submission' && 'Nộp bài muộn'}
                    {selectedPenalty.type === 'rule_violation' && 'Vi phạm quy tắc'}
                    {selectedPenalty.type === 'abandonment' && 'Bỏ thi giữa chừng'}
                  </p>
                  <p className="text-gray-300 text-sm">{selectedPenalty.reason}</p>
                  <p className="text-red-400 text-sm mt-1">
                    Trừ {Math.abs(selectedPenalty.points)} điểm
                  </p>
                </div>
              }
              type="error"
              showIcon
              className="mb-4"
            />
          </div>
        )}
        <Form form={appealForm} onFinish={handleAppealPenalty} layout="vertical">
          <Form.Item
            label={<span className="text-white">Lý do phúc khảo</span>}
            name="message"
            rules={[
              { required: true, message: 'Vui lòng nhập lý do phúc khảo!' },
              { min: 10, message: 'Lý do phúc khảo phải có ít nhất 10 ký tự!' },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Giải thích lý do bạn muốn phúc khảo penalty này..."
            />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setAppealModalVisible(false);
                  appealForm.resetFields();
                  setSelectedPenalty(null);
                }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={appealPenaltyMutation.isPending}
                className="bg-orange-500 hover:bg-orange-600 border-0"
              >
                {appealPenaltyMutation.isPending ? 'Đang gửi...' : 'Gửi phúc khảo'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Submission Details Modal */}
      <Modal
        title={
          selectedSubmission && (
            <span className="text-xl font-semibold text-white">
              Chi tiết bài nộp: {selectedSubmission.title || 'Chưa có tiêu đề'}
            </span>
          )
        }
        open={!!selectedSubmission}
        onCancel={() => setSelectedSubmission(null)}
        footer={null}
        width={800}
        className="[&_.ant-modal-content]:bg-gray-900/95 [&_.ant-modal-content]:backdrop-blur-xl [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white [&_.ant-modal-mask]:bg-black/50"
      >
        {selectedSubmission && (
          <div className="space-y-6">
            {/* Project Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Phase</label>
                <p className="text-white">{selectedSubmission.phaseName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Track</label>
                <p className="text-white">{selectedSubmission.trackName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Đội</label>
                <p className="text-white">{selectedSubmission.teamName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Trạng thái</label>
                <Tag color={getSubmissionStatusColor(selectedSubmission.isFinal)}>
                  {getSubmissionStatusText(selectedSubmission.isFinal)}
                </Tag>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Đã nộp</label>
                <p className="text-white">
                  {selectedSubmission.submittedAt 
                    ? dayjs(selectedSubmission.submittedAt).format('DD/MM/YYYY HH:mm')
                    : 'Chưa nộp'}
                </p>
              </div>
            </div>

            {/* File */}
            {selectedSubmission.filePath && (
              <div>
                <label className="block text-gray-400 mb-2">File đã nộp</label>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <FileTextOutlined className="text-green-400 text-lg" />
                    <div>
                      <p className="text-white m-0">
                        {selectedSubmission.filePath.split('/').pop() || 'File'}
                      </p>
                      <p className="text-gray-400 text-sm m-0">
                        {selectedSubmission.filePath}
                      </p>
                    </div>
                  </div>
                  <AntButton
                    type="text"
                    className="text-white hover:text-green-400"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownloadFile(selectedSubmission.filePath)}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyTeamPage;
