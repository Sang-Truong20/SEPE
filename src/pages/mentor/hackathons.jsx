import {
  SearchOutlined,
  TrophyOutlined,
  CalendarOutlined,
  UserOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { Button, Card, Input, Tag, Select, Spin, Row, Col } from 'antd';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../constants';
import { useGetHackathons } from '../../hooks/student/hackathon';
import { useUserData } from '../../hooks/useUserData';

const { Option } = Select;

const MentorHackathons = () => {
  const navigate = useNavigate();
  const [hackathonSearchQuery, setHackathonSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: hackathonsData, isLoading: hackathonsLoading } = useGetHackathons();

  // Filter hackathons: exclude completed, filter by search and status
  const filteredHackathons = useMemo(() => {
    if (!hackathonsData) return [];
    const hackathons = Array.isArray(hackathonsData) ? hackathonsData : hackathonsData?.data || [];
    
    return hackathons.filter((hack) => {
      // Exclude completed
      if (hack.status?.toLowerCase() === 'completed') return false;
      
      // Filter by status
      if (statusFilter !== 'all') {
        const hackStatus = hack.status?.toLowerCase();
        if (statusFilter === 'active' && hackStatus !== 'active') return false;
        if (statusFilter === 'pending' && hackStatus !== 'pending' && hackStatus !== 'upcoming') return false;
      }
      
      // Filter by search query
      if (hackathonSearchQuery) {
        const query = hackathonSearchQuery.toLowerCase();
        const name = (hack.name || hack.title || '').toLowerCase();
        const description = (hack.description || '').toLowerCase();
        if (!name.includes(query) && !description.includes(query)) return false;
      }
      
      return true;
    });
  }, [hackathonsData, statusFilter, hackathonSearchQuery]);

  const handleHackathonClick = (hackathonId) => {
    navigate(`${PATH_NAME.MENTOR_HACKATHONS}/${hackathonId}`);
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Tag color="green">ĐANG DIỄN RA</Tag>;
      case 'pending':
      case 'upcoming':
        return <Tag color="orange">SẮP DIỄN RA</Tag>;
      default:
        return <Tag>{status?.toUpperCase() || 'UNKNOWN'}</Tag>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Button onClick={() => navigate(PATH_NAME.MENTOR_DASHBOARD)}>
        Quay lại Dashboard
      </Button>

      <div>
        <h1 className="text-4xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Hackathon
        </h1>
        <p className="text-gray-400 text-lg mt-2">
          Chọn hackathon để xem các teams bạn đang quản lý
        </p>
      </div>

      {/* Search and Filter - Improved UI */}
      <Card className="border-0 bg-gradient-to-r from-white/5 to-white/5 backdrop-blur-xl shadow-lg">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <SearchOutlined className="text-green-400 text-lg" />
            <h3 className="text-white font-semibold">Tìm kiếm & Lọc</h3>
          </div>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={14}>
              <Input
                placeholder="Tìm kiếm hackathon theo tên hoặc mô tả..."
                prefix={<SearchOutlined className="text-green-400" />}
                value={hackathonSearchQuery}
                onChange={(e) => setHackathonSearchQuery(e.target.value)}
                className="bg-white/10 border-white/20 hover:border-green-400/50 focus:border-green-400 transition-all"
                size="large"
                allowClear
              />
            </Col>
            <Col xs={24} sm={24} md={10}>
              <Select
                placeholder="Lọc theo trạng thái"
                size="large"
                value={statusFilter}
                onChange={setStatusFilter}
                suffixIcon={<FilterOutlined className="text-green-400" />}
                className="w-full [&_.ant-select-selector]:bg-white/10 [&_.ant-select-selector]:border-white/20 [&_.ant-select-selector:hover]:border-green-400/50"
              >
                <Option value="all">
                  <span className="text-white">Tất cả</span>
                </Option>
                <Option value="active">
                  <span className="text-white">Đang diễn ra</span>
                </Option>
                <Option value="pending">
                  <span className="text-white">Sắp diễn ra</span>
                </Option>
              </Select>
            </Col>
          </Row>
        </div>
      </Card>

      {/* Hackathons Grid */}
      {hackathonsLoading ? (
        <Card className="border-0 bg-white/5 backdrop-blur-xl">
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        </Card>
      ) : filteredHackathons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHackathons.map((hackathon) => (
            <Card
              key={hackathon.id}
              className="border-0 bg-gradient-to-br from-white/5 to-white/5 backdrop-blur-xl hover:from-white/10 hover:to-green-500/10 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-xl"
              onClick={() => handleHackathonClick(hackathon.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl text-white mb-2">
                    {hackathon.name || hackathon.title}
                  </h3>
                  {getStatusBadge(hackathon.status)}
                </div>
                <TrophyOutlined className="text-2xl text-green-400/50" />
              </div>

              {hackathon.description && (
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {hackathon.description}
                </p>
              )}

              <div className="space-y-2 text-sm">
                {hackathon.startDate && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <CalendarOutlined />
                    <span>Bắt đầu: {formatDate(hackathon.startDate)}</span>
                  </div>
                )}
                {hackathon.endDate && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <CalendarOutlined />
                    <span>Kết thúc: {formatDate(hackathon.endDate)}</span>
                  </div>
                )}
                {hackathon.participantCount !== undefined && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <UserOutlined />
                    <span>{hackathon.participantCount} người tham gia</span>
                  </div>
                )}
              </div>

            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-0 bg-white/5 backdrop-blur-xl">
          <div className="p-12 text-center">
            <TrophyOutlined className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">
              {hackathonSearchQuery || statusFilter !== 'all'
                ? 'Không tìm thấy hackathon nào phù hợp'
                : 'Không có hackathon nào đang diễn ra'}
            </p>
          </div>
        </Card>
      )}

    </div>
  );
};

export default MentorHackathons;

