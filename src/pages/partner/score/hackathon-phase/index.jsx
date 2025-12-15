import { useNavigate, useSearchParams } from 'react-router-dom';
import { ConfigProvider, theme, Button, Select, Card, Tag } from 'antd';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { PATH_NAME } from '../../../../constants/index.js';
import { useHackathonPhases } from '../../../../hooks/admin/hackathon-phases/useHackathonPhases.js';
import { useHackathons } from '../../../../hooks/admin/hackathons/useHackathons.js';
import EntityTable from '../../../../components/ui/EntityTable.jsx';
import { useMemo } from 'react';
import { useUserData } from '../../../../hooks/useUserData.js';

const HackathonPhases = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const hackathonId = searchParams.get('hackathonId');
  const { userInfo } = useUserData();
  const isPartner = userInfo?.roleName?.toLowerCase() === 'partner';

  const { fetchHackathons } = useHackathons();
  const { data: hackathons = [], isLoading: hackathonsLoading } =
    fetchHackathons;

  const { fetchHackathonPhases, } = useHackathonPhases();
  const {
    data: phasesData = [],
    isLoading,
    error,
  } = fetchHackathonPhases(hackathonId);

  const selectedHackathon = hackathons.find(
    (h) => h.hackathonId === parseInt(hackathonId),
  );

  // Model cho bảng phases
  const tableModel = useMemo(
    () => ({
      entityName: 'giai đoạn',
      rowKey: 'phaseId',
      columns: [
        {
          title: 'Tên giai đoạn',
          dataIndex: 'phaseName',
          key: 'phaseName',
          type: 'text',
          className: 'font-medium text-white',
        },
        {
          title: 'Ngày bắt đầu',
          dataIndex: 'startDate',
          key: 'startDate',
          type: 'datetime',
          format: 'DD/MM/YYYY HH:mm',
        },
        {
          title: 'Ngày kết thúc',
          dataIndex: 'endDate',
          key: 'endDate',
          type: 'datetime',
          format: 'DD/MM/YYYY HH:mm',
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
                onClick={() => navigate(`${PATH_NAME.PARTNER_TEAM_SCORES}/?phaseId=${record.phaseId}&hackathonId=${hackathonId}`)}
              >
                Xem điểm
              </Button>
            </div>
          ),
        },
      ],
    }),
    [hackathonId, phasesData, navigate],
  );

  const handleHackathonChange = (newHackathonId) => {
    setSearchParams({ hackathonId: newHackathonId });
  };



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
        <div className="mb-6">
          <Button
            onClick={() => navigate(PATH_NAME.PARTNER_TEAM_SCORES)}
            type="link"
            icon={<ArrowLeftOutlined />}
            className="mb-4 !text-light-primary hover:!text-primary"
          >
            Quay lại
          </Button>

          {!isPartner && (
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Chọn Hackathon
              </label>
              <Select
                placeholder="Chọn hackathon để xem phases"
                value={hackathonId}
                onChange={handleHackathonChange}
                loading={hackathonsLoading}
                className="w-full max-w-md"
                style={{ backgroundColor: '#1f1f1f' }}
              >
                {hackathons.map((hackathon) => (
                  <Select.Option
                    key={hackathon.hackathonId}
                    value={hackathon.hackathonId.toString()}
                  >
                    {hackathon.name} ({hackathon.seasonName})
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}

          {selectedHackathon && (
            <Card
              bordered={false}
              className="bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg"
              title={
                <h3 className="text-white font-semibold text-lg">
                  Hackathon đã chọn
                </h3>
              }
            >
              <div className="space-y-2">
                <p className="text-gray-200 text-base font-medium">
                  {selectedHackathon.name} - {selectedHackathon.seasonName}
                </p>
                <p className="text-gray-400 text-sm italic">
                  {selectedHackathon.theme}
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <Tag
                    color="green"
                    icon={<CalendarOutlined />}
                    className="flex items-center gap-1"
                  >
                    <span className="text-sm text-gray-100">
                      {selectedHackathon.startDate}
                    </span>
                  </Tag>
                  <Tag
                    color="geekblue"
                    icon={<CalendarOutlined />}
                    className="flex items-center gap-1"
                  >
                    <span className="text-sm text-gray-100">
                      {selectedHackathon.endDate}
                    </span>
                  </Tag>
                </div>
              </div>
            </Card>
          )}
        </div>

        {hackathonId ? (
          <EntityTable
            model={tableModel}
            data={phasesData}
            loading={isLoading}
            emptyText="Không có giai đoạn nào cho hackathon này"
            dateFormatter={(value, fmt) =>
              value ? dayjs(value).format(fmt) : '--'
            }
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">
              Vui lòng chọn một hackathon để xem các phases
            </p>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default HackathonPhases;
