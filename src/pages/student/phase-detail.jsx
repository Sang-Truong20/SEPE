import { ArrowLeftOutlined, CalendarOutlined, TeamOutlined, TrophyOutlined, ExclamationCircleOutlined, FileTextOutlined, UploadOutlined, SendOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Form, Input, Modal, Spin, Table, Tag, Tabs, message } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  PhaseInfoCard, 
  TracksSelection, 
  PhaseInfoSidebar,
  SubmissionSection,
  getPhaseStatus 
} from '../../components/features/student/phase-detail';
import { useGroups } from '../../hooks/admin/groups/useGroups';
import { useGetHackathon } from '../../hooks/student/hackathon';
import { useGetHackathonPhases } from '../../hooks/student/hackathon-phase';
import { useGetMyHackathonRegistrations } from '../../hooks/student/hackathon-registration';
import { useGetFinalQualifiedTeams } from '../../hooks/student/qualification';
import { useGetHackathonRanking } from '../../hooks/student/team-ranking';
import { useGetTeams, useGetMyTeams } from '../../hooks/student/team';
import { useGetTeamPhasePenalties } from '../../hooks/student/penalty';
import { useGetTeamAppeals, useCreateAppeal } from '../../hooks/student/appeal';
import { useGetTeamMembers } from '../../hooks/student/team-member';
import { useSelectTeamTrack } from '../../hooks/student/team-track';
import { useGetTracksByPhase } from '../../hooks/student/track';
import { useUserData } from '../../hooks/useUserData';

