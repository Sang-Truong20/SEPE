import {
  ArrowLeftOutlined,
  BankOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined,
  MailOutlined,
  SearchOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Alert, Avatar, Button, Card, Divider, Form, Input, Modal, Select, Space, Spin, Table, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HackathonPhases from '../../components/features/student/HackathonPhases';
import PrizeList from '../../components/features/student/PrizeList';
import { PATH_NAME } from '../../constants';
import { useGetHackathon } from '../../hooks/student/hackathon';
import { useGetMyHackathonRegistrations, useRegisterHackathon } from '../../hooks/student/hackathon-registration';
import { useAssignMentor } from '../../hooks/student/mentor-assignment';
import { useGetMyTeams } from '../../hooks/student/team';
import { useGetTrackRanking } from '../../hooks/student/team-ranking';
import { useUserData } from '../../hooks/useUserData';
import { useGroups } from '../../hooks/admin/groups/useGroups';
import { useGetHackathonPhases } from '../../hooks/student/hackathon-phase';

const StudentHackathonDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: hackathon, isLoading, error } = useGetHackathon(id);
  const { userInfo } = useUserData();
  const { data: myTeamsData } = useGetMyTeams();
  const { data: phases = [] } = useGetHackathonPhases(id);
  const phase1 = phases.find(p => p.phaseNumber === 1 || p.phaseId === phases[0]?.phaseId);
  const { fetchGroupsByHackathon } = useGroups();
  const { data: groupsData = [], isLoading: groupsLoading } = fetchGroupsByHackathon(id);
  
  const { data: myRegistrations } = useGetMyHackathonRegistrations();
  
  // Normalize myTeamsData to always be an array
  const teamsArray = useMemo(() => {
    if (!myTeamsData) return [];
    if (Array.isArray(myTeamsData)) return myTeamsData;
    if (Array.isArray(myTeamsData.data)) return myTeamsData.data;
    return [];
  }, [myTeamsData]);
  
  // Check if user has any teams
  const hasTeams = teamsArray.length > 0;
  
  // Filter teams where user is leader and hasn't joined any hackathon yet
  const availableTeams = useMemo(() => {
    if (!hasTeams || !userInfo) return [];
    
    const userName = userInfo?.name || userInfo?.fullName || userInfo?.userName;
    const userId = userInfo?.id || userInfo?.userId;
    
    return teamsArray.filter(t => {
      const teamLeaderName = t.teamLeaderName || t.leaderName || t.leader?.name;
      const teamLeaderId = t.teamLeaderId || t.leaderId || t.leader?.id || t.leader?.userId;
      
      // Check if user is leader
      const isLeader = (teamLeaderName && userName && teamLeaderName === userName) ||
                      (teamLeaderId && userId && teamLeaderId === userId);
      
      // Check if team hasn't joined any hackathon (hackathonId is null)
      const hasNotJoined = t.hackathonId === null || t.hackathonId === undefined || 
                          t.hackathonName === "(No hackathon)" || t.hackathonName === null;
      
      return isLeader && hasNotJoined;
    });
  }, [teamsArray, userInfo, hasTeams]);
  
  // Tìm registration của user cho hackathon hiện tại
  const myRegistration = useMemo(() => {
    if (!myRegistrations || !Array.isArray(myRegistrations)) return null;
    return myRegistrations.find(reg => reg.hackathonId === parseInt(id)) || null;
  }, [myRegistrations, id]);
  
  // Alias để giữ tương thích với code cũ
  const registration = myRegistration;
  
  const registerMutation = useRegisterHackathon();
  const assignMentorMutation = useAssignMentor();
  
  const [rankingModalVisible, setRankingModalVisible] = useState(false);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [mentorSelectModalVisible, setMentorSelectModalVisible] = useState(false);
  const [selectedPhaseId, setSelectedPhaseId] = useState(null);
  const [selectedMentorId, setSelectedMentorId] = useState(null);
  const [mentorSearchQuery, setMentorSearchQuery] = useState('');
  const [registerForm] = Form.useForm();

  // Mock mentors data
  const mockMentors = [
    { 
      mentorId: 1, 
      username: 'quangtrung89000', 
      email: '0583301@gmail.com',
      chapterName: 'FPT University',
      position: 'SE'
    },
    { 
      mentorId: 13, 
      username: 'vy94307', 
      email: 'vy94307@donga.edu.vn',
      chapterName: 'FPT University',
      position: 'SE'
    },
  ];
  
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
    if (!values.teamId) {
      console.error('No team selected');
      return;
    }
    
    try {
      await registerMutation.mutateAsync({ 
        hackathonId: parseInt(id), 
        link: values.link || '',
        teamId: values.teamId
      });
      setRegisterModalVisible(false);
      registerForm.resetFields();
    } catch (error) {
      console.error('Register hackathon error:', error);
    }
  };

  const handleSelectMentor = async () => {
    if (!selectedMentorId || !myRegistration?.teamId) {
      return;
    }
    try {
      await assignMentorMutation.mutateAsync({
        mentorId: selectedMentorId,
        hackathonId: parseInt(id),
        teamId: myRegistration.teamId,
      });
      setMentorSelectModalVisible(false);
      setSelectedMentorId(null);
      setMentorSearchQuery('');
    } catch (error) {
      console.error('Assign mentor error:', error);
    }
  };

  // Filter mentors by search query
  const filteredMentors = useMemo(() => {
    if (!mentorSearchQuery.trim()) return mockMentors;
    const query = mentorSearchQuery.toLowerCase();
    return mockMentors.filter(
      (mentor) =>
        mentor.username.toLowerCase().includes(query) ||
        mentor.email.toLowerCase().includes(query) ||
        mentor.chapterName?.toLowerCase().includes(query) ||
        mentor.position?.toLowerCase().includes(query)
    );
  }, [mentorSearchQuery]);

  const getMyRegistrationStatusTag = (status) => {
    if (!status) return null;
    
    const normalizedStatus = status?.toLowerCase();
    
    switch (normalizedStatus) {
      case 'approved':
        return {
          icon: <CheckCircleOutlined />,
          color: 'green',
          text: 'Đã tham gia hackathon'
        };
      case 'pending':
        return {
          icon: <ClockCircleOutlined />,
          color: 'orange',
          text: 'Đang chờ duyệt'
        };
      case 'waitingmentor':
        return {
          icon: <ClockCircleOutlined />,
          color: 'blue',
          text: 'Đang chờ mentor'
        };
      case 'rejected':
        return {
          icon: <CloseCircleOutlined />,
          color: 'red',
          text: 'Bị từ chối'
        };
      default:
        return {
          icon: <ClockCircleOutlined />,
          color: 'default',
          text: status
        };
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

          {/* Groups Section - Chỉ hiển thị ở Phase 1 */}
          {phase1 && (
            <Card className="bg-card-background border border-card-border backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Các bảng đấu (Phase 1)
              </h3>
              {groupsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Spin size="large" />
                </div>
              ) : groupsData && groupsData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupsData.map((group) => (
                    <div
                      key={group.groupId}
                      className="p-4 bg-card-background/50 rounded-lg border border-card-border/50 hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/student/hackathons/${id}/phases/${phase1.phaseId}`)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-text-primary">
                          Bảng {group.groupName}
                        </h4>
                        <Tag color="blue" size="small">
                          Track {group.trackId}
                        </Tag>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <TeamOutlined className="text-primary" />
                          <span>{Array.isArray(group.teamIds) ? group.teamIds.length : 0} đội</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarOutlined className="text-primary" />
                          <span>{new Date(group.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TrophyOutlined className="text-4xl mb-2 opacity-50" />
                  <p>Chưa có bảng đấu nào được tạo</p>
                </div>
              )}
            </Card>
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Card */}
          <Card className="bg-card-background border border-card-border backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Hành động
            </h3>
            <Space direction="vertical" className="w-full" style={{ width: '100%' }}>
              {myRegistration && (() => {
                const statusInfo = getMyRegistrationStatusTag(myRegistration.status);
                if (!statusInfo) return null;
                const isWaitingMentor = myRegistration.status?.toLowerCase() === 'waitingmentor';
                return (
                  <div className="mb-2">
                    <Tag icon={statusInfo.icon} color={statusInfo.color}>
                      {statusInfo.text}
                    </Tag>
                    {myRegistration.teamName && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Đội: {myRegistration.teamName}
                      </p>
                    )}
                    {isWaitingMentor && (
                      <Button
                        type="primary"
                        size="large"
                        icon={<UserOutlined />}
                        onClick={() => setMentorSelectModalVisible(true)}
                        className="w-full mt-3 bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white border-0"
                      >
                        Chọn Mentor
                      </Button>
                    )}
                  </div>
                );
              })()}
              
              {myRegistration?.chapterResponse && (
                <div className="mb-2">
                  <p className="text-sm text-muted-foreground">
                    {myRegistration.chapterResponse}
                  </p>
                </div>
              )}
              
              {!myRegistration && (
                <Button
                  type="primary"
                  size="large"
                  icon={<TeamOutlined />}
                  onClick={handleRegisterHackathon}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0"
                  disabled={hackathon.status?.toLowerCase() === 'completed' || registerMutation.isPending || availableTeams.length === 0}
                  loading={registerMutation.isPending}
                >
                  {hackathon.status?.toLowerCase() === 'completed' 
                    ? 'Đã kết thúc' 
                    : 'Đăng ký Hackathon'}
                </Button>
              )}

              {myRegistration && (myRegistration.status?.toLowerCase() === 'approved' || myRegistration.status?.toLowerCase() === 'waitingmentor') && registration?.status?.toLowerCase() === 'approved' && registration.selectedPhaseId && registration.selectedTrackId && (
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
          className="[&_.ant-form-item-label>label]:text-white [&_.ant-input]:bg-card-background [&_.ant-input]:border-card-border [&_.ant-input]:text-white [&_.ant-input]:placeholder:text-gray-500 [&_.ant-select-selector]:bg-card-background [&_.ant-select-selector]:border-card-border [&_.ant-select-selection-item]:text-white [&_.ant-select-selection-placeholder]:text-gray-500"
        >
          <Form.Item
            label="Chọn đội"
            name="teamId"
            rules={[
              { required: true, message: 'Vui lòng chọn đội!' }
            ]}
            help={availableTeams.length === 0 ? 'Bạn chưa có đội nào là đội trưởng và chưa tham gia hackathon. Vui lòng tạo đội trước.' : null}
          >
            <Select
              placeholder={availableTeams.length === 0 ? "Không có đội khả dụng" : "Chọn đội của bạn"}
              size="large"
              showSearch
              disabled={availableTeams.length === 0}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={availableTeams.map(team => ({
                value: team.teamId || team.id || team.teamID,
                label: team.teamName || team.name || `Đội ${team.teamId || team.id || team.teamID}`
              }))}
              className="[&_.ant-select-selector]:!bg-card-background [&_.ant-select-selector]:!border-card-border [&_.ant-select-selection-item]:!text-white"
            />
          </Form.Item>

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
                disabled={availableTeams.length === 0}
                className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0"
              >
                Đăng ký
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Select Mentor Modal */}
      <Modal
        title="Chọn Mentor"
        open={mentorSelectModalVisible}
        onOk={handleSelectMentor}
        onCancel={() => {
          setMentorSelectModalVisible(false);
          setSelectedMentorId(null);
          setMentorSearchQuery('');
        }}
        okText="Gửi yêu cầu"
        cancelText="Hủy"
        okButtonProps={{
          disabled: !selectedMentorId,
          loading: assignMentorMutation.isPending,
          className: 'bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white border-0',
        }}
        width={700}
        className="[&_.ant-modal-content]:bg-gray-900/95 [&_.ant-modal-content]:backdrop-blur-xl [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white [&_.ant-modal-mask]:bg-black/50"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground mb-2">
            Vui lòng chọn một mentor để hỗ trợ đội của bạn trong hackathon này.
          </p>
          
          {/* Search Input */}
          <Input
            placeholder="Tìm kiếm mentor theo tên, email, chapter..."
            prefix={<SearchOutlined className="text-muted-foreground" />}
            value={mentorSearchQuery}
            onChange={(e) => setMentorSearchQuery(e.target.value)}
            size="large"
            allowClear
            className="[&_.ant-input]:bg-white/5 [&_.ant-input]:border-white/10 [&_.ant-input]:text-white [&_.ant-input]:placeholder:text-gray-500 [&_.ant-input]:focus:border-green-500/50 [&_.ant-input]:hover:border-green-500/30"
          />
          
          {filteredMentors.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredMentors.map((mentor) => (
                <div
                  key={mentor.mentorId}
                  onClick={() => setSelectedMentorId(mentor.mentorId)}
                  className={`relative p-5 rounded-xl transition-all duration-200 border-2 cursor-pointer ${
                    selectedMentorId === mentor.mentorId
                      ? 'bg-green-500/10 border-green-500 shadow-lg shadow-green-500/20'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-green-500/30 hover:shadow-md'
                  }`}
                >
                  {/* Avatar - Top Left */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <Avatar
                        size={64}
                        className="bg-gradient-to-r from-green-400 to-emerald-400 flex-shrink-0 shadow-lg border-2 border-green-500/50"
                      >
                        <span className="text-2xl font-bold text-white">
                          {mentor.username.charAt(0).toUpperCase()}
                        </span>
                      </Avatar>
                    </div>
                    
                    {/* Name and Position */}
                    <div className="flex-1 pt-1">
                      <div className="text-green-400 font-semibold text-xl mb-2">
                        {mentor.username}
                      </div>
                      {mentor.position && (
                        <div className="flex items-center gap-2 text-green-400">
                          <BankOutlined className="text-sm" />
                          <span className="text-sm">{mentor.position}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Separator */}
                  <Divider className="my-3 border-green-500/30" />

                  {/* Email and Location */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-400">
                      <MailOutlined className="text-sm" />
                      <span className="text-sm truncate">{mentor.email}</span>
                    </div>
                    {mentor.chapterName && (
                      <div className="flex items-center gap-2 text-green-400">
                        <EnvironmentOutlined className="text-sm" />
                        <span className="text-sm truncate">{mentor.chapterName}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <SearchOutlined className="text-4xl mb-3 opacity-50" />
              <p className="text-base">Không tìm thấy mentor nào phù hợp</p>
              <p className="text-sm mt-1">Vui lòng thử lại với từ khóa khác</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default StudentHackathonDetail;




