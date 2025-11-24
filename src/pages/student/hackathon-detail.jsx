import {
  TrophyOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SelectOutlined,
} from '@ant-design/icons';
import { Button, Card, Spin, Tag, Avatar, Space, Divider, Alert, Empty, Select, Modal, Form, Table, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useGetHackathon } from '../../hooks/student/hackathon';
import { useGetHackathonPhases } from '../../hooks/student/hackathon-phase';
import { PATH_NAME } from '../../constants';
import { useGetTeamHackathonRegistration, useRegisterTeamForHackathon, useSelectHackathonPhase, useSelectHackathonTrack } from '../../hooks/student/hackathon-registration';
import { useGetTrackRanking } from '../../hooks/student/team-ranking';
import { useGetTeams } from '../../hooks/student/team';
import { useUserData } from '../../hooks/useUserData';

const { Option } = Select;

const StudentHackathonDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: hackathon, isLoading, error } = useGetHackathon(id);
  const { data: phases = [], isLoading: phasesLoading } = useGetHackathonPhases(id);
  const { userInfo } = useUserData();
  const { data: teamsData } = useGetTeams();
  
  // Get user's team (assuming user is leader of one team)
  const userTeam = teamsData && Array.isArray(teamsData) 
    ? teamsData.find(t => t.leaderId === (userInfo?.id || userInfo?.userId))
    : null;
  const teamId = userTeam?.id || 'team-1'; // Fallback to mock team
  
  const { data: registration, isLoading: registrationLoading } = useGetTeamHackathonRegistration(teamId, id);
  const registerMutation = useRegisterTeamForHackathon();
  const selectPhaseMutation = useSelectHackathonPhase();
  const selectTrackMutation = useSelectHackathonTrack();
  
  const [phaseTrackModalVisible, setPhaseTrackModalVisible] = useState(false);
  const [rankingModalVisible, setRankingModalVisible] = useState(false);
  const [selectedPhaseId, setSelectedPhaseId] = useState(null);
  const [form] = Form.useForm();
  
  // Get ranking data when phase is selected
  const { data: rankingData = [] } = useGetTrackRanking(
    id,
    registration?.selectedTrackId,
    selectedPhaseId || registration?.selectedPhaseId,
    { enabled: !!registration?.selectedTrackId && (!!selectedPhaseId || !!registration?.selectedPhaseId) }
  );

  const handleJoinHackathon = async () => {
    if (!userTeam) {
      message.warning('Bạn cần tạo đội trước khi đăng ký hackathon');
      navigate(PATH_NAME.STUDENT_TEAMS);
      return;
    }
    
    if (registration?.status === 'approved') {
      message.info('Đội đã được duyệt tham gia hackathon này');
      return;
    }
    
    if (registration?.status === 'pending') {
      message.info('Đang chờ chapter duyệt đăng ký');
      return;
    }
    
    try {
      await registerMutation.mutateAsync({ teamId, hackathonId: id });
    } catch (error) {
      console.error('Register hackathon error:', error);
    }
  };

  const handleBack = () => {
    navigate(PATH_NAME.STUDENT_HACKATHONS);
  };

  const handleSelectPhaseTrack = async (values) => {
    try {
      if (values.phaseId) {
        await selectPhaseMutation.mutateAsync({ teamId, hackathonId: id, phaseId: values.phaseId });
      }
      if (values.trackId) {
        await selectTrackMutation.mutateAsync({ teamId, hackathonId: id, trackId: values.trackId });
      }
      setPhaseTrackModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Select phase/track error:', error);
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
          <Card className="bg-card-background border border-card-border backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Các giai đoạn của Hackathon
            </h3>
            {phasesLoading ? (
              <div className="flex justify-center py-8">
                <Spin />
              </div>
            ) : phases && phases.length > 0 ? (
              <div className="space-y-3">
                {phases.map((phase) => (
                  <Card
                    key={phase.phaseId}
                    className="bg-card-background/50 border border-card-border/50"
                    size="small"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-text-primary font-medium mb-2">
                          {phase.phaseName}
                        </h4>
                        <div className="flex items-center gap-3 flex-wrap">
                          <Tag color="green" icon={<CalendarOutlined />}>
                            Bắt đầu: {dayjs(phase.startDate).format('DD/MM/YYYY HH:mm')}
                          </Tag>
                          <Tag color="blue" icon={<CalendarOutlined />}>
                            Kết thúc: {dayjs(phase.endDate).format('DD/MM/YYYY HH:mm')}
                          </Tag>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Empty description="Chưa có giai đoạn nào" />
            )}
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
            <Space direction="vertical" className="w-full" style={{ width: '100%' }}>
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
              
              {(!registration || registration.status !== 'approved') && (
                <Button
                  type="primary"
                  size="large"
                  icon={<TeamOutlined />}
                  onClick={handleJoinHackathon}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0"
                  disabled={hackathon.status?.toLowerCase() === 'completed' || registerMutation.isPending}
                  loading={registerMutation.isPending}
                >
                  {registration?.status === 'pending' 
                    ? 'Đang chờ duyệt...' 
                    : hackathon.status?.toLowerCase() === 'completed' 
                    ? 'Đã kết thúc' 
                    : 'Đăng ký Hackathon'}
                </Button>
              )}

              {registration?.status === 'approved' && userTeam && (
                <>
                  <Button
                    type="primary"
                    size="large"
                    icon={<SelectOutlined />}
                    onClick={() => {
                      form.setFieldsValue({
                        phaseId: registration.selectedPhaseId,
                        trackId: registration.selectedTrackId,
                      });
                      setPhaseTrackModalVisible(true);
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white border-0"
                  >
                    Chọn Phase & Track
                  </Button>
                  
                  {registration.selectedPhaseId && registration.selectedTrackId && (
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

      {/* Phase & Track Selection Modal */}
      <Modal
        title="Chọn Phase và Track"
        open={phaseTrackModalVisible}
        onCancel={() => {
          setPhaseTrackModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        className="[&_.ant-modal-content]:bg-gray-900/95 [&_.ant-modal-content]:backdrop-blur-xl [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white [&_.ant-modal-mask]:bg-black/50"
      >
        <Form form={form} onFinish={handleSelectPhaseTrack} layout="vertical">
          <Form.Item
            label={<span className="text-white">Chọn Phase</span>}
            name="phaseId"
            rules={[{ required: true, message: 'Vui lòng chọn phase!' }]}
          >
            <Select placeholder="Chọn phase">
              {registration?.phases?.map((phase) => (
                <Option key={phase.id} value={phase.id}>
                  {phase.name} ({dayjs(phase.startDate).format('DD/MM/YYYY')} - {dayjs(phase.endDate).format('DD/MM/YYYY')})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={<span className="text-white">Chọn Track</span>}
            name="trackId"
            rules={[{ required: true, message: 'Vui lòng chọn track!' }]}
          >
            <Select placeholder="Chọn track">
              {registration?.tracks?.map((track) => (
                <Option key={track.id} value={track.id}>
                  {track.name} - {track.description}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-2">
              <Button onClick={() => {
                setPhaseTrackModalVisible(false);
                form.resetFields();
              }}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={selectPhaseMutation.isPending || selectTrackMutation.isPending}
                className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 border-0"
              >
                Xác nhận
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

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
    </div>
  );
};

export default StudentHackathonDetail;




