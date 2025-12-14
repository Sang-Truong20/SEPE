import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import TeamCard from './TeamCard';

const TeamList = ({
  teams,
  title,
  emptyMessage,
  onViewTeam,
  onLeaveTeam,
  onJoinTeam,
  selectedTeam,
  teamLoading,
  membersLoading,
  teamMembersData,
  leaveTeamMutation,
  isMyTeam = false,
  isAvailableTeam = false,
  showCreateButton = false,
  onCreateTeam,
}) => {
  return (
    <div>
      {title && (
        <h2 className="text-2xl font-semibold text-white mb-6">{title}</h2>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teams.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p
              className={`text-gray-400 text-lg mb-4 ${isMyTeam ? '' : 'mb-8'}`}
            >
              {emptyMessage}
            </p>
            {showCreateButton && onCreateTeam && (
              <Button
                icon={<PlusOutlined />}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                onClick={onCreateTeam}
              >
                {isMyTeam ? 'Tạo đội đầu tiên' : 'Tạo đội mới'}
              </Button>
            )}
          </div>
        ) : (
          teams.map((team) => {
            const key = team.id ?? team.teamId ?? team.teamID ?? team.team?.id;
            return (
              <TeamCard
                key={key || team.teamName}
                team={team}
                onViewTeam={onViewTeam}
                onLeaveTeam={onLeaveTeam}
                onJoinTeam={onJoinTeam}
                selectedTeam={selectedTeam}
                teamLoading={teamLoading}
                membersLoading={membersLoading}
                teamMembersData={teamMembersData}
                isMyTeam={isMyTeam}
                isAvailableTeam={isAvailableTeam}
                leaveTeamMutation={leaveTeamMutation}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default TeamList;
