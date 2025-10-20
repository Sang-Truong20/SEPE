import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { Progress } from 'antd';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { AlertTriangle, XCircle } from 'lucide-react';
import {
  Users,
  Plus,
  UserPlus,
  Crown,
  CheckCircle,
  Clock,
  Code,
  Palette,
  Database,
  Mail,
  Github,
  Linkedin,
  Trophy,
  Target,
  Activity,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../constants';

const { Search } = Input;
const { Option } = Select;

export function StudentTeams({ onNavigate }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inviteEmail, setInviteEmail] = useState('');
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [hasTeam, setHasTeam] = useState(true);
  const [userRole, setUserRole] = useState<'leader' | 'member'>('leader');
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      alert('Vui lòng nhập tên nhóm!');
      return;
    }
    setHasTeam(true);
    setUserRole('leader');
    setShowCreateTeam(false);
    setActiveTab('dashboard');
  };

  const handleInviteMember = () => {
    // Simulate invitation
    setInviteEmail('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-400';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400';
      default:
        return 'bg-green-500/10 text-green-400';
    }
  };

  if (showCreateTeam) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl text-white">
              Tạo Nhóm Của Bạn
            </CardTitle>
            <CardDescription>
              Bắt đầu xây dựng đội ngũ mơ ước cho hackathon
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="team-name">Tên Nhóm</Label>
              <Input
                id="team-name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Nhập tên nhóm của bạn"
                className="bg-white/5 border-white/10 focus:border-blue-500/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hackathon">Chọn Hackathon</Label>
              <Select defaultValue="ai-revolution-2024">
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem value="ai-revolution-2024">
                    Cuộc Cách mạng AI 2024
                  </SelectItem>
                  <SelectItem value="blockchain-vietnam">
                    Blockchain Hackathon Vietnam
                  </SelectItem>
                  <SelectItem value="green-tech">
                    Green Tech Solutions
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô Tả Nhóm</Label>
              <Input
                id="description"
                value={newTeamDescription}
                onChange={(e) => setNewTeamDescription(e.target.value)}
                placeholder="Mô tả ngắn gọn về trọng tâm của nhóm bạn"
                className="bg-white/5 border-white/10 focus:border-blue-500/50"
              />
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-white">Vai trò của bạn: Trưởng nhóm</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Với vai trò trưởng nhóm, bạn sẽ có quyền mời thành viên, quản lý
                dự án và nộp bài chính thức.
              </p>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleCreateTeam}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                Tạo Nhóm
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateTeam(false)}
                className="border-white/10"
              >
                Hủy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user doesn't have a team, show join/create options
  if (!hasTeam) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4">
            Tham Gia Đội Thi
          </h1>
          <p className="text-muted-foreground text-lg">
            Tìm kiếm đội thi phù hợp hoặc tạo đội mới để bắt đầu hành trình
            hackathon
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl text-white mb-2">Tạo Đội Mới</h3>
              <p className="text-muted-foreground mb-6">
                Trở thành trưởng nhóm và xây dựng đội thi của riêng bạn
              </p>
              <Button
                onClick={() => setShowCreateTeam(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0"
              >
                Tạo Đội Ngay
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500/20 to-emerald-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl text-white mb-2">Tìm Đội</h3>
              <p className="text-muted-foreground mb-6">
                Tham gia các đội thi đang tìm kiếm thành viên
              </p>
              <Button
                variant="outline"
                className="w-full border-white/20 bg-white/5 hover:bg-white/10"
              >
                Duyệt Đội Thi
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Available Teams */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">
              Đội Thi Đang Tuyển Thành Viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: 'Tech Innovators',
                  members: '3/5',
                  skills: ['React', 'Node.js', 'Python'],
                  description: 'Phát triển ứng dụng AI cho giáo dục',
                },
                {
                  name: 'Green Coders',
                  members: '2/5',
                  skills: ['Flutter', 'Firebase', 'IoT'],
                  description: 'Giải pháp IoT cho môi trường xanh',
                },
                {
                  name: 'Data Wizards',
                  members: '4/5',
                  skills: ['Python', 'ML', 'Analytics'],
                  description: 'Phân tích dữ liệu và machine learning',
                },
              ].map((team, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-white">{team.name}</h4>
                      <Badge
                        variant="outline"
                        className="border-green-500/30 text-green-300"
                      >
                        {team.members} thành viên
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {team.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {team.skills.map((skill, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white border-0"
                  >
                    Gửi Yêu Cầu
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const teamData = {
    name: 'Chiến binh Code',
    hackathon: 'Cuộc Cách mạng AI 2024',
    members: [
      {
        id: 1,
        name: 'Nguyễn Việt Anh',
        role: 'Trưởng nhóm',
        skills: ['React', 'Node.js', 'AI/ML'],
        avatar: 'NVA',
        status: 'confirmed',
        github: 'nguyenvietanh',
        email: 'anh@example.com',
        isLeader: true,
        penalty: null,
      },
      {
        id: 2,
        name: 'Trần Thị Lan',
        role: 'Thiết kế UI/UX',
        skills: ['Figma', 'CSS', 'Design Systems'],
        avatar: 'TTL',
        status: 'confirmed',
        github: 'tranthilan',
        email: 'lan@example.com',
        isLeader: false,
        penalty: null,
      },
      {
        id: 3,
        name: 'Lê Minh Đức',
        role: 'Lập trình Backend',
        skills: ['Python', 'FastAPI', 'PostgreSQL'],
        avatar: 'LMD',
        status: 'pending',
        github: 'leminhduc',
        email: 'duc@example.com',
        isLeader: false,
        penalty: null,
      },
      {
        id: 4,
        name: 'Phạm Văn Hải',
        role: 'Lập trình Frontend',
        skills: ['Vue.js', 'TypeScript'],
        avatar: 'PVH',
        status: 'confirmed',
        github: 'phamvanhai',
        email: 'hai@example.com',
        isLeader: false,
        penalty: {
          type: 'abandonment',
          reason: 'Bỏ thi giữa chừng trong hackathon trước',
          date: '2024-10-15',
          severity: 'medium',
        },
      },
    ],
    tasks: [
      {
        id: 1,
        title: 'Thiết lập repository dự án',
        assignee: 'Nguyễn Việt Anh',
        status: 'completed',
        priority: 'high',
      },
      {
        id: 2,
        title: 'Thiết kế mockup giao diện người dùng',
        assignee: 'Trần Thị Lan',
        status: 'in-progress',
        priority: 'high',
      },
      {
        id: 3,
        title: 'Triển khai hệ thống xác thực',
        assignee: 'Lê Minh Đức',
        status: 'todo',
        priority: 'medium',
      },
      {
        id: 4,
        title: 'Tích hợp API mô hình AI',
        assignee: 'Nguyễn Việt Anh',
        status: 'todo',
        priority: 'high',
      },
      {
        id: 5,
        title: 'Tạo slide thuyết trình',
        assignee: 'Trần Thị Lan',
        status: 'todo',
        priority: 'low',
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto p-6 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            {teamData.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            Tham gia {teamData.hackathon}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="border-blue-500/30 text-blue-400">
            {teamData.members.length}/5 Thành viên
          </Badge>
          <Button
            onClick={() => onNavigate('submissions')}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            Nộp Dự Án
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/5">
          <TabsTrigger
            value="dashboard"
            className="data-[state=active]:bg-blue-600"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="members"
            className="data-[state=active]:bg-blue-600"
          >
            Members
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className="data-[state=active]:bg-blue-600"
          >
            Tasks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-2xl text-white">3</p>
                    <p className="text-sm text-muted-foreground">
                      Team Members
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-2xl text-white">1</p>
                    <p className="text-sm text-muted-foreground">
                      Tasks Completed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-8 h-8 text-yellow-400" />
                  <div>
                    <p className="text-2xl text-white">2d</p>
                    <p className="text-sm text-muted-foreground">Time Left</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Code className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-2xl text-white">20%</p>
                    <p className="text-sm text-muted-foreground">Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Team Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Frontend Development</span>
                    <span>40%</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Backend Development</span>
                    <span>10%</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Design & UI</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-600 text-white">
                      AJ
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm text-white">
                      Alex completed "Set up project repository"
                    </p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-purple-600 text-white">
                      SC
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm text-white">
                      Sarah started working on UI mockups
                    </p>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-green-600 text-white">
                      MR
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm text-white">Mike joined the team</p>
                    <p className="text-xs text-muted-foreground">6 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <Card className="backdrop-blur-xl bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Thành Viên Đội ({teamData.members.length}/5)
                </CardTitle>
                {userRole === 'leader' && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Mời Thành Viên
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-white/10">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          Mời Thành Viên Mới
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                          Chỉ trưởng nhóm mới có quyền mời thành viên vào đội
                          thi
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-white">Email thành viên</Label>
                          <Input
                            placeholder="example@email.com"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            className="bg-white/5 border-white/10 focus:border-blue-500/50"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={handleInviteMember}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                          >
                            Gửi Lời Mời
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                {userRole === 'member' && (
                  <Badge
                    variant="outline"
                    className="border-orange-500/30 text-orange-300"
                  >
                    Chỉ trưởng nhóm mới có thể mời thành viên
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamData.members.map((member) => (
                  <Card key={member.id} className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-white">{member.name}</h4>
                            {member.isLeader && (
                              <Crown className="w-4 h-4 text-yellow-400" />
                            )}
                            <Badge
                              variant="outline"
                              className={getStatusColor(member.status)}
                            >
                              {member.status === 'confirmed'
                                ? 'Đã xác nhận'
                                : member.status === 'pending'
                                  ? 'Chờ xác nhận'
                                  : member.status}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-2">
                            {member.role}
                          </p>

                          {/* Penalty Status */}
                          {member.penalty && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 mb-3">
                              <div className="flex items-center space-x-2">
                                <AlertTriangle className="w-4 h-4 text-red-400" />
                                <span className="text-red-300 text-xs">
                                  Cảnh báo
                                </span>
                              </div>
                              <p className="text-xs text-red-200 mt-1">
                                {member.penalty.reason}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Ngày:{' '}
                                {new Date(
                                  member.penalty.date,
                                ).toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-1 mb-3">
                            {member.skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 text-muted-foreground hover:text-white"
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 text-muted-foreground hover:text-white"
                            >
                              <Github className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 text-muted-foreground hover:text-white"
                            >
                              <Linkedin className="w-4 h-4" />
                            </Button>
                            {userRole === 'leader' && !member.isLeader && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1 text-red-400 hover:text-red-300"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full" />
                  <span>To Do</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {teamData.tasks
                  .filter((task) => task.status === 'todo')
                  .map((task) => (
                    <Card key={task.id} className="bg-white/5 border-white/10">
                      <CardContent className="p-3">
                        <h4 className="text-sm text-white">{task.title}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">
                            {task.assignee}
                          </p>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span>In Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {teamData.tasks
                  .filter((task) => task.status === 'in-progress')
                  .map((task) => (
                    <Card key={task.id} className="bg-white/5 border-white/10">
                      <CardContent className="p-3">
                        <h4 className="text-sm text-white">{task.title}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">
                            {task.assignee}
                          </p>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span>Completed</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {teamData.tasks
                  .filter((task) => task.status === 'completed')
                  .map((task) => (
                    <Card key={task.id} className="bg-white/5 border-white/10">
                      <CardContent className="p-3">
                        <h4 className="text-sm text-white line-through opacity-60">
                          {task.title}
                        </h4>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">
                            {task.assignee}
                          </p>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
