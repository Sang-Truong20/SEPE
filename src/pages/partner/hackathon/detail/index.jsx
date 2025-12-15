import { Spin, ConfigProvider, theme } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useHackathons } from '../../../../hooks/admin/hackathons/useHackathons.js';
import { useScoreHistories } from '../../../../hooks/admin/scoreHistory/useScoreHistory.js';
import { PATH_NAME } from '../../../../constants/index.js';
import EntityDetail from '../../../../components/ui/EntityDetail.jsx';
import ScoreHistoryCard from '../../../../components/features/score-history/ScoreHistoryCard.jsx';

const HackathonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchHackathon } = useHackathons();
  const { data: hackathon, isLoading } = fetchHackathon(id);

  // Fetch score histories
  const { fetchScoreHistoriesByHackathon } = useScoreHistories();
  const { data: scoreHistories, isLoading: isLoadingHistory } = fetchScoreHistoriesByHackathon(id);

  const model = {
    modelName: 'Cuộc thi',
    fields: [
      { key: 'Tên Hackathon', type: 'input', name: 'name' },
      { key: 'Mùa', type: 'input', name: 'season' },
      { key: 'Mô tả', type: 'textarea', name: 'description' },
      {
        type: 'column',
        items: [
          [
            { key: 'Ngày bắt đầu', type: 'datetime', name: 'startDate', format: 'DD/MM/YYYY' }
          ],
          [
            { key: 'Ngày kết thúc', type: 'datetime', name: 'endDate', format: 'DD/MM/YYYY' }
          ]
        ]
      },
      { key: 'Trạng thái', type: 'dropdown', name: 'status' }
    ]
  };

  // Tuỳ biến cách hiển thị giá trị
  const valueRenders = {
    status: (value) => {
      if (!value) return <span className="text-gray-300">--</span>;
      const map = {
        Pending: { color: 'gold', text: 'Đang chờ' },
        Active: { color: 'green', text: 'Đang diễn ra' },
        Ended: { color: 'red', text: 'Đã kết thúc' },
      };
      const cfg = map[value] || { color: 'blue', text: value };
      return (
        <span
          className={`px-2 py-1 rounded text-xs font-medium
          ${
            cfg.color === 'gold'
              ? 'bg-yellow-700/30 text-yellow-300'
              : cfg.color === 'green'
                ? 'bg-green-700/30 text-green-300'
                : cfg.color === 'red'
                  ? 'bg-red-700/30 text-red-300'
                  : 'bg-blue-700/30 text-blue-300'
          }`}
        >
          {cfg.text}
        </span>
      );
    },
    startDate: (val) => (
      <span className="text-gray-300">
        {val ? dayjs(val).format('DD/MM/YYYY') : '--'}
      </span>
    ),
    endDate: (val) => (
      <span className="text-gray-300">
        {val ? dayjs(val).format('DD/MM/YYYY') : '--'}
      </span>
    ),
  };



  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgContainer: '#111111',
          colorBgElevated: '#181818',
          colorBorder: '#2f2f2f',
          colorText: '#ffffff',
          colorTextPlaceholder: '#9ca3af',
          colorPrimary: '#10b981',
          borderRadius: 4,
        },
      }}
    >
      <div className="p-6 space-y-6">
        <EntityDetail
          entityName="Hackathon"
          model={model}
          data={hackathon || {}}
          onBack={() => navigate(PATH_NAME.PARTNER_HACKATHONS)}
          showEdit={false}
          valueRenders={valueRenders}
        />

        <ScoreHistoryCard
          histories={scoreHistories || []}
          loading={isLoadingHistory}
          title="Lịch sử chấm điểm Hackathon"
          showSubmissionInfo={true}
          showJudgeInfo={true}
        />
      </div>
    </ConfigProvider>
  );
};

export default HackathonDetail;
