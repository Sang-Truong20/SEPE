import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { ConfigProvider, theme, Button, Select, Card, Tag } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { PATH_NAME } from '../../../constants/index.js';
import { useRankings } from '../../../hooks/admin/ranking/useRanking.js';
import { useHackathons } from '../../../hooks/admin/hackathons/useHackathons.js';
import EntityTable from '../../../components/ui/EntityTable.jsx';

const Rankings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const hackathonId = searchParams.get('hackathonId');

  const { fetchHackathons } = useHackathons();
  const { data: hackathons = [], isLoading: hackathonsLoading } =
    fetchHackathons;

  const { fetchRankings } = useRankings();
  const {
    data: rankingsData = [],
    isLoading: rankingsLoading,
  } = fetchRankings(hackathonId);

  const selectedHackathon = hackathons.find(
    (h) => h.hackathonId === parseInt(hackathonId),
  );

  // Model cho bảng rankings
  const tableModel = useMemo(
    () => ({
      entityName: 'xếp hạng',
      rowKey: 'rankingId',
      columns: [
        {
          title: 'Hạng',
          dataIndex: 'rank',
          key: 'rank',
          type: 'badge',
          transform: (val) => `Hạng ${val}`,
          className: 'font-bold text-primary',
        },
        {
          title: 'Tên đội',
          dataIndex: 'teamName',
          key: 'teamName',
          type: 'text',
          className: 'font-medium text-white',
        },
        {
          title: 'Tên Hackathon',
          dataIndex: 'hackathonName',
          key: 'hackathonName',
          type: 'text',
          className: 'text-gray-300',
        },
        {
          title: 'Tổng điểm',
          dataIndex: 'totalScore',
          key: 'totalScore',
          type: 'custom',
          render: (value, record) => (
            <span className="text-green-400 font-semibold">
              {value?.toFixed(2) || record?.totalScore?.toFixed(2) || '0.00'}
            </span>
          ),
        },
        {
          title: 'Cập nhật',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
          type: 'datetime',
          format: 'DD/MM/YYYY HH:mm',
        },
      ],
      actions: {},
    }),
    [],
  );

  const handleHackathonChange = (newHackathonId) => {
    setSearchParams({ hackathonId: newHackathonId });
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgContainer: '#111111',
          colorBorder: '#2f2f2f',
          colorText: '#ffffff',
          colorTextPlaceholder: '#9ca3af',
          colorPrimary: '#10b981',
          borderRadius: 6,
        },
      }}
    >
      <div className="bg-dark-secondary border border-dark-accent rounded-xl p-6 shadow-md">
        <div className="mb-6">
          <Button
            onClick={() => window.history.back()}
            type="link"
            icon={<ArrowLeftOutlined />}
            className="mb-4 !text-light-primary hover:!text-primary"
          >
            Quay lại
          </Button>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Chọn Hackathon
            </label>
            <Select
              placeholder="Chọn hackathon để xem xếp hạng"
              value={hackathonId}
              onChange={handleHackathonChange}
              loading={hackathonsLoading}
              className="w-full max-w-md"
              style={{ backgroundColor: '#1f1f1f' }}
            >
              {hackathons.map((hackathon) => (
                <Select.Option
                  key={hackathon.hackathonId}
                  value={hackathon.hackathonId.toString()}
                >
                  {hackathon.name} ({hackathon.seasonName})
                </Select.Option>
              ))}
            </Select>
          </div>

          {selectedHackathon && (
            <Card
              bordered={false}
              className="bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg"
              title={
                <h3 className="text-white font-semibold text-lg">
                  Hackathon đã chọn
                </h3>
              }
            >
              <div className="space-y-2">
                <p className="text-gray-200 text-base font-medium">
                  {selectedHackathon.name} - {selectedHackathon.seasonName}
                </p>
                <p className="text-gray-400 text-sm italic">
                  {selectedHackathon.theme}
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <Tag
                    color="green"
                    icon={<CalendarOutlined />}
                    className="flex items-center gap-1"
                  >
                    <span className="text-sm text-gray-100">
                      {selectedHackathon.startDate}
                    </span>
                  </Tag>
                  <Tag
                    color="geekblue"
                    icon={<CalendarOutlined />}
                    className="flex items-center gap-1"
                  >
                    <span className="text-sm text-gray-100">
                      {selectedHackathon.endDate}
                    </span>
                  </Tag>
                </div>
              </div>
            </Card>
          )}
        </div>

        {hackathonId ? (
          <EntityTable
            model={tableModel}
            data={rankingsData}
            loading={rankingsLoading}
            handlers={{}}
            emptyText="Không có dữ liệu xếp hạng cho hackathon này"
            dateFormatter={(value, fmt) =>
              value ? dayjs(value).format(fmt) : '--'
            }
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">
              Vui lòng chọn một hackathon để xem xếp hạng
            </p>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default Rankings;
