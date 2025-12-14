import { SearchOutlined } from '@ant-design/icons';
import { Alert, Card, Input, Spin } from 'antd';
import { useState, useMemo } from 'react';
import TeamList from './TeamList';

const SearchTeamsTab = ({
  allTeamsData,
  allTeamsLoading,
  allTeamsError,
  myTeams,
  onViewTeam,
  onJoinTeam,
  selectedTeam,
  membersLoading,
  teamMembersData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // All teams from /Team
  const allTeamsArray = useMemo(() => {
    return Array.isArray(allTeamsData)
      ? allTeamsData
      : allTeamsData?.data
        ? allTeamsData.data
        : allTeamsData?.teams
          ? allTeamsData.teams
          : [];
  }, [allTeamsData]);

  // Get my team IDs to filter them out from search
  const myTeamIds = useMemo(() => {
    return new Set(
      myTeams.map((team) => team.id || team.teamId || team.teamID)
    );
  }, [myTeams]);

  // Filter available teams (not in my teams) and apply search
  const availableTeams = useMemo(() => {
    return allTeamsArray.filter((team) => {
      const teamId = team.id || team.teamId || team.teamID;
      const isNotMyTeam = !myTeamIds.has(teamId);
      const matchesSearch =
        !searchQuery ||
        (team.teamName || team.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (team.chapterName || team.chapter?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      return isNotMyTeam && matchesSearch;
    });
  }, [allTeamsArray, myTeamIds, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <Card className="bg-card-background border border-card-border backdrop-blur-xl">
        <Input
          size="large"
          placeholder="Tìm kiếm đội theo tên hoặc chapter..."
          prefix={<SearchOutlined className="text-muted-foreground" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
        />
      </Card>

      {/* Teams List */}
      {allTeamsLoading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : allTeamsError ? (
        <Alert
          message="Lỗi tải dữ liệu"
          description="Không thể tải danh sách đội. Vui lòng thử lại sau."
          type="error"
          showIcon
        />
      ) : (
        <TeamList
          teams={availableTeams}
          title=""
          emptyMessage={
            searchQuery
              ? 'Không tìm thấy đội nào phù hợp với từ khóa tìm kiếm'
              : 'Không có đội nào khả dụng'
          }
          onViewTeam={onViewTeam}
          onJoinTeam={onJoinTeam}
          selectedTeam={selectedTeam}
          teamLoading={false}
          membersLoading={membersLoading}
          teamMembersData={teamMembersData}
          isMyTeam={false}
          isAvailableTeam={true}
          showCreateButton={false}
        />
      )}
    </div>
  );
};

export default SearchTeamsTab;

