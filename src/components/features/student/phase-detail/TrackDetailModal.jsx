import {
  CheckCircleOutlined,
  DownloadOutlined,
  FileTextOutlined,
  TrophyOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Button, Modal, Spin, Tag } from 'antd';
import { useGetChallengesByTrack } from '../../../../hooks/student/challenge';
import { useGetCriteriaByPhase } from '../../../../hooks/student/criterion';

const ChallengeItem = ({ challenge }) => {
  if (!challenge) {
    return null;
  }

  const title = challenge.title || challenge.challengeName || 'Thử thách';

  return (
    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FileTextOutlined className="text-green-400" />
            <h5 className="text-white font-semibold text-lg">
              {title}
            </h5>
            {challenge.status && (
              <Tag color={challenge.status === 'Complete' ? 'green' : 'orange'}>
                {challenge.status}
              </Tag>
            )}
          </div>
          {challenge.description && (
            <p className="text-slate-300 text-sm mb-3">
              {challenge.description}
            </p>
          )}
          {challenge.filePath && (
            <a
              href={challenge.filePath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <DownloadOutlined />
              <span className="text-sm">Tải xuống tài liệu</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const TrackDetailModal = ({ 
  track, 
  visible, 
  onClose, 
  onSelectTrack,
  isSelected,
  phaseId
}) => {
  const trackId = track?.trackId ?? track?.id;
  // Get criteria for this phase
  const { data: criteria = [], isLoading: criteriaLoading } = useGetCriteriaByPhase(
    phaseId ? parseInt(phaseId) : null
  );

  const {
    data: challengesData = [],
    isLoading: challengesLoading,
  } = useGetChallengesByTrack(trackId, { enabled: !!trackId });

  const challenges = Array.isArray(challengesData)
    ? challengesData
    : challengesData?.data
      ? challengesData.data
      : challengesData?.challenges
        ? challengesData.challenges
        : [];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <TrophyOutlined className="text-green-400" />
          <span className="text-white font-semibold">{track?.name}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="[&_.ant-modal-content]:bg-gray-900/95 [&_.ant-modal-content]:backdrop-blur-xl [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white [&_.ant-modal-mask]:bg-black/50"
    >
      <div className="space-y-6">
        {/* Track Description */}
        {track?.description && (
          <div>
            <h4 className="text-sm font-semibold text-slate-400 mb-2">Mô tả</h4>
            <p className="text-white">{track.description}</p>
          </div>
        )}

        {/* Criteria Section */}
        {criteria && criteria.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
              <StarOutlined />
              Tiêu chí đánh giá ({criteria.length})
            </h4>
            {criteriaLoading ? (
              <div className="flex justify-center py-4">
                <Spin />
              </div>
            ) : (
              <div className="space-y-3">
                {criteria.map((criterion, index) => (
                  <div
                    key={criterion.criterionId || index}
                    className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-green-400">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h5 className="text-white font-semibold mb-1">
                          {criterion.criterionName || criterion.name || `Tiêu chí ${index + 1}`}
                        </h5>
                        {criterion.description && (
                          <p className="text-slate-300 text-sm">
                            {criterion.description}
                          </p>
                        )}
                        {criterion.weight && (
                          <p className="text-slate-400 text-xs mt-2">
                            Trọng số: {criterion.weight}%
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Challenges Section */}
        <div>
          <h4 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
            <TrophyOutlined />
            Thử thách ({challenges.length})
          </h4>

          {challengesLoading ? (
            <div className="flex justify-center py-4">
              <Spin />
            </div>
          ) : challenges.length > 0 ? (
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <ChallengeItem
                  key={challenge.challengeId || challenge.id}
                  challenge={challenge}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-lg bg-slate-900/50">
              <p className="text-slate-400">Chưa có thử thách nào</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-800">
          <Button
            type="primary"
            size="large"
            icon={<CheckCircleOutlined />}
            onClick={() => {
              if (onSelectTrack) {
                onSelectTrack();
                onClose();
              }
            }}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white border-0"
            disabled={challenges.length === 0}
          >
            {isSelected ? 'Đã chọn track này' : 'Chọn track này'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TrackDetailModal;

