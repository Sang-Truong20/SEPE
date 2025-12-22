import { CalendarOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons';
import { Card, Spin, Tag } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGroups } from '../../../../hooks/admin/groups/useGroups';

const GroupsSection = ({ onGroupClick }) => {
  const { hackathonId } = useParams();
  const { fetchGroupsByHackathon } = useGroups();
  const { data: groupsData = [], isLoading: groupsLoading } = fetchGroupsByHackathon(hackathonId);
  if (groupsLoading) {
    return (
      <Card className="bg-card-background border border-card-border backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Các bảng đấu
        </h3>
        <div className="flex items-center justify-center py-8">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!groupsData || groupsData.length === 0) {
    return (
      <Card className="bg-card-background border border-card-border backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Các bảng đấu
        </h3>
        <div className="text-center py-8 text-muted-foreground">
          <TrophyOutlined className="text-4xl mb-2 opacity-50" />
          <p>Chưa có bảng đấu nào được tạo</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-card-background border border-card-border backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Các bảng đấu
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groupsData.map((group) => (
          <div
            key={group.groupId}
            onClick={() => onGroupClick(group)}
            className="p-4 bg-card-background/50 rounded-lg border border-card-border/50 hover:border-primary/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-text-primary">
                Bảng {group.groupName}
              </h4>
              <Tag color="blue" size="small">
                Track {group.trackId}
              </Tag>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TeamOutlined className="text-primary" />
                <span>{Array.isArray(group.teamIds) ? group.teamIds.length : 0} đội</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarOutlined className="text-primary" />
                <span>{new Date(group.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default GroupsSection;

