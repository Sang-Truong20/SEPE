import { useState } from 'react';
import {
  ReadOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  StarOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  BankOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import {
  Card,
  Badge,
  Button,
  Input,
  Select,
  Modal,
  message,
  Tabs,
  Tag,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../../constants';

const { TextArea } = Input;

const ChapterMentorManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('applications');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const mentorApplications = [
    {
      id: '1',
      name: 'TS. Phạm Văn Đức',
      email: 'ducpv@fpt.edu.vn',
      phone: '+84 912 345 678',
      position: 'Giảng viên Senior',
      department: 'Khoa Công nghệ thông tin',
      experience: '8 năm',
      specializations: ['AI/Machine Learning', 'Data Science', 'Python'],
      education: 'Tiến sĩ Khoa học máy tính - ĐH Quốc gia',
      submittedAt: '1 ngày trước',
      status: 'pending',
      cv: 'cv_pham_van_duc.pdf',
      linkedIn: 'linkedin.com/in/phamvanduc',
      mentorReason: 'Muốn chia sẻ kinh nghiệm và hướng dẫn sinh viên trong lĩnh vực AI',
      availableTime: 'Thứ 2, 4, 6 (18:00-20:00)',
      previousMentoring: 'Đã mentor 15 sinh viên trong 3 năm qua',
    },
    {
      id: '2',
      name: 'ThS. Nguyễn Thị Mai',
      email: 'maivn@fpt.edu.vn',
      phone: '+84 987 654 321',
      position: 'Giảng viên',
      department: 'Khoa Kỹ thuật phần mềm',
      experience: '5 năm',
      specializations: ['Web Development', 'React', 'Node.js', 'JavaScript'],
      education: 'Thạc sĩ Kỹ thuật phần mềm - ĐH Bách khoa',
      submittedAt: '2 ngày trước',
      status: 'pending',
      cv: 'cv_nguyen_thi_mai.pdf',
      portfolio: 'portfolio.mai-nguyen.dev',
      mentorReason: 'Đam mê giảng dạy và muốn hướng dẫn sinh viên làm dự án thực tế',
      availableTime: 'Thứ 3, 5, 7 (19:00-21:00)',
    },
    {
      id: '3',
      name: 'KS. Trần Minh Hoàng',
      email: 'hoangtm@techcorp.vn',
      phone: '+84 901 234 567',
      position: 'Senior Software Engineer',
      department: 'Bên ngoài - TechCorp',
      experience: '6 năm',
      specializations: ['Mobile Development', 'Flutter', 'React Native'],
      education: 'Kỹ sư Phần mềm - ĐH FPT',
      submittedAt: '3 ngày trước',
      status: 'approved',
      portfolio: 'github.com/hoangmintran',
      mentorReason: 'Alumni muốn đóng góp lại cho trường và hướng dẫn junior',
      availableTime: 'Cuối tuần (9:00-17:00)',
    },
  ];

  const existingMentors = [
    {
      id: '1',
      name: 'TS. Lê Văn Hùng',
      email: 'hunglv@fpt.edu.vn',
      position: 'Trưởng bộ môn AI',
      department: 'Khoa Công nghệ thông tin',
      specializations: ['AI/ML', 'Deep Learning', 'Computer Vision'],
      activeTeams: 3,
      rating: 4.8,
      totalMentored: 45,
      joinedAt: '2 năm trước',
      status: 'active',
    },
    {
      id: '2',
      name: 'ThS. Bùi Thị Hương',
      email: 'huongbt@fpt.edu.vn',
      position: 'Giảng viên',
      department: 'Khoa Kỹ thuật phần mềm',
      specializations: ['Full-stack', 'Database', 'Cloud Computing'],
      activeTeams: 2,
      rating: 4.6,
      totalMentored: 28,
      joinedAt: '1.5 năm trước',
      status: 'active',
    },
    {
      id: '3',
      name: 'KS. Võ Minh Tú',
      email: 'tuvm@startup.vn',
      position: 'CTO',
      department: 'Bên ngoài - StartupVN',
      specializations: ['Blockchain', 'Cryptocurrency', 'Smart Contracts'],
      activeTeams: 1,
      rating: 4.9,
      totalMentored: 12,
      joinedAt: '8 tháng trước',
      status: 'active',
    },
  ];

  const filteredApplications = mentorApplications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredMentors = existingMentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const pendingCount = mentorApplications.filter((app) => app.status === 'pending').length;
  const approvedCount = mentorApplications.filter((app) => app.status === 'approved').length;
  const activeMentorsCount = existingMentors.filter((m) => m.status === 'active').length;

  const handleApprove = (id) => {
    message.success('Đã phê duyệt đăng ký mentor!');
    console.log('Approved mentor application:', id);
  };

  const handleReject = (id) => {
    if (!rejectionReason.trim()) {
      message.warning('Vui lòng nhập lý do từ chối!');
      return;
    }
    message.success('Đã từ chối đăng ký mentor!');
    console.log('Rejected mentor application:', id, 'Reason:', rejectionReason);
    setIsModalVisible(false);
    setSelectedApplication(null);
    setRejectionReason('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge status="processing" text="Chờ duyệt" style={{ color: '#fbbf24' }} />;
      case 'approved':
        return <Badge status="success" text="Đã duyệt" style={{ color: '#10b981' }} />;
      case 'rejected':
        return <Badge status="error" text="Từ chối" style={{ color: '#ef4444' }} />;
      case 'active':
        return <Badge status="success" text="Đang hoạt động" style={{ color: '#3b82f6' }} />;
      case 'inactive':
        return <Badge status="default" text="Tạm ngưng" style={{ color: '#6b7280' }} />;
      default:
        return null;
    }
  };

  const showModal = (application) => {
    setSelectedApplication(application);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedApplication(null);
    setRejectionReason('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(PATH_NAME.CHAPTER_DASHBOARD)}
          className="mb-4 text-gray-400 hover:text-white border-gray-600"
        >
          Quay lại
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            Quản Lý Mentor
          </h1>
          <p className="text-gray-400">Duyệt đăng ký mentor mới và quản lý mentor hiện tại</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <ClockCircleOutlined className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Chờ duyệt</p>
                <p className="text-2xl text-white">{pendingCount}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <ReadOutlined className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Mentor hoạt động</p>
                <p className="text-2xl text-white">{activeMentorsCount}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <StarOutlined className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Đánh giá TB</p>
                <p className="text-2xl text-white">4.8</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <TrophyOutlined className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Teams đã mentor</p>
                <p className="text-2xl text-white">85</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="space-y-6"
          items={[
            {
              key: 'applications',
              label: `Đăng Ký Mới (${pendingCount})`,
              children: (
                <div className="space-y-6">
                  {/* Filters */}
                  <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <Input
                          placeholder="Tìm kiếm theo tên, email, khoa..."
                          prefix={<SearchOutlined className="text-gray-400" />}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div className="w-full md:w-48">
                        <Select
                          value={statusFilter}
                          onChange={setStatusFilter}
                          className="w-full"
                          style={{ width: '100%' }}
                          options={[
                            { value: 'all', label: 'Tất cả trạng thái' },
                            { value: 'pending', label: 'Chờ duyệt' },
                            { value: 'approved', label: 'Đã duyệt' },
                            { value: 'rejected', label: 'Từ chối' },
                          ]}
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Applications List */}
                  <Card
                    className="bg-white/5 border-white/10 backdrop-blur-xl"
                    title={
                      <div className="flex items-center">
                        <UserAddOutlined className="w-5 h-5 mr-2 text-emerald-400" />
                        <span className="text-white">
                          Đăng Ký Mentor ({filteredApplications.length})
                        </span>
                      </div>
                    }
                  >
                    <div className="space-y-4">
                      {filteredApplications.map((application) => (
                        <div
                          key={application.id}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-white">{application.name}</h4>
                              <Tag color="purple">{application.position}</Tag>
                              {getStatusBadge(application.status)}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400 mb-2">
                              <div className="flex items-center">
                                <MailOutlined className="w-3 h-3 mr-1" />
                                {application.email}
                              </div>
                              <div className="flex items-center">
                                <BankOutlined className="w-3 h-3 mr-1" />
                                {application.department}
                              </div>
                              <div className="flex items-center">
                                <StarOutlined className="w-3 h-3 mr-1" />
                                {application.experience} kinh nghiệm
                              </div>
                              <div className="flex items-center">
                                <ClockCircleOutlined className="w-3 h-3 mr-1" />
                                {application.submittedAt}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {application.specializations.slice(0, 3).map((spec, idx) => (
                                <Tag key={idx} color="green">
                                  {spec}
                                </Tag>
                              ))}
                              {application.specializations.length > 3 && (
                                <Tag>+{application.specializations.length - 3}</Tag>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              size="small"
                              icon={<EyeOutlined />}
                              onClick={() => showModal(application)}
                              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
                            >
                              Chi tiết
                            </Button>

                            {application.status === 'pending' && (
                              <>
                                <Button
                                  size="small"
                                  icon={<CheckCircleOutlined />}
                                  onClick={() => handleApprove(application.id)}
                                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
                                />
                                <Button
                                  size="small"
                                  icon={<CloseCircleOutlined />}
                                  onClick={() => showModal(application)}
                                  className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-0"
                                />
                              </>
                            )}
                          </div>
                        </div>
                      ))}

                      {filteredApplications.length === 0 && (
                        <div className="text-center py-12">
                          <UserAddOutlined className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-400">Không có đăng ký mentor nào phù hợp</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              ),
            },
            {
              key: 'mentors',
              label: `Mentor Hiện Tại (${activeMentorsCount})`,
              children: (
                <div className="space-y-6">
                  {/* Search */}
                  <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                    <Input
                      placeholder="Tìm kiếm mentor hiện tại..."
                      prefix={<SearchOutlined className="text-gray-400" />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </Card>

                  {/* Existing Mentors List */}
                  <Card
                    className="bg-white/5 border-white/10 backdrop-blur-xl"
                    title={
                      <div className="flex items-center">
                        <ReadOutlined className="w-5 h-5 mr-2 text-emerald-400" />
                        <span className="text-white">
                          Mentor Hiện Tại ({filteredMentors.length})
                        </span>
                      </div>
                    }
                  >
                    <div className="space-y-4">
                      {filteredMentors.map((mentor) => (
                        <div
                          key={mentor.id}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-white">{mentor.name}</h4>
                              <Tag color="purple">{mentor.position}</Tag>
                              {getStatusBadge(mentor.status)}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400 mb-2">
                              <div className="flex items-center">
                                <MailOutlined className="w-3 h-3 mr-1" />
                                {mentor.email}
                              </div>
                              <div className="flex items-center">
                                <BankOutlined className="w-3 h-3 mr-1" />
                                {mentor.department}
                              </div>
                              <div className="flex items-center">
                                <StarOutlined className="w-3 h-3 mr-1" />
                                {mentor.rating}/5.0 • {mentor.totalMentored} teams
                              </div>
                              <div className="flex items-center">
                                <UserOutlined className="w-3 h-3 mr-1" />
                                {mentor.activeTeams} teams đang mentor
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {mentor.specializations.slice(0, 3).map((spec, idx) => (
                                <Tag key={idx} color="green">
                                  {spec}
                                </Tag>
                              ))}
                              {mentor.specializations.length > 3 && (
                                <Tag>+{mentor.specializations.length - 3}</Tag>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              size="small"
                              icon={<EyeOutlined />}
                              onClick={() => setSelectedMentor(mentor)}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
                            >
                              Xem
                            </Button>
                          </div>
                        </div>
                      ))}

                      {filteredMentors.length === 0 && (
                        <div className="text-center py-12">
                          <ReadOutlined className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-400">Không có mentor nào phù hợp</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              ),
            },
          ]}
        />

        {/* Detail Modal */}
        <Modal
          title="Chi Tiết Đăng Ký Mentor"
          open={isModalVisible}
          onCancel={handleModalCancel}
          footer={null}
          width={800}
          className="chapter-modal"
        >
          {selectedApplication && (
            <div className="space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white block mb-1">Họ tên</label>
                  <p className="text-gray-400">{selectedApplication.name}</p>
                </div>
                <div>
                  <label className="text-white block mb-1">Email</label>
                  <p className="text-gray-400">{selectedApplication.email}</p>
                </div>
                <div>
                  <label className="text-white block mb-1">Điện thoại</label>
                  <p className="text-gray-400">{selectedApplication.phone}</p>
                </div>
                <div>
                  <label className="text-white block mb-1">Chức vụ</label>
                  <p className="text-gray-400">{selectedApplication.position}</p>
                </div>
                <div>
                  <label className="text-white block mb-1">Khoa/Công ty</label>
                  <p className="text-gray-400">{selectedApplication.department}</p>
                </div>
                <div>
                  <label className="text-white block mb-1">Kinh nghiệm</label>
                  <p className="text-gray-400">{selectedApplication.experience}</p>
                </div>
              </div>

              {/* Education & Specializations */}
              <div>
                <label className="text-white block mb-1">Học vấn</label>
                <p className="text-gray-400">{selectedApplication.education}</p>
              </div>

              <div>
                <label className="text-white block mb-1">Chuyên môn</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedApplication.specializations.map((spec, idx) => (
                    <Tag key={idx} color="green">
                      {spec}
                    </Tag>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white block mb-1">CV</label>
                  <p className="text-emerald-400 cursor-pointer">
                    {selectedApplication.cv || 'Chưa cung cấp'}
                  </p>
                </div>
                <div>
                  <label className="text-white block mb-1">Portfolio</label>
                  <p className="text-emerald-400 cursor-pointer">
                    {selectedApplication.portfolio || 'Chưa cung cấp'}
                  </p>
                </div>
              </div>

              {/* Mentor Info */}
              <div>
                <label className="text-white block mb-1">Lý do muốn làm mentor</label>
                <p className="text-gray-400">{selectedApplication.mentorReason}</p>
              </div>

              <div>
                <label className="text-white block mb-1">Thời gian có thể mentor</label>
                <p className="text-gray-400">{selectedApplication.availableTime}</p>
              </div>

              {selectedApplication.previousMentoring && (
                <div>
                  <label className="text-white block mb-1">Kinh nghiệm mentor</label>
                  <p className="text-gray-400">{selectedApplication.previousMentoring}</p>
                </div>
              )}

              {/* Actions */}
              {selectedApplication.status === 'pending' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-white block mb-1">
                      Lý do từ chối (nếu có)
                    </label>
                    <TextArea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Nhập lý do từ chối nếu không phê duyệt..."
                      rows={3}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleApprove(selectedApplication.id)}
                      icon={<CheckCircleOutlined />}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
                    >
                      Phê Duyệt
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedApplication.id)}
                      icon={<CloseCircleOutlined />}
                      className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-0"
                    >
                      Từ Chối
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ChapterMentorManagement;

