import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ConfigProvider, theme, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { PATH_NAME } from '../../../constants';
import EntityTable from '../../../components/ui/EntityTable.jsx';
import { useChallenges } from '../../../hooks/admin/challanges/useChallenges.js';

const Challenges = () => {
  const navigate = useNavigate();
  const { fetchChallenges, deleteChallenge } = useChallenges();
  const { data: challengesData = [], isLoading, error } = fetchChallenges;
  const [deletingId, setDeletingId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, challengeId: null });

  console.log('data', challengesData);

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
          title: 'Mùa',
          dataIndex: 'seasonName',
          key: 'seasonName',
          type: 'tag',
          tagColor: 'green',
          transform: (val) => val || 'N/A',
        },
        {
          title: 'Người tạo',
          dataIndex: 'userName',
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
  };

  if (error) {
    return (
      <div className="bg-dark-secondary border border-dark-accent rounded-xl p-6 shadow-md text-red-400">
        Lỗi tải dữ liệu thử thách.
      </div>
    );
  }

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
          data={challengesData}
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
    </ConfigProvider>
  );
};

export default Challenges;
