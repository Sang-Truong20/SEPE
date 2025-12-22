import { ExclamationCircleOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Spin, Tag } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetTeamPhasePenalties } from '../../../../hooks/student/penalty';
import { useGetTeamAppeals } from '../../../../hooks/student/appeal';

const PenaltiesTab = ({ teamId, isLeader, onOpenAppealModal }) => {
  const { phaseId } = useParams();

  // Get penalties for team in current phase
  const { data: penaltiesData = [], isLoading: penaltiesLoading } = useGetTeamPhasePenalties(
    teamId,
    phaseId,
    { enabled: !!teamId && !!phaseId }
  );

  const penalties = Array.isArray(penaltiesData)
    ? penaltiesData
    : Array.isArray(penaltiesData?.data)
      ? penaltiesData.data
      : [];

  // Get appeals for team
  const { data: appealsData = [] } = useGetTeamAppeals(
    teamId,
    { enabled: !!teamId }
  );

  const appeals = Array.isArray(appealsData)
    ? appealsData
    : Array.isArray(appealsData?.data)
      ? appealsData.data
      : [];

  // Filter appeals related to penalties in current phase
  const phaseAppeals = React.useMemo(() => {
    if (!phaseId || !penalties.length) return [];

    // Get penalty IDs from current phase
    const penaltyIds = penalties.map(p => p.penaltyId || p.id).filter(Boolean);

    // Filter appeals that match penalties in this phase
    return appeals.filter(appeal => {
      const appealPenaltyId = appeal.adjustmentId || appeal.penaltyId;
      return appealPenaltyId && penaltyIds.includes(appealPenaltyId);
    });
  }, [appeals, penalties, phaseId]);

  const hasAppeal = (penalty) => {
    const penaltyId = penalty.penaltyId || penalty.id;
    return phaseAppeals.some(appeal => {
      const appealPenaltyId = appeal.adjustmentId || appeal.penaltyId;
      return appealPenaltyId && Number(appealPenaltyId) === Number(penaltyId);
    });
  };

  if (penaltiesLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spin size="large" />
      </div>
    );
  }

  if (penalties.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <ExclamationCircleOutlined className="text-4xl mb-2 opacity-50" />
        <p className="text-sm">Không có penalty nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {penalties.map((penalty) => {
        const penaltyHasAppeal = hasAppeal(penalty);
        return (
          <div
            key={penalty.penaltyId || penalty.id}
            className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-red-400 font-semibold text-sm">
                    {penalty.type === 'late_submission' && 'Nộp bài muộn'}
                    {penalty.type === 'rule_violation' && 'Vi phạm quy tắc'}
                    {penalty.type === 'abandonment' && 'Bỏ thi giữa chừng'}
                    {!penalty.type && 'Penalty'}
                  </span>
                  <Tag color="red" size="small">
                    -{Math.abs(penalty.points || penalty.penaltyPoints || 0)} điểm
                  </Tag>
                  {penaltyHasAppeal && (
                    <Tag color="blue" size="small">
                      Đã kháng cáo
                    </Tag>
                  )}
                </div>
                {penalty.reason && (
                  <p className="text-text-secondary text-sm mb-2">
                    {penalty.reason}
                  </p>
                )}
                {penalty.createdAt && (
                  <p className="text-muted-foreground text-xs">
                    {new Date(penalty.createdAt).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
              </div>
              {isLeader && !penaltyHasAppeal && (
                <Button
                  type="primary"
                  size="small"
                  icon={<SendOutlined />}
                  onClick={() => onOpenAppealModal(penalty)}
                  className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 border-0 ml-2"
                >
                  Kháng cáo
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PenaltiesTab;

