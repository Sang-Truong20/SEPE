import { useState, useMemo } from 'react';
import {
  TeamOutlined,
  SearchOutlined,
  TrophyOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LineChartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import {
  Card,
  Button,
  Input,
  Select,
  Badge,
  Tag,
  Avatar,
  Space,
  Modal,
  Spin,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../../constants';
import { useGetChapterTeams } from '../../../hooks/chapter/useChapterTeams';

const ChapterTeamsList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterHackathon, setFilterHackathon] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: teamsData, isLoading } = useGetChapterTeams();
  
  // Get teams from API
  const mockTeams = useMemo(() => {
    if (!teamsData) return [];
    return Array.isArray(teamsData) ? teamsData : teamsData?.data || [];
  }, [teamsData]);

  const hackathons = Array.from(new Set(mockTeams.map((t) => t.hackathon)));

  const filteredTeams = mockTeams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.leader.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || team.status === filterStatus;
    const matchesHackathon =
      filterHackathon === 'all' || team.hackathon === filterHackathon;
    return matchesSearch && matchesStatus && matchesHackathon;
  });

  const stats = {
    total: mockTeams.length,
    active: mockTeams.filter((t) => t.status === 'active').length,
    ongoing: mockTeams.filter((t) => t.hackathonStatus === 'ongoing').length,
    completed: mockTeams.filter((t) => t.hackathonStatus === 'completed').length,
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge status="success" text="Đang hoạt động" style={{ color: '#10b981' }} />;
      case 'pending':
        return <Badge status="processing" text="Chờ duyệt" style={{ color: '#fbbf24' }} />;
      case 'disqualified':
        return <Badge status="error" text="Bị loại" style={{ color: '#ef4444' }} />;
      default:
        return null;
    }
  };

  const getHackathonStatusBadge = (status) => {
    switch (status) {
      case 'ongoing':
        return <Badge status="processing" text="Đang diễn ra" style={{ color: '#06b6d4' }} />;
      case 'upcoming':
        return <Badge status="default" text="Sắp tới" style={{ color: '#3b82f6' }} />;
      case 'completed':
        return <Badge status="default" text="Đã kết thúc" style={{ color: '#6b7280' }} />;
      default:
        return null;
    }
  };

  const showTeamDetail = (team) => {
    setSelectedTeam(team);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedTeam(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 pb-24 space-y-6">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(PATH_NAME.CHAPTER_DASHBOARD)}
        className="mb-4 text-gray-400 hover:text-white border-gray-600"
      >
        Quay lại
      </Button>

      <div>
        <h1 className="text-4xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Quản lý Team Trường
        </h1>
        <p className="text-gray-400 text-lg mt-2">
          Theo dõi và quản lý các đội thi từ FPT University - Ho Chi Minh
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center">
              <TeamOutlined className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl text-white">{stats.total}</p>
              <p className="text-sm text-gray-400">Tổng số đội</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center">
              <CheckCircleOutlined className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl text-white">{stats.active}</p>
              <p className="text-sm text-gray-400">Đang hoạt động</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
              <LineChartOutlined className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl text-white">{stats.ongoing}</p>
              <p className="text-sm text-gray-400">Đang thi đấu</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <TrophyOutlined className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl text-white">{stats.completed}</p>
              <p className="text-sm text-gray-400">Đã hoàn thành</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Input
              placeholder="Tìm kiếm theo tên đội hoặc leader..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border-white/10"
            />
          </div>

          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            className="w-full"
            style={{ width: '100%' }}
            options={[
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'active', label: 'Đang hoạt động' },
              { value: 'pending', label: 'Chờ duyệt' },
              { value: 'disqualified', label: 'Bị loại' },
            ]}
          />

          <Select
            value={filterHackathon}
            onChange={setFilterHackathon}
            className="w-full"
            style={{ width: '100%' }}
            options={[
              { value: 'all', label: 'Tất cả hackathon' },
              ...hackathons.map((h) => ({ value: h, label: h })),
            ]}
          />
        </div>
      </Card>

      {/* Teams List */}
      {isLoading ? (
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTeams.map((team) => (
          <Card
            key={team.id}
            className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all cursor-pointer"
            onClick={() => showTeamDetail(team)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl text-white">{team.name}</h3>
                  {getStatusBadge(team.status)}
                  {getHackathonStatusBadge(team.hackathonStatus)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <TrophyOutlined className="w-4 h-4 text-emerald-400" />
                    <span>{team.hackathon}</span>
                  </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <TeamOutlined className="w-4 h-4 text-emerald-400" />
                    <span>{team.members.length} thành viên</span>
                  </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <UserOutlined className="w-4 h-4 text-emerald-400" />
                    <span>Leader: {team.leader.name}</span>
                  </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <CalendarOutlined className="w-4 h-4 text-emerald-400" />
                    <span>
                      Tạo: {new Date(team.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>

                {team.score && (
                  <div className="mt-3 flex items-center gap-4">
                    <Tag color="gold">
                      <TrophyOutlined className="mr-1" />
                      Điểm: {team.score}/10
                    </Tag>
                    {team.rank && (
                      <Tag color="purple">
                        <TrophyOutlined className="mr-1" />
                        Hạng #{team.rank}
                      </Tag>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
          ))}

          {filteredTeams.length === 0 && (
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <div className="text-center py-12">
                <TeamOutlined className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">
                  Không tìm thấy đội thi nào phù hợp với tiêu chí lọc
                </p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Team Detail Modal */}
      <Modal
        title={selectedTeam?.name}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={900}
        className="chapter-modal"
      >
        {selectedTeam && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/5 border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                      <TeamOutlined className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl text-white">{selectedTeam.members.length}</p>
                    <p className="text-sm text-gray-400">Thành viên</p>
                  </div>
                </div>
              </Card>

              {selectedTeam.score && (
                <Card className="bg-white/5 border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                      <TrophyOutlined className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-2xl text-white">{selectedTeam.score}/10</p>
                      <p className="text-sm text-gray-400">Điểm số</p>
                    </div>
                  </div>
                </Card>
              )}

              {selectedTeam.rank && (
                <Card className="bg-white/5 border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <TrophyOutlined className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-2xl text-white">#{selectedTeam.rank}</p>
                      <p className="text-sm text-gray-400">Xếp hạng</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            <Card className="bg-white/5 border-white/10" title="Thông tin Hackathon">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <TrophyOutlined className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-sm text-gray-400">Cuộc thi</p>
                    <p className="text-white">{selectedTeam.hackathon}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarOutlined className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-sm text-gray-400">Ngày tạo đội</p>
                    <p className="text-white">
                      {new Date(selectedTeam.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ClockCircleOutlined className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-sm text-gray-400">Trạng thái hackathon</p>
                    <div className="mt-1">
                      {getHackathonStatusBadge(selectedTeam.hackathonStatus)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card
              className="bg-white/5 border-white/10"
              title={`Danh sách thành viên (${selectedTeam.members.filter((m) => m.verified).length}/${selectedTeam.members.length} đã xác thực)`}
            >
              <div className="space-y-4">
                {selectedTeam.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500">
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white">{member.name}</p>
                          {member.role === 'leader' && (
                            <Tag color="gold">Trưởng nhóm</Tag>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-sm text-gray-400 flex items-center gap-1">
                            <MailOutlined className="w-3 h-3" />
                            {member.email}
                          </p>
                          <p className="text-sm text-gray-400 flex items-center gap-1">
                            <UserOutlined className="w-3 h-3" />
                            {member.studentId}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      {member.verified ? (
                        <Badge
                          status="success"
                          text="Đã xác thực"
                          style={{ color: '#10b981' }}
                        />
                      ) : (
                        <Badge
                          status="error"
                          text="Chưa xác thực"
                          style={{ color: '#ef4444' }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ChapterTeamsList;

