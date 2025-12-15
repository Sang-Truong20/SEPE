// components/groups/GroupTeamList.jsx
import React from 'react';
import { TrophyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useGroups } from '../../../../hooks/admin/groups/useGroups.js';
import { usePenalty } from '../../../../hooks/admin/penalty/usePenalty.js';
import EntityTable from '../../../../components/ui/EntityTable.jsx';
import { ConfigProvider, theme, Table, Empty, Tag, Spin, Modal, Form, Input, InputNumber, Select, Button, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

const GroupTeamList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trackId = searchParams.get('trackId');
  const phaseId = searchParams.get('phaseId');
  const { id } = useParams();
  const { fetchGroupTeams } = useGroups();
  const { data: teamsList = [], isLoading } = fetchGroupTeams(id);
  const { fetchPenaltiesByTeamAndPhase } = usePenalty();

  const teamTableModel = {
    entityName: 'Đội tham gia',
    rowKey: 'teamId',
    columns: [
      {
        title: 'Tên đội',
        dataIndex: 'teamName',
        width: 220,
        render: (value) => (
          <div className="font-semibold text-white flex items-center gap-2">
            <TrophyOutlined className="text-yellow-500" />
            {value || '--'}
          </div>
        ),
      },
      {
        title: 'Thứ hạng',
        dataIndex: 'rank',
        width: 100,
        align: 'center',
        render: (value) => {
          if (value === null || value === undefined) return '—';
          const num = parseFloat(value);
          const isPositive = num > 0;
          const isZero = num === 0;
          return (
            <span className={`font-bold ${isPositive ? 'text-green-400' : isZero ? 'text-gray-400' : 'text-red-400'}`}>
              {isPositive ? '#' : ''}{num.toFixed(0)}
            </span>
          );
        },
      },
      {
        title: 'Điểm trung bình',
        dataIndex: 'averageScore',
        width: 100,
        align: 'center',
        render: (value) => {
          if (value === null || value === undefined) return '—';
          const num = parseFloat(value);
          return (
            <text>{num.toFixed(2)}</text>
          );
        },
      },
    ],
    actions: {
      view: true
    }
  };

  const handlers = {
    onView: (record) => navigate(`/admin/team/${record.teamId}?trackId=${trackId}`),
  };


  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBggContainer: '#111111',
          colorBorder: '#2f2f2f',
          colorText: '#ffffff',
          colorTextPlaceholder: '#9ca3af',
          colorPrimary: '#10b981',
          borderRadius: 6
        }
      }}
    >
    <div className="bg-gray-900/30 rounded-xl border border-white/10 p-5">
      <div className="mb-4">
        <Button
          onClick={() => {
            // Navigate về phase detail với phaseId và hackathonId
            const hackathonId = searchParams.get('hackathonId');
            if (phaseId && hackathonId) {
              navigate(`/admin/hackathons/hackathon-phases/${phaseId}?hackathonId=${hackathonId}`);
            } else {
              navigate(-1);
            }
          }}
          type="link"
          icon={<ArrowLeftOutlined />}
          className="mb-4 !text-light-primary hover:!text-primary"
        >
          Quay lại
        </Button>
      </div>
      <EntityTable
        model={teamTableModel}
        data={teamsList}
        loading={isLoading}
        handlers={handlers}
        emptyText="Chưa có đội nào trong bảng này"
        dateFormatter={(val, fmt) => dayjs(val).format(fmt || 'DD/MM/YYYY HH:mm')}
        expandable={
          phaseId
            ? {
                expandedRowRender: (record) => (
                  <TeamPenaltiesExpanded
                    teamId={record.teamId}
                    phaseId={phaseId}
                    fetchPenaltiesByTeamAndPhase={fetchPenaltiesByTeamAndPhase}
                  />
                ),
                rowExpandable: () => true,
              }
            : undefined
        }
      />
    </div>
    </ConfigProvider>
  );
};

