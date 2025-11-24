// components/partner/scores/PhaseScores.jsx
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ConfigProvider, theme, Button, Card, Tag, Modal, Form, InputNumber, Input, Space } from 'antd';
import { ArrowLeftOutlined, TrophyOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { PATH_NAME } from '../../../constants/index.js';
import EntityTable from '../../../components/ui/EntityTable.jsx';
import { useMemo, useState } from 'react';
import { useScores } from '../../../hooks/admin/score/useScore.js';

const { TextArea } = Input;

const PhaseScores = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phaseId = searchParams.get('phaseId');
  const hackathonId = searchParams.get('hackathonId');

  const { fetchMyScoresGrouped, updateScore } = useScores();
  const { data: scoresData = [], isLoading } = fetchMyScoresGrouped(phaseId);

  const [editModal, setEditModal] = useState({ open: false, record: null });
  const [form] = Form.useForm();

  const tableModel = useMemo(
    () => ({
      entityName: 'Điểm số các Team',
      rowKey: 'submissionId',
      columns: [
        {
          title: 'Submission',
          dataIndex: 'submissionName',
          key: 'submissionName',
          type: 'text',
          className: 'font-medium text-white',
        },
        {
          title: 'Tổng điểm',
          dataIndex: 'totalScore',
          key: 'totalScore',
          type: 'tag',
          tagColor: 'gold',
          render: (value) => (
            <span className="text-lg font-bold">
              <TrophyOutlined className="mr-1" /> {value ?? 0}
            </span>
          ),
        },
        {
          title: 'Đã chấm',
          key: 'criteriaCount',
          type: 'text',
          render: (_, record) => (
            <Tag color={record.scores?.length > 0 ? 'green' : 'red'}>
              {record.scores?.length || 0} tiêu chí
            </Tag>
          ),
        },
      ],
      actions: {
        view: {
          tooltip: 'Xem chi tiết điểm',
          icon: <EyeOutlined />,
          className: 'text-blue-400 hover:text-blue-300',
        },
        edit: {
          tooltip: 'Chấm lại điểm',
          icon: <EditOutlined />,
          className: 'text-yellow-400 hover:text-yellow-300',
        },
      },
    }),
    []
  );

  const handlers = {
    onView: (record) => {
      navigate(
        `${PATH_NAME.PARTNER_TEAM_SCORES}/${record.submissionId}?submissionId=${record.submissionId}&phaseId=${phaseId}&hackathonId=${hackathonId}`
      );
    },
    onEdit: (record) => {
      setEditModal({ open: true, record });
      // Đổ dữ liệu cũ vào form
      const initialValues = {};
      record.scores?.forEach((s, idx) => {
        initialValues[`scoreValue_${s.scoreId}`] = s.scoreValue;
        initialValues[`comment_${s.scoreId}`] = s.comment || '';
      });
      form.setFieldsValue(initialValues);
    },
  };

  const handleUpdateScore = () => {
    form.validateFields().then((values) => {
      const scores = editModal.record.scores.map((item) => ({
        criteriaId: item.criteriaId || item.scoreId, // fallback nếu không có criteriaId
        scoreValue: values[`scoreValue_${item.scoreId}`],
        comment: values[`comment_${item.scoreId}`] || null,
      }));

      const payload = {
        submissionId: editModal.record.submissionId,
        scores,
      };

      updateScore.mutate(payload, {
        onSuccess: () => {
          message.success('Cập nhật điểm thành công!');
          setEditModal({ open: false, record: null });
          form.resetFields();
        },
        onError: () => {
          message.error('Cập nhật điểm thất bại!');
        },
      });
    });
  };

  if (!phaseId) {
    return <div className="text-center py-16 text-gray-400">Vui lòng chọn giai đoạn để xem điểm số</div>;
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgContainer: '#111111',
          colorBorder: '#2f2f2f',
          colorText: '#ffffff',
          colorPrimary: '#10b981',
        },
      }}
    >
      <div className="bg-dark-secondary border border-dark-accent rounded-xl p-6 shadow-md">
        <div className="mb-6">
          <Button
            onClick={() => navigate(-1)}
            type="link"
            icon={<ArrowLeftOutlined />}
            className="mb-4 !text-light-primary hover:!text-primary"
          >
            Quay lại danh sách giai đoạn
          </Button>

          <Card className="bg-neutral-900 border border-neutral-700 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Bảng điểm theo giai đoạn
                </h2>
                <p className="text-gray-400">
                  Phase ID: <Tag color="cyan">{phaseId}</Tag> • {scoresData.length} submission
                </p>
              </div>
              <Tag icon={<TrophyOutlined />} color="gold" className="text-lg">
                Tổng {scoresData.length} đội thi
              </Tag>
            </div>
          </Card>

          <EntityTable
            model={tableModel}
            data={scoresData}
            loading={isLoading}
            handlers={handlers}
            emptyText="Chưa có submission nào được chấm điểm"
          />
        </div>
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <EditOutlined className="text-yellow-500" />
            <span>Chấm điểm: {editModal.record?.submissionName}</span>
          </div>
        }
        open={editModal.open}
        onCancel={() => {
          setEditModal({ open: false, record: null });
          form.resetFields();
        }}
        onOk={handleUpdateScore}
        okText="Cập nhật điểm"
        cancelText="Hủy"
        confirmLoading={updateScore.isPending}
        width={700}
        centered
      >
        <Form form={form} layout="vertical">
          {editModal.record?.scores?.map((item) => (
            <Space key={item.scoreId} direction="vertical" className="w-full mb-4 block">
              <div className="font-medium text-white mb-2">
                {item.criteriaName}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name={`scoreValue_${item.scoreId}`}
                  label="Điểm"
                  rules={[{ required: true, message: 'Vui lòng nhập điểm' }]}
                  initialValue={item.scoreValue}
                >
                  <InputNumber
                    min={0}
                    max={10}
                    step={0.5}
                    className="w-full"
                    placeholder="VD: 8.5"
                  />
                </Form.Item>
                <Form.Item
                  name={`comment_${item.scoreId}`}
                  label="Nhận xét"
                  initialValue={item.comment || ''}
                >
                  <TextArea rows={2} placeholder="Nhận xét (tùy chọn)" />
                </Form.Item>
              </div>
            </Space>
          ))}
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default PhaseScores;