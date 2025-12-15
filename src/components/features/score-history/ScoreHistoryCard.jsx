import { Card, Timeline, Empty, Tag, Tooltip } from 'antd';
import { ClockCircleOutlined, UserOutlined, TrophyOutlined, FileTextOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

/**
 * ScoreHistoryCard - Reusable component for displaying score history in a professional timeline format
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.histories - Array of score history objects with the following structure:
 *   - historyId: integer - Unique identifier for the history record
 *   - scoreId: integer - ID of the score being changed
 *   - submissionId: integer - ID of the submission
 *   - submissionTitle: string - Title of the submission
 *   - judgeId: integer - ID of the judge who made the change
 *   - criteriaId: integer - ID of the criteria
 *   - criteriaName: string - Name of the criteria
 *   - oldScore: integer - Previous score value
 *   - oldComment: string - Previous comment
 *   - changedAt: string (date-time) - Timestamp when the change was made
 *   - changeReason: string - Reason for the change
 *   - changedBy: integer - ID of the user who made the change
 *   - changedByName: string - Name of the user who made the change
 * @param {boolean} props.loading - Whether the data is loading
 * @param {string} props.title - Title for the card (default: 'Lịch sử chấm điểm')
 * @param {boolean} props.showSubmissionInfo - Whether to show submission information (default: true)
 * @param {boolean} props.showJudgeInfo - Whether to show judge information (default: true)
 * @param {string} props.emptyText - Text to show when there's no data (default: 'Chưa có lịch sử chấm điểm')
 *
 * @example
 * // Usage in admin, judge, or partner pages
 * <ScoreHistoryCard
 *   histories={scoreHistories}
 *   loading={isLoadingHistory}
 *   title="Lịch sử chấm điểm Hackathon"
 *   showSubmissionInfo={true}
 *   showJudgeInfo={true}
 * />
 */
const ScoreHistoryCard = ({
  histories = [],
  loading = false,
  title = 'Lịch sử chấm điểm',
  showSubmissionInfo = true,
  showJudgeInfo = true,
  emptyText = 'Chưa có lịch sử chấm điểm'
}) => {
  const renderScoreChange = (oldScore) => {
    if (oldScore === undefined || oldScore === null) return null;
    return (
      <div className="flex items-center gap-2 mt-2">
        <span className="text-gray-400">Điểm cũ:</span>
        <Tag color="default">{oldScore}</Tag>
      </div>
    );
  };

  const renderHistoryItem = (item) => (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-4 border border-gray-700/50 hover:border-green-500/30 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {showSubmissionInfo && item.submissionTitle && (
            <div className="flex items-center gap-2 mb-2">
              <FileTextOutlined className="text-blue-400" />
              <span className="text-white font-medium">{item.submissionTitle} vào lúc {dayjs(item.changedAt).format('HH:mm:ss')}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <TrophyOutlined className="text-yellow-500" />
            <span className="font-medium text-gray-300">{item.criteriaName}</span>
          </div>
        </div>

        <Tooltip title={dayjs(item.changedAt).format('DD/MM/YYYY HH:mm:ss')}>
          <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">
            <ClockCircleOutlined />
            <span>{dayjs(item.changedAt).fromNow()}</span>
          </div>
        </Tooltip>
      </div>

      {/* Score Change */}
      {renderScoreChange(item.oldScore)}

      {/* Comments */}
      {(item.oldComment || item.changeReason) && (
        <div className="mt-3 space-y-2">
          {item.oldComment && (
            <div className="text-sm">
              <span className="text-gray-400">Nhận xét cũ:</span>
              <p className="text-gray-300 mt-1 italic bg-gray-800/30 p-2 rounded">
                "{item.oldComment}"
              </p>
            </div>
          )}

          {item.changeReason && (
            <div className="text-sm">
              <span className="text-gray-400">Lý do thay đổi:</span>
              <p className="text-green-300 mt-1 bg-green-900/20 p-2 rounded border-l-2 border-green-500">
                {item.changeReason}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Judge Info */}
      {showJudgeInfo && item.changedByName && (
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <div className="flex items-center gap-2 text-sm">
            <UserOutlined className="text-purple-400" />
            <span className="text-gray-400">Được chỉnh sửa bởi:</span>
            <span className="text-purple-300 font-medium">{item.changedByName}</span>
          </div>
        </div>
      )}
    </div>
  );

  if (!histories || histories.length === 0) {
    return (
      <Card
        title={
          <div className="flex items-center gap-2">
            <EditOutlined className="text-green-500" />
            <span>{title}</span>
          </div>
        }
        className="bg-gray-900/50 border-gray-700"
        loading={loading}
      >
        <Empty
          description={<span className="text-gray-400">{emptyText}</span>}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <EditOutlined className="text-green-500" />
          <span>{title}</span>
          <Tag color="green" className="ml-2">
            {histories.length} thay đổi
          </Tag>
        </div>
      }
      className="bg-gray-900/50 border-gray-700"
      loading={loading}
    >
      <Timeline
        mode={'alternate'}
        items={histories.map((item) => ({
          color: 'green',
          dot: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
          children: renderHistoryItem(item),
          label: (
            <div className="text-xs text-gray-500">
              {dayjs(item.changedAt).format('DD/MM/YYYY')}
            </div>
          ),
        }))}
      />
    </Card>
  );
};

export default ScoreHistoryCard;

