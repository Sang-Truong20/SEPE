import {
  ArrowUpOutlined,
  BankOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  FileTextOutlined,
  MailOutlined,
  PhoneOutlined,
  ReadOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Badge, Button, Card, Progress, Skeleton, Tag, Empty } from 'antd';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../../configs/axiosClient';
import { PATH_NAME } from '../../../constants';
import { useGetMentorVerifications } from '../../../hooks/chapter/mentor-verification';

const ChapterDashboard = () => {
  const navigate = useNavigate();
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);

  // Fetch mentor verifications
  const { data: mentorVerificationsData, isLoading: mentorLoading } = useGetMentorVerifications();

  const getStatusTag = (statusRaw, statusNormalized) => {
    const colorMap = {
      pending: 'processing',
      approved: 'success',
      rejected: 'error',
    };

    // Map status to Vietnamese labels
    const statusLabelMap = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Từ chối',
    };

    const label = statusLabelMap[statusNormalized] || statusRaw || 'Không rõ';

    return <Tag color={colorMap[statusNormalized] || 'default'} style={{ marginLeft: 4 }}>{label}</Tag>;
  };

  const chapterStats = [
    {
      label: 'Sinh Viên Đã Verify',
      value: '1,247',
      icon: UserOutlined,
      change: '+89',
      color: 'text-green-400',
    },
    {
      label: 'Mentors Hoạt Động',
      value: '24',
      icon: ReadOutlined,
      change: '+3',
      color: 'text-emerald-400',
    },
    {
      label: 'Yêu Cầu Chờ Duyệt',
      value: '12',
      icon: ClockCircleOutlined,
      change: '+5',
      color: 'text-orange-400',
    },
    {
      label: 'Teams Từ Trường',
      value: '156',
      icon: TeamOutlined,
      change: '+23',
      color: 'text-purple-400',
    },
  ];

  useEffect(() => {
    const fetchPendingOrRejected = async () => {
      try {
        const res = await axiosClient.get('/StudentVerification/verifications/pending-or-rejected');
        const raw = Array.isArray(res?.data) ? res.data : res?.data?.data || [];
        const mapped = raw.map((item) => {
          const statusRaw = item.status || 'pending';
          const statusNormalized = statusRaw.toLowerCase();
          return {
            id: item.verificationId || item.id || item.userId,
            studentName: item.fullName || item.studentName || '—',
            studentId: item.studentCode || item.studentId || '—',
            major: item.major || undefined,
            year: item.yearOfAdmission ? `Khóa ${item.yearOfAdmission}` : item.year,
            submittedAt: item.submittedAt || item.createdAt || item.updatedAt || undefined,
            status: statusRaw,
            statusNormalized,
            documents: [
              item.frontCardImage && 'Thẻ SV - Mặt trước',
              item.backCardImage && 'Thẻ SV - Mặt sau',
            ].filter(Boolean),
          };
        });
        setPendingVerifications(mapped);
      } catch (error) {
        console.error('Failed to fetch pending/rejected verifications', error);
        setPendingVerifications([]);
      } finally {
        setPendingLoading(false);
      }
    };

    fetchPendingOrRejected();
  }, []);

  // Map mentor verifications from API
  const mentorApplications = useMemo(() => {
    if (!mentorVerificationsData) return [];
    const raw = Array.isArray(mentorVerificationsData)
      ? mentorVerificationsData
      : mentorVerificationsData?.data || [];

    return raw.map((item) => {
      const statusRaw = item.status || 'Pending';
      const statusNormalized = statusRaw.toLowerCase();

      return {
        id: item.id,
        name: item.fullName || '—',
        position: item.position || '—',
        email: item.email || '—',
        phone: item.phone || '—',
        cv: item.cv || null,
        reasonToBecomeMentor: item.reasonToBecomeMentor || '—',
        hackathonId: item.hackathonId,
        chapterId: item.chapterId,
        chapterName: item.chapterName || '—',
        status: statusRaw,
        statusNormalized,
        submittedAt: item.createdAt || item.updatedAt || undefined,
      };
    });
  }, [mentorVerificationsData]);

  // Limit to 3 items for display
  const displayedMentorApplications = mentorApplications.slice(0, 3);
  const hasMoreMentors = mentorApplications.length > 3;

  // Limit to 3 items for student verifications
  const displayedPendingVerifications = pendingVerifications.slice(0, 3);
  const hasMoreVerifications = pendingVerifications.length > 3;

  const universityInfo = {
    name: 'FPT University Hà Nội',
    code: 'FPT-HN',
    location: 'Khu Công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội',
    totalStudents: '12,547',
    verifiedStudents: '1,247',
    activeMentors: '24',
    contact: {
      email: 'chapter.hanoi@fpt.edu.vn',
      phone: '+84 24 7300 5588',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            Chapter Dashboard
          </h1>
          <p className="text-gray-400">
            Quản lý sinh viên và mentor từ {universityInfo.name}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-white">{universityInfo.name}</p>
            <p className="text-xs text-gray-400">{universityInfo.code}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {chapterStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card
              key={index}
              className="bg-white/5 border-white/10 backdrop-blur-xl"
              styles={{ body: { padding: '24px' } }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="text-2xl text-white">{stat.value}</p>
                  <div className="flex items-center text-sm text-green-400">
                    <ArrowUpOutlined className="w-3 h-3 mr-1" />
                    {stat.change}
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <IconComponent className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Student Verifications */}
        <Card
          className="bg-white/5 border-white/10 backdrop-blur-xl"
          title={
            <div className="flex items-center">
              <UserOutlined className="w-5 h-5 mr-2 text-green-400" />
              <span className="text-white">Yêu Cầu Verify Sinh Viên</span>
            </div>
          }
        >
          <div className="space-y-4">
            {pendingLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <Card
                  key={`skeleton-${idx}`}
                  className="bg-white/5 border-white/10"
                  size="small"
                  bodyStyle={{ padding: '16px' }}
                >
                  <Skeleton active paragraph={{ rows: 2 }} title={{ width: '40%' }} />
                </Card>
              ))
            ) : pendingVerifications.length === 0 ? (
              <div className="py-6">
                <Empty description="Không có yêu cầu verify" />
              </div>
            ) : (
              displayedPendingVerifications.map((student, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-white">{student.studentName}</h4>
                      <Badge
                        style={{
                          backgroundColor: 'rgba(59, 130, 246, 0.2)',
                          color: '#93c5fd',
                          borderColor: 'rgba(59, 130, 246, 0.3)',
                        }}
                      >
                        {student.studentId}
                      </Badge>
                      {getStatusTag(student.status, student.statusNormalized)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400 mb-2">
                      {student.email && (
                        <div className="flex items-center">
                          <MailOutlined className="w-3 h-3 mr-1" />
                          {student.email}
                        </div>
                      )}
                      {[student.major, student.year].filter(Boolean).length > 0 && (
                        <div className="flex items-center">
                          <ReadOutlined className="w-3 h-3 mr-1" />
                          {[student.major, student.year].filter(Boolean).join(' • ')}
                        </div>
                      )}
                      {student.universityName && (
                        <div className="flex items-center">
                          <BankOutlined className="w-3 h-3 mr-1" />
                          {student.universityName}
                        </div>
                      )}
                      {student.submittedAt && (
                        <div className="flex items-center">
                          <ClockCircleOutlined className="w-3 h-3 mr-1" />
                          {student.submittedAt}
                        </div>
                      )}
                    </div>
                    {student.documents?.length > 0 && (
                      <div className="flex items-center text-xs text-gray-400">
                        <FileTextOutlined className="w-3 h-3 mr-1" />
                        {student.documents.length} tài liệu đính kèm
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => navigate(PATH_NAME.CHAPTER_VERIFY_STUDENTS)}
                      size="small"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
                    >
                      <EyeOutlined className="w-4 h-4 mr-1" />
                      Xem
                    </Button>
                  </div>
                </div>
              ))
            )}
            {hasMoreVerifications && (
              <div className="pt-2">
                <Button
                  onClick={() => navigate(PATH_NAME.CHAPTER_VERIFY_STUDENTS)}
                  type="link"
                  className="w-full text-center text-green-400 hover:text-green-300"
                >
                  Xem thêm ({pendingVerifications.length - 3} yêu cầu khác)
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Mentor Applications */}
        <Card
          className="bg-white/5 border-white/10 backdrop-blur-xl"
          title={
            <div className="flex items-center">
              <ReadOutlined className="w-5 h-5 mr-2 text-emerald-400" />
              <span className="text-white">Đăng Ký Mentor</span>
            </div>
          }
        >
          <div className="space-y-4">
            {mentorLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <Card
                  key={`mentor-skeleton-${idx}`}
                  className="bg-white/5 border-white/10"
                  size="small"
                  bodyStyle={{ padding: '16px' }}
                >
                  <Skeleton active paragraph={{ rows: 2 }} title={{ width: '40%' }} />
                </Card>
              ))
            ) : displayedMentorApplications.length === 0 ? (
              <div className="py-6">
                <Empty description="Không có đăng ký mentor" />
              </div>
            ) : (
              displayedMentorApplications.map((mentor, index) => (
                <div
                  key={mentor.id || index}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-white">{mentor.name}</h4>
                      <Badge
                        style={{
                          backgroundColor: 'rgba(168, 85, 247, 0.2)',
                          color: '#c4b5fd',
                          borderColor: 'rgba(168, 85, 247, 0.3)',
                        }}
                      >
                        {mentor.position}
                      </Badge>
                      {getStatusTag(mentor.status, mentor.statusNormalized)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400 mb-2">
                      {mentor.email && (
                        <div className="flex items-center">
                          <MailOutlined className="w-3 h-3 mr-1" />
                          {mentor.email}
                        </div>
                      )}
                      {mentor.phone && (
                        <div className="flex items-center">
                          <PhoneOutlined className="w-3 h-3 mr-1" />
                          {mentor.phone}
                        </div>
                      )}
                      {mentor.chapterName && (
                        <div className="flex items-center">
                          <BankOutlined className="w-3 h-3 mr-1" />
                          {mentor.chapterName}
                        </div>
                      )}
                      {mentor.reasonToBecomeMentor && (
                        <div className="flex items-center">
                          <FileTextOutlined className="w-3 h-3 mr-1" />
                          <span className="truncate">{mentor.reasonToBecomeMentor}</span>
                        </div>
                      )}
                    </div>
                    {mentor.cv && (
                      <div className="flex items-center text-xs text-gray-400">
                        <FileTextOutlined className="w-3 h-3 mr-1" />
                        <a
                          href={mentor.cv}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Xem CV
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => navigate(PATH_NAME.CHAPTER_MENTOR_MANAGEMENT)}
                      size="small"
                      className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white border-0"
                    >
                      <EyeOutlined className="w-4 h-4 mr-1" />
                      Xem
                    </Button>
                  </div>
                </div>
              ))
            )}
            {hasMoreMentors && (
              <div className="pt-2">
                <Button
                  onClick={() => navigate(PATH_NAME.CHAPTER_MENTOR_MANAGEMENT)}
                  type="link"
                  className="w-full text-center text-emerald-400 hover:text-emerald-300"
                >
                  Xem thêm ({mentorApplications.length - 3} đăng ký khác)
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* University Overview */}
      <Card
        className="bg-white/5 border-white/10 backdrop-blur-xl"
        title={
          <div className="flex items-center">
            <BankOutlined className="w-5 h-5 mr-2 text-orange-400" />
            <span className="text-white">Thông Tin Trường</span>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <EnvironmentOutlined className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-white">{universityInfo.name}</p>
                  <p className="text-sm text-gray-400">{universityInfo.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <TeamOutlined className="w-4 h-4 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Tổng sinh viên</p>
                    <p className="text-white">{universityInfo.totalStudents}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <UserOutlined className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-sm text-gray-400">Đã verify</p>
                    <p className="text-white">{universityInfo.verifiedStudents}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-400">Tỷ lệ verify</p>
                <Progress
                  percent={Math.round(
                    (parseInt(universityInfo.verifiedStudents.replace(',', '')) /
                      parseInt(universityInfo.totalStudents.replace(',', ''))) *
                      100
                  )}
                  strokeColor={{
                    '0%': '#10b981',
                    '100%': '#3b82f6',
                  }}
                />
                <p className="text-xs text-gray-400">
                  {Math.round(
                    (parseInt(universityInfo.verifiedStudents.replace(',', '')) /
                      parseInt(universityInfo.totalStudents.replace(',', ''))) *
                      100
                  )}% sinh viên đã được verify
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MailOutlined className="w-4 h-4 text-orange-400" />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white text-sm">{universityInfo.contact.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <PhoneOutlined className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Điện thoại</p>
                <p className="text-white text-sm">{universityInfo.contact.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20 backdrop-blur-xl">
        <div className="p-6">
          <h3 className="text-xl mb-4 text-white">Thao Tác Nhanh</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => navigate(PATH_NAME.CHAPTER_VERIFY_STUDENTS)}
              className="border-white/20 bg-white/5 hover:bg-white/10 h-auto py-4 flex flex-col items-center"
            >
              <UserOutlined className="w-6 h-6 mb-2 text-green-400" />
              <span>Duyệt Sinh Viên</span>
            </Button>

            <Button
              onClick={() => navigate(PATH_NAME.CHAPTER_MENTOR_MANAGEMENT)}
              className="border-white/20 bg-white/5 hover:bg-white/10 h-auto py-4 flex flex-col items-center"
            >
              <ReadOutlined className="w-6 h-6 mb-2 text-emerald-400" />
              <span>Quản Lý Mentor</span>
            </Button>

            <Button
              onClick={() => navigate(PATH_NAME.CHAPTER_NOTIFICATIONS)}
              className="border-white/20 bg-white/5 hover:bg-white/10 h-auto py-4 flex flex-col items-center"
            >
              <MailOutlined className="w-6 h-6 mb-2 text-orange-400" />
              <span>Thông Báo</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChapterDashboard;

