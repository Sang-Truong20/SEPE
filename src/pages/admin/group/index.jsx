import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ConfigProvider, theme, Modal, Button, InputNumber, Select, Card, Tag } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useGroups } from '../../../hooks/admin/groups/useGroups';
import EntityTable from '../../../components/ui/EntityTable.jsx';
import { useHackathons } from '../../../hooks/admin/hackathons/useHackathons.js';

const Groups = (tracks) => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const hackathonId = searchParams.get('hackathonId');
    
    const { fetchGroupsByHackathon, autoCreateGroups } = useGroups();
    const { data: groupsData = [], isLoading, error } = fetchGroupsByHackathon(hackathonId)

    const trackIds = tracks.tracks.map(t => t.trackId);

    const sortedGroups = [...groupsData].filter(group => trackIds.includes(group.trackId))?.sort((a, b) =>
      a.groupName.localeCompare(b.groupName)
    );

    // fetch hackathons for select
    const { fetchHackathons } = useHackathons();
    const { data: hackathons = [], isLoading: hackathonsLoading } = fetchHackathons;

    const selectedHackathon = hackathons.find(h => h.hackathonId === parseInt(hackathonId));

    const [teamsPerGroup, setTeamsPerGroup] = useState(1);

    // Model cho bảng groups
    const tableModel = useMemo(() => ({
        entityName: 'bảng đấu',
        rowKey: 'groupId',
        columns: [
            {
                title: 'Tên bảng đấu',
                dataIndex: 'groupName',
                key: 'groupName',
                type: 'text',
                className: 'font-medium text-white'
            },
            {
                title: 'Track ID',
                dataIndex: 'trackId',
                key: 'trackId',
                type: 'tag',
                tagColor: 'blue',
                transform: (val) => val || 'N/A'
            },
            {
                title: 'Số Teams',
                dataIndex: 'teamIds',
                key: 'teamIds',
                type: 'text',
                transform: (val) => Array.isArray(val) ? val.length : 0
            },
            {
                title: 'Ngày Tạo',
                dataIndex: 'createdAt',
                key: 'createdAt',
                type: 'datetime',
                format: 'DD/MM/YYYY HH:mm'
            }
        ],
        actions: {
            view: true,
            edit: false,
            delete: false,
        }
    }), [hackathonId, navigate]);

    const handleAutoCreateGroups = () => {
        Modal.confirm({
            title: 'Tạo bảng đấu Tự Động',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div className="space-y-4">
                    <p>Nhập số lượng teams trong mỗi bảng đấu:</p>
                    <InputNumber
                        min={1}
                        value={teamsPerGroup}
                        onChange={(value) => setTeamsPerGroup(value)}
                        className="w-full"
                        placeholder="Số teams/bảng đấu"
                    />
                </div>
            ),
            okText: 'Tạo',
            cancelText: 'Hủy',
            centered: true,
            onOk: () => {
                autoCreateGroups.mutate({
                    teamsPerGroup: teamsPerGroup,
                    phaseId: tracks.tracks[0]?.phaseId || null,
                }, {
                    onSuccess: () => {
                        // nothing extra to do here
                    }
                });
            }
        });
    };

    const handlers = {
        onView: (record) => navigate(`/admin/groups/${record.groupId}?trackId=${record.trackId}`),
    };


    if (error) {
        return (
            <div className="bg-dark-secondary border border-dark-accent rounded-xl p-6 shadow-md text-red-400">
                Lỗi tải dữ liệu Groups.
            </div>
        );
    }

    return (
      <>
        <div className="flex justify-end">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAutoCreateGroups}
            size="large"
            loading={autoCreateGroups.isPending}
            disabled={!hackathonId}
          >
            Tạo bảng đấu Tự Động
          </Button>
        </div>
        <EntityTable
          model={tableModel}
          data={sortedGroups}
          loading={isLoading}
          handlers={handlers}
          emptyText="Không có bảng đấu nào"
          dateFormatter={(value, fmt) => value ? dayjs(value).format(fmt) : '--'}
        /></>


    );
};

export default Groups;
