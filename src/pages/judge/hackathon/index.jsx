import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { ConfigProvider, theme, Button, Tag } from 'antd';
import dayjs from 'dayjs';
import { PATH_NAME } from '../../../constants';
import { useJudgeAssignment } from '../../../hooks/admin/assignments/useJudgeAssignments.js';
import EntityTable from '../../../components/ui/EntityTable.jsx';

const Hackathons = () => {
  const navigate = useNavigate();
  const { fetchMyHackathonAssignments } = useJudgeAssignment();
  const { data: hackathonData = [], isLoading, error } = fetchMyHackathonAssignments();

  // Model cho bảng
  const tableModel = useMemo(
    () => ({
      entityName: 'Hackathon',
      rowKey: 'hackathonId',
      columns: [
        {
          title: 'Tên hackathon',
          dataIndex: 'hackathonName',
          key: 'hackathonName',
          type: 'text',
          className: 'font-medium text-white'
        },
        {
          title: 'Giai đoạn',
          dataIndex: 'phaseName',
          key: 'phaseName',
          type: 'tag',
          tagColor: 'purple',
        },
        {
          title: 'Ngày phân công',
          dataIndex: 'assignedAt',
          key: 'assignedAt',
          type: 'datetime',
          format: 'DD/MM/YYYY HH:mm'
        },
        {
          title: 'Trạng thái',
          dataIndex: 'status',
          key: 'status',
          type: 'tag',
          tagColor: (status) => status === 'Active' ? 'green' : 'red',
          transform: (status) => status === 'Active' ? 'Hoạt động' : 'Đã khóa'
        },
        {
          title: 'Quản lý',
          key: 'management',
          type: 'custom',
          render: (value, record) => (
            <div className="flex gap-2">
              <Button
                size="small"
                className="text-xs bg-blue-600/30 text-blue-300 border-blue-600/50 hover:bg-blue-600/50"
                onClick={() => navigate(`${PATH_NAME.JUDGE_TEAM_SCORES}/phase?hackathonId=${record.hackathonId}`)}
              >
                Giai đoạn
              </Button>
            </div>
          ),
        },
      ],
    }),
    [navigate],
  );



  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgContainer: '#111111',
          colorBorder: '#2f2f2f',
          colorText: '#ffffff',
          colorTextPlaceholder: '#9ca3af',
          colorPrimary: '#10b981',
          borderRadius: 6,
        },
      }}
    >
      <div className="bg-dark-secondary border border-dark-accent rounded-xl p-6 shadow-md">
        <EntityTable
          model={tableModel}
          data={hackathonData}
          loading={isLoading}
          emptyText="Không có dữ liệu"
          // optional override format sử dụng dayjs toàn cục
          dateFormatter={(value, fmt) =>
            value ? dayjs(value).format(fmt) : '--'
          }
        />
      </div>
    </ConfigProvider>
  );
};

export default Hackathons;
