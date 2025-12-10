import { ArrowLeftOutlined, CalendarOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Form, Spin, Table, Tag } from 'antd';
import React, { useEffect, useMemo } from 'react';
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
import { useGetHackathonRanking, useGetTrackRanking } from '../../hooks/student/team-ranking';
import { useGetTeams } from '../../hooks/student/team';
import { useGetTeamMembers } from '../../hooks/student/team-member';
import { useSelectTeamTrack } from '../../hooks/student/team-track';
import { useGetTracksByPhase } from '../../hooks/student/track';
import { useUserData } from '../../hooks/useUserData';

const StudentPhaseDetail = () => {
  const navigate = useNavigate();
  const { phaseId, hackathonId } = useParams();
  
  const { userInfo } = useUserData();
  const { data: teamsData } = useGetTeams();
  const { data: hackathon } = useGetHackathon(hackathonId);
  const { data: phases = [] } = useGetHackathonPhases(hackathonId);
  const phase = phases.find(p => p.phaseId === parseInt(phaseId));
  const phaseIndex = phases.findIndex(p => p.phaseId === parseInt(phaseId));
  const phaseNumber = phase?.phaseNumber || (phaseIndex + 1);
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
  
  // Get teamId from registration
  const teamId = React.useMemo(() => {
    // Try to get teamId from myRegistration first
    if (myRegistration?.teamId) return myRegistration.teamId;
    if (myRegistration?.team?.teamId) return myRegistration.team.teamId;
    if (myRegistration?.team?.id) return myRegistration.team.id;
    
    // Fallback: try to find from teamsData
    const userTeam = teamsData && Array.isArray(teamsData) 
      ? teamsData.find(t => t.leaderId === (userInfo?.id || userInfo?.userId))
      : null;
    
    return userTeam?.teamId || userTeam?.id || null;
  }, [myRegistration, teamsData, userInfo]);
  
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

          <SubmissionSection
            teamId={teamId}
            phaseId={phaseId}
            selectedTrack={selectedTrack}
            isLeader={isLeader}
            userInfo={userInfo}
          />

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
    </div>
  );
};

export default StudentPhaseDetail;

