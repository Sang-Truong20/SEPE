
import { useState, useMemo, useEffect } from 'react';
import {
  Spin,
  ConfigProvider,
  theme,
  Card,
  Button,
  message,
} from 'antd';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useHackathonPhases } from '../../../../hooks/admin/hackathon-phases/useHackathonPhases';
import { PATH_NAME } from '../../../../constants';
import EntityDetail from '../../../../components/ui/EntityDetail.jsx';
import EntityTable from '../../../../components/ui/EntityTable.jsx';
import {
  PlusOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useQualifications } from '../../../../hooks/admin/qualification/useQualification.js';

const HackathonPhaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hackathonId = searchParams.get('hackathonId');
  const isLastPhase = searchParams.get('isLastPhase')?.includes('true');

  const { fetchHackathonPhase } = useHackathonPhases();
  const { fetchFinalQualified, selectTopTeams } = useQualifications();

  const {
    data: phase,
    isLoading: phaseLoading,
    error: phaseError,
  } = fetchHackathonPhase(id);
  const { data: qualifiedTeams = [], isLoading: qualifiedLoading, refetch: fetch } = fetchFinalQualified(id);

  // const [showQualifiedTable, setShowQualifiedTable] = useState(false);
  useEffect(() => {
    fetch()
  },[])

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
      >
        {/* Qualification Section - Chỉ hiển thị nếu là phase cuối */}
        {isLastPhase && (
          <>
            {/*{ !showQualifiedTable &&*/}
            {/* ( <div className="mx-6 mb-6">*/}
            {/*    <Button*/}
            {/*      type="dashed"*/}
            {/*      icon={<PlusOutlined />}*/}
            {/*      onClick={handleGetQualifiedTeams}*/}
            {/*      loading={selectTopTeams.isPending}*/}
            {/*      disabled={selectTopTeams.isPending}*/}
            {/*      className="w-full h-12 !text-primary !border-primary/50 hover:!border-primary hover:!bg-primary/5"*/}
            {/*    >*/}
            {/*      {selectTopTeams.isPending*/}
            {/*        ? 'Đang xử lý...'*/}
            {/*        : 'Lấy danh sách đội'}*/}
            {/*    </Button>*/}
            {/*  </div>)*/}
            {/*}*/}

            {true && (
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

    </ConfigProvider>
  );
};

export default HackathonPhaseDetail;