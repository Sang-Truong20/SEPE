import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MailOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Button, Card, Empty, Input, Modal, Select, Spin, Tag, message } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useRespondToTeamJoinRequest } from '../../../../hooks/student/team-join-request';

const { TextArea } = Input;

const TeamJoinRequestsTab = ({
  requests,
  isLoading,
  onRefetchRequests,
  onRefetchTeamDetail,
}) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Approved'); // 'Approved' or 'Rejected'

  const respondMutation = useRespondToTeamJoinRequest({
    onSuccess: async () => {
      message.success(
        selectedStatus === 'Approved'
          ? 'Đã chấp nhận yêu cầu tham gia đội!'
          : 'Đã từ chối yêu cầu tham gia đội!',
      );
      setIsModalVisible(false);
      setSelectedRequest(null);
      setResponseMessage('');
      setSelectedStatus('Approved');

      // Refetch join requests list
      if (onRefetchRequests) {
        await onRefetchRequests();
      }

      // Refetch team detail to update counts
      if (onRefetchTeamDetail) {
        await onRefetchTeamDetail();
      }
    },
    onError: (error) => {
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        'Có lỗi xảy ra khi phản hồi yêu cầu. Vui lòng thử lại.';
      message.error(errorMsg);
    },
  });

  const getStatusTag = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return (
          <Tag icon={<ClockCircleOutlined />} color="orange">
            Đang chờ
          </Tag>
        );
      case 'approved':
        return (
          <Tag icon={<CheckCircleOutlined />} color="green">
            Đã chấp nhận
          </Tag>
        );
      case 'rejected':
        return (
          <Tag icon={<CloseCircleOutlined />} color="red">
            Đã từ chối
          </Tag>
        );
      default:
        return <Tag color="default">{status || 'Unknown'}</Tag>;
    }
  };

  const handleOpenModal = (request) => {
    setSelectedRequest(request);
    setSelectedStatus('Approved'); // Default to Approved
    setResponseMessage('');
    setIsModalVisible(true);
  };

  const handleRespond = () => {
    if (!selectedRequest) return;

    respondMutation.mutate({
      requestId: selectedRequest.requestId,
      status: selectedStatus, // 'Approved' or 'Rejected'
      leaderResponse: responseMessage || undefined,
      teamId: selectedRequest.teamId,
    });
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    setSelectedRequest(null);
    setResponseMessage('');
    setSelectedStatus('Approved');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spin size="large" />
      </div>
    );
  }

  // If no requests at all, show single empty message
  if (!requests || requests.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <Empty
            description="Không có yêu cầu tham gia đội nào"
            className="py-12"
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">
          Yêu cầu tham gia đội
        </h3>
        <div className="space-y-4">
          {requests.map((request) => {
            const isPending = request.status?.toLowerCase() === 'pending';

            return (
              <Card
                key={request.requestId}
                className={`bg-white/5 border-white/10 transition-colors ${
                  isPending
                    ? 'hover:border-green-500/50'
                    : 'opacity-90'
                }`}
                size="small"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <TeamOutlined
                        className={isPending ? 'text-green-400 text-lg' : 'text-gray-400'}
                      />
                      <h4
                        className={`${
                          isPending
                            ? 'text-white font-semibold text-base'
                            : 'text-white font-medium'
                        }`}
                      >
                        {request.teamName || 'Đội không xác định'}
                      </h4>
                      {getStatusTag(request.status)}
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-gray-300">
                        <UserOutlined />
                        <span className={isPending ? 'font-medium' : ''}>
                          {request.userName}
                        </span>
                        {!isPending && (
                          <span className="text-gray-500">
                            ({request.userEmail})
                          </span>
                        )}
                      </div>
                      {isPending && (
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <MailOutlined />
                          <span>{request.userEmail}</span>
                        </div>
                      )}
                    </div>

                    {request.message && (
                      <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
                        <p className="text-gray-300 text-sm">
                          <span className="font-medium">Lời nhắn:</span>{' '}
                          {request.message}
                        </p>
                      </div>
                    )}

                    {request.leaderResponse && (
                      <div className="bg-gray-800/50 rounded-lg p-2 mb-2">
                        <p className="text-gray-300 text-sm">
                          <span className="font-medium">Phản hồi:</span>{' '}
                          {request.leaderResponse}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>
                        Gửi:{' '}
                        {dayjs(request.createdAt).format('DD/MM/YYYY HH:mm')}
                      </span>
                      {request.respondedAt && (
                        <span>
                          Xử lý:{' '}
                          {dayjs(request.respondedAt).format(
                            'DD/MM/YYYY HH:mm',
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {isPending && (
                    <div className="flex flex-col gap-2">
                      <Button
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleOpenModal(request)}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-0"
                      >
                        Phản hồi
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      {/* Response Modal */}
      <Modal
        title="Phản hồi yêu cầu tham gia đội"
        open={isModalVisible}
        onOk={handleRespond}
        onCancel={handleCancelModal}
        okText="Gửi phản hồi"
        cancelText="Hủy"
        okButtonProps={{
          className:
            selectedStatus === 'Approved'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-0'
              : 'bg-red-500 hover:bg-red-600 border-0',
          danger: selectedStatus === 'Rejected',
          loading: respondMutation.isPending,
        }}
        className="[&_.ant-modal-content]:bg-gray-900/95 [&_.ant-modal-content]:backdrop-blur-xl [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white [&_.ant-modal-mask]:bg-black/50"
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div>
              <p className="text-gray-300 mb-2">
                <span className="font-medium">Người yêu cầu:</span>{' '}
                {selectedRequest.userName} ({selectedRequest.userEmail})
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-medium">Đội:</span>{' '}
                {selectedRequest.teamName}
              </p>
              {selectedRequest.message && (
                <div className="bg-gray-800/50 rounded-lg p-3 mb-2">
                  <p className="text-gray-300 text-sm">
                    <span className="font-medium">Lời nhắn:</span>{' '}
                    {selectedRequest.message}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-white mb-2">
                Trạng thái <span className="text-red-400">*</span>
              </label>
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                className="w-full [&_.ant-select-selector]:bg-gray-800/50 [&_.ant-select-selector]:border-gray-700 [&_.ant-select-selection-item]:text-white"
                options={[
                  {
                    value: 'Approved',
                    label: 'Đã chấp nhận',
                  },
                  {
                    value: 'Rejected',
                    label: 'Đã từ chối',
                  },
                ]}
              />
            </div>

            <div>
              <label className="block text-white mb-2">
                {selectedStatus === 'Approved'
                  ? 'Lời nhắn phản hồi (tùy chọn)'
                  : 'Lý do từ chối (tùy chọn)'}
              </label>
              <TextArea
                rows={4}
                placeholder={
                  selectedStatus === 'Approved'
                    ? 'Nhập lời nhắn chào mừng...'
                    : 'Nhập lý do từ chối...'
                }
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TeamJoinRequestsTab;

