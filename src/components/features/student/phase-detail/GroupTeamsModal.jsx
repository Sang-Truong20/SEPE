import { TeamOutlined, TrophyOutlined } from '@ant-design/icons';
import { Modal, Spin, Table } from 'antd';
import React from 'react';

const GroupTeamsModal = ({ visible, onClose, groupTeams, loading }) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <TeamOutlined />
          <span>Danh sách đội trong bảng</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="[&_.ant-modal-content]:bg-gray-900/95 [&_.ant-modal-content]:backdrop-blur-xl [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white [&_.ant-modal-mask]:bg-black/50"
    >
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Spin size="large" />
        </div>
      ) : groupTeams.length > 0 ? (
        <Table
          dataSource={groupTeams}
          rowKey={(record) => record.groupTeamId || record.teamId || record.id}
          pagination={false}
          columns={[
            {
              title: 'Hạng',
              key: 'rank',
              width: 80,
              render: (_, record, index) => {
                const rank = record.rank || index + 1;
                if (rank === 1) return <TrophyOutlined className="text-yellow-400 text-xl" />;
                if (rank === 2) return <TrophyOutlined className="text-gray-400 text-xl" />;
                if (rank === 3) return <TrophyOutlined className="text-amber-600 text-xl" />;
                return <span className="text-white">{rank}</span>;
              },
            },
            {
              title: 'Tên đội',
              dataIndex: 'teamName',
              key: 'teamName',
              render: (teamName) => <span className="font-semibold">{teamName}</span>,
            },
            {
              title: 'Điểm trung bình',
              dataIndex: 'averageScore',
              key: 'averageScore',
              render: (score) => (
                <span className="text-primary font-semibold">
                  {score ? Number(score).toFixed(2) : '-'}
                </span>
              ),
            },
            {
              title: 'Tham gia',
              dataIndex: 'joinedAt',
              key: 'joinedAt',
              render: (joinedAt) =>
                joinedAt
                  ? new Date(joinedAt).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '-',
            },
          ]}
          className="[&_.ant-table]:bg-transparent [&_th]:!bg-card-background [&_th]:!text-text-primary [&_td]:!text-text-secondary [&_td]:border-card-border [&_th]:border-card-border"
        />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <TeamOutlined className="text-4xl mb-2 opacity-50" />
          <p>Chưa có đội nào trong bảng này</p>
        </div>
      )}
    </Modal>
  );
};

export default GroupTeamsModal;

