import {
  CrownOutlined,
  MessageOutlined,
  SettingOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Space, Spin, Tag } from 'antd';

const TeamCard = ({
  team,
  onViewTeam,
  onLeaveTeam,
  onJoinTeam,
  selectedTeam,
  teamLoading,
  membersLoading,
  teamMembersData,
  isMyTeam = false,
  isAvailableTeam = false,
  leaveTeamMutation,
  getStatusColor,
}) => {
  const handleLeaveTeam = () => {
    if (onLeaveTeam) {
      onLeaveTeam(team.id);
    }
  };

  const handleJoinTeam = () => {
    if (onJoinTeam) {
      onJoinTeam(team.id);
    }
  };

  const handleViewTeam = () => {
    if (onViewTeam) {
      onViewTeam(team.id);
    }
  };

  return (
    <Card className="border-0 hover:shadow-lg transition-all duration-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl text-white">{team.teamName || team.name}</h3>
            <p className="text-gray-400">
              {team.hackathonName || team.hackathon || 'Hackathon'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Tag color={getStatusColor(team.status || team.teamStatus)}>
              {(team.status || team.teamStatus || 'unknown')?.toUpperCase()}
            </Tag>
            {(team.isLeader || team.role === 'leader') && (
              <CrownOutlined className="text-yellow-400" />
            )}
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Thành viên:</span>
            <span className="text-white">
              {team.memberCount || team.members?.length || 0}/
              {team.maxMembers || 5}
            </span>
          </div>
          {(team.projectName || team.project) && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Dự án:</span>
              <span className="text-white">
                {team.projectName || team.project}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Tiến độ:</span>
            <span className="text-white">{team.progress || 0}%</span>
          </div>
        </div>

        <div className="w-full bg-gray-700/50 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${team.progress || 0}%` }}
          ></div>
        </div>

        {/* Team Members - Show loading if fetching members */}
        {selectedTeam === team.id && membersLoading ? (
          <div className="flex items-center justify-center mb-4">
            <Spin size="small" />
            <span className="ml-2 text-gray-400">Đang tải thành viên...</span>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-4">
            <div className="flex -space-x-2">
              {teamMembersData?.slice(0, 3).map((member) => (
                <Avatar
                  key={member.id}
                  size="small"
                  className={`border-2 border-card-background ${
                    member.status === 'active' ? '' : 'opacity-50'
                  }`}
                >
                  {member.fullName?.charAt(0) || member.name?.charAt(0) || '?'}
                </Avatar>
              ))}
              {teamMembersData && teamMembersData.length > 3 && (
                <Avatar
                  size="small"
                  className="border-2 border-card-background bg-primary"
                >
                  +{teamMembersData.length - 3}
                </Avatar>
              )}
            </div>

            <Space>
              <Button
                type="text"
                size="small"
                className="text-white hover:text-primary"
                icon={<MessageOutlined />}
              >
                Chat
              </Button>
              <Button
                type="text"
                size="small"
                className="text-white hover:text-primary"
                icon={<SettingOutlined />}
              >
                Cài đặt
              </Button>
            </Space>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            size="small"
            className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white border-0"
            onClick={handleViewTeam}
            loading={selectedTeam === team.id && teamLoading}
          >
            Xem chi tiết
          </Button>
          <Button
            size="small"
            variant="outline"
            className="border-white/20 bg-white/5 hover:bg-white/10"
          >
            Chỉnh sửa
          </Button>
          {isMyTeam && !team.isLeader && (
            <Button
              size="small"
              variant="outline"
              className="border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400"
              onClick={handleLeaveTeam}
              loading={leaveTeamMutation?.isPending}
            >
              Rời đội
            </Button>
          )}
          {isAvailableTeam && (
            <Button
              size="small"
              className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white border-0"
              onClick={handleJoinTeam}
            >
              Xin gia nhập
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TeamCard;
