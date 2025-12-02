// components/partner/scores/PhaseScores.jsx
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ConfigProvider,
  theme,
  Button,
  Card,
  Tag,
  Modal,
  Form,
  InputNumber,
  Input,
  Space,
  message,
  Divider,
  Collapse,
  Row,
  Col,
  Empty,
  Typography,
  Alert,
} from 'antd';
import {
  ArrowLeftOutlined,
  TrophyOutlined,
  EditOutlined,
  FileTextOutlined,
  BarsOutlined,
} from '@ant-design/icons';
import EntityTable from '../../../components/ui/EntityTable.jsx';
import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query'; // ← THÊM IMPORT NÀY
import { useSubmission } from '../../../hooks/admin/submission/useSubmission.js';
import { useCriteria } from '../../../hooks/admin/criterias/useCriteria.js';
import { useTracks } from '../../../hooks/admin/tracks/useTracks.js';
import { useScores } from '../../../hooks/admin/score/useScore.js';
import { PATH_NAME } from '../../../constants/index.js';
const { TextArea } = Input;
const { Title, Text } = Typography;

const PhaseScores = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phaseId = searchParams.get('phaseId');
  const queryClient = useQueryClient(); // ← THÊM HOOK NÀY

  const { fetchSubmissionsByPhase } = useSubmission();
  const { fetchCriteria } = useCriteria();
  const { fetchTracks } = useTracks();
  const { createScore, updateScore, fetchMyScoresGrouped } = useScores();

  const { data: allTracks = [], isLoading: tracksLoading } = fetchTracks;
  const { data: submissionsData = [], isLoading: submissionsLoading } = fetchSubmissionsByPhase(phaseId);
  const { data: allCriteria = [], isLoading: criteriaLoading } = fetchCriteria(phaseId);
  const { data: allScore = [] } = fetchMyScoresGrouped(phaseId);

  const [detailsModal, setDetailsModal] = useState({ open: false, submission: null, track: null });
  const [editModal, setEditModal] = useState({ open: false, submission: null, track: null, criteria: [] });
  const [form] = Form.useForm();

  // Enrich data
  const enrichedSubmissions = useMemo(() => {
    return submissionsData
      .filter(s => s.isFinal)
      .map(submission => {
        const track = allTracks.find(t => t.name === submission.trackName && t.phaseId.toString() === phaseId);
        const challenges = track?.challenges || [];

        const selectedChallenge = challenges.find(c => c.challengeId === submission.challengeId);

        const relevantCriteria = allCriteria.filter(c => !c.trackId || c.trackId === track?.trackId);

        const scores = allScore.filter(s => s.submissionId === submission.submissionId).pop()?.scores || [];
        const totalWeighted = scores.reduce((sum, s) => {
          const crit = relevantCriteria.find(c => c.criteriaId === s.criteriaId);
          return sum + (s.scoreValue || 0) * (crit?.weight || 1);
        }, 0);
        const maxPossible = relevantCriteria.reduce((sum, c) => sum + (c.weight || 1), 0);
        const finalScore = maxPossible > 0 ? (totalWeighted / maxPossible) * 100 : 0;
        submission.scores = scores;

        return {
          ...submission,
          track,
          challenges,
          selectedChallenge,
          relevantCriteria,
          totalScore: finalScore.toFixed(2),
          scoredCount: scores.length,
          criteriaCount: relevantCriteria.length,
          status: scores.length === relevantCriteria.length && scores.every(s => s.scoreValue != null) ? 'scored' : 'pending',
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore);
  }, [submissionsData, allTracks, allCriteria, phaseId, allScore]);

  const tableModel = useMemo(() => ({
    entityName: 'Bảng điểm các đội',
    rowKey: 'id',
    columns: [
      {
        title: 'Đội thi',
        dataIndex: 'teamName',
        key: 'teamName',
        width: 180,
        render: text => <span className="font-medium">{text || 'Chưa đặt tên'}</span>,
      },
      {
        title: 'Track',
        dataIndex: ['track', 'name'],
        key: 'track',
        render: name => name ? <Tag color="purple">{name}</Tag> : '-',
      },
      {
        title: 'Thử thách',
        key: 'challenges',
        type: 'custom',
        ellipsis: true,
        width: 500,
        render: (_, record) => {
          const challenges = record.challenges || [];
          if (challenges.length === 0) {
            return <Tag color="default">Chưa có thử thách</Tag>;
          }
          return (
            <Space wrap>
              {challenges?.map((ch) => (
                <Button
                  key={ch.challengeId}
                  size="small"
                  type="primary"
                  ghost
                  className="text-xs"
                  onClick={() =>
                    navigate(`${PATH_NAME.JUDGE_CHALLENGES}/${ch.challengeId}`)
                  }
                >
                  {ch.title}
                </Button>
              ))}
            </Space>
          );
        },
      },
      {
        title: 'Đã chọn',
        key: 'selected',
        render: (_, record) => record.selectedChallenge ? (
          <Tag color="green" icon={<TrophyOutlined />}>
            {record.selectedChallenge.title}
          </Tag>
        ) : <Tag color="orange">Chưa chọn</Tag>,
      },
      {
        title: 'Tiêu chí',
        key: 'criteria',
        render: (_, r) => <Tag>{r.scoredCount}/{r.criteriaCount}</Tag>,
      },
      {
        title: 'Tổng điểm',
        dataIndex: 'totalScore',
        key: 'totalScore',
        render: score => <strong className="text-lg text-green-400">{score}%</strong>,
        sorter: (a, b) => a.totalScore - a.totalScore,
      },
    ],
    actions: {
      view: { tooltip: 'Xem chi tiết', icon: <FileTextOutlined />, className: 'text-blue-400' },
      edit: { tooltip: 'Chấm điểm', icon: <EditOutlined />, className: 'text-yellow-500' },
    },
  }), []);

  const handlers = {
    onView: (record) => {
      setDetailsModal({
        open: true,
        submission: record,
        track: record.track,
      });
    },
    onEdit: (record) => {
      setEditModal({
        open: true,
        submission: record,
        track: record.track,
        criteria: record.relevantCriteria,
        existingScores: record.scores || [],
      });

      form.resetFields();

      const fieldValues = {};
      record.scores?.forEach(s => {
        fieldValues[`score_${s.criteriaId}`] = s.scoreValue;
        fieldValues[`comment_${s.criteriaId}`] = s.comment || '';
      });

      form.setFieldsValue(fieldValues);
    },
  };

  const handleSaveScore = () => {
    form.validateFields().then(values => {
      const scores = editModal?.criteria?.map(c => ({
        criteriaId: c.criteriaId,
        scoreValue: values[`score_${c.criteriaId}`] || 0,
        comment: values[`comment_${c.criteriaId}`] || null,
      }));

      const payload = { submissionId: editModal.submission.submissionId, scores };
      const mutation = editModal.existingScores.length > 0 ? updateScore : createScore;

      mutation.mutate(payload, {
        onSuccess: () => {
          message.success('Lưu điểm thành công!');

          // ← THÊM PHẦN NÀY: Invalidate queries để refetch dữ liệu mới
          queryClient.invalidateQueries({
            queryKey: ['myScoresGrouped', phaseId]
          });
          queryClient.invalidateQueries({
            queryKey: ['submissionsByPhase', phaseId]
          });

          setEditModal({ open: false });
          form.resetFields();
        },
        onError: (error) => {
          message.error('Có lỗi xảy ra khi lưu điểm!');
          console.error('Save score error:', error);
        }
      });
    }).catch(error => {
      message.warning('Vui lòng kiểm tra lại thông tin nhập vào!');
    });
  };

  if (!phaseId) return <div className="text-center py-16 text-gray-400">Vui lòng chọn giai đoạn</div>;

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
            Quay lại
          </Button>

          <Card className="bg-neutral-900 border border-neutral-800 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <Title level={3} className="!text-white !mb-1">Bảng điểm Phase {phaseId}</Title>
                <Text className="text-gray-400">Tổng {enrichedSubmissions.length} đội thi</Text>
              </div>
              <Tag icon={<TrophyOutlined />} color="gold" size="large">Top {enrichedSubmissions.length}</Tag>
            </div>
          </Card>

          <EntityTable
            model={tableModel}
            data={enrichedSubmissions}
            loading={submissionsLoading || criteriaLoading || tracksLoading}
            handlers={handlers}
            emptyText="Chưa có bài nộp cuối cùng"
          />

          {/* Modal Chi tiết */}
          <Modal
            open={detailsModal.open}
            onCancel={() => setDetailsModal({ open: false })}
            footer={null}
            width={950}
            title={<Title level={4}><FileTextOutlined /> Chi tiết bài thi</Title>}
          >
            {detailsModal.submission && (
              <div className="space-y-6">
                <Card title="Thông tin đội thi">
                  <Row gutter={[16, 12]}>
                    <Col span={12}><Text strong>Đội:</Text> {detailsModal.submission.teamName}</Col>
                    <Col span={12}><Text strong>Track:</Text> <Tag color="purple">{detailsModal.track?.name}</Tag></Col>
                    <Col span={24}>
                      <Text strong>Thử thách trong Track:</Text>
                      <div className="mt-2">
                        <Space wrap>
                          {detailsModal.track?.challenges?.length > 0 ? (
                            detailsModal.track?.challenges?.map((ch) => (
                              <Button
                                key={ch.challengeId}
                                size="small"
                                type="primary"
                                ghost
                                className="text-xs"
                                onClick={() =>
                                  navigate(`${PATH_NAME.JUDGE_CHALLENGES}/${ch.challengeId}`)
                                }
                              >
                                {ch.title}
                              </Button>
                            ))
                          )  : (
                            <Tag color="default">Chưa có thử thách</Tag>
                          )}
                        </Space>
                      </div>
                    </Col>
                    {detailsModal.submission.selectedChallenge && (
                      <Col span={24}>
                        <Alert
                          message={<>Đội đã chọn: <strong>{detailsModal.submission.selectedChallenge.title}</strong></>}
                          type="success"
                          showIcon
                        />
                      </Col>
                    )}
                  </Row>
                </Card>

                <Card title={<><TrophyOutlined /> Tiêu chí chấm điểm</>}>
                  {detailsModal.submission.relevantCriteria?.length > 0 ? (
                    <Collapse>
                      {detailsModal.submission?.relevantCriteria?.map(crit => {
                        const score = detailsModal.submission.scores?.find(s => s.criteriaName === crit.name);
                        return (
                          <Collapse.Panel
                            key={crit.criteriaId}
                            header={
                              <div className="flex justify-between">
                                <span className="font-medium">{crit.name}</span>
                                <Space>
                                  <Tag>Weight: {crit.weight}</Tag>
                                  {score && <Tag color="green">Điểm: {score.scoreValue}/{crit.weight}</Tag>}
                                </Space>
                              </div>
                            }
                          >
                            {score?.comment && (
                              <div>
                                <Text type="secondary">Nhận xét:</Text><br />
                                <Text>{score.comment}</Text>
                              </div>
                            )}
                          </Collapse.Panel>
                        );
                      })}
                    </Collapse>
                  ) : <Empty description="Không có tiêu chí" />}
                </Card>

                <Card className="bg-gradient-to-r from-emerald-900 to-green-900 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <Text className="text-green-200 text-lg">Tổng điểm cuối cùng</Text>
                      <Title level={1} className="!text-white !mt-0">
                        {detailsModal.submission.totalScore}%
                      </Title>
                    </div>
                    <TrophyOutlined className="text-6xl opacity-80" />
                  </div>
                </Card>
              </div>
            )}
          </Modal>

          {/* Modal Chấm điểm */}
          <Modal
            open={editModal.open}
            onCancel={() => {
              setEditModal({ open: false });
              form.resetFields();
            }}
            onOk={handleSaveScore}
            okText="Lưu điểm"
            cancelText="Hủy"
            width={900}
            confirmLoading={createScore.isPending || updateScore.isPending}
            title={<><EditOutlined /> Chấm điểm: {editModal.submission?.teamName}</>}
          >
            <Form form={form} layout="vertical">
              <Alert
                className="mb-4"
                message={
                  <Space>
                    <Text strong>Track:</Text> <Tag color="purple">{editModal.track?.name}</Tag>
                    {editModal.submission?.selectedChallenge && (
                      <>| Đã chọn: <Tag color="green">{editModal.submission.selectedChallenge.title}</Tag></>
                    )}
                  </Space>
                }
                type="info"
                showIcon
              />

              {editModal.track?.challenges?.length > 0 && (
                <Card size="small" title="Các thử thách trong Track" className="mb-6 bg-neutral-800">
                  <Space wrap>
                    {editModal?.track?.challenges?.map((ch) => (
                      <Button
                        key={ch.challengeId}
                        size="small"
                        type="primary"
                        ghost
                        className="text-xs"
                        onClick={() =>
                          navigate(`${PATH_NAME.JUDGE_CHALLENGES}/${ch.challengeId}`)
                        }
                      >
                        {ch.title}
                      </Button>
                    ))}
                  </Space>
                </Card>
              )}

              <Title level={5}>Chấm điểm theo tiêu chí</Title>
              {editModal?.criteria?.map(crit => {
                const existing = editModal.existingScores.find(s => s.criteriaName === crit.name);

                const scoreValidator = (_, value) => {
                  if (value === undefined || value === null || value === '') {
                    return Promise.reject(new Error('Vui lòng nhập điểm!'));
                  }
                  if (value < 0) {
                    return Promise.reject(new Error('Điểm phải lớn hơn 0!'));
                  }
                  if (value > crit.weight) {
                    return Promise.reject(new Error(`Điểm không được lớn hơn trọng số (${crit.weight})!`));
                  }
                  return Promise.resolve();
                };

                return (
                  <Card
                    key={crit.criteriaId}
                    className="mb-4 bg-neutral-800"
                    size="small"
                    bordered={false}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <Text strong className="text-lg">{crit.name}</Text>
                      <Tag color="blue" className="text-sm">
                        Trọng số: {crit.weight}
                      </Tag>
                    </div>
                    <Row gutter={16}>
                      <Col span={10}>
                        <Form.Item
                          name={`score_${crit.criteriaId}`}
                          label={`Điểm (0 < điểm ≤ ${crit.weight})`}
                          initialValue={existing?.scoreValue ?? undefined}
                          rules={[
                            { required: true },
                            { validator: scoreValidator }
                          ]}
                          validateTrigger={['onChange', 'onBlur']}
                        >
                          <InputNumber
                            min={0}
                            max={crit.weight}
                            step={0.5}
                            precision={2}
                            className="w-full"
                            placeholder={`0 - ${crit.weight}`}
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={14}>
                        <Form.Item
                          name={`comment_${crit.criteriaId}`}
                          label="Nhận xét"
                          initialValue={existing?.comment || ''}
                        >
                          <TextArea
                            rows={4}
                            placeholder="Nhập nhận xét chi tiết về tiêu chí này..."
                            autoSize={{ minRows: 3, maxRows: 8 }}
                            className="resize-none"
                            style={{ resize: 'none' }}
                            showCount
                            maxLength={1000}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                );
              })}
            </Form>
          </Modal>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default PhaseScores;