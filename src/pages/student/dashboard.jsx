import {
    BarChartOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    PlayCircleOutlined,
    SettingOutlined,
    TeamOutlined,
    TrophyOutlined
} from '@ant-design/icons';
import { useQueries } from '@tanstack/react-query';
import { Button, Card, Spin, Tag } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../configs/axiosClient';
import { PATH_NAME } from '../../constants';
import { useGetHackathons } from '../../hooks/student/hackathon';
import { useGetMyHackathonRegistrations } from '../../hooks/student/hackathon-registration';
import { useGetNotifications } from '../../hooks/student/notification';
import { useGetMyTeams } from '../../hooks/student/team';

dayjs.extend(relativeTime);
dayjs.extend(utc);

const StudentDashboard = () => {
  const navigate = useNavigate();

  // Fetch data from hooks
  const { data: hackathonRegistrations = [], isLoading: registrationsLoading } = useGetMyHackathonRegistrations();
  const { data: myTeamsData, isLoading: teamsLoading } = useGetMyTeams();
  const { data: notifications = [] } = useGetNotifications();

  // Normalize teams data
  const myTeams = useMemo(() => {
    if (!myTeamsData) return [];
    if (Array.isArray(myTeamsData)) return myTeamsData;
    if (Array.isArray(myTeamsData.data)) return myTeamsData.data;
    return [];
  }, [myTeamsData]);

  // Get team IDs
  const teamIds = useMemo(() => {
    return myTeams.map(team => team.teamId || team.id || team.teamID).filter(Boolean);
  }, [myTeams]);

  // Fetch submissions for each team
  const submissionsQueries = useQueries({
    queries: teamIds.map(teamId => ({
      queryKey: ['student', 'submission', 'submissions-by-team', teamId],
      queryFn: async () => {
        const response = await axiosClient.get(`/Submission/team/${teamId}`);
        return response.data;
      },
      enabled: !!teamId,
      staleTime: 5 * 60 * 1000,
    })),
  });

  // Aggregate submissions from all teams
  const submissions = useMemo(() => {
    const allSubmissions = [];
    submissionsQueries.forEach(query => {
      if (query.data) {
        const data = Array.isArray(query.data) ? query.data : (query.data.data || []);
        allSubmissions.push(...data);
      }
    });
    return allSubmissions;
  }, [submissionsQueries]);

  const submissionsLoading = submissionsQueries.some(query => query.isLoading);

  // Normalize notifications data
  const notificationsList = useMemo(() => {
    if (!notifications) return [];
    if (Array.isArray(notifications)) return notifications;
    if (Array.isArray(notifications.data)) return notifications.data;
    return [];
  }, [notifications]);

  // Get all hackathons to match with registrations
  const { data: allHackathons = [] } = useGetHackathons();

  // Normalize hackathons data
  const hackathons = useMemo(() => {
    if (!allHackathons) return [];
    if (Array.isArray(allHackathons)) return allHackathons;
    if (Array.isArray(allHackathons.data)) return allHackathons.data;
    return [];
  }, [allHackathons]);

  // Calculate statistics
  const hackathonsCount = hackathonRegistrations.length;
  const teamsCount = myTeams.length;
  
  // Calculate hackathons waiting for mentor confirmation
  const waitingMentorHackathonsCount = useMemo(() => {
    return hackathonRegistrations.filter(reg => {
      const status = reg.status || reg.registrationStatus;
      return status?.toLowerCase() === 'waitingmentor' || status === 'WaitingMentor';
    }).length;
  }, [hackathonRegistrations]);
  
  // Calculate approved hackathons count
  const approvedHackathonsCount = useMemo(() => {
    return hackathonRegistrations.filter(reg => {
      const status = reg.status || reg.registrationStatus;
      return status === 'Approved' || status === 'approved';
    }).length;
  }, [hackathonRegistrations]);

  // Get recent hackathons from registrations
  const recentHackathons = useMemo(() => {
    if (!hackathonRegistrations || hackathonRegistrations.length === 0) return [];
    
    return hackathonRegistrations
      .map(reg => {
        const hackathon = hackathons.find(h => h.hackathonId === reg.hackathonId || h.id === reg.hackathonId);
        return {
          id: reg.hackathonId || hackathon?.hackathonId || hackathon?.id,
          name: hackathon?.name || reg.hackathonName || 'N/A',
          description: hackathon?.description || '',
          startDate: hackathon?.startDate || reg.startDate,
          endDate: hackathon?.endDate || reg.endDate,
          status: hackathon?.status || reg.status,
          registeredAt: reg.createdAt || reg.registeredAt,
        };
      })
      .sort((a, b) => {
        const dateA = dayjs(a.registeredAt || a.startDate);
        const dateB = dayjs(b.registeredAt || b.startDate);
        return dateB.valueOf() - dateA.valueOf();
      })
      .slice(0, 3); // Get 3 most recent
  }, [hackathonRegistrations, hackathons]);

  // Format recent activity from notifications and submissions
  const recentActivity = useMemo(() => {
    const activities = [];
    
    // Add recent notifications
    const recentNotifications = notificationsList
      .slice(0, 2)
      .map(notif => ({
        action: notif.title || notif.message || 'Thông báo mới',
        time: notif.createdAt ? dayjs.utc(notif.createdAt).utcOffset(7).fromNow() : 'Vừa xong',
        type: notif.isRead ? 'neutral' : 'info',
      }));
    
    // Add recent submissions
    const recentSubmissions = submissions
      .filter(s => s.isFinal)
      .sort((a, b) => {
        const dateA = dayjs(a.submittedAt || a.createdAt);
        const dateB = dayjs(b.submittedAt || b.createdAt);
        return dateB.valueOf() - dateA.valueOf();
      })
      .slice(0, 2)
      .map(sub => ({
        action: `Nộp ${sub.title || 'bài nộp'}`,
        time: sub.submittedAt || sub.createdAt 
          ? dayjs(sub.submittedAt || sub.createdAt).fromNow()
          : 'Vừa xong',
        type: 'success',
      }));
    
    activities.push(...recentSubmissions, ...recentNotifications);
    
    // Sort by time and take first 4
    return activities.slice(0, 4);
  }, [notificationsList, submissions]);

  const stats = [
    {
      label: 'Hackathons tham gia',
      value: hackathonsCount.toString(),
      icon: TrophyOutlined,
    },
    {
      label: 'Đội đang tham gia',
      value: teamsCount.toString(),
      icon: TeamOutlined,
    },
    {
      label: 'Hackathon chờ mentor xác nhận',
      value: waitingMentorHackathonsCount.toString(),
      icon: ClockCircleOutlined,
    },
    {
      label: 'Hackathons đã duyệt',
      value: approvedHackathonsCount.toString(),
      icon: PlayCircleOutlined,
    },
  ];

  const isLoading = registrationsLoading || teamsLoading || submissionsLoading;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            Dashboard Sinh viên
          </h1>
          <p className="text-gray-400 mt-2">
            Quản lý dự án và theo dõi tiến độ của bạn
          </p>
        </div>


      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-200 hover:scale-105 border-0"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                    <p className="text-2xl text-white font-semibold">
                      {stat.value}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-lg flex items-center justify-center border border-white/10">
                    <stat.icon className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recent Hackathons */}
        <div className="lg:col-span-2">
          <Card className="border-0 hover:shadow-lg transition-all duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <TrophyOutlined className="w-5 h-5 mr-2 text-yellow-400" />
                  <span className="text-xl font-semibold text-white">
                    Hackathon Tham Gia Gần Đây
                  </span>
                </div>
                <Button
                  type="link"
                  onClick={() => navigate(PATH_NAME.STUDENT_HACKATHONS)}
                  className="text-green-400 hover:text-green-300"
                >
                  Xem tất cả
                </Button>
              </div>

              {recentHackathons.length > 0 ? (
                <div className="space-y-4">
                  {recentHackathons.map((hackathon) => {
                    const now = dayjs();
                    const startDate = hackathon.startDate ? dayjs(hackathon.startDate) : null;
                    const endDate = hackathon.endDate ? dayjs(hackathon.endDate) : null;
                    const isUpcoming = startDate && startDate.isAfter(now);
                    const isOngoing = startDate && endDate && now.isAfter(startDate) && now.isBefore(endDate);
                    const isCompleted = endDate && endDate.isBefore(now);
                    
                    let statusText = 'Chưa bắt đầu';
                    let statusColor = 'default';
                    if (isOngoing) {
                      statusText = 'Đang diễn ra';
                      statusColor = 'green';
                    } else if (isCompleted) {
                      statusText = 'Đã kết thúc';
                      statusColor = 'blue';
                    } else if (isUpcoming) {
                      statusText = 'Sắp diễn ra';
                      statusColor = 'orange';
                    }

                    return (
                      <div
                        key={hackathon.id}
                        className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-green-400/30 transition-all cursor-pointer"
                        onClick={() => navigate(`${PATH_NAME.STUDENT_HACKATHONS}/${hackathon.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg text-white font-semibold mb-1">
                              {hackathon.name}
                            </h3>
                            {hackathon.description && (
                              <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                                {hackathon.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              {startDate && (
                                <div className="flex items-center">
                                  <CalendarOutlined className="w-4 h-4 mr-1" />
                                  <span>Bắt đầu: {startDate.format('DD/MM/YYYY')}</span>
                                </div>
                              )}
                              {endDate && (
                                <div className="flex items-center">
                                  <ClockCircleOutlined className="w-4 h-4 mr-1" />
                                  <span>Kết thúc: {endDate.format('DD/MM/YYYY')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Tag color={statusColor} className="ml-4">
                            {statusText}
                          </Tag>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">Bạn chưa tham gia hackathon nào</p>
                  <Button
                    onClick={() => navigate(PATH_NAME.STUDENT_HACKATHONS)}
                    className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    Tham Gia Hackathon
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-card-background border border-card-border backdrop-blur-xl">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <SettingOutlined className="w-5 h-5 mr-2 text-green-400" />
              <span className="text-xl font-semibold text-white">
                Hoạt Động Gần Đây
              </span>
            </div>

            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'success'
                          ? 'bg-green-400'
                          : activity.type === 'info'
                            ? 'bg-blue-400'
                            : 'bg-gray-400'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-white">{activity.action}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">Chưa có hoạt động nào</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 hover:shadow-lg transition-all duration-200">
        <div className="p-6">
          <h3 className="text-xl mb-6 text-white font-semibold">
            Thao Tác Nhanh
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => navigate(PATH_NAME.STUDENT_HACKATHONS)}
              className="border-white/10 bg-white/5 hover:bg-gradient-to-br hover:from-green-500/10 hover:to-emerald-500/10 hover:border-green-400/30 text-white h-auto py-6 px-4 flex flex-col items-center transition-all duration-200 hover:scale-105 hover:shadow-lg group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <TrophyOutlined className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium">Tham Gia Hackathon</span>
            </Button>
            <Button
              onClick={() => navigate(PATH_NAME.STUDENT_TEAMS)}
              className="border-white/10 bg-white/5 hover:bg-gradient-to-br hover:from-green-500/10 hover:to-emerald-500/10 hover:border-green-400/30 text-white h-auto py-6 px-4 flex flex-col items-center transition-all duration-200 hover:scale-105 hover:shadow-lg group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <TeamOutlined className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium">Quản Lý Đội</span>
            </Button>
            <Button
              onClick={() => navigate(PATH_NAME.STUDENT_LEADERBOARD)}
              className="border-white/10 bg-white/5 hover:bg-gradient-to-br hover:from-yellow-500/10 hover:to-orange-500/10 hover:border-yellow-400/30 text-white h-auto py-6 px-4 flex flex-col items-center transition-all duration-200 hover:scale-105 hover:shadow-lg group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <BarChartOutlined className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium">Xem Kết Quả</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentDashboard;

