// components/admin/hackathon-phases/HackathonPhaseDetail.jsx
import { useState } from 'react';
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
import { PATH_NAME } from '../../../../constants';
import EntityDetail from '../../../../components/ui/EntityDetail.jsx';
import EntityTable from '../../../../components/ui/EntityTable.jsx';
import {
  ExclamationCircleOutlined,
  ThunderboltOutlined,
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

  const {
    data: phase,
    isLoading: phaseLoading,
    error: phaseError,
  } = fetchHackathonPhase(id);
  const { data: allTracks, isLoading: tracksLoading } = fetchTracks;
  const { data: allChallenges = [], isLoading: challengesLoading } = fetchChallenges;

  const phaseTracks =
    allTracks?.filter((track) => track.phaseId === parseInt(id)) || [];

  const challengeMap = allChallenges.reduce((map, ch) => {
    map[ch.challengeId] = ch.title;
    return map;
  }, {});

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
        width: 800,
        className: 'text-gray-300',
      },
      {
        title: 'Thử thách',
        key: 'challenges',
        type: 'custom',
        ellipsis: true,
        width: 500,
        render: (_, record) => {
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
          icon: <ThunderboltOutlined />,
          tooltip: 'Gán challenge ngẫu nhiên',
          className: 'text-yellow-500 hover:text-yellow-400',
        },
      ],
    },
  };

  const [assignModal, setAssignModal] = useState({ open: false, track: null });
  const [assignForm] = Form.useForm();

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

  const trackHandlers = {
    onView: (record) =>
      navigate(
        `${PATH_NAME.ADMIN_TRACKS}/${record.trackId}?phaseId=${id}&hackathonId=${hackathonId}`,
      ),
    onEdit: (record) =>
      navigate(
        `${PATH_NAME.ADMIN_TRACKS}/edit/${record.trackId}?phaseId=${id}&hackathonId=${hackathonId}`,
      ),
    onDelete: (record) => {
      Modal.confirm({
        title: 'Xác nhận xóa',
        icon: <ExclamationCircleOutlined />,
        content: 'Bạn có chắc chắn muốn xóa track này không?',
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        centered: true,
        onOk: () => {
          deleteTrack.mutate(record.trackId, {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: hackathonPhaseQueryKeys.detail(id),
              });
            },
          });
        },
      });
    },
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
      </EntityDetail>

      {/* Modal Gán thử thách ngẫu nhiên - ĐÃ HOÀN THIỆN */}
      <Modal
        title={
          <>
            <ThunderboltOutlined className="text-yellow-500 mr-2" />
            Gán thử thách ngẫu nhiên
          </>
        }
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
          Track: <span className="text-primary">{assignModal.track?.name}</span>
        </div>
        <Form form={assignForm} layout="vertical">
          <Form.Item
            name="quantity"
            label="Số lượng entity nhận thử thách"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
          >
            <InputNumber min={1} max={1000} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="challengeIds" label="Chọn thử thách">
            <Select
              mode="multiple"
              placeholder="Chọn thử thách ưu tiên"
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
    </ConfigProvider>
  );
};

export default HackathonPhaseDetail;