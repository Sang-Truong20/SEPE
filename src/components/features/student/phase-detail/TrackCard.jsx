import {
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  TrophyOutlined
} from '@ant-design/icons';

const TrackCard = ({ track, isSelected, onSelect, onSubmit }) => {
  const hasChallenges = track.challenges && track.challenges.length > 0;

  return (
    <div
      className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl shadow-green-500/20 transition-all duration-300 cursor-pointer"
      onClick={onSelect}
    >
      {/* Card Header */}
      <div className="p-5 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <EnvironmentOutlined style={{ fontSize: '80px' }} />
        </div>
        <div className="flex justify-between items-start relative z-10">
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1 text-green-400 transition-colors">
              {track.name}
            </h3>
            {track.description && (
              <p className="text-sm text-slate-400 line-clamp-2 min-h-[40px]">
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
            {hasChallenges ? 'Bắt đầu ngay' : 'Sắp ra mắt'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;

