import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Card, Empty, Spin, Tag } from 'antd';
import dayjs from 'dayjs';

const JoinRequestsTab = ({ joinRequests, joinRequestsLoading }) => {
  const getJoinRequestStatusTag = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Tag icon={<ClockCircleOutlined />} color="orange">Đang chờ</Tag>;
      case 'approved':
        return <Tag icon={<CheckCircleOutlined />} color="green">Đã chấp nhận</Tag>;
      case 'rejected':
        return <Tag icon={<CloseCircleOutlined />} color="red">Đã từ chối</Tag>;
      default:
        return <Tag color="default">{status || 'Unknown'}</Tag>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Join Requests */}
      <Card className="bg-card-background border border-card-border backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Yêu cầu tham gia đội
        </h3>
        {joinRequestsLoading ? (
          <div className="flex justify-center py-8">
            <Spin />
          </div>
        ) : joinRequests && joinRequests.length > 0 ? (
          <div className="space-y-3">
            {joinRequests.map((request) => (
              <Card
                key={request.requestId || request.id}
                className="bg-card-background/50 border border-card-border"
                size="small"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-text-primary font-medium">
                        {request.teamName || 'Đội không xác định'}
                      </h4>
                      {getJoinRequestStatusTag(request.status)}
                    </div>
                    {request.message && (
                      <p className="text-text-secondary text-sm mb-2">
                        {request.message}
                      </p>
                    )}
                    {request.createdAt && (
                      <p className="text-muted-foreground text-xs">
                        Gửi lúc: {dayjs(request.createdAt).format('DD/MM/YYYY HH:mm')}
                      </p>
                    )}
                    {request.leaderResponse && (
                      <p className="text-text-secondary text-sm mt-2">
                        Phản hồi: {request.leaderResponse}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Empty description="Không có yêu cầu tham gia đội nào" />
        )}
      </Card>
    </div>
  );
};

export default JoinRequestsTab;


