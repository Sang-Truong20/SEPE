import {
    ArrowUpOutlined,
    BankOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    EyeOutlined,
    MailOutlined,
    PhoneOutlined,
    ReadOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Badge, Button, Card, Progress } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../../constants';

const ChapterDashboard = () => {
  const navigate = useNavigate();



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

  const pendingVerifications = [
    {
      studentName: 'Nguyễn Văn An',
      studentId: 'SE123456',
      major: 'Software Engineering',
      year: 'Năm 3',
      submittedAt: '2 giờ trước',
      status: 'pending',
      documents: ['Thẻ sinh viên', 'Giấy xác nhận'],
    },
    {
      studentName: 'Trần Thị Bình',
      studentId: 'AI789012',
      major: 'Artificial Intelligence',
      year: 'Năm 2',
      submittedAt: '4 giờ trước',
      status: 'pending',
      documents: ['Thẻ sinh viên', 'Bảng điểm'],
    },
    {
      studentName: 'Lê Hoàng Cường',
      studentId: 'CS345678',
      major: 'Computer Science',
      year: 'Năm 4',
      submittedAt: '6 giờ trước',
      status: 'pending',
      documents: ['Thẻ sinh viên'],
    },
  ];

  const mentorApplications = [
    {
      name: 'TS. Phạm Văn Đức',
      position: 'Giảng viên Senior',
      department: 'Khoa Công nghệ thông tin',
      experience: '8 năm',
      specialization: 'AI/Machine Learning',
      submittedAt: '1 ngày trước',
      status: 'pending',
    },
    {
      name: 'ThS. Nguyễn Thị Mai',
      position: 'Giảng viên',
      department: 'Khoa Kỹ thuật phần mềm',
      experience: '5 năm',
      specialization: 'Web Development',
      submittedAt: '2 ngày trước',
      status: 'pending',
    },
  ];

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
              bodyStyle={{ padding: '24px' }}
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
            {pendingVerifications.map((student, index) => (
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
                  </div>
                  <p className="text-sm text-gray-400 mb-1">
                    {student.major} • {student.year}
                  </p>
                  <div className="flex items-center text-xs text-gray-400">
                    <ClockCircleOutlined className="w-3 h-3 mr-1" />
                    {student.submittedAt} • {student.documents.length} tài liệu
                  </div>
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
            ))}
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
            {mentorApplications.map((mentor, index) => (
              <div
                key={index}
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
                  </div>
                  <p className="text-sm text-gray-400 mb-1">{mentor.department}</p>
                  <div className="flex items-center text-xs text-gray-400">
                    <span className="mr-1">⭐</span>
                    {mentor.experience} • {mentor.specialization}
                  </div>
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
            ))}
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

