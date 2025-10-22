import {
  TrophyOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Input, Row, Tag, Avatar, Space, Select, Badge } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../constants';

const { Search } = Input;
const { Option } = Select;

const StudentHackathons = () => {
  const navigate = useNavigate();

  const hackathons = [
    {
      id: '1',
      name: 'AI Revolution 2024',
      status: 'active',
      participants: 1250,
      maxParticipants: 2000,
      startDate: '2024-03-15',
      endDate: '2024-03-17',
      prize: '$50,000',
      difficulty: 'Intermediate',
      technologies: ['Python', 'Machine Learning', 'TensorFlow'],
      description: 'Build innovative AI solutions for real-world problems',
      joined: true,
      team: 'Code Crusaders',
    },
    {
      id: '2',
      name: 'Web3 Future Hackathon',
      status: 'upcoming',
      participants: 890,
      maxParticipants: 1500,
      startDate: '2024-04-01',
      endDate: '2024-04-03',
      prize: '$25,000',
      difficulty: 'Advanced',
      technologies: ['Solidity', 'React', 'Node.js'],
      description: 'Create the next generation of decentralized applications',
      joined: false,
      team: null,
    },
    {
      id: '3',
      name: 'Green Tech Challenge',
      status: 'upcoming',
      participants: 230,
      maxParticipants: 1000,
      startDate: '2024-04-20',
      endDate: '2024-04-22',
      prize: '$30,000',
      difficulty: 'Beginner',
      technologies: ['JavaScript', 'React', 'Node.js'],
      description: 'Develop sustainable technology solutions for environmental challenges',
      joined: false,
      team: null,
    },
    {
      id: '4',
      name: 'Mobile App Innovation',
      status: 'completed',
      participants: 567,
      maxParticipants: 800,
      startDate: '2024-02-10',
      endDate: '2024-02-12',
      prize: '$15,000',
      difficulty: 'Intermediate',
      technologies: ['React Native', 'Flutter', 'iOS', 'Android'],
      description: 'Create innovative mobile applications that solve real problems',
      joined: true,
      team: 'Mobile Mavericks',
    },
  ];

  const handleJoinHackathon = (hackathonId) => {
    console.log('Joining hackathon:', hackathonId);
    // Navigate to team creation or joining
    navigate(PATH_NAME.STUDENT_TEAMS);
  };

  const handleViewDetails = (hackathonId) => {
    console.log('Viewing hackathon details:', hackathonId);
    // Navigate to hackathon details page
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'upcoming':
        return 'blue';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'green';
      case 'Intermediate':
        return 'orange';
      case 'Advanced':
        return 'red';
      default:
        return 'default';
    }
  };

  const filteredHackathons = hackathons.filter(h => h.status !== 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            Hackathons
          </h1>
          <p className="text-muted-foreground mt-2">
            Khám phá và tham gia các hackathon thú vị
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            icon={<PlusOutlined />}
            className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 transition-all"
            onClick={() => navigate(PATH_NAME.STUDENT_TEAMS)}
          >
            Tạo đội mới
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-8">
        <Search
          placeholder="Tìm kiếm hackathon..."
          allowClear
          className="flex-1"
          prefix={<SearchOutlined />}
        />
        <Select
          placeholder="Lọc theo trạng thái"
          style={{ width: 150 }}
          allowClear
        >
          <Option value="active">Đang diễn ra</Option>
          <Option value="upcoming">Sắp diễn ra</Option>
        </Select>
        <Select
          placeholder="Lọc theo độ khó"
          style={{ width: 150 }}
          allowClear
        >
          <Option value="beginner">Beginner</Option>
          <Option value="intermediate">Intermediate</Option>
          <Option value="advanced">Advanced</Option>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHackathons.map((hackathon) => (
          <Card key={hackathon.id} className="bg-card-background border border-card-border backdrop-blur-xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-text-primary">
                      {hackathon.name}
                    </h3>
                    <Tag color={getStatusColor(hackathon.status)}>
                      {hackathon.status.toUpperCase()}
                    </Tag>
                    <Tag color={getDifficultyColor(hackathon.difficulty)}>
                      {hackathon.difficulty}
                    </Tag>
                  </div>

                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {hackathon.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {hackathon.technologies.map((tech) => (
                      <Tag key={tech} size="small" className="bg-card-background/50 text-text-secondary border border-card-border">
                        {tech}
                      </Tag>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <UserOutlined className="text-primary" />
                      <span className="text-sm text-gray-400">
                        {hackathon.participants}/{hackathon.maxParticipants}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarOutlined className="text-primary" />
                      <span className="text-sm text-gray-400">
                        {hackathon.prize}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarOutlined className="text-primary" />
                      <span className="text-sm text-gray-400">
                        {hackathon.startDate}
                      </span>
                    </div>
                    {hackathon.team && (
                      <div className="flex items-center gap-2">
                        <TeamOutlined className="text-primary" />
                        <span className="text-sm text-gray-400">
                          {hackathon.team}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <Space>
                  <Button
                    type="text"
                    className="text-white hover:text-primary"
                    icon={<TrophyOutlined />}
                    onClick={() => handleViewDetails(hackathon.id)}
                  >
                    Chi tiết
                  </Button>
                  {hackathon.joined && (
                    <Tag color="green">Đã tham gia</Tag>
                  )}
                </Space>

                {!hackathon.joined && (
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0"
                    onClick={() => handleJoinHackathon(hackathon.id)}
                  >
                    Tham gia ngay
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredHackathons.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-card-background/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <TrophyOutlined className="text-4xl text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Không tìm thấy hackathon nào
          </h3>
          <p className="text-muted-foreground">
            Hãy thử thay đổi bộ lọc hoặc kiểm tra lại sau
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentHackathons;