// Component hiển thị penalties trong expanded row của team
const TeamPenaltiesExpanded = ({ teamId, phaseId, fetchPenaltiesByTeamAndPhase }) => {
  const [createPenaltyModal, setCreatePenaltyModal] = React.useState(false);
  const [editPenaltyModal, setEditPenaltyModal] = React.useState({ open: false, penalty: null });
  const [deleteConfirmModal, setDeleteConfirmModal] = React.useState({ open: false, penalty: null });
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const { createPenalty, updatePenalty, deletePenalty } = usePenalty();

  const { data: penalties = [], isLoading } = fetchPenaltiesByTeamAndPhase(
    teamId,
    phaseId,
  );

  const penaltiesArray = Array.isArray(penalties) ? penalties : [];

  const handleCreatePenalty = async (values) => {
    try {
      // Đảm bảo points là number, không phải string
      const pointsValue = values.points != null ? Number(values.points) : 0;
      await createPenalty.mutateAsync({
        teamId: parseInt(teamId),
        phaseId: parseInt(phaseId),
        type: values.type || 'Penalty',
        points: pointsValue,
        reason: values.reason || '',
      });
      setCreatePenaltyModal(false);
      form.resetFields();
    } catch (error) {
      console.error('Error creating penalty:', error);
    }
  };

  const handleOpenModal = () => {
    setCreatePenaltyModal(true);
    // Reset form với giá trị mặc định
    form.setFieldsValue({
      type: 'Penalty',
      points: undefined, // Không set giá trị mặc định để người dùng tự nhập
      reason: '',
    });
  };

  const handleEditPenalty = (penalty) => {
    setEditPenaltyModal({ open: true, penalty });
    editForm.setFieldsValue({
      points: penalty.points,
      reason: penalty.reason,
    });
  };

  const handleUpdatePenalty = async (values) => {
    try {
      // Đảm bảo points là number, không phải string
      const pointsValue = values.points != null ? Number(values.points) : 0;
      await updatePenalty.mutateAsync({
        id: editPenaltyModal.penalty.adjustmentId,
        payload: {
          points: pointsValue,
          reason: values.reason || '',
        },
      });
      setEditPenaltyModal({ open: false, penalty: null });
      editForm.resetFields();
    } catch (error) {
      console.error('Error updating penalty:', error);
    }
  };

  const handleDeletePenalty = async () => {
    try {
      await deletePenalty.mutateAsync(deleteConfirmModal.penalty.adjustmentId);
      setDeleteConfirmModal({ open: false, penalty: null });
    } catch (error) {
      console.error('Error deleting penalty:', error);
    }
  };

  const columns = [
    {
      title: 'Điểm',
      dataIndex: 'points',
      key: 'points',
      className: 'text-gray-300',
      width: 120,
      fixed: 'left',
      render: (points) => (
        <Tag color={points >= 0 ? 'green' : 'red'}>
          {points >= 0 ? `+${points}` : points}
        </Tag>
      ),
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
      className: 'text-gray-300',
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <span title={text} className="block truncate">
          {text || '--'}
        </span>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      className: 'text-gray-400',
      width: 180,
      render: (date) =>
        date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '--',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditPenalty(record)}
            className="!text-blue-400 hover:!text-blue-300"
            size="small"
            title="Sửa"
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => setDeleteConfirmModal({ open: true, penalty: record })}
            className="!text-red-400 hover:!text-red-300"
            size="small"
            title="Xóa"
          />
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center py-4">
          <Spin size="small" />
          <span className="ml-2 text-gray-400">Đang tải vi phạm...</span>
        </div>
      </div>
    );
  }

  if (penaltiesArray.length === 0 && !isLoading) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-white font-medium">Danh sách vi phạm</h5>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenModal}
            className="bg-primary hover:bg-primary/90"
          >
            Thêm vi phạm
          </Button>
        </div>
        <Empty description="Không có vi phạm nào" />
        {/* Modal tạo vi phạm */}
        <Modal
          title="Thêm vi phạm cho đội"
          open={createPenaltyModal}
          onCancel={() => {
            setCreatePenaltyModal(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
          centered
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreatePenalty}
            initialValues={{
              type: 'Penalty',
            }}
          >
            <Form.Item
              name="type"
              label="Loại"
              initialValue="Penalty"
            >
              <Input
                value="Vi phạm (Penalty)"
                disabled
                className="bg-white/5"
              />
            </Form.Item>

            <Form.Item
              name="points"
              label="Điểm"
              rules={[
                { required: true, message: 'Vui lòng nhập điểm!' },
                { type: 'number', message: 'Điểm phải là số!' },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập điểm"
                min={-1000}
                max={1000}
              />
            </Form.Item>

            <Form.Item
              name="reason"
              label="Lý do"
              rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Nhập lý do vi phạm/thưởng..."
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <div className="flex justify-end gap-2">
                <Button onClick={() => {
                  setCreatePenaltyModal(false);
                  form.resetFields();
                }}>
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={createPenalty.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  Tạo vi phạm
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-white font-medium">Danh sách vi phạm</h5>
        <Button
          type="primary"
          icon={<PlusOutlined />}
            onClick={handleOpenModal}
          className="bg-primary hover:bg-primary/90"
        >
          Thêm vi phạm
        </Button>
      </div>
      <div className="w-full">
        <Table
          columns={columns}
          dataSource={penaltiesArray}
          rowKey="adjustmentId"
          pagination={false}
          scroll={{ x: 'max-content' }}
          locale={{
            emptyText: <Empty description="Không có vi phạm" />,
          }}
          className="[&_.ant-table]:bg-transparent [&_th]:!bg-white/5 [&_th]:!text-white [&_td]:!text-gray-300"
        />
      </div>

      {/* Modal tạo vi phạm */}
      <Modal
        title="Thêm vi phạm cho đội"
        open={createPenaltyModal}
        onCancel={() => {
          setCreatePenaltyModal(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreatePenalty}
            initialValues={{
              type: 'Penalty',
            }}
        >
          <Form.Item
            name="type"
            label="Loại"
            rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}
          >
            <Select placeholder="Chọn loại">
              <Select.Option value="Penalty">Vi phạm (Penalty)</Select.Option>
              <Select.Option value="Bonus">Thưởng (Bonus)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="points"
            label="Điểm"
            rules={[
              { required: true, message: 'Vui lòng nhập điểm!' },
              { type: 'number', message: 'Điểm phải là số!' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Nhập điểm (số âm cho vi phạm, số dương cho thưởng)"
              min={-1000}
              max={1000}
            />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Lý do"
            rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập lý do vi phạm/thưởng..."
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-2">
              <Button onClick={() => {
                setCreatePenaltyModal(false);
                form.resetFields();
              }}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createPenalty.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                Tạo vi phạm
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal sửa vi phạm */}
      <Modal
        title="Sửa vi phạm"
        open={editPenaltyModal.open}
        onCancel={() => {
          setEditPenaltyModal({ open: false, penalty: null });
          editForm.resetFields();
        }}
        footer={null}
        width={600}
        centered
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdatePenalty}
        >
          <Form.Item
            name="points"
            label="Điểm"
            rules={[
              { required: true, message: 'Vui lòng nhập điểm!' },
              { type: 'number', message: 'Điểm phải là số!' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Nhập điểm (số âm cho vi phạm, số dương cho thưởng)"
              min={-1000}
              max={1000}
            />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Lý do"
            rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập lý do vi phạm/thưởng..."
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-2">
              <Button onClick={() => {
                setEditPenaltyModal({ open: false, penalty: null });
                editForm.resetFields();
              }}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={updatePenalty.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                Cập nhật
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa"
        open={deleteConfirmModal.open}
        onOk={handleDeletePenalty}
        onCancel={() => setDeleteConfirmModal({ open: false, penalty: null })}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        confirmLoading={deletePenalty.isPending}
        centered
      >
        <div className="flex items-start gap-3">
          <ExclamationCircleOutlined className="text-yellow-500 text-xl mt-1" />
          <span>
            Bạn có chắc chắn muốn xóa vi phạm này không? Hành động này không thể hoàn tác.
          </span>
        </div>
      </Modal>
    </div>
  );
};

export default GroupTeamList;
