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
import { useCriteria } from '../../../../hooks/admin/criterias/useCriteria.js';
import { useUsers } from '../../../../hooks/admin/users/useUsers';
import { useJudgeAssignment } from '../../../../hooks/admin/assignments/useJudgeAssignments.js';
import { UserAddOutlined } from '@ant-design/icons';
import { useUserData } from '../../../../hooks/useUserData.js';

const HackathonPhaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hackathonId = searchParams.get('hackathonId');
  const isLastPhaseParam = searchParams.get('isLastPhase')?.includes('true');
  const queryClient = useQueryClient();

  const { userInfo } = useUserData();
  const isAdmin = userInfo?.roleName?.toLowerCase() === 'admin';

  const { fetchHackathonPhases, fetchHackathonPhase } = useHackathonPhases();
  const { deleteTrack, fetchTracks, assignRandomChallenge } = useTracks();
  const { fetchCompleteChallenge } = useChallenges();
  const { fetchGroupsByHackathon, autoCreateGroups } = useGroups();
  const { fetchFinalQualified, selectTopTeams } = useQualifications();

  // Lấy danh sách users có role Judge
  const { fetchUsers } = useUsers();
  const { data: allUsers = [], isLoading: usersLoading } = fetchUsers;

  // Lấy danh sách judge assignments
  const { fetchJudgeAssignmentsByHackathon, createJudgeAssignment, blockJudgeAssignment, reactivateJudgeAssignment } = useJudgeAssignment();
  const { data: allAssignments = [], isLoading: assignmentsLoading } = fetchJudgeAssignmentsByHackathon(hackathonId);

  // Filter assignments cho phase hiện tại (chỉ filter theo phaseId)
  // const phaseAssignments = allAssignments.filter(
  //   assignment => String(assignment.phaseId) === String(id)
  // );

  const judgeUsers = allUsers.filter(user =>
    user.roleName === 'Judge' &&
    !allAssignments.some(assignment => String(assignment.judgeId) === String(user.userId))
  );

  // Lấy tiêu chí của phase này
  const { fetchCriteria, deleteCriterion } = useCriteria();
  const { data: phaseCriteria = [], isLoading: criteriaLoading } = fetchCriteria(id);

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
  const [isAssignJudgeModalOpen, setIsAssignJudgeModalOpen] = useState(false);
  const [assignJudgeForm] = Form.useForm();
  const [confirmJudgeModal, setConfirmJudgeModal] = useState({ open: false, type: '', record: null });

  const computedIsLastPhase = useMemo(() => {
    if (!phases?.length || !phase?.endDate) return null;
    const sortedByEnd = [...phases].sort(
      (a, b) => dayjs(b.endDate).valueOf() - dayjs(a.endDate).valueOf(),
    );
    const lastPhase = sortedByEnd[0];
    return lastPhase?.phaseId === phase?.phaseId;
  }, [phases, phase]);

  const isLastPhase = computedIsLastPhase ?? isLastPhaseParam;

  // Xác định phase 1 (phase đầu tiên theo startDate)
  const isFirstPhase = useMemo(() => {
    if (!phases?.length || !phase?.startDate) return false;
    const sortedByStart = [...phases].sort(
      (a, b) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf(),
    );
    const firstPhase = sortedByStart[0];
    return firstPhase?.phaseId === phase?.phaseId;
  }, [phases, phase]);

  // Kiểm tra nếu chỉ có 1 giai đoạn
  const isSinglePhase = phases?.length === 1;

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

  const trackTableModel = useMemo(() => ({
    entityName: 'phần thi',
    rowKey: 'trackId',
    createButton: isAdmin && isFirstPhase ? {
      label: 'Tạo mới phần thi',
      action: () =>
        navigate(
          `${PATH_NAME.ADMIN_TRACKS}/create?phaseId=${id}&hackathonId=${hackathonId}`,
        ),
      icon: true,
    } : null,
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
      edit: isAdmin && isFirstPhase,
      delete: isAdmin && isFirstPhase,
      extra: isAdmin && isFirstPhase ? [
        {
          key: 'assign-random-challenge',
          icon: <SyncOutlined />,
          tooltip: 'Gán thử thách ngẫu nhiên',
          className: 'text-yellow-500 hover:text-yellow-400',
        },
      ] : [],
    },
  }), [isAdmin, isFirstPhase, id, hackathonId, navigate]);

  const groupTableModel = useMemo(() => ({
    entityName: 'bảng đấu',
    rowKey: 'groupId',
    createButton: isAdmin && isFirstPhase ? {
      label: 'Tạo bảng đấu Tự Động',
      action: () => {
        setCreateGroupModal(true);
        createGroupForm.setFieldsValue({ teamsPerGroup: 1 });
      },
      icon: true,
    } : null,
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
  }), [isAdmin, isFirstPhase]);

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
        title: 'Hạng mục',
        dataIndex: 'trackName',
        key: 'trackName',
        type: 'text',
        className: 'text-gray-300'
      }
    ],
    actions: {
      view: false,
      edit: false,
      delete: false,
    }
  }), []);

  const judgeAssignmentTableModel = useMemo(() => ({
    entityName: 'giám khảo được phân công',
    rowKey: 'assignmentId',
    createButton: isAdmin && isFirstPhase ? {
      label: 'Thêm giám khảo',
      icon: <UserAddOutlined />,
      action: () => setIsAssignJudgeModalOpen(true),
    } : null,
    columns: [
      {
        title: 'Tên giám khảo',
        dataIndex: 'judgeName',
        key: 'judgeName',
        className: 'font-medium',
        render: (text, record) => (
          <Button
            type="link"
            className="p-0 h-auto text-emerald-400"
            onClick={() => navigate(`${PATH_NAME.ADMIN_USERS}/${record.judgeId}`)}
          >
            {text}
          </Button>
        ),
      },
      {
        title: 'Gán vào lúc',
        dataIndex: 'assignedAt',
        key: 'assignedAt',
        className: 'text-gray-400',
        render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Tag color={status === 'Active' ? 'green' : 'red'}>
            {status == 'Active' ? 'Hoạt động' : 'Đã khoá'}
          </Tag>
        ),
      },
      ...(isAdmin && isFirstPhase ? [{
        title: 'Thao tác',
        key: 'action',
        render: (record) => (
          <Space>
            {record.status === 'Active' ? (
              <Button
                danger
                size="small"
                onClick={() => handleBlockJudgeAssignment(record)}
              >
                Khoá
              </Button>
            ) : (
              <Button
                type="primary"
                size="small"
                onClick={() => handleReactivateJudgeAssignment(record)}
              >
                Mở khoá
              </Button>
            )}
          </Space>
        ),
      }] : []),
    ],
    actions: {},
  }), [isAdmin, isFirstPhase, navigate, handleBlockJudgeAssignment, handleReactivateJudgeAssignment]);

  const criteriaTableModel = useMemo(() => ({
    entityName: 'Tiêu chí chấm điểm',
    rowKey: 'criteriaId',
    createButton: isAdmin && isFirstPhase ? {
      label: 'Thêm tiêu chí',
      action: () =>
        navigate(
          `${PATH_NAME.ADMIN_CRITERIAS}/create?phaseId=${id}&hackathonId=${hackathonId}`,
        ),
    } : null,
    columns: [
      {
        title: 'Tên tiêu chí',
        dataIndex: 'name',
        key: 'name',
        className: 'font-medium',
      },
      {
        title: 'Hạng mục',
        dataIndex: 'trackId',
        key: 'trackId',
        className: 'text-gray-400',
        render: (trackId) => {
          if (!trackId) return 'Tất cả hạng mục';
          const track = phaseTracks.find(t => String(t.trackId) === String(trackId));
          return track?.name || 'N/A';
        },
      },
      {
        title: 'Trọng số',
        dataIndex: 'weight',
        key: 'weight',
        className: 'text-gray-400',
      },
    ],
    actions: {
      view: true,
      edit: isAdmin && isFirstPhase,
      delete: isAdmin && isFirstPhase,
    },
  }), [isAdmin, isFirstPhase, id, hackathonId, navigate, phaseTracks]);

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

  const handleAssignJudge = async (values) => {
    try {
      await createJudgeAssignment.mutateAsync({
        judgeId: values.judgeId,
        hackathonId: parseInt(hackathonId),
        phaseId: parseInt(id),
      });
      setIsAssignJudgeModalOpen(false);
      assignJudgeForm.resetFields();
    } catch (error) {
      console.error('Error assigning judge:', error);
    }
  };

  const handleBlockJudgeAssignment = (record) => {
    setConfirmJudgeModal({ open: true, type: 'blockAssignment', record });
  };

  const handleReactivateJudgeAssignment = (record) => {
    setConfirmJudgeModal({ open: true, type: 'reactivateAssignment', record });
  };

  const handleConfirmJudgeOk = () => {
    const { type, record } = confirmJudgeModal;
    if (type === 'blockAssignment') {
      blockJudgeAssignment.mutate(record.assignmentId);
    } else if (type === 'reactivateAssignment') {
      reactivateJudgeAssignment.mutate(record.assignmentId);
    }
    setConfirmJudgeModal({ open: false, type: '', record: null });
  };

  const handleConfirmJudgeCancel = () => {
    setConfirmJudgeModal({ open: false, type: '', record: null });
  };

  const criteriaHandlers = {
    onView: (record) =>
      navigate(
        `${PATH_NAME.ADMIN_CRITERIAS}/${record.criteriaId}?phaseId=${id}&trackId=${record.trackId || ''}&hackathonId=${hackathonId}`,
      ),
    onEdit: isAdmin && isFirstPhase ? (record) =>
      navigate(
        `${PATH_NAME.ADMIN_CRITERIAS}/edit/${record.criteriaId}?phaseId=${id}&trackId=${record.trackId || ''}&hackathonId=${hackathonId}`,
      ) : undefined,
    onDelete: isAdmin && isFirstPhase ? (record) => {
      setConfirmJudgeModal({ open: true, type: 'deleteCriteria', record });
    } : undefined,
    isDeleting: (record) =>
      deleteCriterion.isPending &&
      deleteCriterion.variables === record.criteriaId,
  };

  const handleConfirmCriteriaDelete = () => {
    const { record } = confirmJudgeModal;
    deleteCriterion.mutate(record.criteriaId);
    setConfirmJudgeModal({ open: false, type: '', record: null });
  };

  const trackHandlers = {
    onView: (record) =>
      navigate(
        `${PATH_NAME.ADMIN_TRACKS}/${record.trackId}?phaseId=${id}&hackathonId=${hackathonId}`,
      ),
    onEdit: isAdmin && isFirstPhase ? (record) =>
      navigate(
        `${PATH_NAME.ADMIN_TRACKS}/edit/${record.trackId}?phaseId=${id}&hackathonId=${hackathonId}`,
      ) : undefined,
    onDelete: isAdmin && isFirstPhase ? (record) => handleDeleteConfirm(record.trackId) : undefined,
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

  if (phaseLoading || phasesLoading || tracksLoading || cChallengesLoading || usersLoading || assignmentsLoading || criteriaLoading) {
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
        showEdit={isAdmin && isFirstPhase}
      >
        {/* Track Section - Không hiển thị nếu là phase cuối (trừ khi chỉ có 1 phase) */}
        {(!isLastPhase || isSinglePhase) && (
          <Card className={`${isFirstPhase ? 'mt-6' : 'mt-16'} border border-white/10 bg-white/5 rounded-xl shadow-sm backdrop-blur-sm`}>
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

        {/* Group Section - Không hiển thị nếu là phase cuối (trừ khi chỉ có 1 phase) */}
        {hackathonId && (!isLastPhase || isSinglePhase) && (
          <Card className={`${isFirstPhase ? 'mt-6' : 'mt-16'} border border-white/10 bg-white/5 rounded-xl`}>
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

        {/* Judge Assignments Section - Chỉ hiển thị ở phase 1 */}
        {hackathonId && isFirstPhase && (
          <Card className="mt-6 border border-white/10 bg-white/5 rounded-xl">
            <EntityTable
              model={judgeAssignmentTableModel}
              data={allAssignments}
              loading={assignmentsLoading}
              emptyText="Chưa có giám khảo nào được phép chấm cho giai đoạn này"
            />
          </Card>
        )}

        {/* Criteria Section - Chỉ hiển thị ở phase 1 */}
        {hackathonId && isFirstPhase && (
          <Card className="mt-6 border border-white/10 bg-white/5 rounded-xl">
            <EntityTable
              model={criteriaTableModel}
              data={phaseCriteria}
              loading={criteriaLoading}
              handlers={criteriaHandlers}
              emptyText="Chưa có tiêu chí chấm điểm nào cho giai đoạn này"
            />
          </Card>
        )}

        {/* Qualification Section - Chỉ hiển thị nếu là phase cuối và không phải single phase */}
        {isLastPhase && !isSinglePhase && (
          <>
            {isAdmin && qualifiedTeams?.length === 0 && !showQualifiedTable &&
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

      {/* Assign Judge Modal */}
      <Modal
        title="Chọn giám khảo"
        open={isAssignJudgeModalOpen}
        onCancel={() => {
          setIsAssignJudgeModalOpen(false);
          assignJudgeForm.resetFields();
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsAssignJudgeModalOpen(false);
              assignJudgeForm.resetFields();
            }}
          >
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={createJudgeAssignment.isPending}
            onClick={() => assignJudgeForm.submit()}
          >
            Gán giám khảo
          </Button>,
        ]}
        width={600}
        centered
      >
        <Form
          form={assignJudgeForm}
          layout="vertical"
          onFinish={handleAssignJudge}
        >
          <Form.Item
            label="Chọn giám khảo"
            name="judgeId"
            rules={[{ required: true, message: 'Vui lòng chọn giám khảo' }]}
          >
            <Select
              placeholder="Tìm kiếm theo tên hoặc email..."
              showSearch
              loading={usersLoading}
              filterOption={(input, option) => {
                const searchText = `${option?.judgeName || ''} ${option?.judgeEmail || ''}`.toLowerCase();
                return searchText.includes(input.toLowerCase());
              }}
              style={{ width: '100%' }}
              notFoundContent={usersLoading ? <Spin size="small" /> : 'Không tìm thấy giám khảo'}
              optionLabelProp="label"
            >
              {judgeUsers.map(judge => (
                <Select.Option
                  key={judge.userId}
                  value={judge.userId}
                  label={judge.fullName}
                  judgeName={judge.fullName}
                  judgeEmail={judge.email}
                >
                  <div style={{ lineHeight: '1.5' }}>
                    <div style={{ fontWeight: 500 }}>{judge.fullName}</div>
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{judge.email}</div>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Confirm Modal for Judge Assignment and Criteria */}
      <Modal
        title={
          confirmJudgeModal.type === 'deleteCriteria'
            ? 'Xóa tiêu chí'
            : confirmJudgeModal.type === 'blockAssignment'
            ? 'Khóa giám khảo'
            : 'Mở lại'
        }
        open={confirmJudgeModal.open}
        onOk={() => {
          if (confirmJudgeModal.type === 'deleteCriteria') {
            handleConfirmCriteriaDelete();
          } else {
            handleConfirmJudgeOk();
          }
        }}
        onCancel={handleConfirmJudgeCancel}
        okText={
          confirmJudgeModal.type === 'deleteCriteria'
            ? 'Xóa'
            : confirmJudgeModal.type === 'blockAssignment'
            ? 'Khóa'
            : 'Mở lại'
        }
        okButtonProps={{
          danger: confirmJudgeModal.type === 'deleteCriteria' || confirmJudgeModal.type === 'blockAssignment'
        }}
        cancelText="Hủy"
        centered
      >
        <div className="flex items-start gap-3">
          <ExclamationCircleOutlined className="text-yellow-500 text-xl mt-1" />
          <span>
            {confirmJudgeModal.type === 'deleteCriteria' &&
              `Xóa tiêu chí "${confirmJudgeModal.record?.name}"? Hành động này không thể hoàn tác.`}
            {confirmJudgeModal.type === 'blockAssignment' &&
              `Bạn có muốn khóa "${confirmJudgeModal.record?.judgeName}"?`}
            {confirmJudgeModal.type === 'reactivateAssignment' &&
              `Bạn có muốn mở lại "${confirmJudgeModal.record?.judgeName}"?`}
          </span>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default HackathonPhaseDetail;
