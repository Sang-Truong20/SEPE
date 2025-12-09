// src/pages/admin/tracks/TrackDetail.jsx
import { Spin, ConfigProvider, theme, Card, Modal, Button, Tag, Space, Select, Form } from 'antd';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTracks } from '../../../../hooks/admin/tracks/useTracks';
import EntityDetail from '../../../../components/ui/EntityDetail.jsx';
import EntityTable from '../../../../components/ui/EntityTable.jsx';
import { PATH_NAME } from '../../../../constants';
import { ExclamationCircleOutlined, UserAddOutlined } from '@ant-design/icons';
import { useCriteria } from '../../../../hooks/admin/criterias/useCriteria.js';
import { useUsers } from '../../../../hooks/admin/users/useUsers';
import { useState } from 'react';
import { useJudgeAssignment } from '../../../../hooks/admin/assignments/useJudgeAssignments.js';
import dayjs from 'dayjs';
import Group from '../../group/index.jsx';

const TrackDetail = () => {
  const { id: trackId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phaseId = searchParams.get('phaseId');
  const hackathonId = searchParams.get('hackathonId');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignForm] = Form.useForm();
  const [confirmModal, setConfirmModal] = useState({ open: false, type: '', record: null });

  // Lấy dữ liệu track
  const { fetchTrackById } = useTracks();
  const {
    data: track,
    isLoading: trackLoading,
    error: trackError,
  } = fetchTrackById(trackId);

  // Lấy danh sách users có role Judge
  const { fetchUsers } = useUsers();
  const { data: allUsers = [], isLoading: usersLoading } = fetchUsers;

  // Lấy danh sách judge assignments
  const { fetchJudgeAssignmentsByHackathon, createJudgeAssignment, blockJudgeAssignment, reactivateJudgeAssignment } = useJudgeAssignment();
  const { data: allAssignments = [], isLoading: assignmentsLoading } = fetchJudgeAssignmentsByHackathon(hackathonId);

  // Filter assignments cho track hiện tại
  const trackAssignments = allAssignments.filter(
    assignment => String(assignment.trackId) === String(trackId)
  );

  const judgeUsers = allUsers.filter(user => user.roleName === 'Judge' && !trackAssignments.some(assignment => String(assignment.judgeId) === String(user.userId)));


  // Lấy tiêu chí chỉ của phase này → sau đó filter theo trackId ở client
  const { fetchCriteria, deleteCriterion } = useCriteria();
  const { data: phaseCriteria = [], isLoading: criteriaLoading } =
    fetchCriteria(phaseId);

  // Chỉ lấy tiêu chí thuộc track hiện tại
  const trackCriteria = phaseCriteria.filter(
    (c) =>
      String(c.trackId) === String(trackId) ||
      (c.trackId === null && trackId === null),
  );

  const model = {
    modelName: 'Tracks',
    fields: [
      { key: 'Tên Track', type: 'input', name: 'name' },
      { key: 'Mô tả', type: 'textarea', name: 'description' },
      {
        key: 'Thử thách',
        name: 'challenges',
        type: 'custom',
        ellipsis: true,
        width: 500,
        render: (record) => {
          const challenges = record.challenges || [];
          if (challenges.length === 0) {
            return <Tag color="default">Chưa có thử thách</Tag>;
          }
          return (
            <Space wrap>
              {challenges.map((ch) => {
                return (
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
                );
              })}
            </Space>
          );
        },
      },
    ],
  };

  const criteriaTableModel = {
    entityName: 'Tiêu chí chấm điểm',
    rowKey: 'criteriaId',
    createButton: {
      label: 'Thêm tiêu chí',
      action: () =>
        navigate(
          `${PATH_NAME.ADMIN_CRITERIAS}/create?phaseId=${phaseId}&trackId=${trackId}&hackathonId=${hackathonId}`,
        ),
    },
    columns: [
      {
        title: 'Tên tiêu chí',
        dataIndex: 'name',
        key: 'name',
        className: 'font-medium',
      },
      {
        title: 'Trọng số',
        dataIndex: 'weight',
        key: 'weight',
        className: 'text-gray-400',
      },
    ],
    actions: { view: true, edit: true, delete: true },
  };

  const judgeAssignmentTableModel = {
    entityName: 'giám khảo được phân công',
    rowKey: 'assignmentId',
    createButton: {
      label: 'Thêm giám khảo',
      icon: <UserAddOutlined />,
      action: () => setIsAssignModalOpen(true),
    },
    columns: [
      {
        title: 'Tên giám khảo',
        dataIndex: 'judgeName',
        key: 'judgeName',
        className: 'font-medium',
        render: (text, record) => (
          <Button
            type="link"
            className="p-0 h-auto text-emerald-400"
            onClick={() => navigate(`${PATH_NAME.ADMIN_USERS}/${record.judgeId}`)}
          >
            {text}
          </Button>
        ),
      },
      {
        title: 'Gán vào lúc',
        dataIndex: 'assignedAt',
        key: 'assignedAt',
        className: 'text-gray-400',
        render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Tag color={status === 'Active' ? 'green' : 'red'}>
            {status == 'Active' ? 'Hoạt động' : 'Đã khoá'}
          </Tag>
        ),
      },
      {
        title: 'Thao tác',
        key: 'action',
        render: (record) => (
          <Space>
            {record.status === 'Active' ? (
              <Button
                danger
                size="small"
                onClick={() => handleBlockAssignment(record)}
              >
                Khoá
              </Button>
            ) : (
              <Button
                type="primary"
                size="small"
                onClick={() => handleReactivateAssignment(record)}
              >
                Mở khoá
              </Button>
            )}
          </Space>
        ),
      },
    ],
    actions: {},
  };

  const criteriaHandlers = {
    onView: (record) =>
      navigate(
        `${PATH_NAME.ADMIN_CRITERIAS}/${record.criteriaId}?phaseId=${phaseId}&trackId=${trackId}&hackathonId=${hackathonId}`,
      ),
    onEdit: (record) =>
      navigate(
        `${PATH_NAME.ADMIN_CRITERIAS}/edit/${record.criteriaId}?phaseId=${phaseId}&trackId=${trackId}&hackathonId=${hackathonId}`,
      ),
    onDelete: (record) => {
      setConfirmModal({ open: true, type: 'deleteCriteria', record });
    },
    isDeleting: (record) =>
      deleteCriterion.isPending &&
      deleteCriterion.variables === record.criteriaId,
  };

  const handleAssignJudge = async (values) => {
    try {
      await createJudgeAssignment.mutateAsync({
        judgeId: values.judgeId,
        hackathonId: parseInt(hackathonId),
        phaseId: phaseId ? parseInt(phaseId) : null,
        trackId: parseInt(trackId),
      });
      setIsAssignModalOpen(false);
      assignForm.resetFields();
    } catch (error) {
      console.error('Error assigning judge:', error);
    }
  };

  const handleBlockAssignment = (record) => {
    setConfirmModal({ open: true, type: 'blockAssignment', record });
  };

  const handleReactivateAssignment = (record) => {
    setConfirmModal({ open: true, type: 'reactivateAssignment', record });
  };

  const handleConfirmOk = () => {
    const { type, record } = confirmModal;
    if (type === 'deleteCriteria') {
      deleteCriterion.mutate(record.criteriaId);
    } else if (type === 'blockAssignment') {
      blockJudgeAssignment.mutate(record.assignmentId);
    } else if (type === 'reactivateAssignment') {
      reactivateJudgeAssignment.mutate(record.assignmentId);
    }
    setConfirmModal({ open: false, type: '', record: null });
  };

  const handleConfirmCancel = () => {
    setConfirmModal({ open: false, type: '', record: null });
  };

  if (trackError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Lỗi tải track
      </div>
    );
  if (trackLoading || criteriaLoading || usersLoading || assignmentsLoading) {
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
          colorPrimary: '#10b981',
        },
      }}
    >
      <EntityDetail
        entityName="Track"
        model={model}
        data={track || {}}
        onBack={() =>
          navigate(
            `${PATH_NAME.ADMIN_HACKATHON_PHASES}/${phaseId}?hackathonId=${hackathonId}`,
          )
        }
        onEdit={() =>
          navigate(
            `${PATH_NAME.ADMIN_TRACKS}/edit/${trackId}?phaseId=${phaseId}&hackathonId=${hackathonId}`,
          )
        }
        showEdit
      >
        {/* Judge Assignments Section */}
        <Card className="mt-6 border border-white/10 bg-white/5 rounded-xl">
          <EntityTable
            model={judgeAssignmentTableModel}
            data={trackAssignments}
            loading={assignmentsLoading}
            emptyText="Chưa có giám khảo nào được phép chấm cho track này"
          />
        </Card>

        {/* Criteria Section */}
        {hackathonId && (
          <Card className="mt-6 border border-white/10 bg-white/5 rounded-xl">
            <EntityTable
              model={criteriaTableModel}
              data={trackCriteria}
              loading={criteriaLoading}
              handlers={criteriaHandlers}
              emptyText="Chưa có tiêu chí chấm điểm nào cho track này"
            />
          </Card>
        )}
      </EntityDetail>

      {/* Assign Judge Modal */}
      <Modal
        title="giám khảo"
        open={isAssignModalOpen}
        onCancel={() => {
          setIsAssignModalOpen(false);
          assignForm.resetFields();
        }}
        onOk={() => assignForm.submit()}
        confirmLoading={createJudgeAssignment.isPending}
      >
        <Form
          form={assignForm}
          layout="vertical"
          onFinish={handleAssignJudge}
        >
          <Form.Item
            label="Chọn giám khảo"
            name="judgeId"
            rules={[{ required: true, message: 'Hãy chọn giám khảo....' }]}
          >
            <Select
              placeholder="Hãy chọn giám khảo...."
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              loading={usersLoading}
            >
              {judgeUsers.map(judge => (
                <Select.Option key={judge.userId} value={judge.userId}>
                  {judge.fullName}  ({judge.email})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Confirm Modal */}
      <Modal
        title={
          confirmModal.type === 'deleteCriteria'
            ? 'Xóa tiêu chí'
            : confirmModal.type === 'blockAssignment'
            ? 'Khóa giám khảo'
            : 'Mở lại'
        }
        open={confirmModal.open}
        onOk={handleConfirmOk}
        onCancel={handleConfirmCancel}
        okText={
          confirmModal.type === 'deleteCriteria'
            ? 'Xóa'
            : confirmModal.type === 'blockAssignment'
            ? 'Khóa'
            : 'Mở lại'
        }
        okButtonProps={{
          danger: confirmModal.type === 'deleteCriteria' || confirmModal.type === 'blockAssignment'
        }}
        cancelText={confirmModal.type === 'deleteCriteria' ? 'Hủy' : 'Hủy'}
        centered
      >
        <div className="flex items-start gap-3">
          <ExclamationCircleOutlined className="text-yellow-500 text-xl mt-1" />
          <span>
            {confirmModal.type === 'deleteCriteria' &&
              `Xóa tiêu chí "${confirmModal.record?.name}"? Hành động này không thể hoàn tác.`}
            {confirmModal.type === 'blockAssignment' &&
              `Bạn có muốn khóa "${confirmModal.record?.judgeName}"?`}
            {confirmModal.type === 'reactivateAssignment' &&
              `Bạn có muốn mở lại "${confirmModal.record?.judgeName}"?`}
          </span>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default TrackDetail;