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
  Input,
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
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useChallenges } from '../../../../hooks/admin/challanges/useChallenges.js';
import { useQualifications } from '../../../../hooks/admin/qualification/useQualification.js';
import { useCriteria } from '../../../../hooks/admin/criterias/useCriteria.js';
import { useUsers } from '../../../../hooks/admin/users/useUsers';
import { useJudgeAssignment } from '../../../../hooks/admin/assignments/useJudgeAssignments.js';
import { UserAddOutlined } from '@ant-design/icons';
import { useUserData } from '../../../../hooks/useUserData.js';
import { usePenalty } from '../../../../hooks/admin/penalty/usePenalty.js';
import { Table, Empty } from 'antd';

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

  // Lấy danh sách judge assignments theo phaseId
  const {
    fetchJudgeAssignmentsByPhase,
    createJudgeAssignment,
    blockJudgeAssignment,
    reactivateJudgeAssignment,
  } = useJudgeAssignment();
  const { data: allAssignments = [], isLoading: assignmentsLoading } =
    fetchJudgeAssignmentsByPhase(id);

  const judgeUsers = allUsers.filter(
    (user) =>
      user.roleName === 'Judge' &&
      !allAssignments.some(
        (assignment) => String(assignment.judgeId) === String(user.userId),
      ),
  );

  // Lấy tiêu chí của phase này
  const { fetchCriteria, deleteCriterion } = useCriteria();
  const { data: phaseCriteria = [], isLoading: criteriaLoading } =
    fetchCriteria(id);


  // Hook để lấy penalties của team
  const { fetchPenaltiesByTeamAndPhase } = usePenalty();

  const {
    data: phase,
    isLoading: phaseLoading,
    error: phaseError,
  } = fetchHackathonPhase(id);
  const { data: phases = [], isLoading: phasesLoading } =
    fetchHackathonPhases(hackathonId);
  const { data: allTracks, isLoading: tracksLoading } = fetchTracks;
  const { data: completesChallenges = [], isLoading: cChallengesLoading } =
    fetchCompleteChallenge(hackathonId);
  const { data: groupsData = [], isLoading: groupsLoading } =
    fetchGroupsByHackathon(hackathonId);
  const {
    data: qualifiedTeams = [],
    isLoading: qualifiedLoading,
    refetch: qualifiedRefetch,
  } = fetchFinalQualified(id);

  // Đảm bảo allTracks và groupsData là array
  const safeAllTracks = Array.isArray(allTracks) ? allTracks : [];
  const safeGroupsData = Array.isArray(groupsData) ? groupsData : [];

  const phaseTracks =
    safeAllTracks.filter((track) => track.phaseId === parseInt(id)) || [];

  const trackIds = phaseTracks.map((t) => t.trackId);
  const sortedGroups = [...safeGroupsData]
    .filter((group) => trackIds?.includes(group.trackId))
    ?.sort((a, b) => a.groupName.localeCompare(b.groupName));

  const [assignModal, setAssignModal] = useState({ open: false, track: null });
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    trackId: null,
  });
  const [showQualifiedTable, setShowQualifiedTable] = useState(false);
  const [isAssignJudgeModalOpen, setIsAssignJudgeModalOpen] = useState(false);
  const [assignJudgeForm] = Form.useForm();
  const [confirmJudgeModal, setConfirmJudgeModal] = useState({
    open: false,
    type: '',
    record: null,
  });

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

  // Xác định phase 2 (phase thứ hai theo startDate)
  const isSecondPhase = useMemo(() => {
    if (!phases?.length || !phase?.startDate) return false;
    const sortedByStart = [...phases].sort(
      (a, b) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf(),
    );
    const secondPhase = sortedByStart[1];
    return secondPhase?.phaseId === phase?.phaseId;
  }, [phases, phase]);

  // Phase 1 hoặc Phase 2
  const isFirstOrSecondPhase = isFirstPhase || isSecondPhase;

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

  const handleBlockJudgeAssignment = (record) => {
    setConfirmJudgeModal({ open: true, type: 'blockAssignment', record });
  };

  const handleReactivateJudgeAssignment = (record) => {
    setConfirmJudgeModal({ open: true, type: 'reactivateAssignment', record });
  };

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

  const trackTableModel = useMemo(
    () => ({
      entityName: 'hạng mục',
      rowKey: 'trackId',
      createButton:
        isAdmin && isFirstPhase
          ? {
              label: 'Tạo mới hạng mục',
              action: () =>
                navigate(
                  `${PATH_NAME.ADMIN_TRACKS}/create?phaseId=${id}&hackathonId=${hackathonId}`,
                ),
              icon: true,
            }
          : null,
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
                      navigate(
                        `${PATH_NAME.ADMIN_CHALLENGES}/${ch.challengeId}`,
                      )
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
        extra:
          isAdmin && isFirstPhase
            ? [
                {
                  key: 'assign-random-challenge',
                  icon: <SyncOutlined />,
                  tooltip: 'Gán thử thách ngẫu nhiên',
                  className: 'text-yellow-500 hover:text-yellow-400',
                },
              ]
            : [],
      },
    }),
    [isAdmin, isFirstPhase, id, hackathonId, navigate],
  );

  const groupTableModel = useMemo(
    () => ({
      entityName: 'bảng đấu',
      rowKey: 'groupId',
      createButton:
        isAdmin && isFirstPhase
          ? {
              label: 'Tạo bảng đấu Tự Động',
              action: () => {
                setCreateGroupModal(true);
                createGroupForm.setFieldsValue({ teamsPerGroup: 1 });
              },
              icon: true,
            }
          : null,
      columns: [
        {
          title: 'Tên bảng đấu',
          dataIndex: 'groupName',
          key: 'groupName',
          type: 'text',
          className: 'font-medium text-white',
        },
        {
          title: 'Mã đội thi',
          dataIndex: 'teamIds',
          key: 'teamIds',
          type: 'text',
          transform: (val) => (Array.isArray(val) ? val.length : 0),
        },
        {
          title: 'Ngày Tạo',
          dataIndex: 'createdAt',
          key: 'createdAt',
          type: 'datetime',
          format: 'DD/MM/YYYY HH:mm',
        },
      ],
      actions: {
        view: true,
        edit: false,
        delete: false,
      },
    }),
    [isAdmin, isFirstPhase],
  );

  // Model cho bảng Qualification
  const qualificationTableModel = useMemo(
    () => ({
      entityName: 'đội đủ điều kiện',
      rowKey: 'teamId',
      columns: [
        {
          title: 'Tên đội',
          dataIndex: 'teamName',
          key: 'teamName',
          type: 'text',
          className: 'font-medium text-white',
        },
        {
          title: 'Bảng đấu',
          dataIndex: 'groupName',
          key: 'groupName',
          type: 'tag',
          tagColor: 'green',
          transform: (val) => val || 'N/A',
        },
        {
          title: 'Hạng mục',
          dataIndex: 'trackName',
          key: 'trackName',
          type: 'text',
          className: 'text-gray-300',
        },
      ],
      actions: {
        view: false,
        edit: false,
        delete: false,
      },
    }),
    [],
  );

  const judgeAssignmentTableModel = useMemo(
    () => ({
      entityName: 'giám khảo được phân công',
      rowKey: 'assignmentId',
      createButton:
        isAdmin && isFirstOrSecondPhase
          ? {
              label: 'Thêm giám khảo',
              icon: <UserAddOutlined />,
              action: () => setIsAssignJudgeModalOpen(true),
            }
          : null,
      columns: [
        {
          title: 'Tên giám khảo',
          dataIndex: 'judgeName',
          key: 'judgeName',
          className: 'font-medium text-white',
        },
        {
          title: 'Phân công',
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
        ...(isAdmin && isFirstOrSecondPhase
          ? [
              {
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
              },
            ]
          : []),
      ],
      actions: {},
    }),
    [
      isAdmin,
      isFirstOrSecondPhase,
      navigate,
      handleBlockJudgeAssignment,
      handleReactivateJudgeAssignment,
    ],
  );


  const criteriaTableModel = useMemo(
    () => ({
      entityName: 'Tiêu chí chấm điểm',
      rowKey: 'criteriaId',
      createButton:
        isAdmin && isFirstOrSecondPhase
          ? {
              label: 'Thêm tiêu chí',
              action: () =>
                navigate(
                  `${PATH_NAME.ADMIN_CRITERIAS}/create?phaseId=${id}&hackathonId=${hackathonId}`,
                ),
            }
          : null,
      columns: [
        {
          title: 'Tên tiêu chí',
          dataIndex: 'name',
          key: 'name',
          className: 'font-medium',
        },
        // {
        //   title: 'Hạng mục',
        //   dataIndex: 'trackId',
        //   key: 'trackId',
        //   className: 'text-gray-400',
        //   render: (trackId) => {
        //     if (!trackId) return 'Tất cả hạng mục';
        //     const track = phaseTracks.find(
        //       (t) => String(t.trackId) === String(trackId),
        //     );
        //     return track?.name || 'N/A';
        //   },
        // },
        {
          title: 'Trọng số',
          dataIndex: 'weight',
          key: 'weight',
          className: 'text-gray-400',
        },
      ],
      actions: {
        view: true,
        edit: isAdmin && isFirstOrSecondPhase,
        delete: isAdmin && isFirstOrSecondPhase,
      },
    }),
    [isAdmin, isFirstOrSecondPhase, id, hackathonId, navigate, phaseTracks],
  );

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
      autoCreateGroups.mutate(
        {
          teamsPerGroup: values.teamsPerGroup,
          phaseId: parseInt(id) || null,
        },
        {
          onSuccess: () => {
            setCreateGroupModal(false);
            createGroupForm.resetFields();
          },
          onError: () => {},
        },
      );
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

  const handleConfirmJudgeOk = () => {
    const { type, record } = confirmJudgeModal;
    if (type === 'blockAssignment') {
      blockJudgeAssignment.mutate({
        assignmentId: record.assignmentId,
        phaseId: parseInt(id),
      });
    } else if (type === 'reactivateAssignment') {
      reactivateJudgeAssignment.mutate({
        assignmentId: record.assignmentId,
        phaseId: parseInt(id),
      });
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
    onEdit:
      isAdmin && isFirstOrSecondPhase
        ? (record) =>
            navigate(
              `${PATH_NAME.ADMIN_CRITERIAS}/edit/${record.criteriaId}?phaseId=${id}&trackId=${record.trackId || ''}&hackathonId=${hackathonId}`,
            )
        : undefined,
    onDelete:
      isAdmin && isFirstOrSecondPhase
        ? (record) => {
            setConfirmJudgeModal({
              open: true,
              type: 'deleteCriteria',
              record,
            });
          }
        : undefined,
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
    onEdit:
      isAdmin && isFirstPhase
        ? (record) =>
            navigate(
              `${PATH_NAME.ADMIN_TRACKS}/edit/${record.trackId}?phaseId=${id}&hackathonId=${hackathonId}`,
            )
        : undefined,
    onDelete:
      isAdmin && isFirstPhase
        ? (record) => handleDeleteConfirm(record.trackId)
        : undefined,
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
    onView: (record) =>
      navigate(
        `/admin/groups/${record.groupId}?trackId=${record.trackId}&phaseId=${id}`,
      ),
  };

  if (phaseError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Lỗi tải dữ liệu.
      </div>
    );
  }

  if (
    phaseLoading ||
    phasesLoading ||
    tracksLoading ||
    cChallengesLoading ||
    usersLoading ||
    assignmentsLoading ||
    criteriaLoading
  ) {
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
        headerExtra={
          isLastPhase &&
          !isSinglePhase &&
          isAdmin &&
          qualifiedTeams?.length === 0 &&
          !showQualifiedTable ? (
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleGetQualifiedTeams}
              loading={selectTopTeams.isPending}
              disabled={selectTopTeams.isPending}
              className="!text-primary !border-primary/50 hover:!border-primary hover:!bg-primary/5"
            >
              {selectTopTeams.isPending ? 'Đang xử lý...' : 'Lấy danh sách đội'}
            </Button>
          ) : null
        }
      >
        {/* Track Section - Không hiển thị nếu là phase cuối (trừ khi chỉ có 1 phase) */}
        {(!isLastPhase || isSinglePhase) && (
          <Card
            className={`${isFirstPhase ? 'mt-6' : 'mt-16'} border border-white/10 bg-white/5 rounded-xl shadow-sm backdrop-blur-sm`}
          >
            <EntityTable
              model={trackTableModel}
              data={phaseTracks}
              loading={tracksLoading || cChallengesLoading}
              handlers={trackHandlers}
              emptyText="Không có hạng mục nào cho giai đoạn này"
              dateFormatter={(value, fmt) =>
                value ? dayjs(value).format(fmt) : '--'
              }
            />
          </Card>
        )}

        {/* Group Section - Không hiển thị nếu là phase cuối (trừ khi chỉ có 1 phase) */}
        {hackathonId && (!isLastPhase || isSinglePhase) && (
          <Card
            className={`${isFirstPhase ? 'mt-6' : 'mt-16'} border border-white/10 bg-white/5 rounded-xl`}
          >
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

        {/* Judge Assignments Section - Hiển thị ở phase 1 và phase 2 */}
        {hackathonId && isFirstOrSecondPhase && (
          <Card className="mt-6 border border-white/10 bg-white/5 rounded-xl">
            <EntityTable
              model={judgeAssignmentTableModel}
              data={allAssignments}
              loading={assignmentsLoading}
              emptyText="Chưa có giám khảo nào được phép chấm cho giai đoạn này"
            />
          </Card>
        )}

        {/* Criteria Section - Hiển thị ở phase 1 và phase 2 */}
        {hackathonId && isFirstOrSecondPhase && (
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
                  expandable={{
                    expandedRowRender: (record) => (
                      <TeamPenaltiesExpanded
                        teamId={record.teamId}
                        phaseId={id}
                        fetchPenaltiesByTeamAndPhase={
                          fetchPenaltiesByTeamAndPhase
                        }
                      />
                    ),
                    rowExpandable: () => true,
                  }}
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
          Hang: <span className="text-primary">{assignModal.track?.name}</span>
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
                const searchText =
                  `${option?.judgeName || ''} ${option?.judgeEmail || ''}`.toLowerCase();
                return searchText.includes(input.toLowerCase());
              }}
              style={{ width: '100%' }}
              notFoundContent={
                usersLoading ? (
                  <Spin size="small" />
                ) : (
                  'Không tìm thấy giám khảo'
                )
              }
              optionLabelProp="label"
            >
              {judgeUsers.map((judge) => (
                <Select.Option
                  key={judge.userId}
                  value={judge.userId}
                  label={judge.fullName}
                  judgeName={judge.fullName}
                  judgeEmail={judge.email}
                >
                  <div style={{ lineHeight: '1.5' }}>
                    <div style={{ fontWeight: 500 }}>{judge.fullName}</div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#888',
                        marginTop: '2px',
                      }}
                    >
                      {judge.email}
                    </div>
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
          danger:
            confirmJudgeModal.type === 'deleteCriteria' ||
            confirmJudgeModal.type === 'blockAssignment',
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

// Component hiển thị penalties trong expanded row của team
const TeamPenaltiesExpanded = ({
  teamId,
  phaseId,
  fetchPenaltiesByTeamAndPhase,
}) => {
  return (
    <TeamPenaltiesSection
      teamId={teamId}
      phaseId={phaseId}
      fetchPenaltiesByTeamAndPhase={fetchPenaltiesByTeamAndPhase}
    />
  );
};

// Component hiển thị penalties của một team
const TeamPenaltiesSection = ({
  teamId,
  phaseId,
  fetchPenaltiesByTeamAndPhase,
}) => {
  const [createPenaltyModal, setCreatePenaltyModal] = useState(false);
  const [editPenaltyModal, setEditPenaltyModal] = useState({
    open: false,
    penalty: null,
  });
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    open: false,
    penalty: null,
  });
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const { createPenalty, updatePenalty, deletePenalty } = usePenalty();

  const { data: penalties = [], isLoading } = fetchPenaltiesByTeamAndPhase(
    teamId,
    phaseId,
  );

  const penaltiesArray = Array.isArray(penalties) ? penalties : [];

  const handleCreatePenalty = async (values) => {
    try {
      // Đảm bảo points là number, không phải string
      const pointsValue = values.points != null ? Number(values.points) : 0;
      await createPenalty.mutateAsync({
        teamId: parseInt(teamId),
        phaseId: parseInt(phaseId),
        type: values.type || 'Penalty',
        points: pointsValue,
        reason: values.reason || '',
      });
      setCreatePenaltyModal(false);
      form.resetFields();
    } catch (error) {
      console.error('Error creating penalty:', error);
    }
  };

  const handleOpenModal = () => {
    setCreatePenaltyModal(true);
    // Reset form với giá trị mặc định
    form.setFieldsValue({
      type: 'Penalty',
      points: undefined, // Không set giá trị mặc định để người dùng tự nhập
      reason: '',
    });
  };

  const handleEditPenalty = (penalty) => {
    setEditPenaltyModal({ open: true, penalty });
    editForm.setFieldsValue({
      points: penalty.points,
      reason: penalty.reason,
    });
  };

  const handleUpdatePenalty = async (values) => {
    try {
      // Đảm bảo points là number, không phải string
      const pointsValue = values.points != null ? Number(values.points) : 0;
      await updatePenalty.mutateAsync({
        id: editPenaltyModal.penalty.adjustmentId,
        payload: {
          points: pointsValue,
          reason: values.reason || '',
        },
      });
      setEditPenaltyModal({ open: false, penalty: null });
      editForm.resetFields();
    } catch (error) {
      console.error('Error updating penalty:', error);
    }
  };

  const handleDeletePenalty = async () => {
    try {
      await deletePenalty.mutateAsync(deleteConfirmModal.penalty.adjustmentId);
      setDeleteConfirmModal({ open: false, penalty: null });
    } catch (error) {
      console.error('Error deleting penalty:', error);
    }
  };

  const columns = [
    {
      title: 'Điểm',
      dataIndex: 'points',
      key: 'points',
      className: 'text-gray-300',
      width: 120,
      fixed: 'left',
      render: (points) => (
        <Tag color={points >= 0 ? 'green' : 'red'}>
          {points >= 0 ? `+${points}` : points}
        </Tag>
      ),
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
      className: 'text-gray-300',
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <span title={text} className="block truncate">
          {text || '--'}
        </span>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      className: 'text-gray-400',
      width: 180,
      render: (date) => (date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '--'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditPenalty(record)}
            className="!text-blue-400 hover:!text-blue-300"
            size="small"
            title="Sửa"
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() =>
              setDeleteConfirmModal({ open: true, penalty: record })
            }
            className="!text-red-400 hover:!text-red-300"
            size="small"
            title="Xóa"
          />
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center py-4">
          <Spin size="small" />
          <span className="ml-2 text-gray-400">Đang tải vi phạm...</span>
        </div>
      </div>
    );
  }

  if (penaltiesArray.length === 0 && !isLoading) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-white font-medium">Danh sách vi phạm</h5>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenModal}
            className="bg-primary hover:bg-primary/90"
          >
            Thêm vi phạm
          </Button>
        </div>
        <Empty description="Không có vi phạm nào" />
        {/* Modal tạo vi phạm */}
        <Modal
          title="Thêm vi phạm cho đội"
          open={createPenaltyModal}
          onCancel={() => {
            setCreatePenaltyModal(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
          centered
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreatePenalty}
            initialValues={{
              type: 'Penalty',
              points: 0,
            }}
          >
            <Form.Item name="type" label="Loại" initialValue="Penalty">
              <Input
                value="Vi phạm (Penalty)"
                disabled
                className="bg-white/5"
              />
            </Form.Item>

            <Form.Item
              name="points"
              label="Điểm"
              rules={[
                { required: true, message: 'Vui lòng nhập điểm!' },
                { type: 'number', message: 'Điểm phải là số!' },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập điểm"
                min={-1000}
                max={1000}
              />
            </Form.Item>

            <Form.Item
              name="reason"
              label="Lý do"
              rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Nhập lý do vi phạm/thưởng..."
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => {
                    setCreatePenaltyModal(false);
                    form.resetFields();
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={createPenalty.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  Tạo vi phạm
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-white font-medium">Danh sách vi phạm</h5>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenModal}
          className="bg-primary hover:bg-primary/90"
        >
          Thêm vi phạm
        </Button>
      </div>
      <div className="w-full">
        <Table
          columns={columns}
          dataSource={penaltiesArray}
          rowKey="adjustmentId"
          pagination={false}
          scroll={{ x: 'max-content' }}
          locale={{
            emptyText: <Empty description="Không có vi phạm" />,
          }}
          className="[&_.ant-table]:bg-transparent [&_th]:!bg-white/5 [&_th]:!text-white [&_td]:!text-gray-300"
        />
      </div>

      {/* Modal tạo vi phạm */}
      <Modal
        title="Thêm vi phạm cho đội"
        open={createPenaltyModal}
        onCancel={() => {
          setCreatePenaltyModal(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreatePenalty}
          initialValues={{
            type: 'Penalty',
            points: 0,
          }}
        >
          <Form.Item
            name="type"
            label="Loại"
            rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}
          >
            <Select placeholder="Chọn loại">
              <Select.Option value="Penalty">Vi phạm (Penalty)</Select.Option>
              <Select.Option value="Bonus">Thưởng (Bonus)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="points"
            label="Điểm"
            rules={[
              { required: true, message: 'Vui lòng nhập điểm!' },
              { type: 'number', message: 'Điểm phải là số!' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Nhập điểm"
              min={-1000}
              max={1000}
            />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Lý do"
            rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập lý do vi phạm/thưởng..."
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setCreatePenaltyModal(false);
                  form.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createPenalty.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                Tạo vi phạm
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal sửa vi phạm */}
      <Modal
        title="Sửa vi phạm"
        open={editPenaltyModal.open}
        onCancel={() => {
          setEditPenaltyModal({ open: false, penalty: null });
          editForm.resetFields();
        }}
        footer={null}
        width={600}
        centered
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdatePenalty}>
          <Form.Item
            name="points"
            label="Điểm"
            rules={[
              { required: true, message: 'Vui lòng nhập điểm!' },
              { type: 'number', message: 'Điểm phải là số!' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Nhập điểm"
              min={-1000}
              max={1000}
            />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Lý do"
            rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập lý do vi phạm/thưởng..."
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setEditPenaltyModal({ open: false, penalty: null });
                  editForm.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={updatePenalty.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                Cập nhật
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa"
        open={deleteConfirmModal.open}
        onOk={handleDeletePenalty}
        onCancel={() => setDeleteConfirmModal({ open: false, penalty: null })}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        confirmLoading={deletePenalty.isPending}
        centered
      >
        <div className="flex items-start gap-3">
          <ExclamationCircleOutlined className="text-yellow-500 text-xl mt-1" />
          <span>
            Bạn có chắc chắn muốn xóa vi phạm này không? Hành động này không thể
            hoàn tác.
          </span>
        </div>
      </Modal>
    </div>
  );
};

export default HackathonPhaseDetail;
