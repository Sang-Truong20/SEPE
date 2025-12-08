import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Alert, Button, Card, Divider, Form, Input, Modal, Space, Spin, Table, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HackathonPhases from '../../components/features/student/HackathonPhases';
import PrizeList from '../../components/features/student/PrizeList';
import { PATH_NAME } from '../../constants';
import { useGetHackathon } from '../../hooks/student/hackathon';
import { useGetMyHackathonRegistrations, useGetTeamHackathonRegistration, useRegisterHackathon } from '../../hooks/student/hackathon-registration';
import { useGetTeams } from '../../hooks/student/team';
import { useGetTrackRanking } from '../../hooks/student/team-ranking';
import { useUserData } from '../../hooks/useUserData';

const StudentHackathonDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: hackathon, isLoading, error } = useGetHackathon(id);
  const { userInfo } = useUserData();
  const { data: teamsData } = useGetTeams();
  
  const userTeam = teamsData && Array.isArray(teamsData) 
    ? teamsData.find(t => {
        const teamLeaderName = t.teamLeaderName || t.leaderName || t.leader?.name;
        const userName = userInfo?.name || userInfo?.fullName || userInfo?.userName;
        return teamLeaderName && userName && teamLeaderName === userName;
      })
    : null;
  
  const { data: registration } = useGetTeamHackathonRegistration(id);
  const { data: myRegistrations } = useGetMyHackathonRegistrations();
  
  // Tìm registration của user cho hackathon hiện tại
  const myRegistration = useMemo(() => {
    if (!myRegistrations || !Array.isArray(myRegistrations)) return null;
    return myRegistrations.find(reg => reg.hackathonId === parseInt(id)) || null;
  }, [myRegistrations, id]);
  
  const registerMutation = useRegisterHackathon();
  
  const [rankingModalVisible, setRankingModalVisible] = useState(false);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [selectedPhaseId, setSelectedPhaseId] = useState(null);
  const [registerForm] = Form.useForm();
  
  // Get ranking data when phase is selected
  const { data: rankingData = [] } = useGetTrackRanking(
    id,
    registration?.selectedTrackId,
    selectedPhaseId || registration?.selectedPhaseId,
    { enabled: !!registration?.selectedTrackId && (!!selectedPhaseId || !!registration?.selectedPhaseId) }
  );

  const handleBack = () => {
    navigate(PATH_NAME.STUDENT_HACKATHONS);
  };

  const handleRegisterHackathon = () => {
    setRegisterModalVisible(true);
    registerForm.resetFields();
  };

  const handleSubmitRegistration = async (values) => {
    try {
      await registerMutation.mutateAsync({ 
        hackathonId: parseInt(id), 
        link: values.link || ''
      });
      setRegisterModalVisible(false);
      registerForm.resetFields();
    } catch (error) {
      console.error('Register hackathon error:', error);
    }
  };

  const getRegistrationStatusTag = () => {
    if (!registration) return null;
    
    switch (registration.status) {
      case 'pending':
        return (
          <Tag icon={<ClockCircleOutlined />} color="orange">
            Đang chờ chapter duyệt
          </Tag>
        );
      case 'approved':
        return (
          <Tag icon={<CheckCircleOutlined />} color="green">
            Đã được duyệt
          </Tag>
        );
      case 'rejected':
        return (
          <Tag icon={<CloseCircleOutlined />} color="red">
            Bị từ chối
          </Tag>
        );
      default:
        return null;
    }
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

          {/* Hackathon Phases */}
          <HackathonPhases hackathonId={id} />

       
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Card */}
          <Card className="bg-card-background border border-card-border backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Hành động
            </h3>
            <Space direction="vertical" className="w-full" style={{ width: '100%' }}>
              {myRegistration && (
                <div className="mb-2">
                  <Tag 
                    icon={myRegistration.status === 'Approved' ? <CheckCircleOutlined /> : <ClockCircleOutlined />} 
                    color={myRegistration.status === 'Approved' ? 'green' : myRegistration.status === 'Pending' ? 'orange' : 'red'}
                  >
                    {myRegistration.status === 'Approved' 
                      ? 'Đã tham gia hackathon' 
                      : myRegistration.status === 'Pending' 
                      ? 'Đang chờ duyệt' 
                      : 'Bị từ chối'}
                  </Tag>
                  {myRegistration.teamName && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Đội: {myRegistration.teamName}
                    </p>
                  )}
                </div>
              )}
              
              {registration && (
                <div className="mb-2">
                  {getRegistrationStatusTag()}
                  {registration.chapterResponse && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {registration.chapterResponse}
                    </p>
                  )}
                </div>
              )}
              
              {!myRegistration && (
                <Button
                  type="primary"
                  size="large"
                  icon={<TeamOutlined />}
                  onClick={handleRegisterHackathon}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0"
                  disabled={hackathon.status?.toLowerCase() === 'completed' || registerMutation.isPending || !userTeam}
                  loading={registerMutation.isPending}
                >
                  {hackathon.status?.toLowerCase() === 'completed' 
                    ? 'Đã kết thúc' 
                    : !userTeam
                    ? 'Cần tạo đội trước'
                    : 'Đăng ký Hackathon'}
                </Button>
              )}

              {myRegistration?.status === 'Approved' && registration?.status === 'approved' && registration.selectedPhaseId && registration.selectedTrackId && (
                <>
                  <Button
                    size="large"
                    icon={<TrophyOutlined />}
                    onClick={() => {
                      setSelectedPhaseId(registration.selectedPhaseId);
                      setRankingModalVisible(true);
                    }}
                    className="w-full"
                  >
                    Xem bảng xếp hạng
                  </Button>
                  <Button
                    size="large"
                    icon={<UserOutlined />}
                    onClick={() => navigate(`/student/hackathons/${id}/mentor-registration`)}
                    className="w-full"
                  >
                    Đăng ký Mentor
                  </Button>
                </>
              )}

              {!userTeam && (
                <Button
                  type="primary"
                  size="large"
                  icon={<TeamOutlined />}
                  onClick={() => navigate(PATH_NAME.STUDENT_TEAMS)}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0"
                >
                  Tạo đội trước
                </Button>
              )}

             
            </Space>
          </Card>

          {/* Prizes Card */}
          <Card className="bg-card-background border border-card-border backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Giải thưởng
            </h3>
            <PrizeList hackathonId={id} />
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

      {/* Ranking Modal */}
      <Modal
        title="Bảng xếp hạng"
        open={rankingModalVisible}
        onCancel={() => {
          setRankingModalVisible(false);
          setSelectedPhaseId(null);
        }}
        footer={null}
        width={800}
        className="[&_.ant-modal-content]:bg-gray-900/95 [&_.ant-modal-content]:backdrop-blur-xl [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white [&_.ant-modal-mask]:bg-black/50"
      >
        <Table
          columns={[
            {
              title: 'Hạng',
              dataIndex: 'rank',
              key: 'rank',
              width: 80,
              render: (rank) => {
                if (rank === 1) return <TrophyOutlined className="text-yellow-400 text-xl" />;
                if (rank === 2) return <TrophyOutlined className="text-gray-400 text-xl" />;
                if (rank === 3) return <TrophyOutlined className="text-amber-600 text-xl" />;
                return <span className="text-white">{rank}</span>;
              },
            },
            {
              title: 'Đội',
              dataIndex: 'teamName',
              key: 'teamName',
            },
            {
              title: 'Thành viên',
              dataIndex: 'members',
              key: 'members',
              render: (members) => members?.join(', ') || '-',
            },
            {
              title: 'Điểm',
              dataIndex: 'score',
              key: 'score',
              render: (score) => <span className="text-primary font-semibold">{score}/100</span>,
            },
            {
              title: 'Bài nộp',
              dataIndex: 'submissions',
              key: 'submissions',
            },
          ]}
          dataSource={rankingData}
          pagination={false}
          rowKey="teamId"
          className="[&_.ant-table]:bg-transparent [&_th]:!bg-card-background [&_th]:!text-text-primary [&_td]:!text-text-secondary [&_td]:border-card-border [&_th]:border-card-border [&_tr:hover_td]:!bg-card-background/50"
        />
      </Modal>

      {/* Register Hackathon Modal */}
      <Modal
        title="Đăng ký Hackathon"
        open={registerModalVisible}
        onCancel={() => {
          setRegisterModalVisible(false);
          registerForm.resetFields();
        }}
        footer={null}
        width={600}
        className="[&_.ant-modal-content]:bg-gray-900/95 [&_.ant-modal-content]:backdrop-blur-xl [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white [&_.ant-modal-mask]:bg-black/50"
      >
        <Form
          form={registerForm}
          layout="vertical"
          onFinish={handleSubmitRegistration}
          className="[&_.ant-form-item-label>label]:text-white [&_.ant-input]:bg-card-background [&_.ant-input]:border-card-border [&_.ant-input]:text-white [&_.ant-input]:placeholder:text-gray-500"
        >
          <Form.Item
            label="Link GitHub Repository"
            name="link"
            rules={[
              { required: true, message: 'Vui lòng nhập link GitHub!' },
              { 
                type: 'url', 
                message: 'Vui lòng nhập URL hợp lệ!' 
              },
              {
                pattern: /^https?:\/\/(www\.)?github\.com\/.+/i,
                message: 'Vui lòng nhập link GitHub hợp lệ!'
              }
            ]}
          >
            <Input
              placeholder="https://github.com/username/repository"
              size="large"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button
                onClick={() => {
                  setRegisterModalVisible(false);
                  registerForm.resetFields();
                }}
                className="[&]:text-white [&]:border-card-border [&]:hover:bg-card-background/50"
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={registerMutation.isPending}
                className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0"
              >
                Đăng ký
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentHackathonDetail;




