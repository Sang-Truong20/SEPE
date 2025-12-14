import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  MailOutlined,
  ReadOutlined,
  SearchOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Image,
  Input,
  message,
  Modal,
  Select,
  Spin,
  Tag
} from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../../constants';
import {
  useApproveStudentVerification,
  useGetPendingOrRejectedStudentVerifications,
  useRejectStudentVerification,
} from '../../../hooks/chapter/student-verification';

const { TextArea } = Input;

const ChapterVerifyStudents = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: verificationsData, isLoading } = useGetPendingOrRejectedStudentVerifications();
  const approveMutation = useApproveStudentVerification();
  const rejectMutation = useRejectStudentVerification();

  // Transform API data to match component structure
  const verificationRequests = useMemo(() => {
    if (!verificationsData) return [];
    
    const data = Array.isArray(verificationsData) 
      ? verificationsData 
      : Array.isArray(verificationsData?.data) 
      ? verificationsData.data 
      : [];

    return data.map((item) => ({
      id: item.verificationId || item.id,
      studentName: item.fullName || item.studentName,
      studentId: item.studentCode || item.studentId,
      email: item.email,
      major: item.major,
      year: item.yearOfAdmission ? `Năm ${item.yearOfAdmission}` : item.year,
      semester: item.semester || 'N/A',
      submittedAt: item.submittedAt || item.createdAt || 'N/A',
      status: item.status?.toLowerCase() || 'pending',
      documents: [
        ...(item.frontCardImage ? [{ name: 'Mặt trước thẻ SV', type: 'image', url: item.frontCardImage }] : []),
        ...(item.backCardImage ? [{ name: 'Mặt sau thẻ SV', type: 'image', url: item.backCardImage }] : []),
      ],
      rejectionReason: item.rejectionReason || item.rejectReason,
      additionalInfo: item.additionalInfo,
    }));
  }, [verificationsData]);

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

  const handleApprove = async (id) => {
    try {
      await approveMutation.mutateAsync(id);
      setIsModalVisible(false);
      setSelectedVerification(null);
    } catch (error) {
      console.error('Approve error:', error);
    }
  };

  const handleReject = async (id) => {
    if (!rejectionReason.trim()) {
      message.warning('Vui lòng nhập lý do từ chối!');
      return;
    }
    try {
      await rejectMutation.mutateAsync({ verificationId: id, reason: rejectionReason });
      setIsModalVisible(false);
      setSelectedVerification(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Reject error:', error);
    }
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : (
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
          )}
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
                {selectedVerification.documents.length === 0 ? (
                  <p className="text-gray-400 text-sm">Không có tài liệu</p>
                ) : (
                  <Image.PreviewGroup>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedVerification.documents.map((doc, idx) => (
                    <div
                      key={idx}
                          className="p-3 bg-white/5 rounded border border-white/10 flex items-center gap-3"
                        >
                          <div className="w-20 h-14 overflow-hidden rounded border border-white/10 bg-black/20 flex items-center justify-center">
                            <Image
                              src={doc.url}
                              alt={doc.name}
                              width={80}
                              height={56}
                              style={{ objectFit: 'cover' }}
                              preview={{ src: doc.url }}
                              fallback=""
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <FileTextOutlined className="text-emerald-400" />
                              <span className="text-white text-sm truncate">{doc.name}</span>
                              <Tag>{doc.type?.toUpperCase()}</Tag>
                      </div>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 text-xs hover:text-emerald-300 underline"
                      >
                              Mở ảnh
                            </a>
                          </div>
                    </div>
                  ))}
                </div>
                  </Image.PreviewGroup>
                )}
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
                      loading={approveMutation.isPending}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      Phê Duyệt
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedVerification.id)}
                      icon={<CloseCircleOutlined />}
                      className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-0"
                      loading={rejectMutation.isPending}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
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

