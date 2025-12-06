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

    const [confirmModal, setConfirmModal] = useState({ open: false, teamsPerGroup: 1 });

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
        setConfirmModal({ open: true, teamsPerGroup: 1 });
    };

    const handleConfirmOk = () => {
        autoCreateGroups.mutate({
            teamsPerGroup: confirmModal.teamsPerGroup,
            phaseId: tracks.tracks[0]?.phaseId || null,
        }, {
            onSuccess: () => {
                setConfirmModal({ open: false, teamsPerGroup: 1 });
            },
            onSettled: () => {
                setConfirmModal({ open: false, teamsPerGroup: 1 });
            }
        });
    };

    const handleConfirmCancel = () => {
        setConfirmModal({ open: false, teamsPerGroup: 1 });
    };

    const handlers = {
        onView: (record) => navigate(`/admin/groups/${record.groupId}?trackId=${record.trackId}`),
    };


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
        />
        <Modal
          title="Tạo bảng đấu Tự Động"
          open={confirmModal.open}
          onOk={handleConfirmOk}
          onCancel={handleConfirmCancel}
          okText="Tạo"
          cancelText="Hủy"
          centered
        >
          <div className="flex items-start gap-3">
            <ExclamationCircleOutlined className="text-yellow-500 text-xl mt-1" />
            <div className="flex-1 space-y-4">
              <p>Nhập số lượng teams trong mỗi bảng đấu:</p>
              <InputNumber
                min={1}
                value={confirmModal.teamsPerGroup}
                onChange={(value) => setConfirmModal({ ...confirmModal, teamsPerGroup: value })}
                className="w-full"
                placeholder="Số teams/bảng đấu"
              />
            </div>
          </div>
        </Modal>
      </>
    );
};

export default Groups;
