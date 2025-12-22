import { TrophyOutlined } from '@ant-design/icons';
import { Card, Spin, Table, Tag } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetFinalQualifiedTeams } from '../../../../hooks/student/qualification';

const QualifiedTeamsSection = () => {
  const { phaseId } = useParams();
  const { data: qualifiedTeams = [], isLoading: qualifiedLoading } = useGetFinalQualifiedTeams(
    phaseId,
    { enabled: !!phaseId }
  );
  if (qualifiedLoading) {
    return (
      <Card className="bg-card-background border border-card-border backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Danh sách đội vào Phase 2 (8 đội)
        </h3>
        <div className="flex items-center justify-center py-8">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!qualifiedTeams || qualifiedTeams.length === 0) {
    return (
      <Card className="bg-card-background border border-card-border backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Danh sách đội vào Phase 2 (8 đội)
        </h3>
        <div className="text-center py-8 text-muted-foreground">
          <TrophyOutlined className="text-4xl mb-2 opacity-50" />
          <p>Chưa có đội nào được qualify vào Phase 2</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-card-background border border-card-border backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Danh sách đội vào Phase 2 (8 đội)
      </h3>
      <Table
        dataSource={qualifiedTeams}
        rowKey={(record) => record.teamId || record.id}
        pagination={false}
        columns={[
          {
            title: 'STT',
            key: 'index',
            width: 60,
            render: (_, __, index) => index + 1,
          },
          {
            title: 'Tên đội',
            dataIndex: 'teamName',
            key: 'teamName',
          },
          {
            title: 'Bảng',
            dataIndex: 'groupName',
            key: 'groupName',
            render: (groupName) => groupName ? <Tag color="blue">{groupName}</Tag> : '-',
          },
          {
            title: 'Track',
            dataIndex: 'trackName',
            key: 'trackName',
            render: (trackName) => trackName ? <Tag>{trackName}</Tag> : '-',
          },
        ]}
        className="[&_.ant-table]:bg-transparent [&_th]:!bg-card-background [&_th]:!text-text-primary [&_td]:!text-text-secondary [&_td]:border-card-border [&_th]:border-card-border"
      />
    </Card>
  );
};

export default QualifiedTeamsSection;

