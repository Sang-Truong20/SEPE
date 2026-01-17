import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ConfigProvider, theme, Modal, Button, Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { PATH_NAME } from '../../../constants';
import { useHackathons } from '../../../hooks/admin/hackathons/useHackathons';
import EntityTable from '../../../components/ui/EntityTable.jsx';

const Hackathons = () => {
  const navigate = useNavigate();
  const { fetchHackathons, deleteHackathon } = useHackathons();
  const { data: hackathonData = [], isLoading, error } = fetchHackathons;
  const [deletingId, setDeletingId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, hackathonId: null });

  // Model cho bảng
  const tableModel = useMemo(
    () => ({
      entityName: 'Hackathon',
      rowKey: 'hackathonId',
      columns: [
        {
          title: 'Tên',
          dataIndex: 'name',
          key: 'name',
          type: 'text',
          className: 'font-medium text-white'
        },
        {
          title: 'Mùa',
          dataIndex: 'seasonName',
          key: 'seasonName',
          type: 'tag',
          tagColor: 'gold',
          transform: (val) => val?.toUpperCase()
        },
        {
          title: 'Mô tả',
          dataIndex: 'description',
          key: 'description',
          type: 'text',
          width: 300,
          ellipsis: { tooltip: true },
          onCell: () => ({
            style: { maxWidth: '300px', overflow: 'hidden' }
          }),
          render: (text) => (
            <Tooltip title={text}>
              <div 
                className="line-clamp-2 text-gray-300"
                style={{ maxWidth: '100%', wordBreak: 'break-word' }}
              >
                {text || '--'}
              </div>
            </Tooltip>
          ),
        },
        {
          title: 'Ngày bắt đầu',
          dataIndex: 'startDate',
          key: 'startDate',
          type: 'datetime',
          format: 'DD/MM/YYYY'
        },
        {
          title: 'Ngày kết thúc',
          dataIndex: 'endDate',
          key: 'endDate',
          type: 'datetime',
          format: 'DD/MM/YYYY'
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
                onClick={() => navigate(`${PATH_NAME.PARTNER_HACKATHON_PHASES}?hackathonId=${record.hackathonId}`)}
              >
                Giai đoạn
              </Button>
              <Button
                size="small"
                className="text-xs bg-yellow-600/30 text-yellow-300 border-yellow-600/50 hover:bg-yellow-600/50"
                onClick={() => navigate(`${PATH_NAME.PARTNER_PRIZES}?hackathonId=${record.hackathonId}`)}
              >
                Giải thưởng
              </Button>
            </div>
          ),
        },
      ],
      actions: {
        view: true,
      },
    }),
    [navigate],
  );

  const handleDeleteConfirm = (id) => {
    setConfirmModal({ open: true, hackathonId: id });
  };

  const handleConfirmOk = () => {
    setDeletingId(confirmModal.hackathonId);
    deleteHackathon.mutate(confirmModal.hackathonId, {
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
      navigate(`${PATH_NAME.PARTNER_HACKATHONS}/${record.hackathonId}`),
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
