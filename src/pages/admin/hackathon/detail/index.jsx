import { Spin, ConfigProvider, theme, Card, Tag, Empty } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useHackathons } from '../../../../hooks/admin/hackathons/useHackathons.js';
import { PATH_NAME } from '../../../../constants/index.js';
import EntityDetail from '../../../../components/ui/EntityDetail.jsx';
import { useHackathonPhases } from '../../../../hooks/admin/hackathon-phases/useHackathonPhases.js';
import { CalendarOutlined } from '@ant-design/icons';

const HackathonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchHackathon } = useHackathons();
  const { data: hackathon, isLoading, error } = fetchHackathon(id);
  const { fetchHackathonPhases } = useHackathonPhases();
  const { data: phases = [], isLoading: phasesLoading } = fetchHackathonPhases(id);

  const model = {
    modelName: 'Hackathons',
    fields: [
      { key: 'Tên Hackathon', type: 'input', name: 'name' },
      { key: 'Season', type: 'input', name: 'season' },
      { key: 'Theme', type: 'input', name: 'theme' },
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
      { key: 'Status', type: 'dropdown', name: 'status' }
    ]
  };

  // Tuỳ biến cách hiển thị giá trị
  const valueRenders = {
    status: (value) => {
      if (!value) return <span className="text-gray-300">--</span>;
      const map = {
        Pending: { color: 'gold', text: 'Đang chờ' },
        Active: { color: 'green', text: 'Đang diễn ra' },
        Ended: { color: 'red', text: 'Đã kết thúc' }
      };
      const cfg = map[value] || { color: 'blue', text: value };
      return (
        <span className={`px-2 py-1 rounded text-xs font-medium
          ${cfg.color === 'gold' ? 'bg-yellow-700/30 text-yellow-300' :
            cfg.color === 'green' ? 'bg-green-700/30 text-green-300' :
              cfg.color === 'red' ? 'bg-red-700/30 text-red-300' :
                'bg-blue-700/30 text-blue-300'
          }`}>
          {cfg.text}
        </span>
      );
    },
    startDate: (val) => <span className="text-gray-300">{val ? dayjs(val).format('DD/MM/YYYY') : '--'}</span>,
    endDate: (val) => <span className="text-gray-300">{val ? dayjs(val).format('DD/MM/YYYY') : '--'}</span>
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Lỗi tải dữ liệu.
      </div>
    );
  }

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
          borderRadius: 4
        }
      }}
    >
      <div className="space-y-6">
        <EntityDetail
          entityName="Hackathon"
          model={model}
          data={hackathon || {}}
          onBack={() => navigate(PATH_NAME.ADMIN_HACKATHONS)}
          onEdit={(rec) => navigate(`${PATH_NAME.HACKATHON_EDIT_PAGE}/${rec.hackathonId}`)}
          showEdit
          valueRenders={valueRenders}
        />

        {/* Hackathon Phases Section */}
        <Card
          className="border border-white/10 bg-white/5 rounded-xl shadow-sm backdrop-blur-sm mx-6"
          title={
            <span className="text-white font-semibold">
              Các giai đoạn của Hackathon
            </span>
          }
          loading={phasesLoading}
        >
          {phases && phases.length > 0 ? (
            <div className="space-y-4">
              {phases.map((phase) => (
                <Card
                  key={phase.phaseId}
                  className="bg-neutral-900 border border-neutral-700"
                  size="small"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-base mb-2">
                        {phase.phaseName}
                      </h4>
                      <div className="flex items-center gap-4 flex-wrap">
                        <Tag
                          color="green"
                          icon={<CalendarOutlined />}
                          className="flex items-center gap-1"
                        >
                          <span className="text-sm">
                            Bắt đầu: {dayjs(phase.startDate).format('DD/MM/YYYY HH:mm')}
                          </span>
                        </Tag>
                        <Tag
                          color="geekblue"
                          icon={<CalendarOutlined />}
                          className="flex items-center gap-1"
                        >
                          <span className="text-sm">
                            Kết thúc: {dayjs(phase.endDate).format('DD/MM/YYYY HH:mm')}
                          </span>
                        </Tag>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Empty description="Chưa có giai đoạn nào" />
          )}
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default HackathonDetail;