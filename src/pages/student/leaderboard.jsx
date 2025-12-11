import { CrownOutlined, FilterOutlined, StarOutlined } from '@ant-design/icons';
import { Button, Card, Select, Table, Tabs } from 'antd';
import { useMemo, useState } from 'react';
import { useGetHackathons } from '../../hooks/student/hackathon';
import { useGetHackathonRanking } from '../../hooks/student/ranking';

const { Option } = Select;

const StudentLeaderboard = () => {
  const [selectedHackathonId, setSelectedHackathonId] = useState(null);

  const { data: hackathonsData, isLoading: hackathonsLoading } = useGetHackathons();
  const { data: rankingData, isLoading: rankingLoading } = useGetHackathonRanking(
    selectedHackathonId,
  );

  const hackathons = useMemo(() => {
    if (!hackathonsData) return [];
    if (Array.isArray(hackathonsData)) return hackathonsData;
    if (Array.isArray(hackathonsData.data)) return hackathonsData.data;
    return [];
  }, [hackathonsData]);

  const globalLeaderboard = useMemo(() => {
    if (!rankingData) return [];
    if (Array.isArray(rankingData)) return rankingData;
    if (Array.isArray(rankingData.data)) return rankingData.data;
    return [];
  }, [rankingData]);

  const leaderboardColumns = [
    {
      title: 'Hạng',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (rank) => {
        let icon = null;
        if (rank === 1) icon = <CrownOutlined className="text-yellow-400" />;
        else if (rank === 2) icon = <CrownOutlined className="text-gray-400" />;
        else if (rank === 3) icon = <StarOutlined className="text-amber-600" />;
        else icon = <span className="text-text-secondary">{rank}</span>;

        return (
          <div className="flex items-center gap-2">
            {icon}
          </div>
        );
      },
    },
    {
      title: 'Đội',
      dataIndex: 'teamName',
      key: 'teamName',
    },
    {
      title: 'Hackathon',
      dataIndex: 'hackathonName',
      key: 'hackathonName',
    },
    {
      title: 'Điểm',
      dataIndex: 'totalScore',
      key: 'score',
      render: (score) => (
        <span className="text-primary font-semibold">{score}</span>
      ),
    },
    {
      title: 'Cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (value) =>
        value ? new Date(value).toLocaleString('vi-VN') : '',
    },
  ];

  const tabItems = [
    {
      key: '1',
      label: 'Bảng xếp hạng chung',
      children: (
        <Card className="bg-card-background border border-card-border backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-text-primary m-0">
              Bảng xếp hạng toàn cầu
            </h2>
            <Select
              placeholder="Chọn hackathon"
              value={selectedHackathonId}
              onChange={setSelectedHackathonId}
              loading={hackathonsLoading}
              style={{ width: 260 }}
              allowClear
            >
              {hackathons.map((hackathon) => {
                const id = hackathon.hackathonId ?? hackathon.id;
                const name =
                  hackathon.name || hackathon.title || hackathon.hackathonName || `Hackathon ${id}`;
                return (
                  <Option key={id} value={id}>
                    {name}
                  </Option>
                );
              })}
            </Select>
          </div>
          {selectedHackathonId ? (
            <Table
              columns={leaderboardColumns}
              dataSource={globalLeaderboard}
              loading={rankingLoading}
              rowKey={(row) => row.rankingId ?? `${row.hackathonName}-${row.teamName}-${row.rank}`}
              pagination={false}
              className="[&_.ant-table]:bg-transparent [&_th]:!bg-card-background [&_th]:!text-text-primary [&_td]:!text-text-secondary [&_td]:border-card-border [&_th]:border-card-border [&_tr:hover_td]:!bg-card-background/50"
            />
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Vui lòng chọn một hackathon để xem bảng xếp hạng.
            </div>
          )}
        </Card>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            Bảng xếp hạng
          </h1>
          <p className="text-muted-foreground mt-2">
            Theo dõi thứ hạng và thành tích của các đội
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            icon={<FilterOutlined />}
            className="border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all"
          >
            Bộ lọc
          </Button>
        </div>
      </div>

      <Tabs
        defaultActiveKey="1"
        items={tabItems}
        className="[&_.ant-tabs-tab]:text-text-secondary [&_.ant-tabs-tab-active]:text-primary [&_.ant-tabs-ink-bar]:bg-primary [&_.ant-tabs-content]:text-white"
      />
    </div>
  );
};

export default StudentLeaderboard;

