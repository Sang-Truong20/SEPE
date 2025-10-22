import {
  TrophyOutlined,
  CrownOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
  BarChartOutlined,
  FilterOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Row, Table, Tag, Avatar, Space, Select, Tabs, Statistic } from 'antd';

const { Option } = Select;

const StudentLeaderboard = () => {
  const globalLeaderboard = [
    {
      rank: 1,
      team: 'AI Innovators',
      members: ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'],
      hackathon: 'AI Revolution 2024',
      score: 95.8,
      submissions: 2,
      badges: ['Innovation', 'Technical Excellence'],
    },
    {
      rank: 2,
      team: 'Code Crusaders',
      members: ['Phạm Thị D', 'Hoàng Văn E'],
      hackathon: 'AI Revolution 2024',
      score: 92.3,
      submissions: 2,
      badges: ['Best Presentation'],
    },
    {
      rank: 3,
      team: 'Neural Networks',
      members: ['Đỗ Thị F', 'Vũ Văn G', 'Bùi Thị H'],
      hackathon: 'AI Revolution 2024',
      score: 89.7,
      submissions: 2,
      badges: ['Creativity'],
    },
    {
      rank: 4,
      team: 'SmartCity AI',
      members: ['Lý Văn I', 'Ngô Thị K'],
      hackathon: 'AI Revolution 2024',
      score: 87.2,
      submissions: 2,
      badges: [],
    },
    {
      rank: 5,
      team: 'Tech Titans',
      members: ['Đinh Văn L', 'Hoàng Thị M'],
      hackathon: 'AI Revolution 2024',
      score: 85.1,
      submissions: 1,
      badges: ['Most Improved'],
    },
  ];

  const myRankings = [
    {
      hackathon: 'AI Revolution 2024',
      rank: 2,
      totalTeams: 45,
      score: 92.3,
      percentile: 95,
    },
    {
      hackathon: 'Web3 Future Hackathon',
      rank: 8,
      totalTeams: 32,
      score: 78.5,
      percentile: 75,
    },
    {
      hackathon: 'Green Tech Challenge',
      rank: 15,
      totalTeams: 28,
      score: 71.2,
      percentile: 46,
    },
  ];

  const categories = [
    {
      title: 'Điểm cao nhất',
      value: '95.8/100',
      description: 'Đội AI Innovators',
      icon: <CrownOutlined className="text-yellow-400 text-2xl" />,
    },
    {
      title: 'Nhiều bài nộp nhất',
      value: '2',
      description: '4 đội đạt được',
      icon: <FileTextOutlined className="text-blue-400 text-2xl" />,
    },
    {
      title: 'Độ tham gia cao nhất',
      value: '45 đội',
      description: 'AI Revolution 2024',
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

  const myRankingColumns = [
    {
      title: 'Hackathon',
      dataIndex: 'hackathon',
      key: 'hackathon',
    },
    {
      title: 'Hạng',
      dataIndex: 'rank',
      key: 'rank',
      render: (rank, record) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-text-primary">#{rank}</div>
          <div className="text-gray-400 text-sm">của {record.totalTeams} đội</div>
        </div>
      ),
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
      title: 'Percentile',
      dataIndex: 'percentile',
      key: 'percentile',
      render: (percentile) => (
        <Tag color={percentile >= 90 ? 'green' : percentile >= 75 ? 'blue' : 'default'}>
          Top {100 - percentile}%
        </Tag>
      ),
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
            <Select defaultValue="all" style={{ width: 200 }}>
              <Option value="all">Tất cả hackathon</Option>
              <Option value="ai-revolution">AI Revolution 2024</Option>
              <Option value="web3-hackathon">Web3 Future Hackathon</Option>
            </Select>
          </div>
          <Table
            columns={leaderboardColumns}
            dataSource={globalLeaderboard}
            pagination={false}
            className="[&_.ant-table]:bg-transparent [&_th]:!bg-card-background [&_th]:!text-text-primary [&_td]:!text-text-secondary [&_td]:border-card-border [&_th]:border-card-border [&_tr:hover_td]:!bg-card-background/50"
          />
        </Card>
      ),
    },
    {
      key: '2',
      label: 'Xếp hạng của tôi',
      children: (
        <Card className="bg-card-background border border-card-border backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-text-primary mb-6">
            Thứ hạng của tôi trong các hackathon
          </h2>
          <Table
            columns={myRankingColumns}
            dataSource={myRankings}
            pagination={false}
            className="[&_.ant-table]:bg-transparent [&_th]:!bg-card-background [&_th]:!text-text-primary [&_td]:!text-text-secondary [&_td]:border-card-border [&_th]:border-card-border [&_tr:hover_td]:!bg-card-background/50"
          />
        </Card>
      ),
    },
    {
      key: '3',
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

          <Card className="bg-card-background border border-card-border backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Phân bố điểm số
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-primary">90-100 điểm</span>
                  <span className="text-muted-foreground">12 đội (15%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-primary">80-89 điểm</span>
                  <span className="text-muted-foreground">25 đội (31%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: '31%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-primary">70-79 điểm</span>
                  <span className="text-muted-foreground">28 đội (35%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-primary">Dưới 70 điểm</span>
                  <span className="text-muted-foreground">15 đội (19%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-red-400 h-2 rounded-full" style={{ width: '19%' }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
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

