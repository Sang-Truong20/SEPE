import { ArrowLeftOutlined, ExclamationCircleOutlined, FileTextOutlined, UploadOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Form, Tabs, message } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  PhaseInfoCard,
  TracksSelection,
  PhaseInfoSidebar,
  SubmissionSection,
  PenaltiesTab,
  AppealsTab,
  GroupsSection,
  QualifiedTeamsSection,
  RankingSection,
  ScoresSection,
  GroupTeamsModal,
  PenaltyAppealModal,
  ScoreAppealModal,
  getPhaseStatus
} from '../../components/features/student/phase-detail';
import { useGetHackathon } from '../../hooks/student/hackathon';
import { useGetHackathonPhases } from '../../hooks/student/hackathon-phase';
import { useGetMyHackathonRegistrations } from '../../hooks/student/hackathon-registration';
import { useGetTeams, useGetMyTeams } from '../../hooks/student/team';
import { useCreateAppeal } from '../../hooks/student/appeal';
import { useGetTeamMembers } from '../../hooks/student/team-member';
import { useSelectTeamTrack } from '../../hooks/student/team-track';
import { useGetTracksByPhase } from '../../hooks/student/track';
import { useGetGroupTeams } from '../../hooks/student/group';
import { useUserData } from '../../hooks/useUserData';

