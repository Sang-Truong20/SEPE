import { useState } from 'react';
import {
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  ReadOutlined,
  CalendarOutlined,
  MailOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import {
  Card,
  Badge,
  Button,
  Input,
  Select,
  Modal,
  Form,
  message,
  Space,
  Tag,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../../constants';

const { TextArea } = Input;

const ChapterVerifyStudents = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const verificationRequests = [
    {
      id: '1',
      studentName: 'Nguyễn Văn An',
      studentId: 'SE123456',
      email: 'anvn@fpt.edu.vn',
      major: 'Software Engineering',
      year: 'Năm 3',
      semester: 'Spring 2024',
      submittedAt: '2 giờ trước',
      status: 'pending',
      documents: [
        { name: 'student_card_front.jpg', type: 'image', url: '#' },
        { name: 'student_card_back.jpg', type: 'image', url: '#' },
        { name: 'transcript.pdf', type: 'pdf', url: '#' },
      ],
      additionalInfo: 'Sinh viên đang học kỳ 5, chuyên ngành AI',
    },
    {
      id: '2',
      studentName: 'Trần Thị Bình',
      studentId: 'AI789012',
      email: 'binhtt@fpt.edu.vn',
      major: 'Artificial Intelligence',
      year: 'Năm 2',
      semester: 'Spring 2024',
      submittedAt: '4 giờ trước',
      status: 'pending',
      documents: [
        { name: 'student_id.jpg', type: 'image', url: '#' },
        { name: 'enrollment_cert.pdf', type: 'pdf', url: '#' },
      ],
    },
    {
      id: '3',
      studentName: 'Lê Hoàng Cường',
      studentId: 'CS345678',
      email: 'cuonglh@fpt.edu.vn',
      major: 'Computer Science',
      year: 'Năm 4',
      semester: 'Spring 2024',
      submittedAt: '1 ngày trước',
      status: 'approved',
      documents: [{ name: 'student_card.jpg', type: 'image', url: '#' }],
    },
    {
      id: '4',
      studentName: 'Phạm Minh Đức',
      studentId: 'IS111222',
      email: 'ducpm@fpt.edu.vn',
      major: 'Information Systems',
      year: 'Năm 1',
      semester: 'Spring 2024',
      submittedAt: '2 ngày trước',
      status: 'rejected',
      documents: [{ name: 'blurry_card.jpg', type: 'image', url: '#' }],
      rejectionReason: 'Hình ảnh thẻ sinh viên không rõ ràng, không thể xác thực thông tin',
    },
  ];

  const filteredRequests = verificationRequests.filter((request) => {
    const matchesSearch =
      request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = verificationRequests.filter((r) => r.status === 'pending').length;
  const approvedCount = verificationRequests.filter((r) => r.status === 'approved').length;
  const rejectedCount = verificationRequests.filter((r) => r.status === 'rejected').length;

  const handleApprove = (id) => {
    message.success('Đã phê duyệt xác thực sinh viên!');
    console.log('Approved verification:', id);
  };

  const handleReject = (id) => {
    if (!rejectionReason.trim()) {
      message.warning('Vui lòng nhập lý do từ chối!');
      return;
    }
    message.success('Đã từ chối xác thực sinh viên!');
    console.log('Rejected verification:', id, 'Reason:', rejectionReason);
    setIsModalVisible(false);
    setSelectedVerification(null);
    setRejectionReason('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <Badge
            status="processing"
            text="Chờ duyệt"
            style={{ color: '#fbbf24' }}
          />
        );
      case 'approved':
        return (
          <Badge status="success" text="Đã duyệt" style={{ color: '#10b981' }} />
        );
      case 'rejected':
        return (
          <Badge status="error" text="Từ chối" style={{ color: '#ef4444' }} />
        );
      default:
        return null;
    }
  };

  const showModal = (request) => {
    setSelectedVerification(request);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedVerification(null);
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
            Duyệt Xác Thực Sinh Viên
          </h1>
          <p className="text-gray-400">
            Xem xét và phê duyệt yêu cầu xác thực từ sinh viên FPT University
          </p>
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
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircleOutlined className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Đã duyệt</p>
                <p className="text-2xl text-white">{approvedCount}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <CloseCircleOutlined className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Từ chối</p>
                <p className="text-2xl text-white">{rejectedCount}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <UserOutlined className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Tổng cộng</p>
                <p className="text-2xl text-white">{verificationRequests.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo tên, MSSV, email..."
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

        {/* Verification Requests */}
        <Card
          className="bg-white/5 border-white/10 backdrop-blur-xl"
          title={
            <div className="flex items-center">
              <UserOutlined className="w-5 h-5 mr-2 text-emerald-400" />
              <span className="text-white">
                Danh Sách Yêu Cầu ({filteredRequests.length})
              </span>
            </div>
          }
        >
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-white">{request.studentName}</h4>
                    <Tag color="green">{request.studentId}</Tag>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400 mb-2">
                    <div className="flex items-center">
                      <MailOutlined className="w-3 h-3 mr-1" />
                      {request.email}
                    </div>
                    <div className="flex items-center">
                      <ReadOutlined className="w-3 h-3 mr-1" />
                      {request.major} • {request.year}
                    </div>
                    <div className="flex items-center">
                      <CalendarOutlined className="w-3 h-3 mr-1" />
                      {request.semester}
                    </div>
                    <div className="flex items-center">
                      <ClockCircleOutlined className="w-3 h-3 mr-1" />
                      {request.submittedAt}
                    </div>
                  </div>

                  <div className="flex items-center text-xs text-gray-400">
                    <FileTextOutlined className="w-3 h-3 mr-1" />
                    {request.documents.length} tài liệu đính kèm
                  </div>

                    {request.rejectionReason && (
                      <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-200">
                        <ExclamationCircleOutlined className="w-3 h-3 inline mr-1" />
                        Lý do từ chối: {request.rejectionReason}
                      </div>
                    )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => showModal(request)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
                  >
                    Xem
                  </Button>

                  {request.status === 'pending' && (
                    <>
                      <Button
                        size="small"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleApprove(request.id)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
                      />
                      <Button
                        size="small"
                        icon={<CloseCircleOutlined />}
                        onClick={() => showModal(request)}
                        className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-0"
                      />
                    </>
                  )}
                </div>
              </div>
            ))}

            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <UserOutlined className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Không có yêu cầu xác thực nào phù hợp</p>
              </div>
            )}
          </div>
        </Card>

        {/* Detail Modal */}
        <Modal
          title="Chi Tiết Xác Thực Sinh Viên"
          open={isModalVisible}
          onCancel={handleModalCancel}
          footer={null}
          width={800}
          className="chapter-modal"
        >
          {selectedVerification && (
            <div className="space-y-6">
              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white block mb-1">Họ tên</label>
                  <p className="text-gray-400">{selectedVerification.studentName}</p>
                </div>
                <div>
                  <label className="text-white block mb-1">MSSV</label>
                  <p className="text-gray-400">{selectedVerification.studentId}</p>
                </div>
                <div>
                  <label className="text-white block mb-1">Email</label>
                  <p className="text-gray-400">{selectedVerification.email}</p>
                </div>
                <div>
                  <label className="text-white block mb-1">Chuyên ngành</label>
                  <p className="text-gray-400">{selectedVerification.major}</p>
                </div>
                <div>
                  <label className="text-white block mb-1">Năm học</label>
                  <p className="text-gray-400">{selectedVerification.year}</p>
                </div>
                <div>
                  <label className="text-white block mb-1">Học kỳ</label>
                  <p className="text-gray-400">{selectedVerification.semester}</p>
                </div>
              </div>

              {/* Documents */}
              <div>
                <label className="text-white mb-2 block">Tài liệu đính kèm</label>
                <div className="space-y-2">
                  {selectedVerification.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10"
                    >
                      <div className="flex items-center space-x-2">
                        <FileTextOutlined className="w-4 h-4 text-emerald-400" />
                        <span className="text-white text-sm">{doc.name}</span>
                        <Tag>{doc.type.toUpperCase()}</Tag>
                      </div>
                      <Button
                        size="small"
                        icon={<DownloadOutlined />}
                        className="text-emerald-400 hover:bg-emerald-400/10 border-0"
                      >
                        Tải
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              {selectedVerification.additionalInfo && (
                <div>
                  <label className="text-white block mb-1">Thông tin bổ sung</label>
                  <p className="text-gray-400">{selectedVerification.additionalInfo}</p>
                </div>
              )}

              {/* Actions */}
              {selectedVerification.status === 'pending' && (
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
                      onClick={() => handleApprove(selectedVerification.id)}
                      icon={<CheckCircleOutlined />}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
                    >
                      Phê Duyệt
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedVerification.id)}
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

export default ChapterVerifyStudents;

