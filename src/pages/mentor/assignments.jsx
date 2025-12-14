import { useMemo, useState } from 'react';
import { Card, Table, Tag, Spin, Alert, Button, Space, message, Modal, Input, Select, Row, Col } from 'antd';
import {
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  SearchOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import {
  useGetMentorAssignments,
  useApproveMentorAssignment,
  useRejectMentorAssignment,
} from '../../hooks/mentor/assignments';
import { useUserData } from '../../hooks/useUserData';

const statusMap = {
  pending: { color: 'orange', text: 'Chờ xác nhận' },
  waitingmentor: { color: 'orange', text: 'Chờ mentor xác nhận' },
  accepted: { color: 'green', text: 'Đã nhận' },
  rejected: { color: 'red', text: 'Từ chối' },
  approved: { color: 'green', text: 'Đã duyệt' },
};

const MentorAssignments = () => {
  const { userInfo, isLoading: userLoading } = useUserData();
  const mentorId = userInfo?.userId;

  const { data = [], isLoading, isError, refetch } = useGetMentorAssignments(mentorId);
  const approveMutation = useApproveMentorAssignment();
  const rejectMutation = useRejectMentorAssignment();
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const assignments = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  }, [data]);

  const filteredAssignments = useMemo(() => {
    const list = assignments;
    return list.filter((item) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        !query ||
        (item.teamName || '').toLowerCase().includes(query) ||
        (item.hackathonName || '').toLowerCase().includes(query) ||
        (item.leaderName || '').toLowerCase().includes(query);

      const status = (item.status || '').toLowerCase();
      const matchesStatus = statusFilter === 'all' || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [assignments, searchTerm, statusFilter]);

  const columns = [
    {
      title: 'Team',
      dataIndex: 'teamName',
      key: 'teamName',
      render: (val) => (
        <span className="text-white font-medium flex items-center gap-2">
          <TeamOutlined /> {val || 'N/A'}
        </span>
      ),
    },
    {
      title: 'Hackathon',
      dataIndex: 'hackathonName',
      key: 'hackathonName',
      render: (val) => <span className="text-gray-300">{val || 'N/A'}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (val) => {
        const norm = (val || '').toLowerCase();
        const cfg = statusMap[norm] || { color: 'default', text: val || 'Unknown' };
        return <Tag color={cfg.color}>{cfg.text}</Tag>;
      },
    },
    {
      title: 'Ngày yêu cầu',
      dataIndex: 'assignedAt',
      key: 'assignedAt',
      render: (val) => (
        <span className="text-gray-300">
          {val ? new Date(val).toLocaleString('vi-VN') : '—'}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => {
        const status = String(record.status || '').toLowerCase().trim();
        const isPending = status === 'pending' || status === 'waitingmentor';
        return (
          <Space>
            <Button
              size="small"
              type="default"
              onClick={() => {
                setSelected(record);
                setModalOpen(true);
              }}
            >
              Xem
            </Button>
            {isPending && (
              <>
                <Button
                  size="small"
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  loading={
                    approveMutation.isPending &&
                    approveMutation.variables === record.assignmentId
                  }
                  onClick={() => {
                    approveMutation.mutate(record.assignmentId, {
                      onSuccess: () => {
                        message.success('Đã duyệt yêu cầu');
                        refetch();
                      },
                    });
                  }}
                  className="bg-emerald-600 text-white border-0 hover:bg-emerald-700"
                >
                  Duyệt
                </Button>
                <Button
                  size="small"
                  danger
                  icon={<CloseCircleOutlined />}
                  loading={
                    rejectMutation.isPending &&
                    rejectMutation.variables === record.assignmentId
                  }
                  onClick={() => {
                    rejectMutation.mutate(record.assignmentId, {
                      onSuccess: () => {
                        message.success('Đã từ chối yêu cầu');
                        refetch();
                      },
                    });
                  }}
                  className="bg-red-600 text-white border-0 hover:bg-red-700"
                >
                  Từ chối
                </Button>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Yêu cầu mentor cho team
        </h1>
        <p className="text-gray-400 text-lg mt-2">
          Xem các team đang yêu cầu bạn làm mentor
        </p>
      </div>

      {userLoading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : !mentorId ? (
        <Alert
          type="warning"
          message="Không tìm thấy thông tin mentor"
          description="Bạn cần đăng nhập để xem các yêu cầu."
          showIcon
          className="bg-yellow-500/10 border-yellow-500/30 text-white"
        />
      ) : (
        <>
          <Card className="border-0 bg-gradient-to-r from-white/5 to-white/5 backdrop-blur-xl shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <SearchOutlined className="text-green-400 text-lg" />
                <h3 className="text-white font-semibold">Tìm kiếm & Lọc</h3>
              </div>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={14}>
                  <Input
                    placeholder="Tìm team, hackathon hoặc leader..."
                    prefix={<SearchOutlined className="text-green-400" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/10 border-white/20 hover:border-green-400/50 focus:border-green-400 transition-all"
                    size="large"
                    allowClear
                  />
                </Col>
                <Col xs={24} sm={24} md={10}>
                  <Select
                    placeholder="Lọc theo trạng thái"
                    size="large"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    suffixIcon={<FilterOutlined className="text-green-400" />}
                    className="w-full [&_.ant-select-selector]:bg-white/10 [&_.ant-select-selector]:border-white/20 [&_.ant-select-selector:hover]:border-green-400/50"
                  >
                    <Select.Option value="all">
                      <span className="text-white">Tất cả</span>
                    </Select.Option>
                    <Select.Option value="pending">
                      <span className="text-white">Chờ xác nhận</span>
                    </Select.Option>
                    <Select.Option value="waitingmentor">
                      <span className="text-white">Chờ mentor xác nhận</span>
                    </Select.Option>
                    <Select.Option value="approved">
                      <span className="text-white">Đã duyệt</span>
                    </Select.Option>
                    <Select.Option value="accepted">
                      <span className="text-white">Đã nhận</span>
                    </Select.Option>
                    <Select.Option value="rejected">
                      <span className="text-white">Từ chối</span>
                    </Select.Option>
                  </Select>
                </Col>
              </Row>
            </div>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          {isError ? (
            <Alert
              type="error"
              message="Lỗi tải danh sách"
              description="Không thể tải yêu cầu mentor. Thử lại sau."
              showIcon
              className="bg-red-500/10 border-red-500/30 text-white"
            />
          ) : (
            <Table
              columns={columns}
                  dataSource={filteredAssignments}
              rowKey={(r) => r.assignmentId || r.id}
              loading={isLoading}
              pagination={{ pageSize: 10, showSizeChanger: true }}
              className="[&_.ant-table]:bg-transparent [&_th]:!bg-white/5 [&_th]:!text-white [&_td]:!text-gray-300 [&_td]:border-white/10 [&_th]:border-white/10 [&_tr:hover_td]:!bg-white/5"
              locale={{
                emptyText: (
                  <div className="text-center py-10 text-gray-400">
                    <ClockCircleOutlined className="text-2xl mb-2" />
                    <div>Chưa có yêu cầu nào</div>
                  </div>
                ),
              }}
            />
          )}
          </Card>
        </>
      )}
      {selected && (
        <Modal
          title="Chi tiết yêu cầu mentor"
          open={modalOpen}
          onCancel={() => {
            setModalOpen(false);
            setSelected(null);
          }}
          footer={null}
          className="chapter-modal"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Team</div>
                <div className="text-white font-semibold flex items-center gap-2">
                  <TeamOutlined /> {selected.teamName}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Leader</div>
                <div className="text-white flex items-center gap-2">
                  <UserOutlined /> {selected.leaderName || '—'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Trạng thái</div>
                <Tag color={statusMap[(selected.status || '').toLowerCase()]?.color || 'default'}>
                  {statusMap[(selected.status || '').toLowerCase()]?.text || selected.status}
                </Tag>
              </div>
              <div>
                <div className="text-sm text-gray-400">Ngày yêu cầu</div>
                <div className="text-white flex items-center gap-2">
                  <CalendarOutlined />
                  {selected.assignedAt
                    ? new Date(selected.assignedAt).toLocaleString('vi-VN')
                    : '—'}
                </div>
              </div>
            </div>

            {(String(selected.status || '').toLowerCase().trim() === 'pending' || 
              String(selected.status || '').toLowerCase().trim() === 'waitingmentor') && (
              <div className="flex gap-2">
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  loading={
                    approveMutation.isPending &&
                    approveMutation.variables === selected.assignmentId
                  }
                  onClick={() =>
                    approveMutation.mutate(selected.assignmentId, {
                      onSuccess: () => {
                        message.success('Đã duyệt yêu cầu');
                        refetch();
                        setModalOpen(false);
                        setSelected(null);
                      },
                    })
                  }
                  className="bg-emerald-600 text-white border-0"
                >
                  Phê duyệt
                </Button>
                <Button
                  danger
                  icon={<CloseCircleOutlined />}
                  loading={
                    rejectMutation.isPending &&
                    rejectMutation.variables === selected.assignmentId
                  }
                  onClick={() =>
                    rejectMutation.mutate(selected.assignmentId, {
                      onSuccess: () => {
                        message.success('Đã từ chối yêu cầu');
                        refetch();
                        setModalOpen(false);
                        setSelected(null);
                      },
                    })
                  }
                >
                  Từ chối
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MentorAssignments;