import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Modal, theme } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EntityTable from '../../../components/ui/EntityTable.jsx';
import { PATH_NAME } from '../../../constants';
import { useHackathons } from '../../../hooks/admin/hackathons/useHackathons';

const Hackathons = () => {
  const navigate = useNavigate();
  const { fetchHackathons, deleteHackathon } = useHackathons();
  const { data: hackathonData = [], isLoading } = fetchHackathons;
  const [deletingId, setDeletingId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    hackathonId: null,
  });

  // Model cho bảng
  const tableModel = useMemo(
    () => ({
      entityName: 'Hackathon',
      rowKey: 'hackathonId',
      createButton: {
        label: 'Tạo mới Hackathon',
        action: () => navigate(`${PATH_NAME.ADMIN_HACKATHONS}/create`),
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
          title: 'Mùa',
          dataIndex: 'seasonName',
          key: 'seasonName',
          type: 'tag',
          tagColor: 'gold',
          transform: (val) => val?.toUpperCase(),
        },
        {
          title: 'Mô tả',
          dataIndex: 'description',
          key: 'description',
          type: 'text',
          ellipsis: true,
          className: 'text-gray-300 line-clamp-2 block',
        },
        {
          title: 'Ngày bắt đầu',
          dataIndex: 'startDate',
          key: 'startDate',
          type: 'datetime',
          format: 'DD/MM/YYYY',
        },
        {
          title: 'Ngày kết thúc',
          dataIndex: 'endDate',
          key: 'endDate',
          type: 'datetime',
          format: 'DD/MM/YYYY',
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
                onClick={() =>
                  navigate(
                    `${PATH_NAME.ADMIN_HACKATHON_PHASES}?hackathonId=${record.hackathonId}`,
                  )
                }
              >
                Giai đoạn
              </Button>
              <Button
                size="small"
                className="text-xs bg-yellow-600/30 text-yellow-300 border-yellow-600/50 hover:bg-yellow-600/50"
                onClick={() =>
                  navigate(
                    `${PATH_NAME.ADMIN_PRIZES}?hackathonId=${record.hackathonId}`,
                  )
                }
              >
                Giải thưởng
              </Button>
              {/*<Button*/}
              {/*  size="small"*/}
              {/*  className="text-xs bg-purple-600/30 text-purple-300 border-purple-600/50 hover:bg-purple-600/50"*/}
              {/*  onClick={() => navigate(`${PATH_NAME.ADMIN_GROUPS}?hackathonId=${record.hackathonId}`)}*/}
              {/*>*/}
              {/*  Bảng đấu*/}
              {/*</Button>*/}
            </div>
          ),
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
    setConfirmModal({ open: true, hackathonId: id });
  };

  const handleConfirmOk = () => {
    const { hackathonId } = confirmModal;
    setDeletingId(hackathonId);
    deleteHackathon.mutate(hackathonId, {
      onSettled: () => {
        setDeletingId(null);
        setConfirmModal({ open: false, hackathonId: null });
      },
    });
  };

  const handleConfirmCancel = () => {
    setConfirmModal({ open: false, hackathonId: null });
  };

  const handlers = {
    onView: (record) =>
      navigate(`${PATH_NAME.ADMIN_HACKATHONS}/${record.hackathonId}`),
    onEdit: (record) =>
      navigate(`${PATH_NAME.ADMIN_HACKATHONS}/edit/${record.hackathonId}`),
    onDelete: (record) => handleDeleteConfirm(record.hackathonId),
    isDeleting: (record) => deletingId === record.hackathonId,
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
          data={hackathonData}
          loading={isLoading}
          handlers={handlers}
          emptyText="Không có dữ liệu"
          // optional override format sử dụng dayjs toàn cục
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
          <span>Bạn có chắc chắn muốn xóa hackathon này không?</span>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default Hackathons;
