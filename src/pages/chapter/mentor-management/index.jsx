import {
  ArrowLeftOutlined,
  BankOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  MailOutlined,
  PhoneOutlined,
  ReadOutlined,
  SearchOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Button, Card, Image, Input, message, Modal, Select, Tabs, Tag, Table } from 'antd';
import {
  FileText,
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

  // Map status to Vietnamese labels - always use Vietnamese, never show English from server
  const statusMap = {
    pending: 'Chờ duyệt',
    approved: 'Đã duyệt',
    rejected: 'Từ chối',
  };

  // Always use Vietnamese label, fallback to 'Không rõ' if not mapped
  const label = statusMap[normalized] || 'Không rõ';
  let classes =
    'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap';

  if (normalized === 'pending') {
    classes += ' border-amber-500/50 text-amber-300 bg-amber-500/20';
  } else if (normalized === 'approved') {
    classes += ' border-emerald-500/50 text-emerald-300 bg-emerald-500/20';
  } else if (normalized === 'rejected') {
    classes += ' border-red-500/50 text-red-300 bg-red-500/20';
  } else {
    classes += ' border-white/10 text-gray-200 bg-white/5';
  }

  return <span className={classes}>{label}</span>;
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

    return list.map((item) => {
      const statusRaw = item.status || 'Pending';
      const statusNormalized = statusRaw.toLowerCase();

      return {
        id: item.id,
        name: item.fullName || item.name,
        email: item.email,
        phone: item.phone,
        position: item.position,
        department: item.chapterName || 'Chapter',
        submittedAt: item.createdAt
          ? new Date(item.createdAt).toLocaleString('vi-VN')
          : '',
        status: statusNormalized, // pending/approved/rejected
        statusRaw, // Pending/Approved/Rejected (original from API)
        statusNormalized, // pending/approved/rejected (normalized)
        cv: item.cv,
        mentorReason: item.reasonToBecomeMentor,
        rejectReason: item.rejectReason,
        hackathonId: item.hackathonId,
        userId: item.userId,
        chapterId: item.chapterId,
        documents: [
          ...(item.cv ? [{ name: 'CV / Portfolio', type: 'file', url: item.cv }] : []),
        ],
      };
    });
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

  const handleApprove = (id, hackathonId) => {
    approveMutation.mutate({ verificationId: id, hackathonId });
  };

  const handleReject = (id, hackathonId) => {
    if (!rejectionReason.trim()) {
      message.warning('Vui lòng nhập lý do từ chối!');
      return;
    }

    rejectMutation.mutate(
      { verificationId: id, reason: rejectionReason, hackathonId },
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

                  {/* Applications List as Table */}
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
                    <Table
                      columns={[
                        {
                          title: 'Tên',
                          dataIndex: 'name',
                          key: 'name',
                          width: 200,
                          ellipsis: { showTitle: false },
                          render: (value, record) => (
                            <div className="flex items-center gap-2 text-white min-w-0">
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {value?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="font-medium truncate" title={value}>{value}</span>
                                <span className="text-gray-400 text-xs truncate" title={record.department}>{record.department}</span>
                              </div>
                            </div>
                          ),
                        },
                        {
                          title: 'Email',
                          dataIndex: 'email',
                          key: 'email',
                          width: 200,
                          ellipsis: { showTitle: false },
                          render: (val) => (
                            <span className="text-gray-300 truncate block" title={val}>{val}</span>
                          ),
                        },
                        {
                          title: 'Điện thoại',
                          dataIndex: 'phone',
                          key: 'phone',
                          width: 150,
                          ellipsis: { showTitle: false },
                          render: (val) => (
                            <span className="text-gray-300 truncate block" title={val}>{val || '—'}</span>
                          ),
                        },
                        {
                          title: 'Chức vụ',
                          dataIndex: 'position',
                          key: 'position',
                          width: 150,
                          ellipsis: { showTitle: false },
                          render: (val) => (
                            <Tag color="purple" className="truncate max-w-full" title={val}>
                              {val || '—'}
                            </Tag>
                          ),
                        },
                        {
                          title: 'Trạng thái',
                          dataIndex: 'status',
                          key: 'status',
                          width: 120,
                          render: (status) => <StatusBadge status={status} />,
                        },
                        {
                          title: 'CV/Portfolio',
                          key: 'cv',
                          width: 120,
                          render: (_, record) =>
                            record.cv ? (
                              <a
                                href={record.cv}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:text-emerald-300 whitespace-nowrap"
                              >
                                Xem
                              </a>
                            ) : (
                              <span className="text-gray-500 text-xs italic">Chưa có</span>
                            ),
                        },
                        {
                          title: 'Ngày gửi',
                          dataIndex: 'submittedAt',
                          key: 'submittedAt',
                          width: 180,
                          ellipsis: { showTitle: false },
                          render: (val) => (
                            <span className="text-gray-300 truncate block" title={val}>{val || '—'}</span>
                          ),
                        },
                        {
                          title: 'Thao tác',
                          key: 'actions',
                          width: 180,
                          fixed: 'right',
                          render: (_, record) => {
                            const isPending = record.status === 'pending';
                            return (
                              <div className="flex items-center gap-2 flex-wrap">
                                <Button
                                  size="small"
                                  icon={<EyeOutlined />}
                                  onClick={() => showModal(record)}
                                  className="bg-white/5 text-white border-white/20 whitespace-nowrap"
                                >
                                  Xem
                                </Button>
                                {isPending && (
                                  <>
                                    <Button
                                      size="small"
                                      icon={<CheckCircleOutlined />}
                                      onClick={() => handleApprove(record.id, record.hackathonId)}
                                      className="bg-emerald-600 text-white border-0"
                                      loading={approveMutation.isPending}
                                      title="Phê duyệt"
                                    />
                                    <Button
                                      size="small"
                                      icon={<CloseCircleOutlined />}
                                      onClick={() => showModal(record)}
                                      className="bg-red-600 text-white border-0"
                                      loading={rejectMutation.isPending}
                                      title="Từ chối"
                                    />
                                  </>
                                )}
                              </div>
                            );
                          },
                        },
                      ]}
                      dataSource={filteredApplications}
                      rowKey="id"
                      pagination={{ pageSize: 8, showSizeChanger: true }}
                      scroll={{ x: 'max-content' }}
                      className="[&_.ant-table]:bg-transparent [&_th]:!bg-white/5 [&_th]:!text-white [&_td]:!text-gray-300 [&_td]:border-white/10 [&_th]:border-white/10 [&_tr:hover_td]:!bg-white/5"
                    />
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
                                <PhoneOutlined className="w-3 h-3 mr-1" />
                                {mentor.phone}
                              </div>
                              <div className="flex items-center">
                                <BankOutlined className="w-3 h-3 mr-1" />
                                {mentor.department}
                              </div>
                              {mentor.submittedAt && (
                                <div className="flex items-center">
                                  <ClockCircleOutlined className="w-3 h-3 mr-1" />
                                  {mentor.submittedAt}
                                </div>
                              )}
                            </div>

                            {mentor.mentorReason && (
                              <div className="text-sm text-gray-400 mb-2">
                                <FileTextOutlined className="w-3 h-3 mr-1" />
                                <span className="italic">&ldquo;{mentor.mentorReason}&rdquo;</span>
                              </div>
                            )}

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

                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              size="small"
                              icon={<EyeOutlined />}
                              onClick={() => showModal(mentor)}
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
                  <label className="text-white block mb-1">Trạng thái</label>
                  <div><StatusBadge status={selectedApplication.status} /></div>
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
              </div>


              {/* Documents & Links */}
              <div>
                <label className="text-white mb-2 block">Tài liệu đính kèm</label>
                {selectedApplication.documents?.length === 0 ? (
                  <p className="text-gray-400 text-sm">Không có tài liệu</p>
                ) : (
                  <Image.PreviewGroup>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedApplication.documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white/5 rounded border border-white/10 flex items-center gap-3"
                        >
                          <div className="w-20 h-14 overflow-hidden rounded border border-white/10 bg-black/20 flex items-center justify-center">
                            {doc.type === 'image' ? (
                              <Image
                                src={doc.url}
                                alt={doc.name}
                                width={80}
                                height={56}
                                style={{ objectFit: 'cover' }}
                                preview={{ src: doc.url }}
                                fallback=""
                              />
                            ) : (
                              <FileText size={20} className="text-emerald-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <FileText size={14} className="text-emerald-400" />
                              <span className="text-white text-sm truncate">{doc.name}</span>
                              <Tag>{doc.type?.toUpperCase()}</Tag>
                            </div>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 text-xs hover:text-emerald-300 underline"
                            >
                              Mở tài liệu
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Image.PreviewGroup>
                )}
              </div>

              {/* Mentor Info */}
              <div>
                <label className="text-white block mb-1">Lý do muốn làm mentor</label>
                <p className="text-gray-400">{selectedApplication.mentorReason || '—'}</p>
              </div>

              {selectedApplication.availableTime && (
                <div>
                  <label className="text-white block mb-1">Thời gian có thể mentor</label>
                  <p className="text-gray-400">{selectedApplication.availableTime}</p>
                </div>
              )}

              {selectedApplication.previousMentoring && (
                <div>
                  <label className="text-white block mb-1">Kinh nghiệm mentor</label>
                  <p className="text-gray-400">{selectedApplication.previousMentoring}</p>
                </div>
              )}

              {/* Rejection Reason (if rejected) */}
              {selectedApplication.status === 'rejected' && selectedApplication.rejectReason && (
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                  <label className="text-red-300 block mb-1 font-semibold">Lý do từ chối:</label>
                  <p className="text-red-200/80">{selectedApplication.rejectReason}</p>
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
                      onClick={() => handleApprove(selectedApplication.id, selectedApplication.hackathonId)}
                      icon={<CheckCircleOutlined />}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
                    >
                      Phê Duyệt
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedApplication.id, selectedApplication.hackathonId)}
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

