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
import { useApproveTeamMember, useRejectTeamMember } from '../../hooks/student/team-member-approval';
import { useUserData } from '../../hooks/useUserData';
import { useInviteTeamMember } from '../../hooks/student/team-invitation';
import { useGetTeamChatGroups, useGetChatGroupMessages, useSendChatMessage } from '../../hooks/student/chat';
import { useGetTeamMembers } from '../../hooks/student/team-member';
import { Table, Tooltip, Button as AntButton, Input as AntInput } from 'antd';
import { EyeOutlined, DownloadOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, MessageOutlined, SendOutlined } from '@ant-design/icons';
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
  
  // Invite team member hook
  const inviteMemberMutation = useInviteTeamMember();
  
  // Get team members from API
  const { data: teamMembersResponse, isLoading: membersLoading } = useGetTeamMembers(id, {
    enabled: !!id,
  });
  
  // Extract members array from API response
  const apiMembers = Array.isArray(teamMembersResponse?.data) 
    ? teamMembersResponse.data 
    : Array.isArray(teamMembersResponse)
      ? teamMembersResponse
      : [];
  
  // Map API members to component format
  const members = apiMembers.map((member) => ({
    id: member.userId,
    userId: member.userId,
    name: member.userName || member.name,
    email: member.email,
    role: member.roleInTeam === 'TeamLeader' ? 'Trưởng nhóm' : 'Thành viên',
    isLeader: member.roleInTeam === 'TeamLeader',
    status: 'confirmed', // API doesn't provide status, assume confirmed
    avatar: (member.userName || member.name || member.email || 'U').charAt(0).toUpperCase(),
  }));

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
  const currentUserId = userInfo?.id || userInfo?.userId;
  const currentUserName = userInfo?.name || userInfo?.fullName || userInfo?.userName;
  // Check if user is leader by comparing userId or userName with members
  const isLeader = members.some(m => 
    (m.userId === currentUserId || m.id === currentUserId) && m.isLeader
  ) || (teamData?.leaderId === currentUserId) || 
  (teamData?.leaderName && currentUserName && teamData.leaderName === currentUserName);

  // Member approval hooks
  const approveMemberMutation = useApproveTeamMember();
  const rejectMemberMutation = useRejectTeamMember();

  // Chat hooks
  const { data: chatGroupsData = [], isLoading: chatGroupsLoading } = useGetTeamChatGroups(id);
  const [selectedChatGroup, setSelectedChatGroup] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const sendMessageMutation = useSendChatMessage();
  
  const chatGroups = Array.isArray(chatGroupsData) 
    ? chatGroupsData 
    : Array.isArray(chatGroupsData?.data) 
      ? chatGroupsData.data 
      : [];
  
  const { data: messagesData = [], isLoading: messagesLoading } = useGetChatGroupMessages(
    selectedChatGroup?.chatGroupId
  );
  
  const messages = Array.isArray(messagesData) 
    ? messagesData 
    : Array.isArray(messagesData?.data) 
      ? messagesData.data 
      : [];

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !selectedChatGroup?.chatGroupId) return;
    
    try {
      await sendMessageMutation.mutateAsync({
        chatGroupId: selectedChatGroup.chatGroupId,
        content: messageContent.trim(),
      });
      setMessageContent('');
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  const handleInvite = async (values) => {
    try {
      await inviteMemberMutation.mutateAsync({
        teamId: id,
        email: values.email,
      });
      message.success('Lời mời đã được gửi thành công!');
      form.resetFields();
      setInviteModalVisible(false);
    } catch (error) {
      console.error('Invite member error:', error);
      // Error message đã được xử lý trong hook
    }
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

  // Members are now fetched separately via useGetTeamMembers hook above

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

            {membersLoading ? (
              <div className="text-center py-8">
                <Spin size="large" />
              </div>
            ) : (
              <>
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
              </>
            )}
          </Card>
        </TabPane>

        <TabPane tab="Group Chat" key="chat">
          <Card className="backdrop-blur-xl bg-white/5 border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl text-white">
                Group Chat ({chatGroups.length})
              </h3>
            </div>
            {chatGroupsLoading ? (
              <div className="text-center py-8">
                <Spin size="large" />
              </div>
            ) : chatGroups.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Chat Groups List */}
                <div className="lg:col-span-1 space-y-2">
                  {chatGroups.map((group) => (
                    <Card
                      key={group.chatGroupId}
                      className={`cursor-pointer transition-all ${
                        selectedChatGroup?.chatGroupId === group.chatGroupId
                          ? 'bg-green-500/10 border-green-500/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedChatGroup(group)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                          <MessageOutlined className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">
                            {group.groupName || group.teamName || 'Group Chat'}
                          </h4>
                          {group.mentorName && (
                            <p className="text-sm text-gray-400 truncate">
                              Mentor: {group.mentorName}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Chat Messages */}
                <div className="lg:col-span-2">
                  {selectedChatGroup ? (
                    <Card className="bg-white/5 border-white/10 h-[600px] flex flex-col">
                      {/* Chat Header */}
                      <div className="border-b border-white/10 pb-4 mb-4">
                        <h4 className="text-white font-medium">
                          {selectedChatGroup.groupName || selectedChatGroup.teamName || 'Group Chat'}
                        </h4>
                        {selectedChatGroup.mentorName && (
                          <p className="text-sm text-gray-400">
                            Mentor: {selectedChatGroup.mentorName}
                          </p>
                        )}
                      </div>

                      {/* Messages Area */}
                      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                        {messagesLoading ? (
                          <div className="text-center py-8">
                            <Spin size="large" />
                          </div>
                        ) : messages.length > 0 ? (
                          messages.map((msg) => (
                            <div
                              key={msg.messageId || msg.id}
                              className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                  msg.senderId === currentUserId
                                    ? 'bg-green-500/20 border border-green-500/30'
                                    : 'bg-white/5 border border-white/10'
                                }`}
                              >
                                <div className="text-xs text-gray-400 mb-1">
                                  {msg.senderName || 'Unknown'}
                                </div>
                                <div className="text-white">{msg.content}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {msg.createdAt
                                    ? dayjs(msg.createdAt).format('HH:mm DD/MM')
                                    : ''}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12 text-gray-400">
                            <MessageOutlined className="text-4xl mb-2 opacity-50" />
                            <p>Chưa có tin nhắn nào</p>
                          </div>
                        )}
                      </div>

                      {/* Message Input */}
                      <div className="flex gap-2">
                        <AntInput
                          placeholder="Nhập tin nhắn..."
                          value={messageContent}
                          onChange={(e) => setMessageContent(e.target.value)}
                          onPressEnter={handleSendMessage}
                          className="bg-white/5 border-white/10 text-white"
                        />
                        <Button
                          type="primary"
                          icon={<SendOutlined />}
                          onClick={handleSendMessage}
                          loading={sendMessageMutation.isPending}
                          disabled={!messageContent.trim()}
                          className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 border-0"
                        >
                          Gửi
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    <Card className="bg-white/5 border-white/10 h-[600px] flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <MessageOutlined className="text-4xl mb-2 opacity-50" />
                        <p>Chọn một group chat để xem tin nhắn</p>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageOutlined className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Chưa có group chat nào</p>
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
                loading={inviteMemberMutation.isPending}
                className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 border-0"
              >
                {inviteMemberMutation.isPending ? 'Đang gửi...' : 'Gửi Lời Mời'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default MyTeamPage;
