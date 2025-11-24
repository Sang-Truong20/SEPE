import {
  PlusOutlined,
  SearchOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { Alert, Button, Card, Input, Select, Spin, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../constants';
import { useGetHackathons } from '../../hooks/student/hackathon';

const { Search } = Input;
const { Option } = Select;

const StudentHackathons = () => {
  const navigate = useNavigate();
  const { data: hackathons, isLoading, error } = useGetHackathons();

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
          <Card
            key={hackathon.hackathonId}
            className="bg-darkv2-tertiary/70 border border-white/10 rounded-2xl shadow shadow-black/10"
          >
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                    {hackathon.seasonName || 'Hackathon'}
                  </p>
                  <h3 className="text-2xl font-semibold text-white">
                    {hackathon.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {hackathon.theme || 'Chưa cập nhật chủ đề'}
                  </p>
                </div>
                <Tag
                  color={getStatusColor(hackathon.status)}
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {getStatusText(hackathon.status)}
                </Tag>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm text-gray-300">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wide text-gray-500">
                    Bắt đầu
                  </span>
                  {hackathon.startDate}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wide text-gray-500">
                    Kết thúc
                  </span>
                  {hackathon.endDate}
                </div>
              </div>

              <div className="flex w-full">
                <Button

       
                  size="large"
                  variant='outlined'
                  className="bg-green-400 hover:bg-green-500 text-white border-0 flex-1 font-semibold shadow-lg shadow-emerald-500/20"
                  onClick={() => handleViewDetails(hackathon.hackathonId)}
                >
                  Xem chi tiết
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

