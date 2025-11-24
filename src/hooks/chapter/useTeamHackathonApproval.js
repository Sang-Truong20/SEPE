import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import axiosClient from '../../configs/axiosClient';

export const teamHackathonApprovalQueryKeys = {
  origin: ['chapter', 'team-hackathon-approval'],
  pending: () => [...teamHackathonApprovalQueryKeys.origin, 'pending'],
  approved: () => [...teamHackathonApprovalQueryKeys.origin, 'approved'],
  rejected: () => [...teamHackathonApprovalQueryKeys.origin, 'rejected'],
};

// Get pending team hackathon approvals
export const useGetPendingTeamHackathonApprovals = () => {
  return useQuery({
    queryKey: teamHackathonApprovalQueryKeys.pending(),
    queryFn: async () => {
      // Mock data - In real app: axiosClient.get('/Chapter/team-hackathon-approvals/pending')
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      return [
        {
          id: '1',
          teamId: '4',
          teamName: 'Blockchain Pioneers',
          hackathonId: '3',
          hackathonName: 'Fintech Innovation 2024',
          leader: {
            id: '13',
            name: 'Đinh Văn Phúc',
            email: 'phucdv@fpt.edu.vn',
            studentId: 'SE123468',
          },
          members: [
            { id: '13', name: 'Đinh Văn Phúc', email: 'phucdv@fpt.edu.vn', verified: true },
            { id: '14', name: 'Mai Thị Quỳnh', email: 'quynhmt@fpt.edu.vn', verified: true },
          ],
          submittedAt: '2024-02-01T10:00:00Z',
          status: 'pending',
          description: 'DeFi platform cho microfinance, giúp người dân vùng sâu vùng xa tiếp cận tài chính dễ dàng hơn',
        },
        {
          id: '2',
          teamId: '6',
          teamName: 'Data Analytics Team',
          hackathonId: '1',
          hackathonName: 'SEAL Hackathon 2024 - Ho Chi Minh',
          leader: {
            id: '18',
            name: 'Nguyễn Văn Tài',
            email: 'tainv@fpt.edu.vn',
            studentId: 'SE123473',
          },
          members: [
            { id: '18', name: 'Nguyễn Văn Tài', email: 'tainv@fpt.edu.vn', verified: true },
            { id: '19', name: 'Trần Thị Hoa', email: 'hoatt@fpt.edu.vn', verified: true },
            { id: '20', name: 'Lê Văn Hùng', email: 'hunglv@fpt.edu.vn', verified: false },
          ],
          submittedAt: '2024-02-02T14:30:00Z',
          status: 'pending',
          description: 'Big data analytics platform cho doanh nghiệp',
        },
      ];
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Approve team hackathon participation
export const useApproveTeamHackathon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ approvalId, teamId, hackathonId }) => {
      // Mock - In real app: axiosClient.put(`/Chapter/team-hackathon-approvals/${approvalId}/approve`)
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true, approvalId, teamId, hackathonId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamHackathonApprovalQueryKeys.pending() });
      queryClient.invalidateQueries({ queryKey: teamHackathonApprovalQueryKeys.approved() });
      message.success('Đã duyệt team tham gia hackathon');
    },
    onError: () => {
      message.error('Có lỗi xảy ra khi duyệt team');
    },
  });
};

// Reject team hackathon participation
export const useRejectTeamHackathon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ approvalId, reason }) => {
      // Mock - In real app: axiosClient.put(`/Chapter/team-hackathon-approvals/${approvalId}/reject`, { reason })
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true, approvalId, reason };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamHackathonApprovalQueryKeys.pending() });
      queryClient.invalidateQueries({ queryKey: teamHackathonApprovalQueryKeys.rejected() });
      message.success('Đã từ chối team tham gia hackathon');
    },
    onError: () => {
      message.error('Có lỗi xảy ra khi từ chối team');
    },
  });
};

