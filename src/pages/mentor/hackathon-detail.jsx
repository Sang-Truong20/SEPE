import {
  TeamOutlined,
  SearchOutlined,
  MessageOutlined,
  TrophyOutlined,
  CalendarOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Input, Tag, Avatar, Spin, Empty, Badge, Row, Col, Divider } from 'antd';
import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_NAME } from '../../constants';
import { useGetHackathon } from '../../hooks/student/hackathon';
import { useGetMentorTeamsByHackathon } from '../../hooks/mentor/useMentorTeamsByHackathon';
import { useUserData } from '../../hooks/useUserData';
import TeamChatModal from '../../components/features/mentor/TeamChatModal';

const MentorHackathonDetail = () => {
  const navigate = useNavigate();
  const { hackathonId } = useParams();
  const [teamSearchQuery, setTeamSearchQuery] = useState('');
  const [chatTeamId, setChatTeamId] = useState(null);
  const { userInfo } = useUserData();

  const currentMentorId = userInfo?.id || userInfo?.userId || null;

  const { data: hackathonData, isLoading: hackathonLoading } = useGetHackathon(hackathonId);
  const {
    data: teamsData,
    isLoading: teamsLoading,
  } = useGetMentorTeamsByHackathon(currentMentorId, hackathonId);

  // Filter teams by search query
  const filteredTeams = useMemo(() => {
    if (!teamsData) return [];
    const teams = Array.isArray(teamsData) ? teamsData : teamsData?.data || [];
    if (!teamSearchQuery) return teams;
    const query = teamSearchQuery.toLowerCase();
    return teams.filter(
      (team) =>
        team.name?.toLowerCase().includes(query) ||
        team.teamName?.toLowerCase().includes(query) ||
        team.description?.toLowerCase().includes(query),
    );
  }, [teamsData, teamSearchQuery]);

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

  const handleOpenChat = (teamId) => {
    setChatTeamId(teamId);
  };

  const handleCloseChat = () => {
    setChatTeamId(null);
  };

  if (hackathonLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (!hackathonData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-0 bg-white/5 backdrop-blur-xl">
          <Empty description="Không tìm thấy hackathon" />
        </Card>
      </div>
    );
  }

  const hackathon = Array.isArray(hackathonData)
    ? hackathonData[0]
    : hackathonData?.data || hackathonData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Button */}
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(PATH_NAME.MENTOR_HACKATHONS)}
        className="mb-4"
      >
        Quay lại danh sách Hackathon
      </Button>

      {/* Hackathon Header */}
      <Card className="border-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border-green-500/30 shadow-lg">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <TrophyOutlined className="text-3xl text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl text-white font-bold">
                    {hackathon.name || hackathon.title}
                  </h1>
                  {getStatusBadge(hackathon.status)}
                </div>
                {hackathon.description && (
                  <p className="text-gray-300 text-base mt-2">{hackathon.description}</p>
                )}
              </div>
            </div>
          </Col>
          <Col xs={24} lg={8}>
            <div className="space-y-3">
              {hackathon.startDate && (
                <div className="flex items-center gap-2 text-gray-300">
                  <CalendarOutlined className="text-green-400" />
                  <span>Bắt đầu: {formatDate(hackathon.startDate)}</span>
                </div>
              )}
              {hackathon.endDate && (
                <div className="flex items-center gap-2 text-gray-300">
                  <CalendarOutlined className="text-green-400" />
                  <span>Kết thúc: {formatDate(hackathon.endDate)}</span>
                </div>
              )}
              {hackathon.participantCount !== undefined && (
                <div className="flex items-center gap-2 text-gray-300">
                  <UserOutlined className="text-green-400" />
                  <span>{hackathon.participantCount} người tham gia</span>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Card>

      {/* Teams Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-white font-semibold">Teams bạn đang quản lý</h2>
            <p className="text-gray-400 mt-1">
              {filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''} trong hackathon này
            </p>
          </div>
        </div>

        {/* Team Search */}
        <Card className="border-0 bg-white/5 backdrop-blur-xl">
          <Input
            placeholder="Tìm kiếm team theo tên hoặc mô tả..."
            prefix={<SearchOutlined className="text-green-400" />}
            value={teamSearchQuery}
            onChange={(e) => setTeamSearchQuery(e.target.value)}
            className="bg-white/10 border-white/20 hover:border-green-400/50 focus:border-green-400 transition-all"
            size="large"
            allowClear
          />
        </Card>

        {/* Teams Grid */}
        {teamsLoading ? (
          <Card className="border-0 bg-white/5 backdrop-blur-xl">
            <div className="flex justify-center py-8">
              <Spin size="large" />
            </div>
          </Card>
        ) : filteredTeams.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTeams.map((team, index) => (
              <Card
                key={team.id}
                className="border-0 bg-gradient-to-br from-white/5 to-white/5 backdrop-blur-xl hover:from-white/10 hover:to-green-500/10 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
                style={{
                  animation: `fadeIn 0.3s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl text-white">{team.name || team.teamName}</h3>
                      <CheckCircleOutlined className="text-green-400" />
                    </div>
                    <p className="text-gray-400 text-sm">
                      {team.description || 'Không có mô tả'}
                    </p>
                  </div>
                </div>

                {/* Team Members */}
                {team.members && team.members.length > 0 && (
                  <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-300">
                        Thành viên ({team.members.length})
                      </span>
                      <Badge
                        count={team.members.length}
                        showZero
                        className="bg-green-500/20 text-green-400"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {team.members.slice(0, 5).map((member, idx) => (
                          <Avatar
                            key={member.id || idx}
                            size="default"
                            className="border-2 border-white/30 hover:border-green-400 transition-all cursor-pointer"
                            title={member.name || member.fullName}
                          >
                            {(member.name || member.fullName || '?')
                              .charAt(0)
                              .toUpperCase()}
                          </Avatar>
                        ))}
                        {team.members.length > 5 && (
                          <Avatar
                            size="default"
                            className="border-2 border-white/30 bg-green-500/20 text-green-400"
                          >
                            +{team.members.length - 5}
                          </Avatar>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      {team.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 text-sm text-gray-400"
                        >
                          <span className="w-2 h-2 rounded-full bg-green-400"></span>
                          <span>
                            {member.name || member.fullName}
                            {member.role === 'leader' && (
                              <Tag color="gold" className="ml-2">
                                Leader
                              </Tag>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat Button */}
                <Button
                  type="primary"
                  icon={<MessageOutlined />}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 border-0 hover:from-green-500 hover:to-emerald-500 shadow-lg hover:shadow-green-500/50 transition-all"
                  onClick={() => handleOpenChat(team.id)}
                  size="large"
                >
                  💬 Chat với Team
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 bg-white/5 backdrop-blur-xl">
            <div className="p-12 text-center">
              <TeamOutlined className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">
                {teamSearchQuery
                  ? 'Không tìm thấy team nào phù hợp'
                  : 'Bạn chưa quản lý team nào trong hackathon này'}
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Chat Modal */}
      {chatTeamId && (
        <TeamChatModal
          teamId={chatTeamId}
          visible={!!chatTeamId}
          onClose={handleCloseChat}
          teamData={filteredTeams.find((t) => t.id === chatTeamId)}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default MentorHackathonDetail;

