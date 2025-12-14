import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Users, TrendingUp, Award, Medal, Crown } from 'lucide-react';
import { useGroups } from '../../../hooks/admin/groups/useGroups.js';
import { Spin } from 'antd';

// Mock hooks - replace with your actual hooks
// const useGroups = () => ({
//   fetchGroupsByHackathon: (hackathonId) => ({
//     data: [
//       { groupId: 1, groupName: "A", trackId: 1, teamIds: [1, 2, 3], createdAt: "2025-11-12T08:06:28.7992909" },
//       { groupId: 2, groupName: "B", trackId: 1, teamIds: [4, 5], createdAt: "2025-11-12T08:06:28.7992909" },
//       { groupId: 3, groupName: "A", trackId: 2, teamIds: [6, 7], createdAt: "2025-11-12T08:06:28.7992909" },
//     ],
//     isLoading: false,
//     error: null
//   }),
//   fetchGroupTeams: (groupId) => ({
//     data: groupId === 1 ? [
//       { groupTeamId: 1, groupId: 1, teamId: 1, averageScore: 9.5, rank: 1, teamName: "Tech Innovators" },
//       { groupTeamId: 2, groupId: 1, teamId: 2, averageScore: 8.7, rank: 2, teamName: "Code Warriors" },
//       { groupTeamId: 3, groupId: 1, teamId: 3, averageScore: 7.8, rank: 3, teamName: "Digital Pioneers" },
//     ] : groupId === 2 ? [
//       { groupTeamId: 4, groupId: 2, teamId: 4, averageScore: 9.2, rank: 1, teamName: "AI Masters" },
//       { groupTeamId: 5, groupId: 2, teamId: 5, averageScore: 8.1, rank: 2, teamName: "Data Wizards" },
//     ] : [
//       { groupTeamId: 6, groupId: 3, teamId: 6, averageScore: 8.9, rank: 1, teamName: "Cloud Ninjas" },
//       { groupTeamId: 7, groupId: 3, teamId: 7, averageScore: 7.5, rank: 2, teamName: "Cyber Squad" },
//     ],
//     isLoading: false,
//     error: null
//   })
// });

// const fetchGroupTeams = (groupId) => ({
//     data: groupId === 1 ? [
//       { groupTeamId: 1, groupId: 1, teamId: 1, averageScore: 9.5, rank: 1, teamName: "Tech Innovators" },
//       { groupTeamId: 2, groupId: 1, teamId: 2, averageScore: 8.7, rank: 2, teamName: "Code Warriors" },
//       { groupTeamId: 3, groupId: 1, teamId: 3, averageScore: 7.8, rank: 3, teamName: "Digital Pioneers" },
//     ] : groupId === 2 ? [
//       { groupTeamId: 4, groupId: 2, teamId: 4, averageScore: 9.2, rank: 1, teamName: "AI Masters" },
//       { groupTeamId: 5, groupId: 2, teamId: 5, averageScore: 8.1, rank: 2, teamName: "Data Wizards" },
//     ] : [
//       { groupTeamId: 6, groupId: 3, teamId: 6, averageScore: 8.9, rank: 1, teamName: "Cloud Ninjas" },
//       { groupTeamId: 7, groupId: 3, teamId: 7, averageScore: 7.5, rank: 2, teamName: "Cyber Squad" },
//     ],
//     isLoading: false,
//     error: null
//   })

