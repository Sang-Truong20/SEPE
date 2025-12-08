import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import {
  ConfigProvider,
  theme,
  Modal,
  Form,
  InputNumber,
  Select,
  message,
} from 'antd';
import { ExclamationCircleOutlined, ArrowUpOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { PATH_NAME } from '../../../constants';
import EntityTable from '../../../components/ui/EntityTable.jsx';
import { useChallenges } from '../../../hooks/admin/challanges/useChallenges.js';
import { useUsers } from '../../../hooks/admin/users/useUsers.js';
import { useHackathons } from '../../../hooks/admin/hackathons/useHackathons.js';

const Challenges = () => {
  const navigate = useNavigate();
  const { fetchChallenges, deleteChallenge, updateChallengeStatus } = useChallenges();
  const { fetchUsers,  } = useUsers();
  const { fetchHackathons  } = useHackathons();
  const { data: challengesData = [], isLoading, error } = fetchChallenges;
  const { data: userData = [] } = fetchUsers;
  const { data: hackData = [] } = fetchHackathons;
  const [deletingId, setDeletingId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, challengeId: null });
  const [statusModal, setStatusModal] = useState({
    open: false,
    challengeId: null,   // ← Thêm field này
    status: null
  });

  const [statusForm] = Form.useForm();

  const statusMap = [
    {key: 'Complete', title: 'Hoàn thành'},
    {key: 'Pending', title:  'Đang chờ'},
    {key: 'Cancel', title: 'Hủy'}
  ]

  const modelData = useMemo(() => {
    if (!Array.isArray(challengesData)) return [];

    return challengesData.map((challenge) => {
      const user = userData.find((u) => u.userId === challenge.userId);
      const hackathon = hackData.find((h) => h.hackathonId === challenge.hackathonId);

      return {
        ...challenge,
        user: user || { fullName: 'Ẩn danh' },        // fallback nếu không tìm thấy
        hackathon: hackathon || { name: 'N/A' },      // fallback nếu không tìm thấy
      };
    });
  }, [challengesData, userData, hackData]);

  // Model cho bảng challenges
  const tableModel = useMemo(
    () => ({
      entityName: 'thử thách',
      rowKey: 'challengeId',
      createButton: {
        label: 'Tạo mới thử thách',
        action: () => navigate(`${PATH_NAME.ADMIN_CHALLENGES}/create`),
        icon: true,
      },
      columns: [
        {
          title: 'Tiêu đề',
          dataIndex: 'title',
          key: 'title',
          type: 'text',
          className: 'font-medium text-white',
        },
        {
          title: 'Hackathon',
          dataIndex: ['hackathon', 'name'],
          key: 'seasonName',
          type: 'tag',
          tagColor: 'green',
          transform: (val) => val || 'N/A',
        },
        {
          title: 'Người tạo',
          dataIndex: ['user', 'fullName'],
          key: 'userName',
          type: 'text',
          transform: (val) => val || 'Ẩn danh',
        },
        {
          title: 'Trạng thái',
          dataIndex: 'status',
          key: 'status',
          type: 'status',
          transform: (val) => val?.toLowerCase(), // Chuẩn hóa
          statusMap: {
            pending: { text: 'Đang chờ', color: 'warning' },
            cancel: { text: 'Đã hủy', color: 'error' },
            complete: { text: 'Hoàn thành', color: 'success' },
          },
        },
        {
          title: 'Ngày tạo',
          dataIndex: 'createdAt',
          key: 'createdAt',
          type: 'datetime',
          format: 'DD/MM/YYYY HH:mm',
        },
      ],
      actions: {
        view: true,
        edit: true,
        delete: true,
        extra: [
          {
            key: 'update-status',
            icon: <ArrowUpOutlined />,
            tooltip: 'Cập nhật trạng thái',
            className: 'text-yellow-500 hover:text-yellow-400',
          },
        ],
      },
    }),
    [navigate],
  );

  const handleDeleteConfirm = (id) => {
    setConfirmModal({ open: true, challengeId: id });
  };

  const handleConfirmOk = () => {
    const { challengeId } = confirmModal;
    setDeletingId(challengeId);
    deleteChallenge.mutate(challengeId, {
      onSettled: () => {
        setDeletingId(null);
        setConfirmModal({ open: false, challengeId: null });
      },
    });
  };

  const handleConfirmCancel = () => {
    setConfirmModal({ open: false, challengeId: null });
  };

  const handlers = {
    onView: (record) => navigate(`/admin/challenges/${record.challengeId}`),
    onEdit: (record) =>
      navigate(`/admin/challenges/edit/${record.challengeId}`),
    onDelete: (record) => handleDeleteConfirm(record.challengeId),
    isDeleting: (record) => deletingId === record.challengeId,
    onExtraAction: (key, record) => {
      if (key === 'update-status') {
        handleUpdateStatusClick(record);
      }
    },
    getExtraActionProps: (key, record) => {
      if (key === 'update-status') {
        const isLoading =
          updateChallengeStatus.isPending &&
          updateChallengeStatus.variables?.challengeId === record.challengeId;
        return {
          loading: isLoading,
          disabled: isLoading,
          tooltip: isLoading ? 'Đang cập nhật...' : 'Cập nhật trạng thái',
        };
      }
      return {};
    },
  };

  const handleUpdateStatusClick = (record) => {
    setStatusModal({
      open: true,
      challengeId: record.challengeId,   // ← Thêm id vào state
      status: record.status
    });

    statusForm.setFieldsValue({
      status: record.status,  // ví dụ: "Pending", "Complete", "Cancel"
    });
  };

  const handleUpdateStatusSubmit = () => {
    statusForm.validateFields().then((values) => {
      const { challengeId } = statusModal; // ← Lấy id từ state

      if (!challengeId) {
        message.error("Không tìm thấy ID thử thách!");
        return;
      }

      updateChallengeStatus.mutate(
        {
          id: challengeId,
          status: values.status   // ← Đảm bảo đúng format: "Pending", "Complete", "Cancel"
        },
        {
          onSuccess: () => {
            message.success('Cập nhật trạng thái thành công!');
            setStatusModal({ open: false, challengeId: null, status: null });
            statusForm.resetFields();
          },
          onError: (error) => {
            console.error(error);
            message.error('Cập nhật trạng thái thất bại!');
          },
        }
      );
    }).catch(() => {
      // validate failed
    });
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
        <EntityTable
          model={tableModel}
          data={modelData}
          loading={isLoading}
          handlers={handlers}
          emptyText="Không có thử thách nào"
          dateFormatter={(value, fmt) =>
            value ? dayjs(value).format(fmt) : '--'
          }
        />
      </div>
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
          <span>Bạn có chắc chắn muốn xóa thử thách này không?</span>
        </div>
      </Modal>
      <Modal
        title="Cập nhật trạng thái"
        open={statusModal.open}
        onCancel={() => {
          setStatusModal({ open: false, track: null });
          statusForm.resetFields();
        }}
        onOk={handleUpdateStatusSubmit}
        okText="Gán ngay"
        cancelText="Hủy"
        centered
        confirmLoading={updateChallengeStatus.isPending}
      >
        <Form form={statusForm} layout="vertical">
          <Form.Item name="status" label="Chọn trạng thái">
            <Select
              placeholder="Chọn trạng thái"
              allowClear
              showSearch
            >
              {statusMap.map((ch) => (
                <Select.Option key={ch.key} value={ch.key}>
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

export default Challenges;
