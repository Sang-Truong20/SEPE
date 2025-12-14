import { useMemo, useEffect } from 'react';
import { Spin, ConfigProvider, theme, Card } from 'antd';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useHackathonPhases } from '../../../../hooks/admin/hackathon-phases/useHackathonPhases';
import { useTracks } from '../../../../hooks/admin/tracks/useTracks';
import { useGroups } from '../../../../hooks/admin/groups/useGroups';
import { useCriteria } from '../../../../hooks/admin/criterias/useCriteria';
import { useJudgeAssignment } from '../../../../hooks/admin/assignments/useJudgeAssignments.js';
import { PATH_NAME } from '../../../../constants';
import EntityDetail from '../../../../components/ui/EntityDetail.jsx';
import EntityTable from '../../../../components/ui/EntityTable.jsx';
import dayjs from 'dayjs';
import { useQualifications } from '../../../../hooks/admin/qualification/useQualification.js';

const HackathonPhaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hackathonId = searchParams.get('hackathonId');
  const isLastPhaseParam = searchParams.get('isLastPhase')?.includes('true');

  const { fetchHackathonPhases, fetchHackathonPhase } = useHackathonPhases();
  const { fetchTracks } = useTracks();
  const { fetchGroupsByHackathon } = useGroups();
  const { fetchCriteria } = useCriteria();
  const { fetchJudgeAssignmentsByHackathon } = useJudgeAssignment();
  const { fetchFinalQualified } = useQualifications();

  const {
    data: phase,
    isLoading: phaseLoading,
    error: phaseError,
  } = fetchHackathonPhase(id);
  const { data: phases = [] } = fetchHackathonPhases(hackathonId);
  const { data: allTracks = [] } = fetchTracks;
  const { data: groupsData = [], isLoading: groupsLoading } =
    fetchGroupsByHackathon(hackathonId);
  const { data: phaseCriteria = [], isLoading: criteriaLoading } =
    fetchCriteria(id);
  const { data: allAssignments = [], isLoading: assignmentsLoading } =
    fetchJudgeAssignmentsByHackathon(hackathonId);
  const {
    data: qualifiedTeams = [],
    isLoading: qualifiedLoading,
    refetch: fetch,
  } = fetchFinalQualified(id);

  const phaseTracks =
    allTracks?.filter((track) => track.phaseId === parseInt(id)) || [];
  const trackIds = phaseTracks.map((t) => t.trackId);
  const sortedGroups = [...groupsData]
    .filter((group) => trackIds?.includes(group.trackId))
    ?.sort((a, b) => a.groupName.localeCompare(b.groupName));

  // Xác định phase 1 và phase cuối
  const isFirstPhase = useMemo(() => {
    if (!phases?.length || !phase?.startDate) return false;
    const sortedByStart = [...phases].sort(
      (a, b) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf(),
    );
    const firstPhase = sortedByStart[0];
    return firstPhase?.phaseId === phase?.phaseId;
  }, [phases, phase]);

  const isSinglePhase = phases?.length === 1;

  const computedIsLastPhase = useMemo(() => {
    // Nếu chỉ có 1 phase, phase đó là phase 1, không phải last phase
    if (isSinglePhase) return false;
    if (!phases?.length || !phase?.endDate) return null;
    const sortedByEnd = [...phases].sort(
      (a, b) => dayjs(b.endDate).valueOf() - dayjs(a.endDate).valueOf(),
    );
    const lastPhase = sortedByEnd[0];
    return lastPhase?.phaseId === phase?.phaseId;
  }, [phases, phase, isSinglePhase]);

  const isLastPhase = computedIsLastPhase ?? isLastPhaseParam;

  // const [showQualifiedTable, setShowQualifiedTable] = useState(false);
  useEffect(() => {
    fetch();
  }, []);

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

  // Model cho bảng Track (chỉ view)
  const trackTableModel = useMemo(
    () => ({
      entityName: 'hạng mục',
      rowKey: 'trackId',
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
      ],
      actions: {
        view: false,
        edit: false,
        delete: false,
      },
    }),
    [],
  );

  // Model cho bảng Group (chỉ view)
  const groupTableModel = useMemo(
    () => ({
      entityName: 'bảng đấu',
      rowKey: 'groupId',
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
        view: false,
        edit: false,
        delete: false,
      },
    }),
    [],
  );

  // Model cho bảng Judge Assignments (chỉ view)
  const judgeAssignmentTableModel = useMemo(
    () => ({
      entityName: 'giám khảo được phân công',
      rowKey: 'assignmentId',
      columns: [
        {
          title: 'Tên giám khảo',
          dataIndex: 'judgeName',
          key: 'judgeName',
          className: 'font-medium',
          type: 'text',
        },
        {
          title: 'Phân công',
          dataIndex: 'assignedAt',
          key: 'assignedAt',
          className: 'text-gray-400',
          type: 'datetime',
          format: 'DD/MM/YYYY HH:mm',
        },
        {
          title: 'Trạng thái',
          dataIndex: 'status',
          key: 'status',
          type: 'tag',
          tagColor: (status) => (status === 'Active' ? 'green' : 'red'),
          transform: (status) =>
            status === 'Active' ? 'Hoạt động' : 'Đã khoá',
        },
      ],
      actions: {},
    }),
    [],
  );

  // Model cho bảng Criteria (chỉ view)
  const criteriaTableModel = useMemo(
    () => ({
      entityName: 'Tiêu chí chấm điểm',
      rowKey: 'criteriaId',
      columns: [
        {
          title: 'Tên tiêu chí',
          dataIndex: 'name',
          key: 'name',
          className: 'font-medium',
          type: 'text',
        },
        {
          title: 'Hạng mục',
          dataIndex: 'trackId',
          key: 'trackId',
          className: 'text-gray-400',
          type: 'text',
          render: (trackId) => {
            if (!trackId) return 'Tất cả hạng mục';
            const track = phaseTracks.find(
              (t) => String(t.trackId) === String(trackId),
            );
            return track?.name || 'N/A';
          },
        },
        {
          title: 'Trọng số',
          dataIndex: 'weight',
          key: 'weight',
          className: 'text-gray-400',
          type: 'text',
        },
      ],
      actions: {
        view: false,
        edit: false,
        delete: false,
      },
    }),
    [phaseTracks],
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

  // const handleGetQualifiedTeams = () => {
  //   selectTopTeams.mutate(id, {
  //     onSuccess: () => {
  //       setShowQualifiedTable(true);
  //     },
  //     onError: () => {},
  //   });
  // };

  if (phaseError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Lỗi tải dữ liệu.
      </div>
    );
  }

  if (phaseLoading) {
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
            `${PATH_NAME.JUDGE_HACKATHON_PHASES}?hackathonId=${hackathonId}`,
          )
        }
        showEdit={false}
      >
        {/* Track Section - Không hiển thị nếu là phase cuối (trừ khi chỉ có 1 phase) */}
        {(!isLastPhase || isSinglePhase) && (
          <Card
            className={`${isFirstPhase ? 'mt-6' : 'mt-16'} border border-white/10 bg-white/5 rounded-xl shadow-sm backdrop-blur-sm`}
          >
            <EntityTable
              model={trackTableModel}
              data={phaseTracks}
              loading={false}
              handlers={{}}
              emptyText="Không có track nào cho phase này"
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
              handlers={{}}
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
              handlers={{}}
              emptyText="Chưa có giám khảo nào được phép chấm cho giai đoạn này"
              dateFormatter={(value, fmt) =>
                value ? dayjs(value).format(fmt) : '--'
              }
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
              handlers={{}}
              emptyText="Chưa có tiêu chí chấm điểm nào cho giai đoạn này"
            />
          </Card>
        )}

        {/* Qualification Section - Chỉ hiển thị nếu là phase cuối và không phải single phase */}
        {isLastPhase && !isSinglePhase && (
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
      </EntityDetail>
    </ConfigProvider>
  );
};

export default HackathonPhaseDetail;
