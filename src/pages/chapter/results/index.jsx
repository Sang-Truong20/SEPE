import {
  TrophyOutlined,
  CrownOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
  BarChartOutlined,
  FilterOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Row, Table, Tag, Avatar, Space, Select, Tabs, Statistic, Spin } from 'antd';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../../constants';
import { useGetChapterLeaderboard, useGetChapterStatistics } from '../../../hooks/chapter/useChapterResults';
import { useGetHackathons } from '../../../hooks/student/hackathon';

const { Option } = Select;

const ChapterResults = () => {
  const navigate = useNavigate();
  const [selectedHackathon, setSelectedHackathon] = useState('all');
  
  const { data: leaderboardData, isLoading: leaderboardLoading } = useGetChapterLeaderboard(
    selectedHackathon !== 'all' ? selectedHackathon : null
  );
  const { data: statisticsData, isLoading: statsLoading } = useGetChapterStatistics(
    selectedHackathon !== 'all' ? selectedHackathon : null
  );
  const { data: hackathonsData } = useGetHackathons();

  const leaderboard = leaderboardData || [];
  const statistics = statisticsData || {};

  const hackathons = useMemo(() => {
    if (!hackathonsData) return [];
    const hacks = Array.isArray(hackathonsData) ? hackathonsData : hackathonsData?.data || [];
    return hacks.filter(h => h.status?.toLowerCase() !== 'completed');
  }, [hackathonsData]);

  const categories = [
    {
      title: 'Điểm cao nhất',
      value: `${statistics.highestScore || 0}/100`,
      description: `Đội ${leaderboard[0]?.team || 'N/A'}`,
      icon: <CrownOutlined className="text-yellow-400 text-2xl" />,
    },
    {
      title: 'Điểm trung bình',
      value: `${statistics.averageScore?.toFixed(1) || 0}/100`,
      description: `Của ${statistics.totalTeams || 0} đội`,
      icon: <BarChartOutlined className="text-blue-400 text-2xl" />,
    },
    {
      title: 'Tổng số đội',
      value: `${statistics.totalTeams || 0}`,
      description: `${statistics.totalParticipants || 0} thành viên`,
      icon: <TeamOutlined className="text-green-400 text-2xl" />,
    },
  ];

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
      dataIndex: 'team',
      key: 'team',
      render: (team, record) => (
        <div className="flex items-center gap-3">
          <Avatar.Group maxCount={3}>
            {record.members.map((member, index) => (
              <Avatar key={index} size="small">
                {member.charAt(0)}
              </Avatar>
            ))}
          </Avatar.Group>
          <div>
            <div className="font-medium text-text-primary">{team}</div>
            <div className="text-gray-400 text-sm">
              {record.members.length} thành viên
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Hackathon',
      dataIndex: 'hackathon',
      key: 'hackathon',
    },
    {
      title: 'Điểm',
      dataIndex: 'score',
      key: 'score',
      render: (score) => (
        <span className="text-primary font-semibold">{score}/100</span>
      ),
    },
    {
      title: 'Bài nộp',
      dataIndex: 'submissions',
      key: 'submissions',
    },
    {
      title: 'Huy hiệu',
      dataIndex: 'badges',
      key: 'badges',
      render: (badges) => (
        <div className="flex flex-wrap gap-1">
          {badges.map((badge) => (
            <Tag key={badge} size="small" className="bg-primary/20 text-primary border-primary/30">
              {badge}
            </Tag>
          ))}
        </div>
      ),
    },
  ];

  const tabItems = [
    {
      key: '1',
      label: 'Bảng xếp hạng',
      children: (
        <Card className="bg-card-background border border-card-border backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-text-primary m-0">
              Bảng xếp hạng các đội của trường
            </h2>
            <Select
              value={selectedHackathon}
              onChange={setSelectedHackathon}
              style={{ width: 250 }}
            >
              <Option value="all">Tất cả hackathon</Option>
              {hackathons.map((hack) => (
                <Option key={hack.id} value={hack.id}>
                  {hack.name || hack.title}
                </Option>
              ))}
            </Select>
          </div>
          {leaderboardLoading ? (
            <div className="flex justify-center py-8">
              <Spin size="large" />
            </div>
          ) : (
            <Table
              columns={leaderboardColumns}
              dataSource={leaderboard}
              pagination={false}
              className="[&_.ant-table]:bg-transparent [&_th]:!bg-card-background [&_th]:!text-text-primary [&_td]:!text-text-secondary [&_td]:border-card-border [&_th]:border-card-border [&_tr:hover_td]:!bg-card-background/50"
            />
          )}
        </Card>
      ),
    },
    {
      key: '2',
      label: 'Thống kê',
      children: (
        <div className="space-y-6">
          <Row gutter={[16, 16]}>
            {categories.map((category, index) => (
              <Col xs={24} sm={8} key={index}>
                <Card className="bg-card-background border border-card-border backdrop-blur-xl text-center">
                  <div className="mb-4">{category.icon}</div>
                  <Statistic
                    title={<span className="text-text-secondary">{category.title}</span>}
                    value={category.value}
                    valueStyle={{ color: 'white', fontSize: '24px' }}
                  />
                  <p className="text-muted-foreground text-sm mt-2">{category.description}</p>
                </Card>
              </Col>
            ))}
          </Row>

          {statistics.scoreDistribution && (
            <Card className="bg-card-background border border-card-border backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Phân bố điểm số
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text-primary">90-100 điểm</span>
                    <span className="text-muted-foreground">
                      {statistics.scoreDistribution['90-100']} đội
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-400 h-2 rounded-full"
                      style={{
                        width: `${(statistics.scoreDistribution['90-100'] / statistics.totalTeams) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text-primary">80-89 điểm</span>
                    <span className="text-muted-foreground">
                      {statistics.scoreDistribution['80-89']} đội
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-400 h-2 rounded-full"
                      style={{
                        width: `${(statistics.scoreDistribution['80-89'] / statistics.totalTeams) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text-primary">70-79 điểm</span>
                    <span className="text-muted-foreground">
                      {statistics.scoreDistribution['70-79']} đội
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${(statistics.scoreDistribution['70-79'] / statistics.totalTeams) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text-primary">Dưới 70 điểm</span>
                    <span className="text-muted-foreground">
                      {statistics.scoreDistribution['below-70']} đội
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-red-400 h-2 rounded-full"
                      style={{
                        width: `${(statistics.scoreDistribution['below-70'] / statistics.totalTeams) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {statistics.hackathons && statistics.hackathons.length > 0 && (
            <Card className="bg-card-background border border-card-border backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Thống kê theo Hackathon
              </h3>
              <Table
                columns={[
                  { title: 'Hackathon', dataIndex: 'name', key: 'name' },
                  { title: 'Số đội', dataIndex: 'teamsCount', key: 'teamsCount' },
                  {
                    title: 'Điểm trung bình',
                    dataIndex: 'averageScore',
                    key: 'averageScore',
                    render: (score) => <span className="text-primary font-semibold">{score}/100</span>,
                  },
                ]}
                dataSource={statistics.hackathons}
                pagination={false}
                className="[&_.ant-table]:bg-transparent [&_th]:!bg-card-background [&_th]:!text-text-primary [&_td]:!text-text-secondary [&_td]:border-card-border [&_th]:border-card-border"
              />
            </Card>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(PATH_NAME.CHAPTER_DASHBOARD)}
        className="mb-4"
      >
        Quay lại Dashboard
      </Button>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Kết quả các đội
          </h1>
          <p className="text-muted-foreground mt-2">
            Theo dõi thứ hạng và thành tích của các đội từ trường
          </p>
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

export default ChapterResults;

