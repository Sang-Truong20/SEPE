import {
  CrownOutlined,
  MessageOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Avatar, Button, Card, Space, Spin } from 'antd';

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
}) => {
  const teamIdentifier = team.id ?? team.teamId ?? team.teamID ?? team.team?.id;
  const leaderName =
    team.teamLeaderName ||
    team.leaderName ||
    team.leader?.name ||
    team.createdByName;
  const memberCount = team.memberCount ?? team.members?.length ?? 0;
  const maxMembers = team.maxMembers ?? team.maxMember ?? 5;
  const progress = team.progress ?? team.progressPercent ?? 0;
  const createdAt = team.createdAt
    ? dayjs(team.createdAt).format('DD/MM/YYYY')
    : null;
  const handleLeaveTeam = () => {
    if (onLeaveTeam) {
      onLeaveTeam(teamIdentifier);
    }
  };

  const handleJoinTeam = () => {
    if (onJoinTeam) {
      onJoinTeam(teamIdentifier);
    }
  };

  const handleViewTeam = () => {
    if (onViewTeam) {
      onViewTeam(teamIdentifier);
    }
  };

  return (
    <Card className="bg-darkv2-tertiary/60 border border-white/5 hover:border-green-500/40 rounded-2xl transition-all duration-200 shadow-lg/20">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
              {team.hackathonName || team.hackathon || 'Chưa có hackathon'}
            </p>
            <h3 className="text-2xl font-semibold text-white">
              {team.teamName || team.name || 'Đội chưa đặt tên'}
            </h3>
            {leaderName && (
              <p className="text-sm text-gray-400 mt-1">
                Leader:{' '}
                <span className="text-white font-medium">{leaderName}</span>
              </p>
            )}
            {createdAt && (
              <p className="text-xs text-gray-500">Tạo ngày {createdAt}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <p className="text-[11px] uppercase tracking-widest text-gray-400">
              Thành viên
            </p>
            <p className="text-lg font-semibold text-white">
              {memberCount}/{maxMembers}
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <p className="text-[11px] uppercase tracking-widest text-gray-400">
              Tiến độ
            </p>
            <p className="text-lg font-semibold text-white">{progress}%</p>
          </div>
          {(team.projectName || team.project) && (
            <div className="bg-white/5 rounded-xl p-3 border border-white/10 md:col-span-1">
              <p className="text-[11px] uppercase tracking-widest text-gray-400">
                Dự án
              </p>
              <p className="text-sm font-medium text-white truncate">
                {team.projectName || team.project}
              </p>
            </div>
          )}
        </div>

        <div className="w-full bg-gray-700/40 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {selectedTeam === teamIdentifier && membersLoading ? (
          <div className="flex items-center justify-center py-4 text-gray-400">
            <Spin size="small" />
            <span className="ml-2">Đang tải thành viên...</span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {teamMembersData?.slice(0, 4).map((member) => (
                <Avatar
                  key={member.id}
                  size="small"
                  className={`border-2 border-darkv2-tertiary ${
                    member.status === 'active' ? '' : 'opacity-50'
                  }`}
                >
                  {member.fullName?.charAt(0) || member.name?.charAt(0) || '?'}
                </Avatar>
              ))}
              {teamMembersData && teamMembersData.length > 4 && (
                <Avatar
                  size="small"
                  className="border-2 border-darkv2-tertiary bg-primary text-white"
                >
                  +{teamMembersData.length - 4}
                </Avatar>
              )}
            </div>
            <Space size="small">
              <Button
                type="text"
                size="small"
                className="text-gray-300 hover:text-white"
                icon={<MessageOutlined />}
              >
                Chat
              </Button>
              <Button
                type="text"
                size="small"
                className="text-gray-300 hover:text-white"
                icon={<SettingOutlined />}
              >
                Cài đặt
              </Button>
              {(team.isLeader || team.role === 'leader') && (
                <CrownOutlined className="text-yellow-400" />
              )}
            </Space>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            size="large"
            className="bg-green-400 hover:bg-green-500 text-white border-0 flex-1 font-semibold shadow-lg shadow-emerald-500/20"
            onClick={handleViewTeam}
            loading={selectedTeam === teamIdentifier && teamLoading}
          >
            Xem chi tiết
          </Button>
          {isMyTeam && !team.isLeader && (
            <Button
              size="middle"
              className="border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20"
              onClick={handleLeaveTeam}
              loading={leaveTeamMutation?.isPending}
            >
              Rời đội
            </Button>
          )}
          {isAvailableTeam && (
            <Button
              size="middle"
              className="border border-white/10 text-white hover:border-green-400/40 hover:bg-white/5"
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
