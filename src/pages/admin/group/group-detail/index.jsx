// components/groups/GroupTeamList.jsx
import React from 'react';
import { TrophyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useGroups } from '../../../../hooks/admin/groups/useGroups.js';
import EntityTable from '../../../../components/ui/EntityTable.jsx';
import { ConfigProvider, theme } from 'antd';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

const GroupTeamList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trackId = searchParams.get('trackId');
  const { id } = useParams();
  const { fetchGroupTeams } = useGroups();
  const { data: teamsList = [], isLoading } = fetchGroupTeams(id);

  const teamTableModel = {
    entityName: 'Đội tham gia',
    rowKey: 'teamId',
    columns: [
      {
        title: 'Tên đội',
        dataIndex: 'teamName',
        width: 220,
        render: (value) => (
          <div className="font-semibold text-white flex items-center gap-2">
            <TrophyOutlined className="text-yellow-500" />
            {value || '--'}
          </div>
        ),
      },
      {
        title: 'Thứ hạng',
        dataIndex: 'rank',
        width: 100,
        align: 'center',
        render: (value) => {
          if (value === null || value === undefined) return '—';
          const num = parseFloat(value);
          const isPositive = num > 0;
          const isZero = num === 0;
          return (
            <span className={`font-bold ${isPositive ? 'text-green-400' : isZero ? 'text-gray-400' : 'text-red-400'}`}>
              {isPositive ? '#' : ''}{num.toFixed(0)}
            </span>
          );
        },
      },
      {
        title: 'Điểm trung bình',
        dataIndex: 'averageScore',
        width: 100,
        align: 'center',
        render: (value) => {
          if (value === null || value === undefined) return '—';
          const num = parseFloat(value);
          return (
            <text>{num.toFixed(2)}</text>
          );
        },
      },
    ],
    actions: {
      view: true
    }
  };

  const handlers = {
    onView: (record) => navigate(`/admin/team/${record.teamId}?trackId=${trackId}`),
  };


  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBggContainer: '#111111',
          colorBorder: '#2f2f2f',
          colorText: '#ffffff',
          colorTextPlaceholder: '#9ca3af',
          colorPrimary: '#10b981',
          borderRadius: 6
        }
      }}
    >
    <div className="bg-gray-900/30 rounded-xl border border-white/10 p-5">
      <EntityTable
        model={teamTableModel}
        data={teamsList}
        loading={isLoading}
        handlers={handlers}
        emptyText="Chưa có đội nào trong bảng này"
        dateFormatter={(val, fmt) => dayjs(val).format(fmt || 'DD/MM/YYYY HH:mm')}
      />
    </div>
    </ConfigProvider>
  );
};

export default GroupTeamList;