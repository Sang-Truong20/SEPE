import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const mentorTeamsByHackathonQueryKeys = {
  origin: ['mentor', 'teams-by-hackathon'],
  teams: (mentorId, hackathonId) => [
    ...mentorTeamsByHackathonQueryKeys.origin,
    mentorId,
    hackathonId,
  ],
};

// Mock API - Get teams managed by mentor for a specific hackathon
export const useGetMentorTeamsByHackathon = (mentorId, hackathonId) => {
  return useQuery({
    queryKey: mentorTeamsByHackathonQueryKeys.teams(mentorId, hackathonId),
    queryFn: async () => {
      // Mock data - In real app, this would be: axiosClient.get(`/MentorAssignment/mentor/${mentorId}/hackathon/${hackathonId}/teams`)
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Mock response based on hackathonId - More diverse teams
      // Support both string and number hackathonId
      const hackId = String(hackathonId);
      const mockTeams = {
        '1': [
          {
            id: '1',
            name: 'Tech Innovators',
            teamName: 'Tech Innovators',
            description: 'AI-powered healthcare platform để cải thiện chẩn đoán bệnh thông qua machine learning và deep learning',
            hackathonId: '1',
            members: [
              { id: '1', name: 'Nguyễn Văn An', fullName: 'Nguyễn Văn An', role: 'leader', email: 'annv@fpt.edu.vn' },
              { id: '2', name: 'Trần Thị Bình', fullName: 'Trần Thị Bình', role: 'member', email: 'binhtt@fpt.edu.vn' },
              { id: '3', name: 'Lê Văn Cường', fullName: 'Lê Văn Cường', role: 'member', email: 'cuonglv@fpt.edu.vn' },
              { id: '4', name: 'Phạm Thị Dung', fullName: 'Phạm Thị Dung', role: 'member', email: 'dungpt@fpt.edu.vn' },
              { id: '5', name: 'Hoàng Văn Em', fullName: 'Hoàng Văn Em', role: 'member', email: 'emhv@fpt.edu.vn' },
            ],
          },
          {
            id: '2',
            name: 'AI Warriors',
            teamName: 'AI Warriors',
            description: 'Education technology platform sử dụng AI để personalize học tập cho từng học sinh',
            hackathonId: '1',
            members: [
              { id: '6', name: 'Trịnh Văn Minh', fullName: 'Trịnh Văn Minh', role: 'leader', email: 'minhtv@fpt.edu.vn' },
              { id: '7', name: 'Lý Thị Ngọc', fullName: 'Lý Thị Ngọc', role: 'member', email: 'ngoclt@fpt.edu.vn' },
              { id: '8', name: 'Phan Văn Oanh', fullName: 'Phan Văn Oanh', role: 'member', email: 'oanhpv@fpt.edu.vn' },
              { id: '9', name: 'Võ Thị Phương', fullName: 'Võ Thị Phương', role: 'member', email: 'phuongvt@fpt.edu.vn' },
            ],
          },
          {
            id: '3',
            name: 'Data Science Squad',
            teamName: 'Data Science Squad',
            description: 'Phân tích dữ liệu lớn để tối ưu hóa quy trình sản xuất trong ngành công nghiệp',
            hackathonId: '1',
            members: [
              { id: '10', name: 'Bùi Văn Quang', fullName: 'Bùi Văn Quang', role: 'leader', email: 'quangbv@fpt.edu.vn' },
              { id: '11', name: 'Đỗ Thị Hoa', fullName: 'Đỗ Thị Hoa', role: 'member', email: 'hoadt@fpt.edu.vn' },
              { id: '12', name: 'Ngô Văn Hùng', fullName: 'Ngô Văn Hùng', role: 'member', email: 'hungnv@fpt.edu.vn' },
            ],
          },
        ],
        '2': [
          {
            id: '4',
            name: 'Blockchain Pioneers',
            teamName: 'Blockchain Pioneers',
            description: 'DeFi platform cho microfinance, giúp người dân vùng sâu vùng xa tiếp cận tài chính dễ dàng hơn',
            hackathonId: '2',
            members: [
              { id: '13', name: 'Đinh Văn Phúc', fullName: 'Đinh Văn Phúc', role: 'leader', email: 'phucdv@fpt.edu.vn' },
              { id: '14', name: 'Mai Thị Quỳnh', fullName: 'Mai Thị Quỳnh', role: 'member', email: 'quynhmt@fpt.edu.vn' },
              { id: '15', name: 'Phan Văn Rộng', fullName: 'Phan Văn Rộng', role: 'member', email: 'rongpv@fpt.edu.vn' },
              { id: '16', name: 'Nguyễn Thị Sáng', fullName: 'Nguyễn Thị Sáng', role: 'member', email: 'sangnt@fpt.edu.vn' },
              { id: '17', name: 'Trương Văn Tài', fullName: 'Trương Văn Tài', role: 'member', email: 'taitv@fpt.edu.vn' },
            ],
          },
          {
            id: '5',
            name: 'Cloud Masters',
            teamName: 'Cloud Masters',
            description: 'Hệ thống quản lý tài nguyên cloud tự động với AI và machine learning',
            hackathonId: '2',
            members: [
              { id: '18', name: 'Lê Thị Uyên', fullName: 'Lê Thị Uyên', role: 'leader', email: 'uyenlt@fpt.edu.vn' },
              { id: '19', name: 'Vũ Văn Vinh', fullName: 'Vũ Văn Vinh', role: 'member', email: 'vinhvv@fpt.edu.vn' },
              { id: '20', name: 'Trần Thị Xuân', fullName: 'Trần Thị Xuân', role: 'member', email: 'xuantt@fpt.edu.vn' },
            ],
          },
        ],
      };
      
      // Return teams for the hackathon, or empty array if not found
      // If hackathonId is not in mock data, return some default teams
      if (mockTeams[hackId]) {
        return mockTeams[hackId];
      }
      
      // Default teams for any other hackathon
      return [
        {
          id: 'default-1',
          name: 'Innovation Team',
          teamName: 'Innovation Team',
          description: 'Team đang phát triển giải pháp sáng tạo cho hackathon',
          hackathonId: hackathonId,
          members: [
            { id: 'd1', name: 'Leader Name', fullName: 'Leader Name', role: 'leader', email: 'leader@fpt.edu.vn' },
            { id: 'd2', name: 'Member 1', fullName: 'Member 1', role: 'member', email: 'member1@fpt.edu.vn' },
            { id: 'd3', name: 'Member 2', fullName: 'Member 2', role: 'member', email: 'member2@fpt.edu.vn' },
          ],
        },
      ];
    },
    // Enable even if mentorId is null for testing purposes
    enabled: !!hackathonId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

