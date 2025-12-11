import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const chapterResultsQueryKeys = {
  origin: ['chapter', 'results'],
  leaderboard: (hackathonId) => [...chapterResultsQueryKeys.origin, 'leaderboard', hackathonId],
  statistics: (hackathonId) => [...chapterResultsQueryKeys.origin, 'statistics', hackathonId],
};

// Get leaderboard for chapter's teams
export const useGetChapterLeaderboard = (hackathonId = null) => {
  return useQuery({
    queryKey: chapterResultsQueryKeys.leaderboard(hackathonId),
    queryFn: async () => {
      // Mock data - In real app: axiosClient.get(`/Chapter/results/leaderboard${hackathonId ? `?hackathonId=${hackathonId}` : ''}`)
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Mock leaderboard data - similar to student leaderboard
      return [
        {
          rank: 1,
          team: 'AI Warriors',
          teamId: '3',
          members: ['Bùi Văn Hải', 'Ngô Thị Lan', 'Trịnh Văn Minh', 'Lý Thị Ngọc', 'Phan Văn Oanh'],
          hackathon: 'Tech Challenge 2024',
          hackathonId: '2',
          score: 92.5,
          submissions: 2,
          badges: ['Innovation', 'Technical Excellence'],
          university: 'FPT University - Ho Chi Minh',
        },
        {
          rank: 2,
          team: 'Tech Innovators FPT',
          teamId: '1',
          members: ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Văn Cường', 'Phạm Thị Dung', 'Hoàng Văn Em'],
          hackathon: 'SEAL Hackathon 2024 - Ho Chi Minh',
          hackathonId: '1',
          score: 85.0,
          submissions: 2,
          badges: ['Best Presentation'],
          university: 'FPT University - Ho Chi Minh',
        },
        {
          rank: 3,
          team: 'Cloud Masters',
          teamId: '5',
          members: ['Lê Thị Uyên', 'Vũ Văn Vinh', 'Trần Thị Xuân'],
          hackathon: 'SEAL Hackathon 2024 - Ho Chi Minh',
          hackathonId: '1',
          score: 81.0,
          submissions: 1,
          badges: ['Creativity'],
          university: 'FPT University - Ho Chi Minh',
        },
        {
          rank: 4,
          team: 'Code Masters',
          teamId: '2',
          members: ['Hoàng Văn Em', 'Đỗ Thị Phương', 'Vũ Văn Giang'],
          hackathon: 'SEAL Hackathon 2024 - Ho Chi Minh',
          hackathonId: '1',
          score: 78.0,
          submissions: 1,
          badges: [],
          university: 'FPT University - Ho Chi Minh',
        },
      ];
    },
    staleTime: 2 * 60 * 1000,
  });
};

// Get statistics for chapter
export const useGetChapterStatistics = (hackathonId = null) => {
  return useQuery({
    queryKey: chapterResultsQueryKeys.statistics(hackathonId),
    queryFn: async () => {
      // Mock data
      await new Promise((resolve) => setTimeout(resolve, 200));
      
      return {
        totalTeams: 5,
        totalParticipants: 18,
        averageScore: 84.1,
        highestScore: 92.5,
        lowestScore: 78.0,
        scoreDistribution: {
          '90-100': 1,
          '80-89': 2,
          '70-79': 1,
          'below-70': 1,
        },
        hackathons: [
          {
            id: '1',
            name: 'SEAL Hackathon 2024 - Ho Chi Minh',
            teamsCount: 3,
            averageScore: 81.3,
          },
          {
            id: '2',
            name: 'Tech Challenge 2024',
            teamsCount: 1,
            averageScore: 92.5,
          },
        ],
      };
    },
    staleTime: 2 * 60 * 1000,
  });
};

