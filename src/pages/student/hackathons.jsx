import {
  TrophyOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Input, Row, Tag, Avatar, Space, Select, Badge, Spin, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../constants';
import { useGetHackathons } from '../../hooks/student/hackathon';

const { Search } = Input;
const { Option } = Select;

const StudentHackathons = () => {
  const navigate = useNavigate();
  const { data: hackathons, isLoading, error } = useGetHackathons();

  const handleJoinHackathon = (hackathonId) => {
    console.log('Joining hackathon:', hackathonId);
    // Navigate to team creation or joining
    navigate(PATH_NAME.STUDENT_TEAMS);
  };

  const handleViewDetails = (hackathonId) => {
    navigate(`/student/hackathons/${hackathonId}`);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'orange';
      case 'active':
        return 'green';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'SẮP DIỄN RA';
      case 'active':
        return 'ĐANG DIỄN RA';
      case 'completed':
        return 'ĐÃ KẾT THÚC';
      default:
        return status?.toUpperCase() || 'UNKNOWN';
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

  const filteredHackathons = hackathons?.filter(h => h.status?.toLowerCase() !== 'completed') || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert
          message="Lỗi tải dữ liệu"
          description="Không thể tải danh sách hackathon. Vui lòng thử lại sau."
          type="error"
          showIcon
        />
      </div>
    );
  }

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
          <Card key={hackathon.hackathonId} className="bg-card-background border border-card-border backdrop-blur-xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-text-primary">
                      {hackathon.name}
                    </h3>
                    <Tag color={getStatusColor(hackathon.status)}>
                      {getStatusText(hackathon.status)}
                    </Tag>
                  </div>

                  <div className="flex items-center gap-4 text-muted-foreground mb-4">
                    <span>Mùa: {hackathon.seasonName}</span>
                    <span>•</span>
                    <span>Chủ đề: {hackathon.theme}</span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <CalendarOutlined className="text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Bắt đầu</p>
                        <span className="text-sm text-gray-400">
                          {hackathon.startDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarOutlined className="text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Kết thúc</p>
                        <span className="text-sm text-gray-400">
                          {hackathon.endDate}
                        </span>
                      </div>
                    </div>
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
                    onClick={() => handleViewDetails(hackathon.hackathonId)}
                  >
                    Chi tiết
                  </Button>
                </Space>

                <Button
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0"
                  onClick={() => handleJoinHackathon(hackathon.hackathonId)}
                  disabled={hackathon.status?.toLowerCase() === 'completed'}
                >
                  {hackathon.status?.toLowerCase() === 'completed' ? 'Đã kết thúc' : 'Tham gia ngay'}
                </Button>
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

