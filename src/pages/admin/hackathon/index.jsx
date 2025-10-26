import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ConfigProvider, theme, Modal, Button } from 'antd';
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

  // Model cho bảng
  const tableModel = useMemo(() => ({
    entityName: 'Hackathon',
    rowKey: 'hackathonId',
    createButton: {
      label: 'Tạo mới Hackathon',
      action: () => navigate(PATH_NAME.HACKATHON_CREATE_PAGE),
      icon: true
    },
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
        dataIndex: 'season',
        key: 'season',
        type: 'tag',
        tagColor: 'gold',
        transform: (val) => val?.toUpperCase()
      },
      {
        title: 'Chủ đề',
        dataIndex: 'theme',
        key: 'theme',
        type: 'text',
        className: 'text-gray-300'
      },
      {
        title: 'Ngày bắt đầu',
        dataIndex: 'startDate',
        key: 'startDate',
        type: 'datetime',
        format: 'DD/MM/YYYY HH:mm'
      },
      {
        title: 'Ngày kết thúc',
        dataIndex: 'endDate',
        key: 'endDate',
        type: 'datetime',
        format: 'DD/MM/YYYY HH:mm'
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
              onClick={() => navigate(`${PATH_NAME.ADMIN_HACKATHON_PHASES}?hackathonId=${record.hackathonId}`)}
            >
              Phases
            </Button>
            <Button
              size="small"
              className="text-xs bg-yellow-600/30 text-yellow-300 border-yellow-600/50 hover:bg-yellow-600/50"
              onClick={() => navigate(`${PATH_NAME.ADMIN_PRIZES}?hackathonId=${record.hackathonId}`)}
            >
              Prizes
            </Button>
          </div>
        )
      }
    ],
    actions: {
      view: true,
      edit: true,
      delete: true,
    }
  }), [navigate]);

  const handleDeleteConfirm = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn xóa hackathon này không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      centered: true,
      onOk: () => {
        setDeletingId(id);
        deleteHackathon.mutate(id, {
          onSettled: () => setDeletingId(null)
        });
      }
    });
  };

  const handlers = {
    onView: (record) => navigate(`${PATH_NAME.HACKATHON_DETAIL_PAGE}/${record.hackathonId}`),
    onEdit: (record) => navigate(`${PATH_NAME.HACKATHON_EDIT_PAGE}/${record.hackathonId}`),
    onDelete: (record) => handleDeleteConfirm(record.hackathonId),
    isDeleting: (record) => deletingId === record.hackathonId
  };

  if (error) {
    return (
      <div className="bg-dark-secondary border border-dark-accent rounded-xl p-6 shadow-md text-red-400">
        Lỗi tải dữ liệu Hackathons.
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
          borderRadius: 6
        }
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
          dateFormatter={(value, fmt) => value ? dayjs(value).format(fmt) : '--'}
        />
      </div>
    </ConfigProvider>
  );
};

export default Hackathons;