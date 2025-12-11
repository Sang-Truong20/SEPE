import { Crown, ExternalLink, MapPin, Shield, Terminal } from 'lucide-react';

const TeamCard = ({
  team,
  onViewTeam,
  onLeaveTeam,
  onJoinTeam,
  selectedTeam,
  teamLoading,
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
  const chapterName = team.chapterName || team.chapter?.name || 'N/A';
  const hackathonName = team.hackathonName || team.hackathon || null;
  const isJoinedHackathon = team.hackathonId !== null || hackathonName !== null;

  const handleViewTeam = () => {
    if (onViewTeam) {
      onViewTeam(teamIdentifier);
    }
  };

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

  // Simple Avatar component
  const TeamAvatar = ({ name }) => {
    const initials = name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'TM';
    
    return (
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
        {initials}
      </div>
    );
  };

  return (
    <div className="group relative bg-card-background border border-card-border hover:border-green-500/50 rounded-xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 flex flex-col h-full backdrop-blur-xl">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-10 transition-opacity text-green-500">
        <Shield size={120} />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-5 z-10">
        <div className="flex items-center gap-3">
          <TeamAvatar name={team.teamName || team.name} />
          <h3 className="text-lg font-bold text-text-primary group-hover:text-green-400 transition-colors">
            {team.teamName || team.name || 'Đội chưa đặt tên'}
          </h3>
        </div>

        {/* Status Badge */}
        <div
          className={`w-2 h-2 rounded-full ${
            isJoinedHackathon
              ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
              : 'bg-gray-600'
          }`}
          title={isJoinedHackathon ? 'Active' : 'Inactive'}
        ></div>
      </div>

      {/* Body */}
      <div className="space-y-4 flex-1 z-10">
        {/* Dòng 1: Chapter & Leader cùng 1 hàng (Grid 2 cột) */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-card-border/50">
          {/* Chapter */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-muted-foreground" />
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Chapter
              </p>
            </div>
            <p
              className="text-sm text-text-secondary truncate font-medium"
              title={chapterName}
            >
              {chapterName}
            </p>
          </div>

          {/* Leader */}
          <div className="flex flex-col gap-1 pl-4 border-l border-card-border/50">
            <div className="flex items-center gap-1.5">
              <Crown size={14} className="text-amber-500/80" />
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Leader
              </p>
            </div>
            <p
              className="text-sm text-text-secondary truncate font-medium"
              title={leaderName}
            >
              {leaderName || 'N/A'}
            </p>
          </div>
        </div>

        {/* Dòng 2: Hackathon - Làm nổi bật nếu có tham gia */}
        <div className="flex items-start gap-3 pt-1">
          <Terminal
            size={16}
            className={`mt-0.5 shrink-0 ${
              isJoinedHackathon ? 'text-green-500' : 'text-muted-foreground'
            }`}
          />
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Hackathon
            </p>
            <p
              className={`text-sm font-medium ${
                isJoinedHackathon
                  ? 'text-green-400'
                  : 'text-muted-foreground italic'
              }`}
            >
              {isJoinedHackathon ? hackathonName : 'Chưa tham gia'}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-card-border/50 flex justify-between items-center z-10">
        <div className="flex gap-2">
          {isMyTeam && !team.isLeader && (
            <button
              onClick={handleLeaveTeam}
              disabled={leaveTeamMutation?.isPending}
              className="text-xs font-medium text-red-500 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              Rời đội
            </button>
          )}
          {isAvailableTeam && (
            <button
              onClick={handleJoinTeam}
              className="text-xs font-medium text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-colors"
            >
              Xin gia nhập
            </button>
          )}
        </div>
        <button
          onClick={handleViewTeam}
          disabled={selectedTeam === teamIdentifier && teamLoading}
          className="text-xs font-medium text-green-500 hover:text-green-400 flex items-center gap-1 transition-colors group/btn"
        >
          Xem chi tiết
          <ExternalLink
            size={12}
            className="group-hover/btn:translate-x-0.5 transition-transform"
          />
        </button>
      </div>
    </div>
  );
};

export default TeamCard;
