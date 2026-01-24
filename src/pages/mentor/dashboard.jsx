import {
    CalendarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    FileTextOutlined,
    TeamOutlined,
    TrophyOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Button, Card, Spin, Tag, message } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../constants';
import { useApproveMentorAssignment, useGetMentorAssignments, useRejectMentorAssignment } from '../../hooks/mentor/assignments';
import { useGetMentorTeams } from '../../hooks/mentor/mentor-assignment';
import { useGetHackathons } from '../../hooks/student/hackathon';
import { useGetNotifications } from '../../hooks/student/notification';
import { useUserData } from '../../hooks/useUserData';

dayjs.extend(relativeTime);
dayjs.extend(utc);

const MentorDashboard = () => {
  const navigate = useNavigate();
  const { userInfo, isLoading: userLoading } = useUserData();

  // Get mentor ID from userInfo
  const mentorId = userInfo?.mentorId || userInfo?.id || userInfo?.userId;

  // Fetch data from hooks
  const { data: mentorTeamsData, isLoading: teamsLoading } = useGetMentorTeams(mentorId);
  const { data: mentorAssignmentsData, isLoading: assignmentsLoading, refetch: refetchAssignments } = useGetMentorAssignments(mentorId);
  const { data: notifications = [] } = useGetNotifications();
  const { data: allHackathons = [] } = useGetHackathons();
  const approveMutation = useApproveMentorAssignment();
  const rejectMutation = useRejectMentorAssignment();

  // Normalize teams data
  const mentorTeams = useMemo(() => {
    if (!mentorTeamsData) return [];
    if (Array.isArray(mentorTeamsData)) return mentorTeamsData;
    if (Array.isArray(mentorTeamsData.data)) return mentorTeamsData.data;
    return [];
  }, [mentorTeamsData]);

  // Normalize assignments data
  const mentorAssignments = useMemo(() => {
    if (!mentorAssignmentsData) return [];
    if (Array.isArray(mentorAssignmentsData)) return mentorAssignmentsData;
    if (Array.isArray(mentorAssignmentsData.data)) return mentorAssignmentsData.data;
    return [];
  }, [mentorAssignmentsData]);

  // Get pending requests (status: pending or waitingmentor) - latest 3
  const pendingRequests = useMemo(() => {
    return mentorAssignments
      .filter(assignment => {
        const status = (assignment.status || '').toLowerCase().trim();
        return status === 'pending' || status === 'waitingmentor';
      })
      .sort((a, b) => {
        const dateA = dayjs(a.assignedAt || a.createdAt || 0);
        const dateB = dayjs(b.assignedAt || b.createdAt || 0);
        return dateB.valueOf() - dateA.valueOf();
      })
      .slice(0, 3); // Get 3 latest requests
  }, [mentorAssignments]);

  // Normalize hackathons data
  const hackathons = useMemo(() => {
    if (!allHackathons) return [];
    if (Array.isArray(allHackathons)) return allHackathons;
    if (Array.isArray(allHackathons.data)) return allHackathons.data;
    return [];
  }, [allHackathons]);

  // Normalize notifications data
  const notificationsList = useMemo(() => {
    if (!notifications) return [];
    if (Array.isArray(notifications)) return notifications;
    if (Array.isArray(notifications.data)) return notifications.data;
    return [];
  }, [notifications]);

  // Get mentor info from userInfo
  const mentorInfo = useMemo(() => {
    if (!userInfo) return null;
    return {
      name: userInfo.fullName || userInfo.name || userInfo.userName || 'Mentor',
      email: userInfo.email || '',
      company: userInfo.organization || userInfo.company || '',
      position: userInfo.position || '',
    };
  }, [userInfo]);

  // Process teams with real data - use available data from API
  const processedTeams = useMemo(() => {
    return mentorTeams.map(team => {
      const teamId = team.teamId || team.id;
      const hackathonId = team.hackathonId;
      
      // Get hackathon name
      const hackathon = hackathons.find(h => 
        h.hackathonId === hackathonId || h.id === hackathonId
      );
      
      // Get members count from team data if available
      const membersCount = team.members?.length || 
                          team.teamMembers?.length || 
                          (Array.isArray(team.members) ? team.members.length : 0);
      
      // Use progress from team data if available, otherwise default to 0
      const progress = team.progress || team.progressPercentage || 0;
      
      // Determine status based on progress
      let status = 'on-track';
      if (progress >= 90) status = 'excellent';
      else if (progress < 50) status = 'needs-attention';
      
      // Get last update from team data
      const lastUpdate = team.lastUpdate || 
                        team.updatedAt 
                          ? dayjs(team.updatedAt).fromNow()
                          : 'Chưa có cập nhật';
      
      return {
        id: teamId,
        name: team.teamName || team.name || 'N/A',
        hackathon: hackathon?.name || team.hackathonName || 'N/A',
        members: membersCount,
        progress,
        status,
        lastUpdate,
        teamId,
        hackathonId,
      };
    });
  }, [mentorTeams, hackathons]);

  // Calculate pending requests count
  const pendingRequestsCount = useMemo(() => {
    return mentorAssignments.filter(assignment => {
      const status = (assignment.status || '').toLowerCase().trim();
      return status === 'pending' || status === 'waitingmentor';
    }).length;
  }, [mentorAssignments]);

  // Calculate approved assignments count
  const approvedAssignmentsCount = useMemo(() => {
    return mentorAssignments.filter(assignment => {
      const status = (assignment.status || '').toLowerCase().trim();
      return status === 'approved' || status === 'accepted';
    }).length;
  }, [mentorAssignments]);


  // Calculate stats from real data
  const stats = [
    {
      label: 'Teams Hướng Dẫn',
      value: processedTeams.length,
      icon: TeamOutlined,
      color: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-400',
    },
    {
      label: 'Hackathons Tham Gia',
      value: new Set(processedTeams.map(t => t.hackathonId).filter(Boolean)).size,
      icon: TrophyOutlined,
      color: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-400',
    },
    {
      label: 'Yêu cầu cần duyệt',
      value: pendingRequestsCount,
      icon: CheckCircleOutlined,
      color: 'from-orange-500/20 to-red-500/20',
      iconColor: 'text-orange-400',
    },
    {
      label: 'Yêu cầu đã duyệt',
      value: approvedAssignmentsCount,
      icon: CheckCircleOutlined,
      color: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-400',
    },
  ];

  // Format recent activities from notifications
  const recentActivities = useMemo(() => {
    return notificationsList
      .sort((a, b) => {
        const dateA = dayjs(a.createdAt);
        const dateB = dayjs(b.createdAt);
        return dateB.valueOf() - dateA.valueOf();
      })
      .slice(0, 5)
      .map(notif => {
        let type = 'info';
        if (notif.title?.toLowerCase().includes('đánh giá') || 
            notif.message?.toLowerCase().includes('đánh giá')) {
          type = 'feedback';
        } else if (notif.title?.toLowerCase().includes('họp') || 
                   notif.message?.toLowerCase().includes('họp')) {
          type = 'meeting';
        } else if (notif.title?.toLowerCase().includes('tài liệu') || 
                   notif.message?.toLowerCase().includes('tài liệu')) {
          type = 'resource';
        }
        
        return {
          id: notif.notificationId || notif.id,
          type,
          team: notif.teamName || 'Tất cả teams',
          message: notif.title || notif.message || 'Thông báo mới',
          time: notif.createdAt ? dayjs.utc(notif.createdAt).utcOffset(7).fromNow() : 'Vừa xong',
        };
      });
  }, [notificationsList]);


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Mentor Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            {mentorInfo ? `Chào mừng trở lại, ${mentorInfo.name}` : 'Mentor Dashboard'}
          </p>
        </div>

        {mentorInfo && (
          <div className="flex items-center space-x-4">
            <div className="text-right">
              {mentorInfo.company && (
                <p className="text-sm text-white">{mentorInfo.company}</p>
              )}
              {mentorInfo.position && (
                <p className="text-xs text-gray-400">{mentorInfo.position}</p>
              )}
            </div>
            
          </div>
        )}
      </div>

      {/* Stats Grid */}
      {(userLoading || teamsLoading) ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-all duration-200 hover:scale-105 border-0 bg-white/5 backdrop-blur-xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="text-2xl text-white mt-1">{stat.value}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          </Card>
        ))}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Pending Mentor Requests */}
        <div>
          <Card
            title="Yêu cầu duyệt mentor"
            extra={
              <Button
                type="link"
                onClick={() => navigate(PATH_NAME.MENTOR_ASSIGNMENTS)}
                className="text-green-400"
              >
                Xem tất cả
              </Button>
            }
            className="border-0 bg-white/5 backdrop-blur-xl"
          >
            {assignmentsLoading ? (
              <div className="flex justify-center py-8">
                <Spin />
              </div>
            ) : pendingRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingRequests.map((request) => {
                  const status = (request.status || '').toLowerCase().trim();
                  const isPending = status === 'pending' || status === 'waitingmentor';
                  
                  return (
                    <div
                      key={request.assignmentId || request.id}
                      className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <TeamOutlined className="text-green-400" />
                            <h4 className="text-white">{request.teamName || 'N/A'}</h4>
                            <Tag color="orange">Chờ duyệt</Tag>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
                            {request.leaderName && (
                              <div className="flex items-center gap-1">
                                <UserOutlined />
                                <span>{request.leaderName}</span>
                              </div>
                            )}
                            {request.hackathonName && (
                              <div className="flex items-center gap-1">
                                <TrophyOutlined />
                                <span>{request.hackathonName}</span>
                              </div>
                            )}
                          </div>
                          {request.assignedAt && (
                            <p className="text-xs text-gray-500 mt-2">
                              {dayjs(request.assignedAt).fromNow()}
                            </p>
                          )}
                        </div>
                      </div>

                      {isPending && (
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                          <Button
                            size="small"
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            loading={approveMutation.isPending && approveMutation.variables === request.assignmentId}
                            onClick={() => {
                              approveMutation.mutate(request.assignmentId, {
                                onSuccess: () => {
                                  message.success('Đã duyệt yêu cầu');
                                  refetchAssignments();
                                },
                              });
                            }}
                            className="bg-emerald-600 text-white border-0 hover:bg-emerald-700"
                          >
                            Duyệt
                          </Button>
                          <Button
                            size="small"
                            danger
                            icon={<CloseCircleOutlined />}
                            loading={rejectMutation.isPending && rejectMutation.variables === request.assignmentId}
                            onClick={() => {
                              rejectMutation.mutate(request.assignmentId, {
                                onSuccess: () => {
                                  message.success('Đã từ chối yêu cầu');
                                  refetchAssignments();
                                },
                              });
                            }}
                            className="bg-red-600 text-white border-0 hover:bg-red-700"
                          >
                            Từ chối
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">Không có yêu cầu nào cần duyệt</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Recent Activities */}
      <Card
        title="Hoạt Động Gần Đây"
        className="border-0 bg-white/5 backdrop-blur-xl"
      >
        <div className="space-y-4">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center shrink-0">
                {activity.type === 'feedback' && (
                  <CheckCircleOutlined className="text-green-400" />
                )}
                {activity.type === 'meeting' && (
                  <CalendarOutlined className="text-emerald-400" />
                )}
                {activity.type === 'resource' && (
                  <FileTextOutlined className="text-purple-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white">{activity.message}</p>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{activity.team}</p>
              </div>
            </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm text-center py-4">Chưa có hoạt động nào</p>
          )}
        </div>
      </Card>

   
    </div>
  );
};

export default MentorDashboard;
