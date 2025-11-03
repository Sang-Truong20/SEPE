import {
  TrophyOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Button, Card, Spin, Tag, Avatar, Space, Divider, Alert } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetHackathon } from '../../hooks/student/hackathon';
import { PATH_NAME } from '../../constants';

const StudentHackathonDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: hackathon, isLoading, error } = useGetHackathon(id);

  const handleJoinHackathon = () => {
    navigate(PATH_NAME.STUDENT_TEAMS);
  };

  const handleBack = () => {
    navigate(PATH_NAME.STUDENT_HACKATHONS);
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
          description="Không thể tải thông tin hackathon. Vui lòng thử lại sau."
          type="error"
          showIcon
        />
        <div className="mt-4">
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert
          message="Không tìm thấy hackathon"
          description="Hackathon này không tồn tại hoặc đã bị xóa."
          type="warning"
          showIcon
        />
        <div className="mt-4">
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className="text-muted-foreground hover:text-primary"
        >
          Quay lại danh sách Hackathons
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hackathon Info Card */}
          <Card className="bg-card-background border border-card-border backdrop-blur-xl">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-text-primary">
                      {hackathon.name}
                    </h1>
                    <Tag color={getStatusColor(hackathon.status)} size="large">
                      {getStatusText(hackathon.status)}
                    </Tag>
                  </div>

                  <div className="flex items-center gap-4 text-muted-foreground mb-4">
                    <span>Mùa: {hackathon.seasonName}</span>
                    <span>•</span>
                    <span>Chủ đề: {hackathon.theme}</span>
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            {/* Hackathon Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">
                  Chi tiết Hackathon
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <CalendarOutlined className="text-primary text-lg" />
                    <div>
                      <p className="text-sm text-muted-foreground">Thời gian bắt đầu</p>
                      <p className="text-text-primary font-medium">{hackathon.startDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CalendarOutlined className="text-primary text-lg" />
                    <div>
                      <p className="text-sm text-muted-foreground">Thời gian kết thúc</p>
                      <p className="text-text-primary font-medium">{hackathon.endDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <UserOutlined className="text-primary text-lg" />
                    <div>
                      <p className="text-sm text-muted-foreground">Trạng thái</p>
                      <p className="text-text-primary font-medium">{getStatusText(hackathon.status)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <TrophyOutlined className="text-primary text-lg" />
                    <div>
                      <p className="text-sm text-muted-foreground">Mùa tổ chức</p>
                      <p className="text-text-primary font-medium">{hackathon.seasonName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Rules & Guidelines */}
          <Card className="bg-card-background border border-card-border backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Quy tắc & Hướng dẫn
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-text-primary mb-2">Điều kiện tham gia</h4>
                <p className="text-muted-foreground">
                  Mở cho sinh viên, chuyên gia và những người đam mê trên toàn thế giới.
                  Nhóm từ 2-5 thành viên.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-2">Thời gian</h4>
                <p className="text-muted-foreground">
                  Thời gian phát triển sẽ được thông báo cụ thể sau khi đăng ký thành công.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-2">Tiêu chí chấm điểm</h4>
                <p className="text-muted-foreground">
                  Sáng tạo (30%), Triển khai kỹ thuật (25%), Thiết kế (20%), Thuyết trình (25%)
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Card */}
          <Card className="bg-card-background border border-card-border backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Hành động
            </h3>
            <Space direction="vertical" className="w-full">
              <Button
                type="primary"
                size="large"
                icon={<TeamOutlined />}
                onClick={handleJoinHackathon}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0"
                disabled={hackathon.status?.toLowerCase() === 'completed'}
              >
                {hackathon.status?.toLowerCase() === 'completed' ? 'Đã kết thúc' : 'Tham gia Hackathon'}
              </Button>

              <Button
                size="large"
                className="w-full"
                disabled={hackathon.status?.toLowerCase() === 'completed'}
              >
                Thêm vào lịch
              </Button>
            </Space>
          </Card>

          {/* Sponsors/Partners Card */}
          <Card className="bg-card-background border border-card-border backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Nhà tài trợ
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {['FPT University', 'SEAL', 'TechCorp', 'InnovateLab'].map((sponsor) => (
                <div
                  key={sponsor}
                  className="p-3 bg-card-background/50 rounded-lg text-center border border-card-border/50"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">{sponsor}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentHackathonDetail;
