import { useState, useEffect, useMemo } from 'react';
import {
  BarChartOutlined,
  FileTextOutlined,
  TrophyOutlined,
  UserOutlined,
  TeamOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Spin, Tooltip } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useHackathons } from '../../../hooks/admin/hackathons/useHackathons';
import { useTeams } from '../../../hooks/admin/teams/useTeams';
import { useUsers } from '../../../hooks/admin/users/useUsers';
import { useSubmission } from '../../../hooks/admin/submission/useSubmission';
import { useAppeal } from '../../../hooks/admin/appeal/useAppeal';

// Color scheme
const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  purple: '#a855f7',
  pink: '#ec4899',
};

const CHART_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.success,
  COLORS.warning,
  COLORS.danger,
  COLORS.info,
  COLORS.purple,
  COLORS.pink,
];

const HackathonDashboard = () => {
  // States
  const [selectedHackathon] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Hooks
  const { fetchHackathons } = useHackathons();
  const { fetchTeams } = useTeams();
  const { fetchUsers } = useUsers();
  const { fetchSubmissions } = useSubmission();
  const { fetchAppeals } = useAppeal();

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchHackathons.refetch();
      fetchTeams.refetch();
      fetchUsers.refetch();
      fetchSubmissions.refetch();
      fetchAppeals.refetch();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Loading state
  const isLoading =
    fetchHackathons.isLoading ||
    fetchTeams.isLoading ||
    fetchUsers.isLoading ||
    fetchSubmissions.isLoading ||
    fetchAppeals.isLoading;

  // Data
  const hackathons = fetchHackathons.data || [];
  const teams = fetchTeams.data || [];
  const users = fetchUsers.data || [];
  const submissions = fetchSubmissions.data || [];
  const appeals = fetchAppeals.data || [];

  // Calculate stats
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeHackathons = hackathons.filter(
      (h) => h.status === 'Active' || h.status === 'InProgress'
    ).length;
    const totalSubmissions = submissions.length;

    return [
      {
        icon: <UserOutlined className="text-3xl" />,
        value: totalUsers.toLocaleString(),
        label: 'Tổng người dùng',
        color: 'from-blue-500 to-blue-600',
        iconBg: 'bg-blue-500/20',
      },
      {
        icon: <TrophyOutlined className="text-3xl" />,
        value: activeHackathons,
        label: 'Hackathon hoạt động',
        color: 'from-purple-500 to-purple-600',
        iconBg: 'bg-purple-500/20',
      },
      {
        icon: <FileTextOutlined className="text-3xl" />,
        value: totalSubmissions.toLocaleString(),
        label: 'Bài nộp',
        color: 'from-green-500 to-green-600',
        iconBg: 'bg-green-500/20',
      },
      {
        icon: <TeamOutlined className="text-3xl" />,
        value: teams.length,
        label: 'Đội tham gia',
        color: 'from-orange-500 to-orange-600',
        iconBg: 'bg-orange-500/20',
      },
    ];
  }, [hackathons, teams, users, submissions, appeals]);

  // User growth data
  const userGrowthData = useMemo(() => {
    const sortedUsers = [...users].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    const monthlyData = {};
    const now = dayjs();

    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const month = now.subtract(i, 'month').format('YYYY-MM');
      monthlyData[month] = { month: now.subtract(i, 'month').format('MMM YY'), users: 0, newUsers: 0 };
    }

    // Count real users
    sortedUsers.forEach((user) => {
      const month = dayjs(user.createdAt).format('YYYY-MM');
      if (monthlyData[month]) {
        monthlyData[month].newUsers += 1;
      }
    });

    // Calculate cumulative
    let cumulative = 0;

    return Object.values(monthlyData).map((item) => {
      cumulative += item.newUsers;
      return {
        ...item,
        users: cumulative,
        newUsers: item.newUsers,
      };
    });
  }, [users]);

  // Submission status distribution
  const submissionStatusData = useMemo(() => {
    const statusCount = submissions.reduce((acc, sub) => {
      const status = sub.isFinal ? 'Final' : 'Draft';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return [
      { name: 'Nháp', value: statusCount['Draft'] || 0, color: COLORS.warning },
      { name: 'Đã nộp', value: statusCount['Final'] || 0, color: COLORS.success },
    ];
  }, [submissions]);

  // Hackathon timeline data
  const hackathonTimelineData = useMemo(() => {
    const filtered = selectedHackathon
      ? hackathons.filter((h) => h.hackathonId === selectedHackathon || h.id === selectedHackathon)
      : hackathons;

    return filtered.map((h) => {
      const hackathonTeams = teams.filter(
        (t) => t.hackathonId === h.hackathonId || t.hackathonId === h.id
      );
      const hackathonSubmissions = submissions.filter(
        (s) => hackathonTeams.some((t) => t.teamId === s.teamId || t.id === s.teamId)
      );

      // Calculate participants from teams (assuming team members are in team data)
      const participants = hackathonTeams.reduce((sum, team) => {
        return sum + (team.memberCount || team.members?.length || 0);
      }, 0);

      return {
        name: h.name || `Hackathon ${h.hackathonId || h.id}`,
        teams: hackathonTeams.length,
        submissions: hackathonSubmissions.length,
        participants: participants,
      };
    });
  }, [hackathons, teams, submissions, selectedHackathon]);

  // User role distribution
  const userRoleData = useMemo(() => {
    const roleCount = users.reduce((acc, user) => {
      const role = user.roleName || 'Member';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(roleCount).map(([name, value]) => ({
      name,
      value: value,
    }));
  }, [users]);

  // Appeal trends
  const appealTrendsData = useMemo(() => {
    const monthlyAppeals = {};
    const now = dayjs();

    for (let i = 5; i >= 0; i--) {
      const month = now.subtract(i, 'month').format('YYYY-MM');
      monthlyAppeals[month] = {
        month: now.subtract(i, 'month').format('MMM YY'),
        total: 0,
        approved: 0,
        rejected: 0,
        pending: 0,
      };
    }

    appeals.forEach((appeal) => {
      const month = dayjs(appeal.createdAt).format('YYYY-MM');
      if (monthlyAppeals[month]) {
        monthlyAppeals[month].total += 1;
        if (appeal.status === 'Approved') monthlyAppeals[month].approved += 1;
        else if (appeal.status === 'Rejected') monthlyAppeals[month].rejected += 1;
        else monthlyAppeals[month].pending += 1;
      }
    });

    return Object.values(monthlyAppeals);
  }, [appeals]);



  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A1F1C' }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-white">
              Dashboard
            </h1>
            <p className="text-gray-400">
              Tổng quan về hiệu suất và hoạt động nền tảng
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <Tooltip title="Tự động làm mới mỗi 5 phút">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded-lg border ${
                  autoRefresh
                    ? 'bg-green-500/20 border-green-500/50 text-green-400'
                    : 'bg-dark-secondary border-dark-accent text-gray-400'
                } hover:opacity-80 transition-all flex items-center gap-2`}
              >
                <ReloadOutlined spin={autoRefresh} />
                {autoRefresh ? 'Auto Refresh ON' : 'Auto Refresh OFF'}
              </button>
            </Tooltip>

            {/*<Select*/}
            {/*  placeholder="Chọn Hackathon"*/}
            {/*  className="w-48"*/}
            {/*  allowClear*/}
            {/*  onChange={setSelectedHackathon}*/}
            {/*  options={hackathons.map((h) => ({*/}
            {/*    label: h.name,*/}
            {/*    value: h.hackathonId,*/}
            {/*  }))}*/}
            {/*/>*/}

            {/*<RangePicker*/}
            {/*  value={dateRange}*/}
            {/*  onChange={setDateRange}*/}
            {/*  className="bg-gray-800 border-gray-700"*/}
            {/*/>*/}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-white/80 mb-2 font-medium">
                      {stat.label}
                    </div>
                      <div className="text-4xl font-bold text-white">
                        {stat.value}
                      </div>
                  </div>
                  <div
                    className={`${stat.iconBg} p-4 rounded-xl text-white`}
                  >
                    {stat.icon}
                  </div>
                </div>
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              </div>
            ))}
          </div>

          {/* Main Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* User Growth Chart */}
            <div className="bg-dark-secondary border border-dark-accent rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Tăng trưởng người dùng
                  </h3>
                  <p className="text-sm text-gray-400">
                    Xu hướng tăng trưởng trong 12 tháng
                  </p>
                </div>
                <Tooltip title="Biểu đồ diện tích hiển thị tổng người dùng tích lũy và người dùng mới mỗi tháng">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <RiseOutlined className="text-blue-400 text-xl" />
                  </div>
                </Tooltip>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={COLORS.primary}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS.primary}
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={COLORS.success}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS.success}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke={COLORS.primary}
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                    name="Tổng người dùng"
                  />
                  <Area
                    type="monotone"
                    dataKey="newUsers"
                    stroke={COLORS.success}
                    fillOpacity={1}
                    fill="url(#colorNew)"
                    name="Người dùng mới"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Submission Status Pie Chart */}
            <div className="bg-dark-secondary border border-dark-accent rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Trạng thái bài nộp
                  </h3>
                  <p className="text-sm text-gray-400">
                    Phân bổ theo trạng thái hiện tại
                  </p>
                </div>
                <Tooltip title="Biểu đồ tròn hiển thị tỷ lệ phần trăm các trạng thái bài nộp">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <BarChartOutlined className="text-purple-400 text-xl" />
                  </div>
                </Tooltip>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={submissionStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {submissionStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Main Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Hackathon Performance */}
            <div className="lg:col-span-2 bg-dark-secondary border border-dark-accent rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Hiệu suất Hackathon
                  </h3>
                  <p className="text-sm text-gray-400">
                    So sánh các chỉ số quan trọng
                  </p>
                </div>
                <Tooltip title="Biểu đồ cột nhóm hiển thị số lượng đội, bài nộp và người tham gia cho mỗi hackathon">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <TrophyOutlined className="text-green-400 text-xl" />
                  </div>
                </Tooltip>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={hackathonTimelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="teams"
                    fill={COLORS.primary}
                    name="Số đội"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="submissions"
                    fill={COLORS.success}
                    name="Bài nộp"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="participants"
                    fill={COLORS.purple}
                    name="Người tham gia"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* User Role Distribution */}
            <div className="bg-dark-secondary border border-dark-accent rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Phân bổ vai trò
                  </h3>
                  <p className="text-sm text-gray-400">Theo loại người dùng</p>
                </div>
                <Tooltip title="Số lượng người dùng theo vai trò trong hệ thống">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <TeamOutlined className="text-orange-400 text-xl" />
                  </div>
                </Tooltip>
              </div>
              <div className="space-y-4">
                {userRoleData.length > 0 ? (
                  userRoleData.map((role, index) => {
                    const total = userRoleData.reduce((sum, r) => sum + r.value, 0);
                    const percentage = total > 0 ? ((role.value / total) * 100).toFixed(1) : 0;
                    return (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-300 font-medium">
                            {role.name}
                          </span>
                          <span className="text-gray-400">
                            {role.value} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              background: `linear-gradient(90deg, ${CHART_COLORS[index % CHART_COLORS.length]}, ${CHART_COLORS[(index + 1) % CHART_COLORS.length]})`,
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    Chưa có dữ liệu
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Charts Row 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Appeal Trends */}
            <div className="bg-dark-secondary border border-dark-accent rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Xu hướng khiếu nại
                  </h3>
                  <p className="text-sm text-gray-400">
                    Theo dõi khiếu nại 6 tháng gần đây
                  </p>
                </div>
                <Tooltip title="Biểu đồ đường hiển thị số lượng khiếu nại và trạng thái xử lý theo thời gian">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <ExclamationCircleOutlined className="text-red-400 text-xl" />
                  </div>
                </Tooltip>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={appealTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke={COLORS.info}
                    strokeWidth={3}
                    name="Tổng"
                    dot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="approved"
                    stroke={COLORS.success}
                    strokeWidth={2}
                    name="Chấp nhận"
                  />
                  <Line
                    type="monotone"
                    dataKey="rejected"
                    stroke={COLORS.danger}
                    strokeWidth={2}
                    name="Từ chối"
                  />
                  <Line
                    type="monotone"
                    dataKey="pending"
                    stroke={COLORS.warning}
                    strokeWidth={2}
                    name="Chờ xử lý"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Stats */}
            <div className="bg-dark-secondary border border-dark-accent rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Thống kê nhanh
                  </h3>
                  <p className="text-sm text-gray-400">Tổng quan hệ thống</p>
                </div>
                <div className="p-2 bg-pink-500/20 rounded-lg">
                  <CheckCircleOutlined className="text-pink-400 text-xl" />
                </div>
              </div>
              <div className="space-y-4">
                <Tooltip title="Tổng số hackathon đã tổ chức">
                  <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-xl">
                    <span className="text-gray-300">Tổng Hackathon</span>
                    <span className="text-2xl font-bold text-purple-400">
                      {hackathons.length}
                    </span>
                  </div>
                </Tooltip>
                <Tooltip title="Số lượng khiếu nại đang chờ xử lý">
                  <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-xl">
                    <span className="text-gray-300">Khiếu nại chờ</span>
                    <span className="text-2xl font-bold text-orange-400">
                      {
                        appeals.filter(
                          (a) => a.status === 'Pending' || a.status === 'InReview'
                        ).length
                      }
                    </span>
                  </div>
                </Tooltip>
                <Tooltip title="Tỷ lệ người dùng đã xác thực">
                  <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-xl">
                    <span className="text-gray-300">Tỷ lệ xác thực</span>
                    <span className="text-2xl font-bold text-green-400">
                      {users.length > 0
                        ? (
                            (users.filter((u) => u.isVerified).length /
                              users.length) *
                            100
                          ).toFixed(0)
                        : 0}
                      %
                    </span>
                  </div>
                </Tooltip>
                <Tooltip title="Số người dùng bị khóa tài khoản">
                  <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-xl">
                    <span className="text-gray-300">Tài khoản bị khóa</span>
                    <span className="text-2xl font-bold text-red-400">
                      {users.filter((u) => u.isBlocked).length}
                    </span>
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default HackathonDashboard;
