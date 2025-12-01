import {
  ArrowLeftOutlined,
  BankOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  MailOutlined,
  ReadOutlined,
  SearchOutlined,
  StarOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Card, Input, message, Modal, Select, Tabs, Tag } from 'antd';
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  FileText,
  Mail as MailIcon,
  Phone as PhoneIcon,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../../constants';
import {
  useApproveMentorVerification,
  useGetMentorVerifications,
  useRejectMentorVerification,
} from '../../../hooks/chapter/mentor-verification';

const { TextArea } = Input;

const StatusBadge = ({ status }) => {
  const normalized = (status || '').toLowerCase();

  let label = 'Không rõ';
  let classes =
    'px-2.5 py-0.5 rounded-full text-xs font-semibold border border-white/10 text-gray-200 bg-white/5';

  if (normalized === 'pending') {
    label = 'Chờ duyệt';
    classes =
      'px-2.5 py-0.5 rounded-full text-xs font-semibold border border-amber-500/40 text-amber-300 bg-amber-500/10';
  } else if (normalized === 'approved') {
    label = 'Đã duyệt';
    classes =
      'px-2.5 py-0.5 rounded-full text-xs font-semibold border border-emerald-500/40 text-emerald-300 bg-emerald-500/10';
  } else if (normalized === 'rejected') {
    label = 'Từ chối';
    classes =
      'px-2.5 py-0.5 rounded-full text-xs font-semibold border border-red-500/40 text-red-300 bg-red-500/10';
  }

  return <span className={classes}>{label}</span>;
};

const RequestCard = ({ item, onApprove, onReject }) => {
  const isPending = (item.status || '').toLowerCase() === 'pending';
  const isRejected = (item.status || '').toLowerCase() === 'rejected';

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/20 backdrop-blur-xl transition-all duration-300 flex flex-col h-full group">
      {/* Header Info */}
      <div className="p-5 border-b border-white/10 flex justify-between items-start bg-darkv2-secondary/80">
        <div className="flex gap-3">
          {/* Avatar Placeholder */}
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-300 font-bold text-lg border border-white/10">
            {(item.name || '?').charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
              {item.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
              <Briefcase size={12} />
              <span>{item.position}</span>
              {item.chapterName && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                  <span>{item.chapterName}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <StatusBadge status={item.status} />
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 space-y-4">
        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 p-2 rounded border border-white/10">
            <MailIcon size={14} className="text-gray-400" />
            <span className="truncate" title={item.email}>
              {item.email}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 p-2 rounded border border-white/10">
            <PhoneIcon size={14} className="text-gray-400" />
            <span>{item.phone}</span>
          </div>
        </div>

        {/* Reason */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase mb-1.5 flex items-center gap-1.5">
            <AlertCircle size={12} /> Lý do đăng ký
          </p>
          <div className="text-sm text-gray-200 bg-white/5 p-3 rounded-lg border border-white/10 italic leading-relaxed">
            {item.mentorReason ? `"${item.mentorReason}"` : 'Không có thông tin'}
          </div>
        </div>

        {/* Reject Reason (if any) */}
        {isRejected && item.rejectReason && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
            <p className="text-xs font-bold text-red-300 mb-1">Lý do từ chối:</p>
            <p className="text-sm text-red-200/80">{item.rejectReason}</p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-darkv2-secondary/90 border-t border-white/10 flex items-center justify-between gap-3">
        {/* CV Link */}
        {item.cv ? (
          <a
            href={item.cv}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
          >
            <FileText size={14} />
            Xem CV / Portfolio
            <ExternalLink size={10} />
          </a>
        ) : (
          <span className="text-xs text-gray-500 italic">Không có CV</span>
        )}

        {/* Approval Actions (Only show if Pending) */}
        {isPending ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onReject && onReject(item)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 border border-transparent transition-all text-xs font-semibold"
            >
              <XCircle size={14} /> Từ chối
            </button>
            <button
              type="button"
              onClick={() => onApprove && onApprove(item)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all text-xs font-semibold"
            >
              <CheckCircle2 size={14} /> Duyệt ngay
            </button>
          </div>
        ) : (
          <div className="text-xs text-gray-500 italic">Đã xử lý hồ sơ</div>
        )}
      </div>
    </div>
  );
};

const ChapterMentorManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('applications');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: mentorVerificationsData } = useGetMentorVerifications();
  const approveMutation = useApproveMentorVerification();
  const rejectMutation = useRejectMentorVerification();

  const mentorApplications = useMemo(() => {
    const raw = mentorVerificationsData;

    const list = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw?.notifications)
      ? raw.notifications
      : [];

    return list.map((item) => ({
      id: item.id,
      name: item.fullName || item.name,
      email: item.email,
      phone: item.phone,
      position: item.position,
      department: item.chapterName || 'Chapter',
      experience: item.experience || '',
      specializations: item.specializations || [],
      education: item.education || '',
      submittedAt: item.createdAt
        ? new Date(item.createdAt).toLocaleString('vi-VN')
        : '',
      status: (item.status || '').toLowerCase(), // Pending/Approved/Rejected -> pending/approved/rejected
      cv: item.cv,
      mentorReason: item.reasonToBecomeMentor,
      rejectReason: item.rejectReason,
      availableTime: item.availableTime || '',
      previousMentoring: item.previousMentoring || '',
    }));
  }, [mentorVerificationsData]);

  const approvedMentors = useMemo(
    () => mentorApplications.filter((app) => app.status === 'approved'),
    [mentorApplications],
  );

   const filteredApplications = mentorApplications.filter((app) => {
     const query = searchTerm.toLowerCase();
     const matchesSearch =
       app.name.toLowerCase().includes(query) ||
       app.email.toLowerCase().includes(query) ||
       (app.department || '').toLowerCase().includes(query);
     const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
     return matchesSearch && matchesStatus;
   });

   const filteredMentors = approvedMentors.filter((mentor) => {
     const query = searchTerm.toLowerCase();
     const matchesSearch =
       mentor.name.toLowerCase().includes(query) ||
       mentor.email.toLowerCase().includes(query) ||
       (mentor.department || '').toLowerCase().includes(query);
     return matchesSearch;
   });

  const pendingCount = mentorApplications.filter((app) => app.status === 'pending').length;
  const activeMentorsCount = approvedMentors.length;

  const handleApprove = (id) => {
    approveMutation.mutate({ verificationId: id });
  };

  const handleReject = (id) => {
    if (!rejectionReason.trim()) {
      message.warning('Vui lòng nhập lý do từ chối!');
      return;
    }

    rejectMutation.mutate(
      { verificationId: id, reason: rejectionReason },
      {
        onSuccess: () => {
          setIsModalVisible(false);
          setSelectedApplication(null);
          setRejectionReason('');
        },
      },
    );
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                <p className="text-sm text-gray-400">Mentor đã duyệt</p>
                <p className="text-2xl text-white">{activeMentorsCount}</p>
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
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {filteredApplications.map((application) => (
                         <RequestCard
                           key={application.id}
                           item={application}
                           onApprove={(app) => handleApprove(app.id)}
                           onReject={(app) => showModal(app)}
                         />
                       ))}

                       {filteredApplications.length === 0 && (
                         <div className="col-span-full text-center py-12">
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
                               <StatusBadge status={mentor.status} />
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

