// components/admin/hackathon-phases/HackathonPhaseDetail.jsx
import { useState, useMemo } from 'react';
import {
  Spin,
  ConfigProvider,
  theme,
  Modal,
  Card,
  Button,
  Form,
  InputNumber,
  Select,
  message,
  Space,
  Tag,
} from 'antd';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useHackathonPhases } from '../../../../hooks/admin/hackathon-phases/useHackathonPhases';
import { useTracks } from '../../../../hooks/admin/tracks/useTracks';
import { useGroups } from '../../../../hooks/admin/groups/useGroups';
import { PATH_NAME } from '../../../../constants';
import EntityDetail from '../../../../components/ui/EntityDetail.jsx';
import EntityTable from '../../../../components/ui/EntityTable.jsx';
import {
  ExclamationCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useChallenges } from '../../../../hooks/admin/challanges/useChallenges.js';

const HackathonPhaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hackathonId = searchParams.get('hackathonId');
  const queryClient = useQueryClient();

  const { fetchHackathonPhase } = useHackathonPhases();
  const { deleteTrack, fetchTracks, assignRandomChallenge } = useTracks();
  const { fetchChallenges } = useChallenges();
  const { fetchGroupsByHackathon, autoCreateGroups } = useGroups();

  const {
    data: phase,
    isLoading: phaseLoading,
    error: phaseError,
  } = fetchHackathonPhase(id);
  const { data: allTracks, isLoading: tracksLoading } = fetchTracks;
  const { data: allChallenges = [], isLoading: challengesLoading } = fetchChallenges;
  const { data: groupsData = [], isLoading: groupsLoading } = fetchGroupsByHackathon(hackathonId);

  const phaseTracks =
    allTracks?.filter((track) => track.phaseId === parseInt(id)) || [];

  const trackIds = phaseTracks.map(t => t.trackId);
  const sortedGroups = [...groupsData]
    .filter(group => trackIds.includes(group.trackId))
    ?.sort((a, b) => a.groupName.localeCompare(b.groupName));

  const [assignModal, setAssignModal] = useState({ open: false, track: null });
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, trackId: null });
  const [assignForm] = Form.useForm();
  const [createGroupForm] = Form.useForm();

  const model = {
    modelName: 'HackathonPhases',
    fields: [
      { key: 'Tên', type: 'input', name: 'phaseName' },
      {
        type: 'column',
        items: [
          [
            {
              key: 'Ngày bắt đầu',
              type: 'datetime',
              name: 'startDate',
              format: 'DD/MM/YYYY HH:mm',
            },
          ],
          [
            {
              key: 'Ngày kết thúc',
              type: 'datetime',
              name: 'endDate',
              format: 'DD/MM/YYYY HH:mm',
            },
          ],
        ],
      },
    ],
  };

  const trackTableModel = {
    entityName: 'phần thi',
    rowKey: 'trackId',
    createButton: {
      label: 'Tạo mới phần thi',
      action: () =>
        navigate(
          `${PATH_NAME.ADMIN_TRACKS}/create?phaseId=${id}&hackathonId=${hackathonId}`,
        ),
      icon: true,
    },
    columns: [
      {
        title: 'Tên',
        dataIndex: 'name',
        key: 'name',
        type: 'text',
        className: 'font-medium text-white',
      },
      {
        title: 'Mô tả',
        dataIndex: 'description',
        key: 'description',
        type: 'text',
        ellipsis: { tooltip: true },
        className: 'text-gray-300',
      },
      {
        title: 'Thử thách',
        key: 'challenges',
        type: 'custom',
        ellipsis: true,
        render: (record) => {
          const challenges = record.challenges || [];
          if (challenges.length === 0) {
            return <Tag color="default">Chưa có thử thách</Tag>;
          }
          return (
            <Space wrap>
              {challenges.map((ch) => (
                <Button
                  key={ch.challengeId}
                  size="small"
                  type="primary"
                  ghost
                  className="text-xs"
                  onClick={() =>
                    navigate(`${PATH_NAME.ADMIN_CHALLENGES}/${ch.challengeId}`)
                  }
                >
                  {ch.title}
                </Button>
              ))}
            </Space>
          );
        },
      },
    ],
    actions: {
      view: true,
      edit: true,
      delete: true,
      extra: [
        {
          key: 'assign-random-challenge',
          icon: <SyncOutlined />,
          tooltip: 'Gán thử thách ngẫu nhiên',
          className: 'text-yellow-500 hover:text-yellow-400',
        },
      ],
    },
  };

  // Model cho bảng groups
  const groupTableModel = useMemo(() => ({
    entityName: 'bảng đấu',
    rowKey: 'groupId',
    createButton: {
      label: 'Tạo bảng đấu Tự Động',
      action: () => {
        setCreateGroupModal(true);
        createGroupForm.setFieldsValue({ teamsPerGroup: 1 });
      },
      icon: true,
    },
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
  }), []);

  const handleAssignRandomClick = (record) => {
    setAssignModal({ open: true, track: record });
    assignForm.setFieldsValue({
      quantity: 1,
      challengeIds: [],
    });
  };

  const handleAssignSubmit = () => {
    assignForm.validateFields().then((values) => {
      assignRandomChallenge.mutate(
        {
          trackId: assignModal.track.trackId,
          quantity: values.quantity,
          challengeIds:
            values.challengeIds.length > 0 ? values.challengeIds : null,
        },
        {
          onSuccess: () => {
            message.success('Gán challenge thành công!');
            setAssignModal({ open: false, track: null });
            assignForm.resetFields();
          },
          onError: () => {
            message.error('Gán challenge thất bại!');
          },
        },
      );
    });
  };

  const handleCreateGroupSubmit = () => {
    createGroupForm.validateFields().then((values) => {
      autoCreateGroups.mutate({
        teamsPerGroup: values.teamsPerGroup,
        phaseId: phaseTracks[0]?.phaseId || null,
      }, {
        onSuccess: () => {
          message.success('Tạo bảng đấu thành công!');
          setCreateGroupModal(false);
          createGroupForm.resetFields();
        },
        onError: () => {
          message.error('Tạo bảng đấu thất bại!');
        }
      });
    });
  };

  const handleDeleteConfirm = (id) => {
    setConfirmModal({ open: true, trackId: id });
  };

  const handleConfirmOk = () => {
    const { trackId } = confirmModal;
    deleteTrack.mutate(trackId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['hackathonPhases', id],
        });
        setConfirmModal({ open: false, trackId: null });
      },
      onSettled: () => {
        setConfirmModal({ open: false, trackId: null });
      },
    });
  };

  const handleConfirmCancel = () => {
    setConfirmModal({ open: false, trackId: null });
  };

  const trackHandlers = {
    onView: (record) =>
      navigate(
        `${PATH_NAME.ADMIN_TRACKS}/${record.trackId}?phaseId=${id}&hackathonId=${hackathonId}`,
      ),
    onEdit: (record) =>
      navigate(
        `${PATH_NAME.ADMIN_TRACKS}/edit/${record.trackId}?phaseId=${id}&hackathonId=${hackathonId}`,
      ),
    onDelete: (record) => handleDeleteConfirm(record.trackId),
    isDeleting: (record) =>
      deleteTrack.isPending && deleteTrack.variables === record.trackId,
    onExtraAction: (key, record) => {
      if (key === 'assign-random-challenge') {
        handleAssignRandomClick(record);
      }
    },
    getExtraActionProps: (key, record) => {
      if (key === 'assign-random-challenge') {
        const isLoading =
          assignRandomChallenge.isPending &&
          assignRandomChallenge.variables?.trackId === record.trackId;
        return {
          loading: isLoading,
          disabled: isLoading,
          tooltip: isLoading ? 'Đang gán...' : 'Gán thử thách ngẫu nhiên',
        };
      }
      return {};
    },
  };

  const groupHandlers = {
    onView: (record) => navigate(`/admin/groups/${record.groupId}?trackId=${record.trackId}`),
  };

  if (phaseError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Lỗi tải dữ liệu.
      </div>
    );
  }

  if (phaseLoading || tracksLoading || challengesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgContainer: '#111111',
          colorBgElevated: '#181818',
          colorBorder: '#2f2f2f',
          colorText: '#ffffff',
          colorTextPlaceholder: '#9ca3af',
          colorPrimary: '#10b981',
          borderRadius: 4,
        },
      }}
    >
      <EntityDetail
        entityName="Giai đoạn"
        model={model}
        data={phase || {}}
        onBack={() =>
          navigate(
            `${PATH_NAME.ADMIN_HACKATHON_PHASES}?hackathonId=${hackathonId}`,
          )
        }
        onEdit={(rec) =>
          navigate(
            `${PATH_NAME.ADMIN_HACKATHON_PHASES}/edit/${rec.phaseId}?hackathonId=${hackathonId}`,
          )
        }
        showEdit
      >
        <Card className="mt-16 border border-white/10 bg-white/5 rounded-xl shadow-sm backdrop-blur-sm">
          <EntityTable
            model={trackTableModel}
            data={phaseTracks}
            loading={tracksLoading || challengesLoading}
            handlers={trackHandlers}
            emptyText="Không có track nào cho phase này"
            dateFormatter={(value, fmt) =>
              value ? dayjs(value).format(fmt) : '--'
            }
          />
        </Card>

        {/* Group Section */}
        {hackathonId && (
          <Card className="mt-6 border border-white/10 bg-white/5 rounded-xl">
            <EntityTable
              model={groupTableModel}
              data={sortedGroups}
              loading={groupsLoading}
              handlers={groupHandlers}
              emptyText="Không có bảng đấu nào"
              dateFormatter={(value, fmt) => value ? dayjs(value).format(fmt) : '--'}
            />
          </Card>
        )}
      </EntityDetail>

      {/* Modal Gán thử thách ngẫu nhiên */}
      <Modal
        title="Gán thử thách ngẫu nhiên"
        open={assignModal.open}
        onCancel={() => {
          setAssignModal({ open: false, track: null });
          assignForm.resetFields();
        }}
        onOk={handleAssignSubmit}
        okText="Gán ngay"
        cancelText="Hủy"
        centered
        confirmLoading={assignRandomChallenge.isPending}
      >
        <div className="mb-2 text-sm font-medium">
          Phần thi: <span className="text-primary">{assignModal.track?.name}</span>
        </div>
        <Form form={assignForm} layout="vertical">
          <Form.Item
            name="quantity"
            label="Số lượng thử thách trong một phân thi"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
          >
            <InputNumber min={1} max={1000} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="challengeIds" label="Chọn thử thách">
            <Select
              mode="multiple"
              placeholder="Chọn thử thách"
              allowClear
              showSearch
            >
              {allChallenges.map((ch) => (
                <Select.Option key={ch.challengeId} value={ch.challengeId}>
                  {ch.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Tạo bảng đấu Tự Động */}
      <Modal
        title="Tạo bảng đấu Tự Động"
        open={createGroupModal}
        onCancel={() => {
          setCreateGroupModal(false);
          createGroupForm.resetFields();
        }}
        onOk={handleCreateGroupSubmit}
        okText="Tạo"
        cancelText="Hủy"
        centered
        confirmLoading={autoCreateGroups.isPending}
      >
        <Form form={createGroupForm} layout="vertical">
          <Form.Item
            name="teamsPerGroup"
            label="Số lượng đôi thi trong mỗi bảng đấu"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              placeholder="Số đội/bảng đấu"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xác nhận xóa track */}
      <Modal
        title="Xác nhận xóa"
        open={confirmModal.open}
        onOk={handleConfirmOk}
        onCancel={handleConfirmCancel}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
        centered
      >
        <div className="flex items-start gap-3">
          <ExclamationCircleOutlined className="text-yellow-500 text-xl mt-1" />
          <span>Bạn có chắc chắn muốn xóa track này không?</span>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default HackathonPhaseDetail;