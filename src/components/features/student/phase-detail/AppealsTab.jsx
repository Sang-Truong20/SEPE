import { FileTextOutlined } from '@ant-design/icons';
import { Spin, Tag } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetTeamPhaseAppeals } from '../../../../hooks/student/appeal';
import { useGetCriteriaByPhase } from '../../../../hooks/student/criterion';

const AppealsTab = ({ teamId }) => {
  const { phaseId } = useParams();

  // Get appeals for team in current phase
  const { data: appealsData = [], isLoading: appealsLoading } = useGetTeamPhaseAppeals(
    teamId,
    phaseId,
    { enabled: !!teamId && !!phaseId }
  );

  const appeals = Array.isArray(appealsData)
    ? appealsData
    : Array.isArray(appealsData?.data)
      ? appealsData.data
      : [];

  // Get criteria for mapping criterionId to name
  const { data: criteriaData } = useGetCriteriaByPhase(phaseId);
  const criteria = React.useMemo(() => {
    if (!criteriaData) return [];
    return Array.isArray(criteriaData)
      ? criteriaData
      : Array.isArray(criteriaData?.data)
        ? criteriaData.data
        : [];
  }, [criteriaData]);
  if (appealsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spin size="large" />
      </div>
    );
  }

  if (appeals.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileTextOutlined className="text-4xl mb-2 opacity-50" />
        <p className="text-sm">Không có appeal nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {appeals.map((appeal) => {
        // Find criterion name for score appeals
        const criterionName = appeal.appealType === 'Score' && appeal.adjustmentId
          ? criteria.find(c => (c.criterionId || c.id) === appeal.adjustmentId)?.name
          : null;
        
        return (
          <div
            key={appeal.appealId || appeal.id}
            className={`p-3 rounded-lg border ${
              appeal.status === 'Approved'
                ? 'bg-green-500/10 border-green-500/20'
                : appeal.status === 'Rejected'
                  ? 'bg-red-500/10 border-red-500/20'
                  : 'bg-yellow-500/10 border-yellow-500/20'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-semibold text-sm ${
                    appeal.status === 'Approved'
                      ? 'text-green-400'
                      : appeal.status === 'Rejected'
                        ? 'text-red-400'
                        : 'text-yellow-400'
                  }`}>
                    {appeal.appealType === 'Score' && criterionName
                      ? `Phúc khảo điểm: ${criterionName}`
                      : appeal.appealType === 'Penalty'
                        ? 'Kháng cáo Penalty'
                        : appeal.appealType || 'Appeal'}
                  </span>
                  <Tag
                    color={
                      appeal.status === 'Approved'
                        ? 'green'
                        : appeal.status === 'Rejected'
                          ? 'red'
                          : 'orange'
                    }
                    size="small"
                  >
                    {appeal.status === 'Approved' && 'Đã chấp nhận'}
                    {appeal.status === 'Rejected' && 'Đã từ chối'}
                    {appeal.status === 'Pending' && 'Đang chờ'}
                    {!appeal.status && 'Chưa xử lý'}
                  </Tag>
                </div>
                {appeal.reason && (
                  <p className="text-text-secondary text-sm mb-1">
                    <span className="font-medium">Lý do:</span> {appeal.reason}
                  </p>
                )}
                {appeal.message && (
                  <p className="text-text-secondary text-sm mb-1">
                    <span className="font-medium">Nội dung:</span> {appeal.message}
                  </p>
                )}
                {appeal.adminResponse && (
                  <p className="text-text-secondary text-sm mb-1">
                    <span className="font-medium">Phản hồi:</span> {appeal.adminResponse}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2">
                  {appeal.createdAt && (
                    <p className="text-muted-foreground text-xs">
                      Tạo: {new Date(appeal.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                  {appeal.reviewedAt && (
                    <p className="text-muted-foreground text-xs">
                      Xử lý: {new Date(appeal.reviewedAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AppealsTab;

