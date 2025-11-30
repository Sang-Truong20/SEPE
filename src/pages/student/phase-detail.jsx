import { ArrowLeftOutlined } from '@ant-design/icons';
import { Alert, Button, Form } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  PhaseInfoCard, 
  TracksSelection, 
  PhaseInfoSidebar,
  getPhaseStatus 
} from '../../components/features/student/phase-detail';
import { useGetHackathon } from '../../hooks/student/hackathon';
import { useGetHackathonPhases } from '../../hooks/student/hackathon-phase';
import { useGetTeamHackathonRegistration } from '../../hooks/student/hackathon-registration';
import { useGetTeams } from '../../hooks/student/team';
import { useSelectTeamTrack } from '../../hooks/student/team-track';
import { useGetTracks } from '../../hooks/student/track';
import { useUserData } from '../../hooks/useUserData';

const StudentPhaseDetail = () => {
  const navigate = useNavigate();
  const { phaseId, hackathonId } = useParams();
  
  const { userInfo } = useUserData();
  const { data: teamsData } = useGetTeams();
  const { data: hackathon } = useGetHackathon(hackathonId);
  const { data: phases = [] } = useGetHackathonPhases(hackathonId);
  const phase = phases.find(p => p.phaseId === parseInt(phaseId));
  
  // Get user's team
  const userTeam = teamsData && Array.isArray(teamsData) 
    ? teamsData.find(t => t.leaderId === (userInfo?.id || userInfo?.userId))
    : null;
  const teamId = userTeam?.id || 'team-1';
  
  const { data: registration } = useGetTeamHackathonRegistration(hackathonId);
  const { data: allTracks = [], isLoading: tracksLoading } = useGetTracks();
  // Filter tracks by phaseId - ensure both are numbers for comparison
  const currentPhaseId = parseInt(phaseId);
  const tracks = allTracks.filter(track => {
    const trackPhaseId = typeof track.phaseId === 'string' ? parseInt(track.phaseId) : track.phaseId;
    return trackPhaseId === currentPhaseId;
  });
  const selectTeamTrackMutation = useSelectTeamTrack();
  
  const [form] = Form.useForm();
  const [selectedTrackId, setSelectedTrackId] = React.useState(null);

  const phaseStatus = phase ? getPhaseStatus(phase) : null;

  const handleBack = () => {
    navigate(`/student/hackathons/${hackathonId}`);
  };

  // Set form initial value when registration data is loaded
  useEffect(() => {
    if (registration?.selectedTrackId && phaseId && parseInt(phaseId) === registration?.selectedPhaseId) {
      const trackId = registration.selectedTrackId;
      form.setFieldsValue({ trackId });
      setSelectedTrackId(trackId);
    }
  }, [registration, phaseId, form]);

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

          <TracksSelection
            tracks={tracks}
            isLoading={tracksLoading}
            selectedTrackId={selectedTrackId}
            onTrackSelect={handleTrackSelect}
            form={form}
            onFinish={handleSelectTrack}
            phaseId={phaseId}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <PhaseInfoSidebar
            phaseStatus={phaseStatus}
            tracksCount={tracks.length}
            selectedTrack={tracks.find(t => t.trackId === registration?.selectedTrackId)}
            registration={registration}
            phaseId={phaseId}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentPhaseDetail;