const HackathonLeaderboard = () => {
  const [hackathonId, setHackathonId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const { fetchGroupsByHackathon, fetchMultipleGroupTeams } = useGroups();

  useEffect(() => {
    // Get hackathonId from URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('hackathonId');
    if (id) setHackathonId(id);
  }, []);

  const groupsQuery = fetchGroupsByHackathon(hackathonId);
  const groups = groupsQuery?.data || [];

  // Gom tất cả groupId theo groupName (vì có thể nhiều track có cùng tên nhóm A, B, C...)
  const groupsByName = groups?.reduce((acc, group) => {
    if (!acc[group?.groupName]) {
      acc[group?.groupName] = [];
    }
    acc[group?.groupName]?.push(group);
    return acc;
  }, {});

  // Lấy tất cả groupId cần fetch teams
  const allGroupIds = Object.values(groupsByName)
    ?.flat()
    ?.map((g) => g.groupId);

  // Dùng useQueries để fetch tất cả teams một lần
  const teamsQueries = fetchMultipleGroupTeams(allGroupIds);

  // Tính toán dữ liệu sau khi tất cả query hoàn thành
  const isLoading =
    groupsQuery?.isLoading || teamsQueries?.some((q) => q?.isLoading);
  const isError = groupsQuery?.isError || teamsQueries?.some((q) => q?.isError);

  const allTeamsData = useMemo(() => {
    if (isLoading || !groups?.length) return {};

    const result = {};

    Object.keys(groupsByName)?.forEach((groupName) => {
      const groupIdsInThisName = groupsByName[groupName]?.map(
        (g) => g?.groupId,
      );
      const teamsForThisGroup = [];

      // Lấy dữ liệu từ các query tương ứng
      allGroupIds?.forEach((groupId, index) => {
        if (groupIdsInThisName?.includes(groupId)) {
          const queryData = teamsQueries[index]?.data;
          if (queryData) {
            teamsForThisGroup?.push(...queryData);
          }
        }
      });

      // Sort và tính rank
      teamsForThisGroup?.sort(
        (a, b) => (b?.averageScore || 0) - (a?.averageScore || 0),
      );
      teamsForThisGroup?.forEach((team, idx) => {
        team.calculatedRank = idx + 1;
      });

      result[groupName] = teamsForThisGroup;
    });
    return result;
  }, [groups, teamsQueries, allGroupIds]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-text-secondary font-bold">
            {rank}
          </span>
        );
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30';
      case 2:
        return 'from-gray-400/20 to-gray-500/10 border-gray-400/30';
      case 3:
        return 'from-amber-600/20 to-amber-700/10 border-amber-600/30';
      default:
        return 'from-dark-secondary to-dark-tertiary border-dark-accent';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 9) return 'text-primary';
    if (score >= 8) return 'text-tertiary';
    if (score >= 7) return 'text-light-tertiary';
    return 'text-text-secondary';
  };

  if (groupsQuery?.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const groupNames = Object.keys(groupsByName)?.sort();
  const displayGroups = selectedGroup === 'all' ? groupNames : [selectedGroup];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-primary">
      {/* Header */}
      <div className="bg-dark-secondary/50 backdrop-blur-sm border-b border-primary/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-xl shadow-lg shadow-primary/20">
                <Trophy className="w-8 h-8 text-dark-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary">
                  Bảng xếp hạng
                </h1>
                <p className="text-text-secondary text-sm mt-1">
                  Theo dõi hiệu suất của tất cả nhóm
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-dark-tertiary px-4 py-2 rounded-lg border border-primary/20">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-text-primary font-semibold">
                {Object.values(allTeamsData)?.flat()?.length} nhóm
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Group Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedGroup('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              selectedGroup === 'all'
                ? 'bg-gradient-to-r from-primary to-secondary text-dark-primary shadow-lg shadow-primary/30'
                : 'bg-dark-tertiary text-text-secondary hover:bg-dark-accent border border-dark-accent'
            }`}
          >
            Tất cả bảng
          </button>
          {groupNames?.map((groupName) => (
            <button
              key={groupName}
              onClick={() => setSelectedGroup(groupName)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                selectedGroup === groupName
                  ? 'bg-gradient-to-r from-primary to-secondary text-dark-primary shadow-lg shadow-primary/30'
                  : 'bg-dark-tertiary text-text-secondary hover:bg-dark-accent border border-dark-accent'
              }`}
            >
              Bảng {groupName}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-8">
          {displayGroups?.map((groupName) => {
            const teams = allTeamsData[groupName] || [];

            return (
              <div key={groupName} className="space-y-4">
                {/* Group Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 px-6 py-3 rounded-xl">
                    <h2 className="text-2xl font-bold text-text-primary">
                      Bảng {groupName}
                    </h2>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
                  <div className="flex items-center gap-2 bg-dark-tertiary px-4 py-2 rounded-lg border border-primary/20">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-text-secondary text-sm font-medium">
                      {teams?.length} nhóm
                    </span>
                  </div>
                </div>

                {/* Top 3 Podium */}
                {teams?.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {/* 2nd Place */}
                    {teams[1] && (
                      <div className="pt-12">
                        <div className="bg-gradient-to-br from-gray-400/20 to-gray-500/10 border border-gray-400/30 rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                          <Medal className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <div className="text-4xl font-bold text-text-primary mb-2">
                            #2
                          </div>
                          <div className="text-lg font-semibold text-text-primary mb-1">
                            {teams[1]?.teamName}
                          </div>
                          <div className="text-3xl font-bold text-tertiary">
                            {teams[1]?.averageScore?.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 1st Place */}
                    {teams[0] && (
                      <div>
                        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-500/40 rounded-2xl p-6 text-center hover:scale-105 transition-transform shadow-2xl shadow-yellow-500/20">
                          <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-3 animate-pulse" />
                          <div className="text-5xl font-bold text-text-primary mb-2">
                            #1
                          </div>
                          <div className="text-xl font-bold text-text-primary mb-1">
                            {teams[0]?.teamName}
                          </div>
                          <div className="text-4xl font-bold text-primary">
                            {teams[0]?.averageScore?.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3rd Place */}
                    {teams[2] && (
                      <div className="pt-12">
                        <div className="bg-gradient-to-br from-amber-600/20 to-amber-700/10 border border-amber-600/30 rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                          <Award className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                          <div className="text-4xl font-bold text-text-primary mb-2">
                            #3
                          </div>
                          <div className="text-lg font-semibold text-text-primary mb-1">
                            {teams[2]?.teamName}
                          </div>
                          <div className="text-3xl font-bold text-light-tertiary">
                            {teams[2]?.averageScore?.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Full Rankings Table */}
                <div className="bg-dark-secondary/50 backdrop-blur-sm border border-primary/20 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-dark-tertiary border-b border-primary/20">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                            Hạng
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                            Tên đội thi
                          </th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-text-primary">
                            Điểm
                          </th>
                          {/* <th className="px-6 py-4 text-right text-sm font-semibold text-text-primary"></th> */}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-accent">
                        {teams?.map((team, index) => (
                          <tr
                            key={team?.groupTeamId}
                            className={`bg-gradient-to-r ${getRankColor(team?.calculatedRank)} hover:bg-dark-accent/50 transition-all border-l-4 ${
                              team?.calculatedRank === 1
                                ? 'border-l-yellow-500'
                                : team?.calculatedRank === 2
                                  ? 'border-l-gray-400'
                                  : team?.calculatedRank === 3
                                    ? 'border-l-amber-600'
                                    : 'border-l-transparent'
                            }`}
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                {getRankIcon(team?.calculatedRank)}
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="font-semibold text-text-primary text-lg">
                                {team?.teamName}
                              </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <div
                                className={`text-2xl font-bold ${getScoreColor(team?.averageScore)}`}
                              >
                                {team?.averageScore?.toFixed(1)}
                              </div>
                            </td>
                            {/* <td className="px-6 py-5 text-right">
                              <div className={`text-2xl font-bold`}>
                                {team?.joinedAt}
                              </div>
                            </td> */}
                            {/* <td className="px-6 py-5 text-right">
                              <span
                                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                  team?.calculatedRank <= 3
                                    ? 'bg-primary/20 text-primary border border-primary/30'
                                    : 'bg-dark-accent/50 text-text-secondary border border-dark-accent'
                                }`}
                              >
                                {team?.calculatedRank <= 3 ? 'Top 3' : 'None'}
                              </span>
                            </td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HackathonLeaderboard;
