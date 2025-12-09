import {
  Spin,
  ConfigProvider,
  theme,
  Modal,
  Form,
  Card,
  InputNumber,
  Select,
} from 'antd';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTeams } from '../../../../hooks/admin/teams/useTeams';
import { PATH_NAME } from '../../../../constants';
import EntityDetail from '../../../../components/ui/EntityDetail.jsx';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useTracks } from '../../../../hooks/admin/tracks/useTracks.js';
import dayjs from 'dayjs';
import EntityTable from '../../../../components/ui/EntityTable.jsx';
import {
  penaltyQueryKeys,
  usePenalty,
} from '../../../../hooks/admin/penalty/usePenalty.js';

const TeamDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const trackId = searchParams.get('trackId');
  const navigate = useNavigate();
  const { fetchTrackById } = useTracks();
  const { fetchTeam } = useTeams();
  const { data: team, isLoading, error } = fetchTeam(id);
  const { fetchPenaltiesByTeamAndPhase, createPenalty, updatePenalty, deletePenalty } = usePenalty();


  // Modal states
  const [penaltyModalOpen, setPenaltyModalOpen] = useState(false);
  const [penaltyModalMode, setPenaltyModalMode] = useState('create');
  const [selectedPenalty, setSelectedPenalty] = useState(null);
  const [penaltyForm] = Form.useForm();
  const [confirmModal, setConfirmModal] = useState({ open: false, record: null });

  const { data: trackData } = fetchTrackById(trackId);
  console.log("trackData", trackData);

  const { data: penaltiesList = [], isLoading: penaltiesLoading } = fetchPenaltiesByTeamAndPhase(
    team?.teamId,
    trackData?.phaseId
  );
  console.log("penaltiesList", penaltiesList);

  const model = {
    modelName: 'Teams',
    fields: [
      {
        key: 'Tên đội',
        type: 'input',
        name: 'teamName',
        className: 'font-medium text-white',
      },
      {
        key: 'ID Đội',
        type: 'id',
        name: 'teamId',
      },
      {
        key: 'Chương',
        type: 'tag',
        name: 'chapterName',
        tagColor: 'blue',
      },
      {
        key: 'Tham gian giai đấu',
        type: 'tag',
        name: 'hackathonName',
        tagColor: 'blue',
      },
      {
        key: 'Trưởng nhóm',
        type: 'tag',
        name: 'teamLeaderName',
        tagColor: 'purple',
        transform: (val) => `#${val}`,
      },
      {
        key: 'Ngày tạo',
        type: 'datetime',
        name: 'createdAt',
        format: 'DD/MM/YYYY HH:mm',
      },
    ],
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Lỗi tải dữ liệu đội.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }
  // Penalty table model
  const penaltyTableModel = {
    entityName: 'thưởng/phạt',
    rowKey: 'adjustmentId',
    createButton: {
      label: 'Tạo mới thưởng/phạt',
      action: () => {
        setPenaltyModalMode('create');
        setSelectedPenalty(null);
        penaltyForm.resetFields();
        setPenaltyModalOpen(true);
      },
      icon: true,
    },
    columns: [
      {
        title: 'Loại',
        dataIndex: 'type',
        key: 'type',
        width: 120,
        render: (value) => {
          const colorMap = {
            Penalty: 'red',
            Bonus: 'green',
          };
          return (
            <span
              style={{
                color: colorMap[value] || 'gray',
                fontWeight: 'bold',
              }}
            >
              {value === 'Penalty'
                ? 'Phạt'
                : value === 'Bonus'
                  ? 'Thưởng'
                  : value || '--'}
            </span>
          );
        },
      },
      {
        title: 'Điểm',
        dataIndex: 'points',
        key: 'points',
        width: 100,
        render: (value) => (
          <span className="font-medium text-white">{value ?? '--'}</span>
        ),
      },
      {
        title: 'Lý do',
        dataIndex: 'reason',
        key: 'reason',
        ellipsis: { tooltip: true },
        className: 'text-gray-300',
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 180,
        render: (value) => (
          <span className="text-gray-300">
            {value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '--'}
          </span>
        ),
      },
    ],
    actions: {
      view: false,
      edit: true,
      delete: true,
    },
  };
  // Handlers cho penalty CRUD
  const handlePenaltyEdit = (record) => {
    setPenaltyModalMode('edit');
    setSelectedPenalty(record);
    penaltyForm.setFieldsValue({
      type: record.type,
      points: record.points,
      reason: record.reason,
    });
    setPenaltyModalOpen(true);
  };
  const handlePenaltyDelete = (record) => {
    setConfirmModal({ open: true, record });
  };

  const handleConfirmOk = () => {
    deletePenalty.mutate(confirmModal.record.adjustmentId);
    setConfirmModal({ open: false, record: null });
  };

  const handleConfirmCancel = () => {
    setConfirmModal({ open: false, record: null });
  };
  const handlePenaltyModalSubmit = () => {
    penaltyForm.validateFields().then((values) => {
      const payload = {
        teamId: team?.teamId,
        phaseId: phaseId,
        type: values.type,
        points: values.points,
        reason: values.reason || null,
      };
      if (penaltyModalMode === 'create') {
        createPenalty.mutate(payload, {
          onSuccess: () => {
            setPenaltyModalOpen(false);
            penaltyForm.resetFields();
          },
        });
      } else {
        updatePenalty.mutate(
          { id: selectedPenalty?.adjustmentId, payload },
          {
            onSuccess: () => {
              setPenaltyModalOpen(false);
              penaltyForm.resetFields();
            },
          },
        );
      }
    });
  };
  const penaltyHandlers = {
    onEdit: handlePenaltyEdit,
    onDelete: handlePenaltyDelete,
    isDeleting: (record) =>
      deletePenalty.isPending &&
      deletePenalty.variables === record.adjustmentId,
  };

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
        entityName="Đội"
        model={model}
        data={team || {}}
        onBack={() => navigate(PATH_NAME.ADMIN_TEAMS)} // Đổi route
        // onEdit: BỎ HOÀN TOÀN → không có nút chỉnh sửa
        showEdit={false}
      >
        {/* Penalties Section */}
        {penaltiesList.length > 0 && (
          <Card className="mt-16 border border-white/10 bg-white/5 rounded-xl shadow-sm backdrop-blur-sm">
            <EntityTable
              model={penaltyTableModel}
              data={penaltiesList}
              loading={penaltiesLoading}
              handlers={penaltyHandlers}
              emptyText="Không có thưởng/phạt nào cho team này"
            />
          </Card>
        )}
      </EntityDetail>
      {/* Penalty Modal - Tạo/Sửa */}
      <Modal
        title={
          <>
            <PlusOutlined className="text-green-500 mr-2" />
            {penaltyModalMode === 'create' ? 'Tạo mới' : 'Cập nhật'} thưởng/phạt
          </>
        }
        open={penaltyModalOpen}
        onCancel={() => {
          setPenaltyModalOpen(false);
          penaltyForm.resetFields();
        }}
        onOk={handlePenaltyModalSubmit}
        okText="Lưu"
        cancelText="Hủy"
        centered
        confirmLoading={createPenalty.isPending || updatePenalty.isPending}
      >
        <Form form={penaltyForm} layout="vertical">
          <Form.Item
            name="type"
            label="Loại"
            rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}
          >
            <Select placeholder="Chọn loại thưởng/phạt">
              <Select.Option value="Penalty">Phạt</Select.Option>
              <Select.Option value="Bonus">Thưởng</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="points"
            label="Điểm"
            rules={[{ required: true, message: 'Vui lòng nhập điểm!' }]}
          >
            <InputNumber
              min={-1000}
              max={1000}
              style={{ width: '100%' }}
              placeholder="Nhập giá trị điểm"
            />
          </Form.Item>
          <Form.Item name="reason" label="Lý do">
            <input
              type="text"
              placeholder="Nhập lý do (tùy chọn)"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #d9d9d9',
                fontSize: '14px',
              }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Confirm Delete Modal */}
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
          <span>Bạn có chắc chắn muốn xóa thưởng/phạt này không?</span>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default TeamDetail;
