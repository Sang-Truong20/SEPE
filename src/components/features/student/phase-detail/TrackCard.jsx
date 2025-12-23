import {
  CheckCircleOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useGetTeamTrackByPhase } from '../../../../hooks/student/team-track';

const TrackCard = ({ track, isSelected, onSelect, onSubmit, teamId, phaseId }) => {
  const hasChallenges = track.challenges && track.challenges.length > 0;
  
  // Check if team has selected any track for this phase
  const { data: selectedTrack, isLoading: isLoadingTrack } = useGetTeamTrackByPhase(
    teamId,
    phaseId,
    { enabled: !!teamId && !!phaseId }
  );
  
  // Check if this specific track is the one selected by the team
  const isTrackSelected = selectedTrack && selectedTrack.trackId === track.trackId;
  
  // Only show button if team hasn't selected any track yet (API returned 204/null)
  // If team has already selected a track, don't show button
  const canShowButton = selectedTrack === null;

  return (
    <div
      className={`flex flex-col h-full border rounded-xl overflow-hidden shadow-xl transition-all duration-300 cursor-pointer ${
        isTrackSelected
          ? 'bg-slate-800/80 border-green-500 shadow-green-500/50 ring-2 ring-green-500/30'
          : isSelected
            ? 'bg-slate-900 border-green-500 shadow-green-500/40'
            : 'bg-slate-900 border-slate-800 shadow-green-500/20'
      }`}
      onClick={onSelect}
    >
      {/* Card Header */}
      <div className={`p-5 border-b relative overflow-hidden ${
        isTrackSelected ? 'border-green-500/30' : 'border-slate-800'
      }`}>
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <EnvironmentOutlined style={{ fontSize: '80px' }} />
        </div>
        <div className="flex justify-between items-start relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-lg font-bold transition-colors ${
                isTrackSelected ? 'text-green-300' : 'text-green-400'
              }`}>
                {track.name}
              </h3>
              {isTrackSelected && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/50 text-green-300 text-xs font-medium">
                  <CheckCircleOutlined />
                  Đã chọn
                </span>
              )}
            </div>
            {track.description && (
              <p className={`text-sm line-clamp-2 min-h-[40px] ${
                isTrackSelected ? 'text-slate-300' : 'text-slate-400'
              }`}>
                {track.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Card Body - List of Challenges */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <TrophyOutlined style={{ fontSize: '12px' }} />
            Thử thách ({track.challenges?.length || 0})
          </h4>
        </div>

        <div className="flex-1">
          {hasChallenges ? (
            <div className="space-y-2">
              {track.challenges.map((challenge) => (
                <div
                  key={challenge.challengeId}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 transition-colors"
                >
                  <FileTextOutlined className="text-green-400" />
                  <span className="text-sm text-slate-300 flex-1">
                    {challenge.title}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full min-h-[80px] flex flex-col items-center justify-center text-slate-600 border border-dashed border-slate-800 rounded-lg bg-slate-900/50">
              <ExclamationCircleOutlined className="mb-2 opacity-50" style={{ fontSize: '20px' }} />
              <span className="text-xs">Chưa có thử thách nào</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!isLoadingTrack && canShowButton && (
          <div className="mt-4 pt-4 border-t border-slate-800">
            <button
              type="button"
              className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                hasChallenges
                  ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
              disabled={!hasChallenges || !onSubmit}
              onClick={(e) => {
                e.stopPropagation();
                if (hasChallenges && onSubmit) {
                  onSubmit();
                }
              }}
            >
              {hasChallenges ? 'Chọn track này' : 'Sắp ra mắt'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackCard;

