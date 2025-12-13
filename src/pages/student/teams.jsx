import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Alert, Button, Card, Empty, message, Space, Spin, Tabs, Tag } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreateTeamModal,
  TeamList,
  JoinTeamModal,
  SearchTeamsTab,
} from '../../components/features/student/team';
import {
  useCreateTeam,
  useGetMyTeams,
  useGetTeams,
} from '../../hooks/student/team';
import {
  useAcceptTeamInvitation,
  useRejectTeamInvitation,
  useTeamInvitationStatus
} from '../../hooks/student/team-invitation';
import {
  useGetMyTeamJoinRequests,
  useCreateTeamJoinRequest,
} from '../../hooks/student/team-join-request';
import {
  useGetTeamMembers,
  useLeaveTeam,
} from '../../hooks/student/team-member';

const StudentTeams = () => {
  const navigate = useNavigate();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [activeTab, setActiveTab] = useState('teams');
  const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);
  const [selectedTeamForJoin, setSelectedTeamForJoin] = useState(null);

  // Hooks for team operations
  const createTeamMutation = useCreateTeam();
  const {
    data: myTeamsData,
    isLoading: myTeamsLoading,
    error: myTeamsError,
  } = useGetMyTeams();
  const {
    data: allTeamsData,
    isLoading: allTeamsLoading,
    error: allTeamsError,
  } = useGetTeams();
  const { data: teamMembersData, isLoading: membersLoading } =
    useGetTeamMembers(selectedTeam);

  const leaveTeamMutation = useLeaveTeam();
  const createJoinRequestMutation = useCreateTeamJoinRequest();

  // Invitations and join requests hooks
  const { data: joinRequests = [], isLoading: joinRequestsLoading } = useGetMyTeamJoinRequests();
  const { data: invitations = [], isLoading: invitationsLoading } = useTeamInvitationStatus();

  const acceptInvitationMutation = useAcceptTeamInvitation();
  const rejectInvitationMutation = useRejectTeamInvitation();


  // My teams from /Team/my-teams
  const myTeamsArray = Array.isArray(myTeamsData)
    ? myTeamsData
    : myTeamsData?.data
      ? myTeamsData.data
      : myTeamsData?.teams
        ? myTeamsData.teams
        : [];

  const myTeams = myTeamsArray || [];

  const handleCreateTeam = async (values) => {
    try {
      await createTeamMutation.mutateAsync({
        teamName: values.teamName,
        chapterId: values.chapterId,
      });
      message.success('Đội đã được tạo thành công!');
      setIsCreateModalVisible(false);
    } catch (error) {
      console.error('Create team error:', error);
      if (
        error?.message?.includes('Network Error') ||
        error?.code === 'NETWORK_ERROR'
      ) {
        message.error(
          'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.',
        );
      } else if (error?.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error?.response?.status >= 500) {
        message.error('Lỗi máy chủ. Vui lòng thử lại sau.');
      } else {
        message.error('Có lỗi xảy ra khi tạo đội. Vui lòng thử lại.');
      }
    }
  };

  const handleJoinTeam = (teamId) => {
    setSelectedTeamForJoin(teamId);
    setIsJoinModalVisible(true);
  };

  const handleSubmitJoinRequest = async (joinMessage) => {
    if (!selectedTeamForJoin) {
      message.error('Không xác định được đội. Vui lòng thử lại.');
      return;
    }

    try {
      await createJoinRequestMutation.mutateAsync({
        teamId: selectedTeamForJoin,
        message: joinMessage || 'Tôi muốn tham gia đội của bạn',
      });
      message.success('Đã gửi yêu cầu tham gia đội thành công!');
      setIsJoinModalVisible(false);
      setSelectedTeamForJoin(null);
    } catch (error) {
      console.error('Join team error:', error);
      if (
        error?.message?.includes('Network Error') ||
        error?.code === 'NETWORK_ERROR'
      ) {
        message.error('Không thể kết nối đến máy chủ. Vui lòng thử lại.');
      } else if (error?.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error?.response?.status === 400) {
        message.error(error?.response?.data?.message || 'Không thể gửi yêu cầu. Có thể bạn đã gửi yêu cầu trước đó.');
      } else {
        message.error('Có lỗi xảy ra khi gửi yêu cầu tham gia đội. Vui lòng thử lại.');
      }
    }
  };

  const handleCancelJoinModal = () => {
    setIsJoinModalVisible(false);
    setSelectedTeamForJoin(null);
  };

  const handleViewTeam = (teamId) => {
    if (!teamId) {
      message.error('Không xác định được đội. Vui lòng thử lại.');
      return;
    }
    setSelectedTeam(teamId);
    navigate(`/student/teams/${teamId}`);
  };

  const handleLeaveTeam = async (teamId) => {
    try {
      await leaveTeamMutation.mutateAsync(teamId);
      message.success('Đã rời khỏi đội thành công!');
      setSelectedTeam(null);
    } catch (error) {
      console.error('Leave team error:', error);
      if (
        error?.message?.includes('Network Error') ||
        error?.code === 'NETWORK_ERROR'
      ) {
        message.error('Không thể kết nối đến máy chủ. Vui lòng thử lại.');
      } else if (error?.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        message.error('Có lỗi xảy ra khi rời đội. Vui lòng thử lại.');
      }
    }
  };

  // Show loading spinner while fetching teams
  if (myTeamsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Show error state if there's an error
  if (myTeamsError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert
          message="Lỗi tải dữ liệu"
          description="Không thể tải danh sách đội. API có thể chưa được khởi chạy hoặc có lỗi kết nối."
          type="error"
          showIcon
          className="mb-6"
        />
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">
            Bạn có thể thử tạo đội mới để kiểm tra chức năng:
          </p>
          <Button
            icon={<PlusOutlined />}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            onClick={() => setIsCreateModalVisible(true)}
          >
            Tạo đội mới
          </Button>
        </div>
      </div>
    );
  }

  const handleAcceptInvitation = async (code) => {
    try {
      await acceptInvitationMutation.mutateAsync({ code });
      message.success('Đã chấp nhận lời mời thành công!');
    } catch (error) {
      console.error('Accept invitation error:', error);
      message.error('Không thể chấp nhận lời mời. Vui lòng thử lại.');
    }
  };

  const handleRejectInvitation = async (code) => {
    try {
      await rejectInvitationMutation.mutateAsync({ code });
      message.success('Đã từ chối lời mời.');
    } catch (error) {
      console.error('Reject invitation error:', error);
      message.error('Không thể từ chối lời mời. Vui lòng thử lại.');
    }
  };

  const getJoinRequestStatusTag = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Tag icon={<ClockCircleOutlined />} color="orange">Đang chờ</Tag>;
      case 'approved':
        return <Tag icon={<CheckCircleOutlined />} color="green">Đã chấp nhận</Tag>;
      case 'rejected':
        return <Tag icon={<CloseCircleOutlined />} color="red">Đã từ chối</Tag>;
      default:
        return <Tag color="default">{status || 'Unknown'}</Tag>;
    }
  };

  const renderTeamsTab = () => (
    <div className="space-y-12">
      <section className="space-y-4">
        <TeamList
          teams={myTeams}
          title=""
          emptyMessage="Bạn chưa tham gia đội nào"
          onViewTeam={handleViewTeam}
          onLeaveTeam={handleLeaveTeam}
          onJoinTeam={handleJoinTeam}
          selectedTeam={selectedTeam}
          teamLoading={false}
          membersLoading={membersLoading}
          teamMembersData={teamMembersData}
          isMyTeam={true}
          leaveTeamMutation={leaveTeamMutation}
          showCreateButton={true}
          onCreateTeam={() => setIsCreateModalVisible(true)}
        />
      </section>

      

      
    </div>
  );

  const renderSearchTeamsTab = () => (
    <SearchTeamsTab
      allTeamsData={allTeamsData}
      allTeamsLoading={allTeamsLoading}
      allTeamsError={allTeamsError}
      myTeams={myTeams}
      onViewTeam={handleViewTeam}
      onJoinTeam={handleJoinTeam}
      selectedTeam={selectedTeam}
      membersLoading={membersLoading}
      teamMembersData={teamMembersData}
    />
  );

  const renderInvitationsTab = () => (
    <div className="space-y-6">
      {/* Team Join Requests */}
      <Card className="bg-card-background border border-card-border backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Yêu cầu tham gia đội
        </h3>
        {joinRequestsLoading ? (
          <div className="flex justify-center py-8">
            <Spin />
          </div>
        ) : joinRequests && joinRequests.length > 0 ? (
          <div className="space-y-3">
            {joinRequests.map((request) => (
              <Card
                key={request.requestId || request.id}
                className="bg-card-background/50 border border-card-border"
                size="small"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-text-primary font-medium">
                        {request.teamName || 'Đội không xác định'}
                      </h4>
                      {getJoinRequestStatusTag(request.status)}
                    </div>
                    {request.message && (
                      <p className="text-text-secondary text-sm mb-2">
                        {request.message}
                      </p>
                    )}
                    {request.createdAt && (
                      <p className="text-muted-foreground text-xs">
                        Gửi lúc: {dayjs(request.createdAt).format('DD/MM/YYYY HH:mm')}
                      </p>
                    )}
                    {request.leaderResponse && (
                      <p className="text-text-secondary text-sm mt-2">
                        Phản hồi: {request.leaderResponse}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Empty description="Không có yêu cầu tham gia đội nào" />
        )}
      </Card>

      {/* Team Invitations */}
      <Card className="bg-card-background border border-card-border backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Lời mời tham gia đội
        </h3>
        {invitationsLoading ? (
          <div className="flex justify-center py-8">
            <Spin />
          </div>
        ) : invitations && invitations.length > 0 ? (
          <div className="space-y-3">
            {invitations.map((invitation) => (
              <Card
                key={invitation.invitationId || invitation.id}
                className="bg-card-background/50 border border-card-border"
                size="small"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-text-primary font-medium">
                        {invitation.teamName || 'Đội không xác định'}
                      </h4>
                      <Tag icon={<ClockCircleOutlined />} color="blue">Lời mời</Tag>
                    </div>
                    {invitation.invitedBy && (
                      <p className="text-text-secondary text-sm mb-2">
                        Được mời bởi: {invitation.invitedBy}
                      </p>
                    )}
                    {invitation.createdAt && (
                      <p className="text-muted-foreground text-xs">
                        Gửi lúc: {dayjs(invitation.createdAt).format('DD/MM/YYYY HH:mm')}
                      </p>
                    )}
                  </div>
                  <Space>
                    <Button
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      onClick={() => handleAcceptInvitation(invitation.code || invitation.invitationCode)}
                      loading={acceptInvitationMutation.isPending}
                      className="bg-green-500 hover:bg-green-600 border-0"
                    >
                      Chấp nhận
                    </Button>
                    <Button
                      danger
                      icon={<CloseCircleOutlined />}
                      onClick={() => handleRejectInvitation(invitation.code || invitation.invitationCode)}
                      loading={rejectInvitationMutation.isPending}
                    >
                      Từ chối
                    </Button>
                  </Space>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Empty description="Không có lời mời nào" />
        )}
      </Card>
    </div>
  );


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            Đội của tôi
          </h1>
          <p className="text-gray-400 mt-2">
            Quản lý đội và bài nộp dự án
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            icon={
              createTeamMutation.isPending ? (
                <LoadingOutlined />
              ) : (
                <PlusOutlined />
              )
            }
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all"
            onClick={() => setIsCreateModalVisible(true)}
            loading={createTeamMutation.isPending}
          >
            Tạo đội mới
          </Button>
        </div>
      </div>

      {/* Teams Content */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'teams',
            label: 'Đội của tôi',
            children: renderTeamsTab(),
          },
          {
            key: 'search',
            label: 'Tìm team',
            children: renderSearchTeamsTab(),
          },
          {
            key: 'invitations',
            label: 'Lời mời',
            children: renderInvitationsTab(),
          },
        ]}
        className="[&_.ant-tabs-tab]:text-text-secondary [&_.ant-tabs-tab-active]:text-primary [&_.ant-tabs-ink-bar]:bg-primary [&_.ant-tabs-content]:text-white"
      />

      {/* Create Team Modal */}
      <CreateTeamModal
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreateTeam}
        loading={createTeamMutation.isPending}
      />

      {/* Join Team Modal */}
      <JoinTeamModal
        visible={isJoinModalVisible}
        onCancel={handleCancelJoinModal}
        onSubmit={handleSubmitJoinRequest}
        loading={createJoinRequestMutation.isPending}
      />

    </div>
  );
};

export default StudentTeams;