const StudentPhaseDetail = () => {
  const navigate = useNavigate();
  const { phaseId, hackathonId } = useParams();
  
  const { userInfo } = useUserData();
  const { data: teamsData } = useGetTeams();
  const { data: myTeamsData } = useGetMyTeams();
  const { data: hackathon } = useGetHackathon(hackathonId);
  const { data: phases = [] } = useGetHackathonPhases(hackathonId);
  const phase = phases.find(p => p.phaseId === parseInt(phaseId));
  const phaseIndex = phases.findIndex(p => p.phaseId === parseInt(phaseId));
  const isPhase1 = phaseIndex === 0; // First phase in array
  const isPhase2 = phaseIndex === 1; // Second phase in array
  const showTrackSelection = !isPhase2; // Hide track selection for phase 2
  
  // Get my hackathon registrations to find teamId
  const { data: myRegistrations } = useGetMyHackathonRegistrations();
  
  // Find registration for current hackathon
  const myRegistration = React.useMemo(() => {
    if (!myRegistrations || !Array.isArray(myRegistrations)) return null;
    return myRegistrations.find(reg => reg.hackathonId === parseInt(hackathonId)) || null;
  }, [myRegistrations, hackathonId]);
  
  // Get teamId from my-teams API matching current hackathon
  const teamId = React.useMemo(() => {
    // First try to get from my-teams API matching hackathon
    if (myTeamsData) {
      const myTeams = Array.isArray(myTeamsData) 
        ? myTeamsData 
        : Array.isArray(myTeamsData?.data) 
          ? myTeamsData.data 
          : Array.isArray(myTeamsData?.teams)
            ? myTeamsData.teams
            : [];
      
      // Find team that matches current hackathon
      const matchedTeam = myTeams.find(team => {
        const teamHackathonId = team.hackathonId || team.hackathon?.hackathonId || team.hackathon?.id;
        return teamHackathonId && Number(teamHackathonId) === Number(hackathonId);
      });
      
      if (matchedTeam) {
        return matchedTeam.teamId || matchedTeam.id || null;
      }
    }
    
    // Try to get teamId from myRegistration
    if (myRegistration?.teamId) return myRegistration.teamId;
    if (myRegistration?.team?.teamId) return myRegistration.team.teamId;
    if (myRegistration?.team?.id) return myRegistration.team.id;
    
    // Fallback: try to find from teamsData
    const userTeam = teamsData && Array.isArray(teamsData) 
      ? teamsData.find(t => t.leaderId === (userInfo?.id || userInfo?.userId))
      : null;
    
    return userTeam?.teamId || userTeam?.id || null;
  }, [myTeamsData, hackathonId, myRegistration, teamsData, userInfo]);
  
  // Get penalties for team in current phase
  const { data: penaltiesData = [], isLoading: penaltiesLoading } = useGetTeamPhasePenalties(
    teamId,
    phaseId,
    { enabled: !!teamId && !!phaseId }
  );
  
  const penalties = Array.isArray(penaltiesData)
    ? penaltiesData
    : Array.isArray(penaltiesData?.data)
      ? penaltiesData.data
      : [];
  
  // Get appeals for team
  const { data: appealsData = [], isLoading: appealsLoading } = useGetTeamAppeals(
    teamId,
    { enabled: !!teamId }
  );
  
  const appeals = Array.isArray(appealsData)
    ? appealsData
    : Array.isArray(appealsData?.data)
      ? appealsData.data
      : [];
  
  // Filter appeals related to penalties in current phase
  const phaseAppeals = React.useMemo(() => {
    if (!phaseId || !penalties.length) return appeals;
    
    // Get penalty IDs from current phase
    const penaltyIds = penalties.map(p => p.penaltyId || p.id).filter(Boolean);
    
    // Filter appeals that match penalties in this phase
    return appeals.filter(appeal => {
      const appealPenaltyId = appeal.adjustmentId || appeal.penaltyId;
      return appealPenaltyId && penaltyIds.includes(appealPenaltyId);
    });
  }, [appeals, penalties, phaseId]);
  
  // Get user's team for leader check
  const userTeam = teamsData && Array.isArray(teamsData) 
    ? teamsData.find(t => t.teamId === teamId || t.id === teamId)
    : null;

  // Get team members to check if user is leader
  const { data: teamMembersResponse } = useGetTeamMembers(teamId, {
    enabled: !!teamId,
  });

  const apiMembers = Array.isArray(teamMembersResponse?.data) 
    ? teamMembersResponse.data 
    : Array.isArray(teamMembersResponse)
      ? teamMembersResponse
      : [];

  // Check if user is leader
  const currentUserId = userInfo?.id || userInfo?.userId;
  const currentUserName = userInfo?.name || userInfo?.fullName || userInfo?.userName;
  const isLeader = React.useMemo(() => {
    if (!userTeam || !currentUserId) return false;
    
    // Check from team leaderId
    if (userTeam.leaderId === currentUserId) return true;
    
    // Check from members list
    return apiMembers.some(m => 
      (m.userId === currentUserId || m.id === currentUserId) && 
      m.roleInTeam === 'TeamLeader'
    ) || (userTeam.leaderName && currentUserName && userTeam.leaderName === currentUserName);
  }, [userTeam, currentUserId, currentUserName, apiMembers]);
  
  // Alias để giữ tương thích với code cũ
  const registration = myRegistration;
  const {
    data: tracksData = [],
    isLoading: tracksLoading,
  } = useGetTracksByPhase(phaseId, { enabled: !!phaseId });

  const tracks = Array.isArray(tracksData)
    ? tracksData
    : tracksData?.data
      ? tracksData.data
      : tracksData?.tracks
        ? tracksData.tracks
        : [];
  const selectTeamTrackMutation = useSelectTeamTrack();
  
  const [form] = Form.useForm();
  const [selectedTrackId, setSelectedTrackId] = React.useState(null);
  const [appealModalVisible, setAppealModalVisible] = React.useState(false);
  const [selectedPenalty, setSelectedPenalty] = React.useState(null);
  const [appealForm] = Form.useForm();
  
  const createAppealMutation = useCreateAppeal();

  const phaseStatus = phase ? getPhaseStatus(phase) : null;
  const isPhaseCompleted = phaseStatus === 'completed';

  // Get groups for phase 1
  const { fetchGroupsByHackathon } = useGroups();
  const { data: groupsData = [], isLoading: groupsLoading } = fetchGroupsByHackathon(hackathonId);

  // Get final qualified teams for phase 2
  const { data: qualifiedTeams = [], isLoading: qualifiedLoading } = useGetFinalQualifiedTeams(
    phaseId,
    { enabled: isPhase2 }
  );

  // Get ranking for phase 2 when completed
  const { data: phase2Ranking = [], isLoading: rankingLoading } = useGetHackathonRanking(
    hackathonId,
    { enabled: isPhase2 && isPhaseCompleted }
  );

  // Tìm track đã chọn từ danh sách tracks dựa vào registration
  const selectedTrack = React.useMemo(() => {
    if (!registration?.selectedTrackId || !tracks.length) return null;
    return tracks.find(t => t.trackId === registration.selectedTrackId) || null;
  }, [tracks, registration?.selectedTrackId]);

  const handleBack = () => {
    navigate(`/student/hackathons/${hackathonId}`);
  };

  // Set form initial value when tracks and registration data are loaded
  useEffect(() => {
    if (selectedTrack && phaseId && parseInt(phaseId) === registration?.selectedPhaseId) {
      const trackId = selectedTrack.trackId;
      form.setFieldsValue({ trackId });
      setSelectedTrackId(trackId);
    }
  }, [selectedTrack, registration, phaseId, form]);

  const handleSelectTrack = async (values) => {
    try {
      if (values.trackId) {
        await selectTeamTrackMutation.mutateAsync({ 
          teamId, 
          trackId: values.trackId 
        });
      }
    } catch (error) {
      console.error('Select track error:', error);
      // Error message đã được xử lý trong hook
    }
  };

  const handleTrackSelect = (trackId) => {
    setSelectedTrackId(trackId);
    form.setFieldsValue({ trackId });
  };

  const handleOpenAppealModal = (penalty) => {
    setSelectedPenalty(penalty);
    appealForm.resetFields();
    appealForm.setFieldsValue({
      reason: '',
      message: '',
    });
    setAppealModalVisible(true);
  };

  const handleCreateAppeal = async (values) => {
    if (!selectedPenalty || !teamId) {
      message.error('Thiếu thông tin để tạo appeal');
      return;
    }

    try {
      await createAppealMutation.mutateAsync({
        appealType: 'Penalty',
        adjustmentId: selectedPenalty.penaltyId || selectedPenalty.id,
        teamId: teamId,
        message: values.message,
        reason: values.reason,
      });
      
      message.success('Gửi kháng cáo thành công!');
      setAppealModalVisible(false);
      setSelectedPenalty(null);
      appealForm.resetFields();
    } catch (error) {
      console.error('Error creating appeal:', error);
      message.error(error?.response?.data?.message || 'Không thể gửi kháng cáo. Vui lòng thử lại.');
    }
  };

  // Check if penalty already has an appeal
  const hasAppeal = (penalty) => {
    const penaltyId = penalty.penaltyId || penalty.id;
    return phaseAppeals.some(appeal => {
      const appealPenaltyId = appeal.adjustmentId || appeal.penaltyId;
      return appealPenaltyId && Number(appealPenaltyId) === Number(penaltyId);
    });
  };

  if (!phase) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert
          message="Không tìm thấy phase"
          description="Phase này không tồn tại hoặc đã bị xóa."
          type="warning"
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className="text-muted-foreground hover:text-primary"
        >
          Quay lại Hackathon
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <PhaseInfoCard 
            phase={phase} 
            phaseStatus={phaseStatus} 
            hackathon={hackathon} 
          />

          {/* Only show track selection for phase 1 */}
          {showTrackSelection && (
            <TracksSelection
              tracks={tracks}
              isLoading={tracksLoading}
              selectedTrackId={selectedTrackId}
              onTrackSelect={handleTrackSelect}
              form={form}
              onFinish={handleSelectTrack}
              phaseId={phaseId}
            />
          )}

          {/* Submission, Penalty and Appeal Tabs */}
          <Card className="bg-card-background border border-card-border backdrop-blur-xl">
            <Tabs
              defaultActiveKey="submission"
              items={[
                {
                  key: 'submission',
                  label: (
                    <span className="flex items-center gap-2">
                      <UploadOutlined />
                      Nộp bài
                    </span>
                  ),
                  children: (
                    <SubmissionSection
                      teamId={teamId}
                      phaseId={phaseId}
                      selectedTrack={selectedTrack}
                      isLeader={isLeader}
                      userInfo={userInfo}
                    />
                  ),
                },
                {
                  key: 'penalties',
                  label: (
                    <span className="flex items-center gap-2">
                      <ExclamationCircleOutlined />
                      Lịch sử Penalty
                    </span>
                  ),
                  children: (
                    <div>
                      {penaltiesLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Spin size="large" />
                        </div>
                      ) : penalties.length > 0 ? (
                        <div className="space-y-3">
                          {penalties.map((penalty) => {
                            const penaltyHasAppeal = hasAppeal(penalty);
                            return (
                              <div
                                key={penalty.penaltyId || penalty.id}
                                className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-red-400 font-semibold text-sm">
                                        {penalty.type === 'late_submission' && 'Nộp bài muộn'}
                                        {penalty.type === 'rule_violation' && 'Vi phạm quy tắc'}
                                        {penalty.type === 'abandonment' && 'Bỏ thi giữa chừng'}
                                        {!penalty.type && 'Penalty'}
                                      </span>
                                      <Tag color="red" size="small">
                                        -{Math.abs(penalty.points || penalty.penaltyPoints || 0)} điểm
                                      </Tag>
                                      {penaltyHasAppeal && (
                                        <Tag color="blue" size="small">
                                          Đã kháng cáo
                                        </Tag>
                                      )}
                                    </div>
                                    {penalty.reason && (
                                      <p className="text-text-secondary text-sm mb-2">
                                        {penalty.reason}
                                      </p>
                                    )}
                                    {penalty.createdAt && (
                                      <p className="text-muted-foreground text-xs">
                                        {new Date(penalty.createdAt).toLocaleDateString('vi-VN', {
                                          day: '2-digit',
                                          month: '2-digit',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        })}
                                      </p>
                                    )}
                                  </div>
                                  {isLeader && !penaltyHasAppeal && (
                                    <Button
                                      type="primary"
                                      size="small"
                                      icon={<SendOutlined />}
                                      onClick={() => handleOpenAppealModal(penalty)}
                                      className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 border-0 ml-2"
                                    >
                                      Kháng cáo
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <ExclamationCircleOutlined className="text-4xl mb-2 opacity-50" />
                          <p className="text-sm">Không có penalty nào</p>
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  key: 'appeals',
                  label: (
                    <span className="flex items-center gap-2">
                      <FileTextOutlined />
                      Lịch sử Appeal
                    </span>
                  ),
                  children: (
                    <div>
                      {appealsLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Spin size="large" />
                        </div>
                      ) : phaseAppeals.length > 0 ? (
                        <div className="space-y-3">
                          {phaseAppeals.map((appeal) => (
                            <div
                              key={appeal.appealId || appeal.id}
                              className={`p-3 rounded-lg border ${
                                appeal.status === 'Approved'
                                  ? 'bg-green-500/10 border-green-500/20'
                                  : appeal.status === 'Rejected'
                                    ? 'bg-red-500/10 border-red-500/20'
                                    : 'bg-yellow-500/10 border-yellow-500/20'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`font-semibold text-sm ${
                                      appeal.status === 'Approved'
                                        ? 'text-green-400'
                                        : appeal.status === 'Rejected'
                                          ? 'text-red-400'
                                          : 'text-yellow-400'
                                    }`}>
                                      {appeal.appealType || 'Appeal'}
                                    </span>
                                    <Tag 
                                      color={
                                        appeal.status === 'Approved' 
                                          ? 'green' 
                                          : appeal.status === 'Rejected' 
                                            ? 'red' 
                                            : 'orange'
                                      } 
                                      size="small"
                                    >
                                      {appeal.status === 'Approved' && 'Đã chấp nhận'}
                                      {appeal.status === 'Rejected' && 'Đã từ chối'}
                                      {appeal.status === 'Pending' && 'Đang chờ'}
                                      {!appeal.status && 'Chưa xử lý'}
                                    </Tag>
                                  </div>
                                  {appeal.reason && (
                                    <p className="text-text-secondary text-sm mb-1">
                                      <span className="font-medium">Lý do:</span> {appeal.reason}
                                    </p>
                                  )}
                                  {appeal.message && (
                                    <p className="text-text-secondary text-sm mb-1">
                                      <span className="font-medium">Nội dung:</span> {appeal.message}
                                    </p>
                                  )}
                                  {appeal.adminResponse && (
                                    <p className="text-text-secondary text-sm mb-1">
                                      <span className="font-medium">Phản hồi:</span> {appeal.adminResponse}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-4 mt-2">
                                    {appeal.createdAt && (
                                      <p className="text-muted-foreground text-xs">
                                        Tạo: {new Date(appeal.createdAt).toLocaleDateString('vi-VN', {
                                          day: '2-digit',
                                          month: '2-digit',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        })}
                                      </p>
                                    )}
                                    {appeal.reviewedAt && (
                                      <p className="text-muted-foreground text-xs">
                                        Xử lý: {new Date(appeal.reviewedAt).toLocaleDateString('vi-VN', {
                                          day: '2-digit',
                                          month: '2-digit',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        })}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileTextOutlined className="text-4xl mb-2 opacity-50" />
                          <p className="text-sm">Không có appeal nào</p>
                        </div>
                      )}
                    </div>
                  ),
                },
              ]}
              className="[&_.ant-tabs-tab]:text-text-secondary [&_.ant-tabs-tab-active]:text-text-primary [&_.ant-tabs-ink-bar]:bg-primary"
            />
          </Card>

          {/* Groups Section - Phase 1 */}
          {isPhase1 && (
            <Card className="bg-card-background border border-card-border backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Các bảng đấu
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
                      className="p-4 bg-card-background/50 rounded-lg border border-card-border/50 hover:border-primary/50 transition-colors"
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

          {/* Qualified Teams Section - Phase 2 */}
          {isPhase2 && (
            <Card className="bg-card-background border border-card-border backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Danh sách đội vào Phase 2 (8 đội)
              </h3>
              {qualifiedLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Spin size="large" />
                </div>
              ) : qualifiedTeams && qualifiedTeams.length > 0 ? (
                <Table
                  dataSource={qualifiedTeams}
                  rowKey={(record) => record.teamId || record.id}
                  pagination={false}
                  columns={[
                    {
                      title: 'STT',
                      key: 'index',
                      width: 60,
                      render: (_, __, index) => index + 1,
                    },
                    {
                      title: 'Tên đội',
                      dataIndex: 'teamName',
                      key: 'teamName',
                    },
                    {
                      title: 'Bảng',
                      dataIndex: 'groupName',
                      key: 'groupName',
                      render: (groupName) => groupName ? <Tag color="blue">{groupName}</Tag> : '-',
                    },
                    {
                      title: 'Track',
                      dataIndex: 'trackName',
                      key: 'trackName',
                      render: (trackName) => trackName ? <Tag>{trackName}</Tag> : '-',
                    },
                  ]}
                  className="[&_.ant-table]:bg-transparent [&_th]:!bg-card-background [&_th]:!text-text-primary [&_td]:!text-text-secondary [&_td]:border-card-border [&_th]:border-card-border"
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TrophyOutlined className="text-4xl mb-2 opacity-50" />
                  <p>Chưa có đội nào được qualify vào Phase 2</p>
                </div>
              )}
            </Card>
          )}

          {/* Ranking Section - Phase 2 Completed */}
          {isPhase2 && isPhaseCompleted && (
            <Card className="bg-card-background border border-card-border backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Bảng xếp hạng Phase 2
              </h3>
              {rankingLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Spin size="large" />
                </div>
              ) : phase2Ranking && phase2Ranking.length > 0 ? (
                <Table
                  dataSource={phase2Ranking}
                  rowKey={(record) => record.teamId || record.id || record.rank}
                  pagination={false}
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
                      title: 'Điểm',
                      dataIndex: 'score',
                      key: 'score',
                      render: (score) => <span className="text-primary font-semibold">{score}/100</span>,
                    },
                  ]}
                  className="[&_.ant-table]:bg-transparent [&_th]:!bg-card-background [&_th]:!text-text-primary [&_td]:!text-text-secondary [&_td]:border-card-border [&_th]:border-card-border"
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TrophyOutlined className="text-4xl mb-2 opacity-50" />
                  <p>Chưa có bảng xếp hạng</p>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <PhaseInfoSidebar
            phaseStatus={phaseStatus}
            tracksCount={tracks.length}
            selectedTrack={selectedTrack}
            registration={registration}
            phaseId={phaseId}
          />
        </div>
      </div>

      {/* Appeal Modal */}
      <Modal
        title="Kháng cáo Penalty"
        open={appealModalVisible}
        onOk={() => appealForm.submit()}
        onCancel={() => {
          setAppealModalVisible(false);
          setSelectedPenalty(null);
          appealForm.resetFields();
        }}
        okText="Gửi kháng cáo"
        cancelText="Hủy"
        okButtonProps={{
          loading: createAppealMutation.isPending,
          className: 'bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white border-0',
        }}
        width={600}
        className="[&_.ant-modal-content]:bg-gray-900/95 [&_.ant-modal-content]:backdrop-blur-xl [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white [&_.ant-modal-mask]:bg-black/50"
      >
        {selectedPenalty && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-400 font-semibold">
                {selectedPenalty.type === 'late_submission' && 'Nộp bài muộn'}
                {selectedPenalty.type === 'rule_violation' && 'Vi phạm quy tắc'}
                {selectedPenalty.type === 'abandonment' && 'Bỏ thi giữa chừng'}
                {!selectedPenalty.type && 'Penalty'}
              </span>
              <Tag color="red" size="small">
                -{Math.abs(selectedPenalty.points || selectedPenalty.penaltyPoints || 0)} điểm
              </Tag>
            </div>
            {selectedPenalty.reason && (
              <p className="text-text-secondary text-sm">
                <span className="font-medium">Lý do penalty:</span> {selectedPenalty.reason}
              </p>
            )}
          </div>
        )}
        
        <Form
          form={appealForm}
          layout="vertical"
          onFinish={handleCreateAppeal}
          className="[&_.ant-form-item-label>label]:text-text-primary [&_.ant-input]:bg-white/5 [&_.ant-input]:border-white/10 [&_.ant-input]:text-white [&_.ant-input]:placeholder:text-gray-500 [&_.ant-textarea]:bg-white/5 [&_.ant-textarea]:border-white/10 [&_.ant-textarea]:text-white"
        >
          <Form.Item
            name="reason"
            label="Lý do kháng cáo"
            rules={[{ required: true, message: 'Vui lòng nhập lý do kháng cáo' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Nhập lý do kháng cáo..."
              className="bg-white/5 border-white/10 text-white"
            />
          </Form.Item>
          
          <Form.Item
            name="message"
            label="Nội dung chi tiết (tùy chọn)"
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập nội dung chi tiết về kháng cáo..."
              className="bg-white/5 border-white/10 text-white"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentPhaseDetail;

