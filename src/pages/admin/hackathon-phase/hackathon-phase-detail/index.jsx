// components/admin/hackathon-phases/HackathonPhaseDetail.jsx
import { useState, useMemo, useEffect } from 'react';
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
  PlusOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useChallenges } from '../../../../hooks/admin/challanges/useChallenges.js';
import { useQualifications } from '../../../../hooks/admin/qualification/useQualification.js';

const HackathonPhaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hackathonId = searchParams.get('hackathonId');
  const isLastPhaseParam = searchParams.get('isLastPhase')?.includes('true');
  const queryClient = useQueryClient();

  const { fetchHackathonPhases, fetchHackathonPhase } = useHackathonPhases();
  const { deleteTrack, fetchTracks, assignRandomChallenge } = useTracks();
  const { fetchCompleteChallenge } = useChallenges();
  const { fetchGroupsByHackathon, autoCreateGroups } = useGroups();
  const { fetchFinalQualified, selectTopTeams } = useQualifications();

  const {
    data: phase,
    isLoading: phaseLoading,
    error: phaseError,
  } = fetchHackathonPhase(id);
  const { data: phases = [], isLoading: phasesLoading } = fetchHackathonPhases(hackathonId);
  const { data: allTracks, isLoading: tracksLoading } = fetchTracks;
  const { data: completesChallenges = [], isLoading: cChallengesLoading } = fetchCompleteChallenge(hackathonId);
  const { data: groupsData = [], isLoading: groupsLoading } = fetchGroupsByHackathon(hackathonId);
  const { data: qualifiedTeams = [], isLoading: qualifiedLoading, refetch: qualifiedRefetch } = fetchFinalQualified(id);

  const phaseTracks =
    allTracks?.filter((track) => track.phaseId === parseInt(id)) || [];

  const trackIds = phaseTracks.map(t => t.trackId);
  const sortedGroups = [...groupsData]
    .filter(group => trackIds?.includes(group.trackId))
    ?.sort((a, b) => a.groupName.localeCompare(b.groupName));

  const [assignModal, setAssignModal] = useState({ open: false, track: null });
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, trackId: null });
  const [showQualifiedTable, setShowQualifiedTable] = useState(false);

  const computedIsLastPhase = useMemo(() => {
    if (!phases?.length || !phase?.endDate) return null;
    const sortedByEnd = [...phases].sort(
      (a, b) => dayjs(b.endDate).valueOf() - dayjs(a.endDate).valueOf(),
    );
    const lastPhase = sortedByEnd[0];
    return lastPhase?.phaseId === phase?.phaseId;
  }, [phases, phase]);

  const isLastPhase = computedIsLastPhase ?? isLastPhaseParam;

  useEffect(() => {
    qualifiedRefetch();
  }, []);
  useEffect(() => {
    // Auto show table when qualified teams already exist
    console.log(qualifiedTeams);
    
    if (qualifiedTeams && qualifiedTeams.length > 0) {
      setShowQualifiedTable(true);
    }
  }, [qualifiedTeams]);

  useEffect(() => {
    if (!phase?.startDate || !hackathonId) return;
    if (dayjs().isBefore(dayjs(phase.startDate))) {
      message.warning('Giai đoạn chưa bắt đầu');
      navigate(
        `${PATH_NAME.ADMIN_HACKATHON_PHASES}?hackathonId=${hackathonId}`,
        { replace: true },
      );
    }
  }, [phase, hackathonId, navigate]);
  const [assignForm] = Form.useForm();
  const [createGroupForm] = Form.useForm();

  const model = {
    modelName: 'Giai đoạn',
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
        title: 'Mã đội thi',
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

  // Model cho bảng Qualification
  const qualificationTableModel = useMemo(() => ({
    entityName: 'đội đủ điều kiện',
    rowKey: 'teamId',
    columns: [
      {
        title: 'Tên đội',
        dataIndex: 'teamName',
        key: 'teamName',
        type: 'text',
        className: 'font-medium text-white'
      },
      {
        title: 'Bảng đấu',
        dataIndex: 'groupName',
        key: 'groupName',
        type: 'tag',
        tagColor: 'green',
        transform: (val) => val || 'N/A'
      },
      {
        title: 'Track',
        dataIndex: 'trackName',
        key: 'trackName',
        type: 'text',
        className: 'text-gray-300'
      },
      {
        title: 'Group ID',
        dataIndex: 'groupId',
        key: 'groupId',
        type: 'tag',
        tagColor: 'blue'
      }
    ],
    actions: {
      view: false,
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
        trackId: assignModal.track?.trackId,
        quantity: values.quantity,
        challengeIds:
          values.challengeIds.length > 0 ? values.challengeIds : null,
      },
      {
        onSuccess: () => {
          setAssignModal({ open: false, track: null });
          assignForm.resetFields();
        },
        onError: () => {},
      },
    );
    });
  };

  const handleCreateGroupSubmit = () => {
    createGroupForm.validateFields().then((values) => {
      autoCreateGroups.mutate({
        teamsPerGroup: values.teamsPerGroup,
        phaseId: parseInt(id) || null,
      }, {
        onSuccess: () => {
          setCreateGroupModal(false);
          createGroupForm.resetFields();
        },
        onError: () => {},
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

  const handleGetQualifiedTeams = () => {
    qualifiedRefetch();
    selectTopTeams.mutate(id, {
      onSuccess: () => {
        setShowQualifiedTable(true);
      },
      onError: () => {},
    });
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

  if (phaseLoading || phasesLoading || tracksLoading || cChallengesLoading) {
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
        {/* Track Section - Không hiển thị nếu là phase cuối */}
        {!isLastPhase && (
          <Card className="mt-16 border border-white/10 bg-white/5 rounded-xl shadow-sm backdrop-blur-sm">
            <EntityTable
              model={trackTableModel}
              data={phaseTracks}
              loading={tracksLoading || cChallengesLoading}
              handlers={trackHandlers}
              emptyText="Không có track nào cho phase này"
              dateFormatter={(value, fmt) =>
                value ? dayjs(value).format(fmt) : '--'
              }
            />
          </Card>
        )}

        {/* Group Section - Không hiển thị nếu là phase cuối */}
        {hackathonId && !isLastPhase && (
          <Card className="mt-16 border border-white/10 bg-white/5 rounded-xl">
            <EntityTable
              model={groupTableModel}
              data={sortedGroups}
              loading={groupsLoading}
              handlers={groupHandlers}
              emptyText="Không có bảng đấu nào"
              dateFormatter={(value, fmt) =>
                value ? dayjs(value).format(fmt) : '--'
              }
            />
          </Card>
        )}

        {/* Qualification Section - Chỉ hiển thị nếu là phase cuối */}
        {isLastPhase && (
          <>
            {qualifiedTeams?.length === 0 && !showQualifiedTable &&
              ( <div className="mx-6 mb-6">
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={handleGetQualifiedTeams}
                  loading={selectTopTeams.isPending}
                  disabled={selectTopTeams.isPending}
                  className="w-full h-12 !text-primary !border-primary/50 hover:!border-primary hover:!bg-primary/5"
                >
                  {selectTopTeams.isPending
                    ? 'Đang xử lý...'
                    : 'Lấy danh sách đội'}
                </Button>
              </div>)
            }

            {showQualifiedTable && (
              <Card className="mt-6 border border-white/10 bg-white/5 rounded-xl">
                <EntityTable
                  model={qualificationTableModel}
                  data={qualifiedTeams}
                  loading={qualifiedLoading}
                  handlers={{}}
                  emptyText="Không có đội nào đủ điều kiện"
                  dateFormatter={(value, fmt) =>
                    value ? dayjs(value).format(fmt) : '--'
                  }
                />
              </Card>
            )}
          </>
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
          Phần thi:{' '}
          <span className="text-primary">{assignModal.track?.name}</span>
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
              {completesChallenges?.map((ch) => (
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