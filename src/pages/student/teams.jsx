import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, message, Spin } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useCreateTeam,
  useGetTeam,
  useGetTeams,
} from '../../hooks/student/team';
import {
  useGetTeamMembers,
  useLeaveTeam,
} from '../../hooks/student/team-member';
import {
  TeamList,
  CreateTeamModal,
} from '../../components/features/student/team';

const StudentTeams = () => {
  const navigate = useNavigate();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Hooks for team operations
  const createTeamMutation = useCreateTeam();
  const {
    data: teamsData,
    isLoading: teamsLoading,
    error: teamsError,
  } = useGetTeams();
  const { isLoading: teamLoading } = useGetTeam(selectedTeam);
  const { data: teamMembersData, isLoading: membersLoading } =
    useGetTeamMembers(selectedTeam);

  const leaveTeamMutation = useLeaveTeam();

  // Filter teams to separate user's teams from available teams
  // Handle different possible API response formats
  const teamsArray = Array.isArray(teamsData)
    ? teamsData
    : teamsData?.data
      ? teamsData.data
      : teamsData?.teams
        ? teamsData.teams
        : [];

  console.log('Teams data structure:', teamsData);
  console.log('Teams array:', teamsArray);

  // For now, show all teams as "my teams" until we understand the API structure
  // If API fails, show empty arrays
  const myTeams = teamsArray || [];
  const availableTeams = [];

  const handleCreateTeam = async (values) => {
    try {
      await createTeamMutation.mutateAsync({
        teamName: values.name,
        chapterId: values.hackathon, // Assuming hackathon ID is used as chapterId
        leaderId: 'current-user-id', // This should come from auth context
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

  const handleJoinTeam = async (teamId) => {
    try {
      // For joining a team, we need to send a request to join
      // This might require a separate hook or API endpoint
      console.log('Joining team:', teamId);
      message.info('Chức năng gia nhập đội đang được phát triển');
    } catch (error) {
      message.error('Có lỗi xảy ra khi gia nhập đội. Vui lòng thử lại.');
      console.error('Join team error:', error);
    }
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
  if (teamsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Show error state if there's an error
  if (teamsError) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            Đội của tôi
          </h1>
          <p className="text-gray-400 mt-2">
            Quản lý đội và tìm đội mới để tham gia
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

      <section className="space-y-4">
        <TeamList
          teams={myTeams}
          title=""
          emptyMessage="Bạn chưa tham gia đội nào"
          onViewTeam={handleViewTeam}
          onLeaveTeam={handleLeaveTeam}
          onJoinTeam={handleJoinTeam}
          selectedTeam={selectedTeam}
          teamLoading={teamLoading}
          membersLoading={membersLoading}
          teamMembersData={teamMembersData}
          isMyTeam={true}
          leaveTeamMutation={leaveTeamMutation}
          showCreateButton={true}
          onCreateTeam={() => setIsCreateModalVisible(true)}
        />
      </section>

      <section className="space-y-4 border-t border-white/5 pt-8">
        <TeamList
          teams={availableTeams}
          title="Đội đang tìm thành viên"
          emptyMessage="Không có đội nào đang tìm thành viên"
          onViewTeam={handleViewTeam}
          onLeaveTeam={handleLeaveTeam}
          onJoinTeam={handleJoinTeam}
          selectedTeam={selectedTeam}
          teamLoading={teamLoading}
          membersLoading={membersLoading}
          teamMembersData={teamMembersData}
          isAvailableTeam={true}
          leaveTeamMutation={leaveTeamMutation}
        />
      </section>

      {/* Create Team Modal */}
      <CreateTeamModal
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreateTeam}
        loading={createTeamMutation.isPending}
      />
    </div>
  );
};

export default StudentTeams;
