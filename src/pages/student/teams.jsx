import {
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Alert, Button, message, Spin, Tabs } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreateTeamModal,
  TeamList,
  JoinTeamModal,
  SearchTeamsTab,
  JoinRequestsTab,
} from '../../components/features/student/team';
import {
  useCreateTeam,
  useGetMyTeams,
  useGetTeams,
} from '../../hooks/student/team';
import {
  useGetMyTeamJoinRequests,
  useCreateTeamJoinRequest,
} from '../../hooks/student/team-join-request';
import {
  useGetTeamMembers,
  useLeaveTeam,
} from '../../hooks/student/team-member';
import useLoadingStore from '../../store/loadingStore';

const StudentTeams = () => {
  const navigate = useNavigate();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [activeTab, setActiveTab] = useState('teams');
  const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);
  const [selectedTeamForJoin, setSelectedTeamForJoin] = useState(null);
  const { showLoading, hideLoading } = useLoadingStore();

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

  // Join requests hooks
  const { data: joinRequestsData, isLoading: joinRequestsLoading } = useGetMyTeamJoinRequests();

  // Extract join requests from response
  const joinRequests = Array.isArray(joinRequestsData)
    ? joinRequestsData
    : joinRequestsData?.data
      ? joinRequestsData.data
      : [];


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
    showLoading('Đang xử lý rời đội...');
    try {
      await leaveTeamMutation.mutateAsync(teamId);
      message.success('Đã rời khỏi đội thành công!');
      setSelectedTeam(null);
    } catch (error) {
      message.error(error?.response?.data?.message);
    }
    hideLoading();
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
    <JoinRequestsTab
      joinRequests={joinRequests}
      joinRequestsLoading={joinRequestsLoading}
    />
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
