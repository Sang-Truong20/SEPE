import { useState } from 'react';
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
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../../constants';

const ChapterTeamsList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterHackathon, setFilterHackathon] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Mock data - danh sách các team từ trường
  const mockTeams = [
    {
      id: '1',
      name: 'Tech Innovators FPT',
      hackathon: 'SEAL Hackathon 2024 - Ho Chi Minh',
      hackathonStatus: 'ongoing',
      leader: {
        id: '1',
        name: 'Nguyễn Văn An',
        email: 'annv@fpt.edu.vn',
        role: 'leader',
        studentId: 'SE123456',
        verified: true,
        avatar: undefined,
      },
      members: [
        {
          id: '1',
          name: 'Nguyễn Văn An',
          email: 'annv@fpt.edu.vn',
          role: 'leader',
          studentId: 'SE123456',
          verified: true,
        },
        {
          id: '2',
          name: 'Trần Thị Bình',
          email: 'binhtt@fpt.edu.vn',
          role: 'member',
          studentId: 'SE123457',
          verified: true,
        },
        {
          id: '3',
          name: 'Lê Văn Cường',
          email: 'cuonglv@fpt.edu.vn',
          role: 'member',
          studentId: 'SE123458',
          verified: true,
        },
        {
          id: '4',
          name: 'Phạm Thị Dung',
          email: 'dungpt@fpt.edu.vn',
          role: 'member',
          studentId: 'SE123459',
          verified: true,
        },
      ],
      createdAt: '2024-01-15',
      status: 'active',
      university: 'FPT University - Ho Chi Minh',
      score: 8.5,
      rank: 3,
    },
    {
      id: '2',
      name: 'Code Masters',
      hackathon: 'SEAL Hackathon 2024 - Ho Chi Minh',
      hackathonStatus: 'ongoing',
      leader: {
        id: '5',
        name: 'Hoàng Văn Em',
        email: 'emhv@fpt.edu.vn',
        role: 'leader',
        studentId: 'SE123460',
        verified: true,
      },
      members: [
        {
          id: '5',
          name: 'Hoàng Văn Em',
          email: 'emhv@fpt.edu.vn',
          role: 'leader',
          studentId: 'SE123460',
          verified: true,
        },
        {
          id: '6',
          name: 'Đỗ Thị Phương',
          email: 'phuongdt@fpt.edu.vn',
          role: 'member',
          studentId: 'SE123461',
          verified: false,
        },
        {
          id: '7',
          name: 'Vũ Văn Giang',
          email: 'giangvv@fpt.edu.vn',
          role: 'member',
          studentId: 'SE123462',
          verified: true,
        },
      ],
      createdAt: '2024-01-18',
      status: 'active',
      university: 'FPT University - Ho Chi Minh',
      score: 7.8,
      rank: 7,
    },
    {
      id: '3',
      name: 'AI Warriors',
      hackathon: 'Tech Challenge 2024',
      hackathonStatus: 'completed',
      leader: {
        id: '8',
        name: 'Bùi Văn Hải',
        email: 'haibv@fpt.edu.vn',
        role: 'leader',
        studentId: 'SE123463',
        verified: true,
      },
      members: [
        {
          id: '8',
          name: 'Bùi Văn Hải',
          email: 'haibv@fpt.edu.vn',
          role: 'leader',
          studentId: 'SE123463',
          verified: true,
        },
        {
          id: '9',
          name: 'Ngô Thị Lan',
          email: 'lannt@fpt.edu.vn',
          role: 'member',
          studentId: 'SE123464',
          verified: true,
        },
        {
          id: '10',
          name: 'Trịnh Văn Minh',
          email: 'minhtv@fpt.edu.vn',
          role: 'member',
          studentId: 'SE123465',
          verified: true,
        },
        {
          id: '11',
          name: 'Lý Thị Ngọc',
          email: 'ngoclt@fpt.edu.vn',
          role: 'member',
          studentId: 'SE123466',
          verified: true,
        },
        {
          id: '12',
          name: 'Phan Văn Oanh',
          email: 'oanhpv@fpt.edu.vn',
          role: 'member',
          studentId: 'SE123467',
          verified: true,
        },
      ],
      createdAt: '2023-11-20',
      status: 'active',
      university: 'FPT University - Ho Chi Minh',
      score: 9.2,
      rank: 1,
    },
    {
      id: '4',
      name: 'Blockchain Pioneers',
      hackathon: 'Fintech Innovation 2024',
      hackathonStatus: 'upcoming',
      leader: {
        id: '13',
        name: 'Đinh Văn Phúc',
        email: 'phucdv@fpt.edu.vn',
        role: 'leader',
        studentId: 'SE123468',
        verified: true,
      },
      members: [
        {
          id: '13',
          name: 'Đinh Văn Phúc',
          email: 'phucdv@fpt.edu.vn',
          role: 'leader',
          studentId: 'SE123468',
          verified: true,
        },
        {
          id: '14',
          name: 'Mai Thị Quỳnh',
          email: 'quynhmt@fpt.edu.vn',
          role: 'member',
          studentId: 'SE123469',
          verified: true,
        },
      ],
      createdAt: '2024-02-01',
      status: 'pending',
      university: 'FPT University - Ho Chi Minh',
    },
  ];

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

