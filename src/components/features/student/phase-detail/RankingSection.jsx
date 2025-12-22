import { TrophyOutlined } from '@ant-design/icons';
import { Card, Spin, Table } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetHackathonRanking } from '../../../../hooks/student/team-ranking';
import { useGetHackathonPhases } from '../../../../hooks/student/hackathon-phase';
import { getPhaseStatus } from './utils';

const RankingSection = () => {
  const { phaseId, hackathonId } = useParams();
  const { data: phases = [] } = useGetHackathonPhases(hackathonId);
  const phase = phases.find(p => p.phaseId === parseInt(phaseId));
  const phaseIndex = phases.findIndex(p => p.phaseId === parseInt(phaseId));
  const isPhase2 = phaseIndex === 1;
  const phaseStatus = phase ? getPhaseStatus(phase) : null;
  const isPhaseCompleted = phaseStatus === 'completed';

  const { data: phase2Ranking = [], isLoading: rankingLoading } = useGetHackathonRanking(
    hackathonId,
    { enabled: isPhase2 && isPhaseCompleted }
  );
  if (rankingLoading) {
    return (
      <Card className="bg-card-background border border-card-border backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Bảng xếp hạng Phase 2
        </h3>
        <div className="flex items-center justify-center py-8">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!phase2Ranking || phase2Ranking.length === 0) {
    return (
      <Card className="bg-card-background border border-card-border backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Bảng xếp hạng Phase 2
        </h3>
        <div className="text-center py-8 text-muted-foreground">
          <TrophyOutlined className="text-4xl mb-2 opacity-50" />
          <p>Chưa có bảng xếp hạng</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-card-background border border-card-border backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Bảng xếp hạng Phase 2
      </h3>
      <Table
        dataSource={phase2Ranking}
        rowKey={(record) => record.teamId || record.id || record.rank}
        pagination={false}
        columns={[
          {
            title: 'Hạng',
            dataIndex: 'rank',
            key: 'rank',
            width: 80,
            render: (rank) => {
              if (rank === 1) return <TrophyOutlined className="text-yellow-400 text-xl" />;
              if (rank === 2) return <TrophyOutlined className="text-gray-400 text-xl" />;
              if (rank === 3) return <TrophyOutlined className="text-amber-600 text-xl" />;
              return <span className="text-white">{rank}</span>;
            },
          },
          {
            title: 'Đội',
            dataIndex: 'teamName',
            key: 'teamName',
          },
          {
            title: 'Điểm',
            dataIndex: 'score',
            key: 'score',
            render: (score) => <span className="text-primary font-semibold">{score}/100</span>,
          },
        ]}
        className="[&_.ant-table]:bg-transparent [&_th]:!bg-card-background [&_th]:!text-text-primary [&_td]:!text-text-secondary [&_td]:border-card-border [&_th]:border-card-border"
      />
    </Card>
  );
};

export default RankingSection;