const StudentPhaseDetail = () => {
  const navigate = useNavigate();
  const { phaseId, hackathonId } = useParams();

  const { userInfo } = useUserData();
  const { data: teamsData } = useGetTeams();
  const { data: myTeamsData, isLoading: myTeamsLoading } = useGetMyTeams();
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
      // Handle different response structures
      let myTeams = [];
      if (Array.isArray(myTeamsData)) {
        myTeams = myTeamsData;
      } else if (Array.isArray(myTeamsData?.data)) {
        myTeams = myTeamsData.data;
      } else if (Array.isArray(myTeamsData?.teams)) {
        myTeams = myTeamsData.teams;
      }

      // Debug: log teams and hackathonId for troubleshooting
      if (myTeams.length > 0) {
        console.log('[PhaseDetail] My teams:', myTeams);
        console.log('[PhaseDetail] Looking for hackathonId:', hackathonId);
      }

      // Find team that matches current hackathon
      const matchedTeam = myTeams.find(team => {
        const teamHackathonId = team.hackathonId || team.hackathon?.hackathonId || team.hackathon?.id;
        const matches = teamHackathonId && Number(teamHackathonId) === Number(hackathonId);
        if (matches) {
          console.log('[PhaseDetail] Found matching team:', team);
        }
        return matches;
      });

      if (matchedTeam) {
        const foundTeamId = matchedTeam.teamId || matchedTeam.id || null;
        console.log('[PhaseDetail] Using teamId from my-teams:', foundTeamId);
        return foundTeamId;
      } else if (myTeams.length > 0) {
        console.warn('[PhaseDetail] No team found for hackathonId:', hackathonId, 'Available teams:', myTeams.map(t => ({ teamId: t.teamId || t.id, hackathonId: t.hackathonId })));
      }
    }

    // Try to get teamId from myRegistration
    if (myRegistration?.teamId) {
      console.log('[PhaseDetail] Using teamId from registration:', myRegistration.teamId);
      return myRegistration.teamId;
    }
    if (myRegistration?.team?.teamId) {
      console.log('[PhaseDetail] Using teamId from registration.team:', myRegistration.team.teamId);
      return myRegistration.team.teamId;
    }
    if (myRegistration?.team?.id) {
      console.log('[PhaseDetail] Using teamId from registration.team.id:', myRegistration.team.id);
      return myRegistration.team.id;
    }

    // Fallback: try to find from teamsData
    if (teamsData && Array.isArray(teamsData)) {
      const userTeam = teamsData.find(t => t.leaderId === (userInfo?.id || userInfo?.userId));
      if (userTeam) {
        console.log('[PhaseDetail] Using teamId from teamsData:', userTeam.teamId || userTeam.id);
        return userTeam.teamId || userTeam.id || null;
      }
    }

    console.error('[PhaseDetail] No teamId found. myTeamsData:', myTeamsData, 'hackathonId:', hackathonId, 'myRegistration:', myRegistration);
    return null;
  }, [myTeamsData, hackathonId, myRegistration, teamsData, userInfo]);


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

  // Check if user has joined hackathon (has team for this hackathon)
  const hasJoinedHackathon = React.useMemo(() => {
    return !!(teamId || myRegistration);
  }, [teamId, myRegistration]);

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
  const [scoreAppealModalVisible, setScoreAppealModalVisible] = React.useState(false);
  const [selectedCriteriaScore, setSelectedCriteriaScore] = React.useState(null);
  const [scoreAppealForm] = Form.useForm();
  const [groupModalVisible, setGroupModalVisible] = React.useState(false);
  const [selectedGroupId, setSelectedGroupId] = React.useState(null);

  const createAppealMutation = useCreateAppeal();

  const phaseStatus = phase ? getPhaseStatus(phase) : null;
  const isPhaseCompleted = phaseStatus === 'completed';


  // Get teams for selected group
  const { data: groupTeamsData = [], isLoading: groupTeamsLoading } = useGetGroupTeams(
    selectedGroupId,
    { enabled: !!selectedGroupId && groupModalVisible }
  );

  const groupTeams = Array.isArray(groupTeamsData)
    ? groupTeamsData
    : Array.isArray(groupTeamsData?.data)
      ? groupTeamsData.data
      : [];



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

    // Get judgeId from penalty (createdBy is the admin/judge who created the penalty)
    const judgeId = selectedPenalty.createdBy || selectedPenalty.judgeId;
    if (!judgeId) {
      message.error('Không tìm thấy thông tin người tạo penalty');
      return;
    }

    try {
      await createAppealMutation.mutateAsync({
        appealType: 'Penalty',
        adjustmentId: selectedPenalty.penaltyId || selectedPenalty.id || selectedPenalty.adjustmentId,
        teamId: teamId,
        judgeId: judgeId,
        message: values.message,
        reason: values.reason,
        // Do NOT send submissionId for Penalty appeals
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

  const handleGroupClick = (group) => {
    setSelectedGroupId(group.groupId);
    setGroupModalVisible(true);
  };

  const handleCloseGroupModal = () => {
    setGroupModalVisible(false);
    setSelectedGroupId(null);
  };



  const handleOpenScoreAppealModal = (criteriaScore) => {
    setSelectedCriteriaScore(criteriaScore);
    scoreAppealForm.resetFields();
    scoreAppealForm.setFieldsValue({
      reason: '',
      message: '',
    });
    setScoreAppealModalVisible(true);
  };

  const handleCreateScoreAppeal = async (values, scoreData) => {
    if (!selectedCriteriaScore || !teamId) {
      message.error('Thiếu thông tin để tạo phúc khảo');
      return;
    }

    // Get submissionId from scores data passed from modal
    const submissionId = scoreData?.submissionId || scoreData?.teamOverviewData?.submissionId;
    if (!submissionId) {
      message.error('Không tìm thấy thông tin submission');
      return;
    }

    // Get judgeId from score data (check criteriaScore or scores structure)
    const judgeId = selectedCriteriaScore.judgeId || scoreData?.judgeId || scoreData?.teamOverviewData?.judgeId;
    if (!judgeId) {
      message.error('Không tìm thấy thông tin giám khảo');
      return;
    }

    try {
      await createAppealMutation.mutateAsync({
        appealType: 'Score',
        // Do NOT send adjustmentId for Score appeals
        teamId: teamId,
        submissionId: submissionId,
        judgeId: judgeId,
        message: values.message,
        reason: values.reason,
      });

      message.success('Gửi phúc khảo điểm thành công!');
      setScoreAppealModalVisible(false);
      setSelectedCriteriaScore(null);
      scoreAppealForm.resetFields();
    } catch (error) {
      console.error('Error creating score appeal:', error);
      message.error(error?.response?.data?.message || 'Không thể gửi phúc khảo. Vui lòng thử lại.');
    }
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
            <>
              {!myTeamsLoading && !hasJoinedHackathon && (
                <Card className="bg-card-background border border-card-border backdrop-blur-xl mb-6">
                  <Alert
                    message="Bạn cần tham gia hackathon để có thể chọn track"
                    description="Vui lòng tham gia hoặc tạo team cho hackathon này trước khi chọn track."
                    type="warning"
                    showIcon
                  />
                </Card>
              )}
              {hasJoinedHackathon && (
                <TracksSelection
                  tracks={tracks}
                  isLoading={tracksLoading}
                  selectedTrackId={selectedTrackId}
                  onTrackSelect={handleTrackSelect}
                  form={form}
                  onFinish={handleSelectTrack}
                  phaseId={phaseId}
                  teamId={teamId}
                  registeredTrackId={registration?.selectedTrackId} // Track đã được chọn từ API
                />
              )}
            </>
          )}

          {/* Submission, Penalty and Appeal Tabs */}
          {hasJoinedHackathon ? (
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
                    <PenaltiesTab
                      teamId={teamId}
                      isLeader={isLeader}
                      onOpenAppealModal={handleOpenAppealModal}
                    />
                  ),
                },
                {
                  key: 'appeals',
                  label: (
                    <span className="flex items-center gap-2">
                      <FileTextOutlined />
                      Lịch sử phúc khảo
                    </span>
                  ),
                  children: (
                    <AppealsTab
                      teamId={teamId}
                    />
                  ),
                },
                ]}
                className="[&_.ant-tabs-tab]:text-text-secondary [&_.ant-tabs-tab-active]:text-text-primary [&_.ant-tabs-ink-bar]:bg-primary"
              />
            </Card>
          ) : (
            <Card className="bg-card-background border border-card-border backdrop-blur-xl">
              <Alert
                message="Bạn cần tham gia hackathon để có thể nộp bài"
                description={
                  <div>
                    <p>Bạn cần tham gia hoặc tạo team cho hackathon này trước khi có thể nộp bài, xem penalty và appeal.</p>
                    <p className="mt-2 text-sm">
                      {!myTeamsLoading && myTeamsData && Array.isArray(myTeamsData) && myTeamsData.length > 0 ? (
                        <>Bạn có {myTeamsData.length} team(s), nhưng không có team nào thuộc hackathon {hackathonId}.</>
                      ) : (
                        <>Bạn chưa có team nào. Vui lòng tham gia hoặc tạo team trước.</>
                      )}
                    </p>
                  </div>
                }
                type="warning"
                showIcon
              />
            </Card>
          )}

          {/* Groups Section - Phase 1 */}
          {isPhase1 && (
            <GroupsSection
              onGroupClick={handleGroupClick}
            />
          )}

          {/* Qualified Teams Section - Phase 2 */}
          {isPhase2 && (
            <QualifiedTeamsSection />
          )}

          {/* Ranking Section - Phase 2 Completed */}
          {isPhase2 && isPhaseCompleted && (
            <RankingSection />
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

          {/* Scores Section */}
          {hasJoinedHackathon && (
            <ScoresSection
              teamId={teamId}
              hasJoinedHackathon={hasJoinedHackathon}
              isLeader={isLeader}
              onOpenScoreAppealModal={handleOpenScoreAppealModal}
            />
          )}
        </div>
      </div>

      {/* Group Teams Modal */}
      <GroupTeamsModal
        visible={groupModalVisible}
        onClose={handleCloseGroupModal}
        groupTeams={groupTeams}
        loading={groupTeamsLoading}
      />

      {/* Appeal Modal */}
      <PenaltyAppealModal
        visible={appealModalVisible}
        onClose={() => {
          setAppealModalVisible(false);
          setSelectedPenalty(null);
          appealForm.resetFields();
        }}
        onSubmit={handleCreateAppeal}
        selectedPenalty={selectedPenalty}
        form={appealForm}
        loading={createAppealMutation.isPending}
      />

      {/* Score Appeal Modal */}
      <ScoreAppealModal
        visible={scoreAppealModalVisible}
        onClose={() => {
          setScoreAppealModalVisible(false);
          setSelectedCriteriaScore(null);
          scoreAppealForm.resetFields();
        }}
        onSubmit={handleCreateScoreAppeal}
        selectedCriteriaScore={selectedCriteriaScore}
        form={scoreAppealForm}
        loading={createAppealMutation.isPending}
        teamId={teamId}
        hasJoinedHackathon={hasJoinedHackathon}
      />
    </div>
  );
};

export default StudentPhaseDetail;

