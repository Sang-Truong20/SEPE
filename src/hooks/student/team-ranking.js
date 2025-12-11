import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const teamRankingQueryKeys = {
    origin: ['student', 'team-ranking'],
    trackRanking: (hackathonId, trackId, phaseId) => [
        ...teamRankingQueryKeys.origin,
        'track',
        hackathonId,
        trackId,
        phaseId,
    ],
    hackathonRanking: (hackathonId) => [
        ...teamRankingQueryKeys.origin,
        'hackathon',
        hackathonId,
    ],
};

// Mock data for team rankings
const mockTrackRankings = {
    '1-track-1-phase-1': [
        {
            rank: 1,
            teamId: 'team-1',
            teamName: 'Chiến binh Code',
            score: 95.8,
            members: ['Nguyễn Việt Anh', 'Trần Thị Lan', 'Lê Minh Đức'],
            submissions: 2,
            passedQualification: true,
        },
        {
            rank: 2,
            teamId: 'team-2',
            teamName: 'Tech Innovators',
            score: 92.3,
            members: ['Nguyễn Văn Hùng', 'Lê Thị Mai'],
            submissions: 2,
            passedQualification: true,
        },
        {
            rank: 3,
            teamId: 'team-3',
            teamName: 'AI Warriors',
            score: 89.7,
            members: ['Phạm Văn Hải', 'Hoàng Thị Lan'],
            submissions: 1,
            passedQualification: true,
        },
        {
            rank: 4,
            teamId: 'team-4',
            teamName: 'Code Masters',
            score: 87.2,
            members: ['Đỗ Văn Nam', 'Bùi Thị Hoa'],
            submissions: 2,
            passedQualification: true,
        },
        {
            rank: 5,
            teamId: 'team-5',
            teamName: 'Tech Titans',
            score: 85.1,
            members: ['Lý Văn Tuấn', 'Ngô Thị Mai'],
            submissions: 1,
            passedQualification: true,
        },
    ],
};

// Get track ranking (after qualification)
export const useGetTrackRanking = (hackathonId, trackId, phaseId, options = {}) => {
    return useQuery({
        queryKey: teamRankingQueryKeys.trackRanking(hackathonId, trackId, phaseId),
        queryFn: async () => {
            const key = `${hackathonId}-track-${trackId}-phase-${phaseId}`;
            // Mock data
            if (mockTrackRankings[key]) {
                await new Promise((resolve) => setTimeout(resolve, 300));
                return mockTrackRankings[key];
            }
            
            // Real API call
            const response = await axiosClient.get(
                `/TeamRanking/hackathon/${hackathonId}/track/${trackId}/phase/${phaseId}`
            );
            return response.data;
        },
        enabled: !!hackathonId && !!trackId && !!phaseId && (options.enabled !== false),
        staleTime: 2 * 60 * 1000, // 2 minutes
        placeholderData: mockTrackRankings[`${hackathonId}-track-${trackId}-phase-${phaseId}`] || [],
        ...options,
    });
};

// Get hackathon ranking
export const useGetHackathonRanking = (hackathonId, options = {}) => {
    return useQuery({
        queryKey: teamRankingQueryKeys.hackathonRanking(hackathonId),
        queryFn: async () => {
            // Real API call
            const response = await axiosClient.get(`/TeamRanking/hackathon/${hackathonId}`);
            return response.data;
        },
        enabled: !!hackathonId && (options.enabled !== false),
        staleTime: 2 * 60 * 1000, // 2 minutes
        ...options,
    });
};

