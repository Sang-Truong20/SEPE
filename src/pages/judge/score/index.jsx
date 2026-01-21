// components/partner/scores/PhaseScores.jsx
import {
  ArrowLeftOutlined,
  EditOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query'; // ← THÊM IMPORT NÀY
import {
  Alert,
  Button,
  Card,
  Col,
  Collapse,
  ConfigProvider,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Space,
  Tabs,
  Tag,
  Typography,
  message,
  theme,
} from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import EntityTable from '../../../components/ui/EntityTable.jsx';
import { PATH_NAME } from '../../../constants/index.js';
import { useAppeal } from '../../../hooks/admin/appeal/useAppeal.js';
import { useCriteria } from '../../../hooks/admin/criterias/useCriteria.js';
import { useScores } from '../../../hooks/admin/score/useScore.js';
import { useSubmission } from '../../../hooks/admin/submission/useSubmission.js';
import { useTracks } from '../../../hooks/admin/tracks/useTracks.js';
import { useUsers } from '../../../hooks/admin/users/useUsers.js';
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
  const { createScore, updateScoreBatch, reScore, updateScoreById, fetchMyScoresGrouped } =
    useScores();
  const { fetchUsers } = useUsers();
  const { fetchAppealsByPhase } = useAppeal();

  const { data: allTracks = [], isLoading: tracksLoading } = fetchTracks;
  const { data: submissionsData = [], isLoading: submissionsLoading } =
    fetchSubmissionsByPhase(phaseId);
  const { data: allCriteria = [], isLoading: criteriaLoading } =
    fetchCriteria(phaseId);
  const { data: allScore = [] } = fetchMyScoresGrouped(phaseId);
  const { data: allUsers = [] } = fetchUsers;
  const { data: appealsData = [] } = fetchAppealsByPhase(phaseId);

  const [detailsModal, setDetailsModal] = useState({
    open: false,
    submission: null,
    track: null,
  });
  const [editModal, setEditModal] = useState({
    open: false,
    submission: null,
    track: null,
    criteria: [],
    isReScore: false,
    appeal: null,
  });
  const [submissionModal, setSubmissionModal] = useState({
    open: false,
    submission: null,
  });
  const [form] = Form.useForm();
  const watchedValues = Form.useWatch([], form);

  const liveTotalScore = useMemo(() => {
    if (!editModal?.criteria) return 0;
    return editModal.criteria.reduce((sum, crit) => {
      const val = watchedValues?.[`score_${crit.criteriaId}`] || 0;
      return sum + val * ((crit.weight || 0) / 10);
    }, 0);
  }, [watchedValues, editModal?.criteria]);

  // ===== DATA 1: Chấm điểm thường - từ fetchSubmissionsByPhase =====
  const enrichedSubmissions = useMemo(() => {
    return submissionsData
      ?.filter((s) => s.isFinal)
      ?.map((submission) => {
        const track = allTracks?.find(
          (t) =>
            t?.name === submission?.trackName &&
            String(t?.phaseId ?? '') === String(phaseId ?? ''),
        );
        const challenges = track?.challenges || [];

        const relevantCriteria = allCriteria?.filter(
          (c) => !c?.trackId || c?.trackId === track?.trackId,
        );

        const scores =
          allScore
            ?.filter((s) => s?.submissionId === submission?.submissionId)
            ?.pop()?.scores || [];
        // Tính tổng điểm: tổng các điểm sau khi nhân với trọng số
        const totalWeighted = scores?.reduce((sum, s) => {
          const crit = relevantCriteria?.find(
            (c) => c?.name === s?.criteriaName,
          );
          if (!crit) return sum;
          // Nhân điểm với trọng số (chia 10 vì trọng số 3 tương đương 30%)
          return sum + (s?.scoreValue || 0) * ((crit?.weight || 0) / 10);
        }, 0);
        
        const submittedBy =
          allUsers?.find((u) => u?.userId === submission?.submittedBy)
            ?.fullName || '--';

        return {
          ...submission,
          scores, // Include scores in the returned object
          track,
          submittedBy,
          challenges,
          relevantCriteria,
          totalScore: totalWeighted?.toFixed(2),
          scoredCount: scores?.length,
          criteriaCount: relevantCriteria?.length,
          status:
            scores?.length === relevantCriteria?.length &&
            scores?.every((s) => s?.scoreValue != null)
              ? 'scored'
              : 'pending',
          isReScore: false,
        };
      })
      ?.sort((a, b) => b?.totalScore - a?.totalScore);
  }, [submissionsData, allTracks, allCriteria, phaseId, allScore, allUsers]);

  // ===== DATA 2: Chấm phúc khảo - từ fetchAppealsByPhase =====
  const enrichedAppeals = useMemo(() => {
    // Chỉ lấy appeals có status = 'Approved' và appealType = 'Score'
    const approvedAppeals =
      appealsData?.data?.filter((appeal) => appeal?.status === 'Approved') ||
      [];

    return approvedAppeals
      ?.map((appeal) => {
        // Tìm submission tương ứng
        const submission = submissionsData?.find(
          (s) => s?.submissionId === appeal?.submissionId,
        );

        const track = allTracks?.find(
          (t) =>
            t?.name === submission?.trackName &&
            String(t?.phaseId ?? '') === String(phaseId ?? ''),
        );
        const challenges = track?.challenges || [];
        const relevantCriteria = allCriteria?.filter(
          (c) => !c?.trackId || c?.trackId === track?.trackId,
        );

        const scores =
          allScore
            ?.filter((s) => s?.submissionId === appeal?.submissionId)
            ?.pop()?.scores || [];
        // Tính tổng điểm: tổng các điểm sau khi nhân với trọng số
        const totalWeighted = scores?.reduce((sum, s) => {
          const crit = relevantCriteria?.find(
            (c) => c?.name === s?.criteriaName,
          );
          if (!crit) return sum;
          // Nhân điểm với trọng số (chia 10 vì trọng số 3 tương đương 30%)
          return sum + (s?.scoreValue || 0) * ((crit?.weight || 0) / 10);
        }, 0);

        const submittedBy =
          allUsers?.find((u) => u?.userId === submission?.submittedBy)
            ?.fullName || '--';

        return {
          ...submission,
          appeal,
          appealId: appeal?.appealId,
          teamName: appeal?.teamName || submission?.teamName,
          track,
          submittedBy,
          challenges,
          relevantCriteria,
          scores,
          totalScore: totalWeighted?.toFixed(2),
          scoredCount: scores?.length,
          criteriaCount: relevantCriteria?.length,
          isReScore: true, // Flag để biết đây là chấm phúc khảo
        };
      })
      ?.sort(
        (a, b) =>
          new Date(b?.appeal?.reviewedAt) - new Date(a?.appeal?.reviewedAt),
      ); // Sort by review date
  }, [
    appealsData,
    submissionsData,
    allTracks,
    allCriteria,
    phaseId,
    allScore,
    allUsers,
  ]);

  const tableModel = useMemo(
    () => ({
      entityName: 'Bảng điểm các đội',
      rowKey: 'id',
      columns: [
        {
          title: 'Đội thi',
          dataIndex: 'teamName',
          key: 'teamName',
          width: 180,
          render: (text) => (
            <span className="font-medium">{text || 'Chưa đặt tên'}</span>
          ),
        },
        {
          title: 'Hạng mục',
          dataIndex: ['track', 'name'],
          key: 'track',
          render: (name) => (name ? <Tag color="purple">{name}</Tag> : '-'),
        },
        {
          title: 'Thử thách',
          key: 'challenges',
          type: 'custom',
          ellipsis: true,
          width: 500,
          render: (_, record) => {
            const challenges = record?.challenges || [];
            if (challenges?.length === 0) {
              return <Tag color="default">Chưa có thử thách</Tag>;
            }
            return (
              <Space wrap>
                {challenges?.map((ch) => (
                  <Button
                    key={ch?.challengeId}
                    size="small"
                    type="primary"
                    ghost
                    className="text-xs"
                  >
                    {ch?.title}
                  </Button>
                ))}
              </Space>
            );
          },
        },
        {
          title: 'Tiêu chí',
          key: 'criteria',
          render: (_, r) => (
            <Tag>
              {r?.scoredCount}/{r?.criteriaCount}
            </Tag>
          ),
        },
        {
          title: 'Tổng điểm',
          dataIndex: 'totalScore',
          key: 'totalScore',
          render: (score) => (
            <strong className="text-lg text-green-400">{score}</strong>
          ),
          sorter: (a, b) => a?.totalScore - b?.totalScore,
        },
      ],
      actions: {
        view: {
          tooltip: 'Xem chi tiết',
          icon: <FileTextOutlined />,
          className: 'text-blue-400',
        },
        edit: {
          tooltip: 'Chấm điểm',
          icon: <EditOutlined />,
          className: 'text-yellow-500',
        },
        extra: [
          {
            key: 'viewSubmission',
            tooltip: (record) =>
              record?.filePath ? 'Xem bài nộp' : 'Không có file',
            icon: <FileSearchOutlined />,
            className: 'text-cyan-400',
            disabled: (record) => !record?.filePath,
          },
        ],
      },
    }),
    [],
  );

  const handlers = {
    onView: (record) => {
      setDetailsModal({
        open: true,
        submission: record,
        track: record?.track,
      });
    },
    onEdit: (record) => {
      // Use scores from the enriched record (already computed from latest allScore via useMemo)
      // This ensures we always get the latest data since enrichedSubmissions/enrichedAppeals 
      // are recalculated whenever allScore changes
      const freshScores = record?.scores || [];

      setEditModal({
        open: true,
        submission: record,
        track: record?.track,
        criteria: record?.relevantCriteria,
        existingScores: freshScores,
        isReScore: record?.isReScore || false,
        appeal: record?.appeal || null,
      });

      // Reset form first
      form.resetFields();

      // Set field values after a small delay to ensure form has mounted
      setTimeout(() => {
        const fieldValues = {};
        freshScores?.forEach((s) => {
          fieldValues[`score_${s?.criteriaId}`] = s?.scoreValue;
          fieldValues[`comment_${s?.criteriaId}`] = s?.comment || '';
        });
        form.setFieldsValue(fieldValues);
      }, 50);
    },
    onExtraAction: (key, record) => {
      if (key === 'viewSubmission') {
        setSubmissionModal({
          open: true,
          submission: record,
        });
      }
    },
  };

  const handleSaveIndividualScore = (crit) => {
    const scoreVal = form.getFieldValue(`score_${crit.criteriaId}`);
    const commentVal = form.getFieldValue(`comment_${crit.criteriaId}`);

    // Manual validation for these specific fields
    if (scoreVal === undefined || scoreVal === null || scoreVal === "") {
      message.warning(`Vui lòng nhập điểm cho ${crit.name}`);
      return;
    }
    if (scoreVal < 0 || scoreVal > 10) {
      message.warning(`Điểm cho ${crit.name} phải từ 0 đến 10`);
      return;
    }

    const existing = editModal.existingScores?.find(
      (s) => s.criteriaName === crit.name
    );

    let mutation;
    let mutationParams;

    if (editModal?.isReScore && editModal?.appeal?.appealId) {
      mutation = reScore;
      mutationParams = {
        appealId: editModal.appeal.appealId,
        payload: {
          submissionId: editModal.submission.submissionId,
          criteriaScores: [
            {
              criterionId: crit.criteriaId,
              score: scoreVal,
              comment: commentVal || null,
            },
          ],
        },
      };
    } else if (existing?.scoreId) {
      mutation = updateScoreById;
      mutationParams = {
        scoreId: existing.scoreId,
        scoreValue: scoreVal,
        comment: commentVal || null,
      };
    } else {
      mutation = createScore;
      mutationParams = {
        submissionId: editModal.submission.submissionId,
        criteriaScores: [
          {
            criterionId: crit.criteriaId,
            score: scoreVal,
            comment: commentVal || null,
          },
        ],
      };
    }

    mutation.mutate(mutationParams, {
      onSuccess: async (response) => {
        // 1. Invalidate queries first
        queryClient.invalidateQueries({ 
          queryKey: ["Scores", "list", { phaseId: phaseId }]
        });
        queryClient.invalidateQueries({ 
          queryKey: ["Submissions", "byPhase", phaseId]
        });
        queryClient.invalidateQueries({ queryKey: ["Appeals"] });

        // 2. Wait for refetch to complete
        await Promise.all([
          queryClient.refetchQueries({ 
            queryKey: ["Scores", "list", { phaseId: phaseId }],
            type: 'active'
          }),
          queryClient.refetchQueries({ 
            queryKey: ["Submissions", "byPhase", phaseId],
            type: 'active'
          }),
        ]);

        // 3. Update local state immediately so if they stay in or reopen, it's fresh
        setEditModal((prev) => {
          const newScores = [...(prev.existingScores || [])];
          const existingIdx = newScores.findIndex(
            (s) => s.criteriaName === crit.name
          );

          // Construct the new score object
          const updatedScore = {
            ...(existingIdx >= 0 ? newScores[existingIdx] : {}),
            criteriaId: crit.criteriaId,
            criteriaName: crit.name,
            scoreValue: scoreVal,
            comment: commentVal,
            // If the response contains the new scoreId, update it (relevant for new scores)
            ...(response?.data?.scoreId ? { scoreId: response.data.scoreId } : {}),
          };

          if (existingIdx >= 0) {
            newScores[existingIdx] = updatedScore;
          } else {
            newScores.push(updatedScore);
          }

          return { ...prev, existingScores: newScores };
        });

      },
      onError: (error) => {
        console.error("Save score error:", error);
        message.error("Không thể lưu điểm. Vui lòng thử lại!");
      },
    });
  };

  const handleSubmitAllScores = (values) => {
    // Collect all criteria scores from form values
    const criteriaScores = editModal?.criteria?.map((crit) => {
      const scoreVal = values[`score_${crit.criteriaId}`];
      const commentVal = values[`comment_${crit.criteriaId}`] || '';

      // Basic validation
      if (scoreVal === undefined || scoreVal === null || scoreVal === '') {
        message.warning(`Vui lòng nhập điểm cho ${crit.name}`);
        return null;
      }
      if (scoreVal < 0 || scoreVal > 10) {
        message.warning(`Điểm cho ${crit.name} phải từ 0 đến 10`);
        return null;
      }

      return {
        criterionId: crit.criteriaId,
        score: scoreVal,
        comment: commentVal,
      };
    }).filter(Boolean); // Remove null entries

    if (!criteriaScores || criteriaScores.length === 0) {
      message.warning('Không có tiêu chí nào được nhập điểm');
      return;
    }

    let mutation;
    let mutationParams;

    if (editModal?.isReScore && editModal?.appeal?.appealId) {
      mutation = reScore;
      mutationParams = {
        appealId: editModal.appeal.appealId,
        payload: {
          submissionId: editModal.submission.submissionId,
          criteriaScores: criteriaScores,
        },
      };
    } else {
      mutation = updateScoreBatch;
      mutationParams = {
        submissionId: editModal.submission.submissionId,
        criteriaScores: criteriaScores,
      };
    }

    mutation.mutate(mutationParams, {
      onSuccess: async () => {
        // 1. Invalidate queries first
        queryClient.invalidateQueries({ 
          queryKey: ["Scores", "list", { phaseId: phaseId }]
        });
        queryClient.invalidateQueries({ 
          queryKey: ["Submissions", "byPhase", phaseId]
        });
        queryClient.invalidateQueries({ queryKey: ["Appeals"] });

        // 2. Wait for refetch to complete
        await Promise.all([
          queryClient.refetchQueries({ 
            queryKey: ["Scores", "list", { phaseId: phaseId }],
            type: 'active'
          }),
          queryClient.refetchQueries({ 
            queryKey: ["Submissions", "byPhase", phaseId],
            type: 'active'
          }),
        ]);

        // 3. Small delay to ensure React has time to update
        await new Promise(resolve => setTimeout(resolve, 100));

        // 4. Reset form and close modal
        form.resetFields();
        setEditModal({ 
          open: false,
          submission: null,
          track: null,
          criteria: [],
          existingScores: [],
          isReScore: false,
          appeal: null,
        });
      },
      onError: (error) => {
        console.error("Save scores error:", error);
        message.error("Không thể lưu điểm. Vui lòng thử lại!");
      },
    });
  };

  const currentSubmission = submissionModal?.submission;

  if (!phaseId)
    return (
      <div className="text-center py-16 text-gray-400">
        Vui lòng chọn giai đoạn
      </div>
    );

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
                <Title level={3} className="!text-white !mb-1">
                  Bảng điểm Phase {phaseId}
                </Title>
                <Text className="text-gray-400">
                  Chấm thường: {enrichedSubmissions?.length} đội | Phúc khảo:{' '}
                  {enrichedAppeals?.length} bài
                </Text>
              </div>
              <Tag icon={<TrophyOutlined />} color="gold" size="large">
                Tổng cộng:{' '}
                {(enrichedSubmissions?.length || 0) +
                  (enrichedAppeals?.length || 0)}
              </Tag>
            </div>
          </Card>

          {/* Tabs cho 2 loại chấm điểm */}
          <Tabs
            defaultActiveKey="regular"
            size="large"
            items={[
              {
                key: 'regular',
                label: (
                  <Space>
                    <EditOutlined />
                    <span>Chấm điểm thường</span>
                    <Tag color="blue">{enrichedSubmissions?.length || 0}</Tag>
                  </Space>
                ),
                children: (
                  <EntityTable
                    model={tableModel}
                    data={enrichedSubmissions}
                    loading={
                      submissionsLoading || criteriaLoading || tracksLoading
                    }
                    handlers={handlers}
                    emptyText="Chưa có bài nộp cuối cùng"
                  />
                ),
              },
              {
                key: 'appeal',
                label: (
                  <Space>
                    <FileTextOutlined />
                    <span>Chấm phúc khảo</span>
                    <Tag color="orange">{enrichedAppeals?.length || 0}</Tag>
                  </Space>
                ),
                children: (
                  <div>
                    <Alert
                      message="Chấm phúc khảo"
                      description="Danh sách các bài nộp có khiếu nại đã được duyệt và cần chấm lại điểm."
                      type="warning"
                      showIcon
                      className="mb-4"
                    />
                    <EntityTable
                      model={tableModel}
                      data={enrichedAppeals}
                      loading={
                        submissionsLoading || criteriaLoading || tracksLoading
                      }
                      handlers={handlers}
                      emptyText="Không có bài nào cần chấm phúc khảo"
                    />
                  </div>
                ),
              },
            ]}
          />

          {/* Modal Bài nộp */}
          <Modal
            open={submissionModal?.open}
            onCancel={() =>
              setSubmissionModal({ open: false, submission: null })
            }
            footer={null}
            width={950}
            title={
              <Title level={4}>
                <FileSearchOutlined /> Bài nộp của đội
              </Title>
            }
          >
            {currentSubmission ? (
              <div className="space-y-4">
                <Alert
                  type="info"
                  showIcon
                  message={
                    <Space direction="vertical" size={2}>
                      <Text strong>{currentSubmission?.teamName}</Text>
                      <Text>
                        Hạng mục:{' '}
                        <Tag color="purple">
                          {currentSubmission?.track?.name ||
                            currentSubmission?.trackName}
                        </Tag>
                      </Text>
                      <Text>
                        Nộp lúc:{' '}
                        {currentSubmission?.submittedAt
                          ? new Date(
                              currentSubmission.submittedAt,
                            ).toLocaleString('vi-VN')
                          : '--'}
                      </Text>
                    </Space>
                  }
                />

                <Card
                  title="Thông tin bài nộp"
                  className="bg-neutral-900 border border-neutral-800"
                >
                  <Row gutter={[16, 12]}>
                    <Col span={12}>
                      <Text strong>Tiêu đề:</Text>{' '}
                      {currentSubmission?.title || 'Chưa có tiêu đề'}
                    </Col>
                    <Col span={12}>
                      <Text strong>Phase:</Text>{' '}
                      {currentSubmission?.phaseName || phaseId}
                    </Col>
                    <Col span={12}>
                      <Text strong>Đội thi:</Text> {currentSubmission?.teamName}
                    </Col>
                    <Col span={12}>
                      <Text strong>Người nộp:</Text>{' '}
                      {currentSubmission?.submittedBy || '--'}
                    </Col>
                  </Row>
                </Card>
              </div>
            ) : (
              <Empty description="Không có bài nộp" />
            )}
          </Modal>

          {/* Modal Chi tiết */}
          <Modal
            open={detailsModal?.open}
            onCancel={() => setDetailsModal({ open: false })}
            footer={null}
            width={950}
            title={
              <Title level={4}>
                <FileTextOutlined /> Chi tiết bài thi
              </Title>
            }
          >
            {detailsModal?.submission && (
              <div className="space-y-6">
                {detailsModal?.submission?.isReScore &&
                  detailsModal?.submission?.appeal && (
                    <Alert
                      message={
                        <Space direction="vertical" size={4}>
                          <Text strong className="text-orange-500">
                            🔄 Bài nộp cần chấm phúc khảo - Khiếu nại đã được
                            duyệt
                          </Text>
                          <Text>
                            <strong>Lý do khiếu nại:</strong>{' '}
                            {detailsModal.submission.appeal.reason ||
                              detailsModal.submission.appeal.message ||
                              'Không có lý do'}
                          </Text>
                          {detailsModal.submission.appeal.adminResponse && (
                            <Text>
                              <strong>Phản hồi admin:</strong>{' '}
                              {detailsModal.submission.appeal.adminResponse}
                            </Text>
                          )}
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            <strong>Ngày duyệt:</strong>{' '}
                            {detailsModal.submission.appeal.reviewedAt
                              ? new Date(
                                  detailsModal.submission.appeal.reviewedAt,
                                ).toLocaleString('vi-VN')
                              : '--'}
                          </Text>
                        </Space>
                      }
                      type="warning"
                      showIcon
                      banner
                      className="mb-4"
                    />
                  )}

                <Card title="Thông tin đội thi">
                  <Row gutter={[16, 12]}>
                    <Col span={12}>
                      <Text strong>Đội:</Text>{' '}
                      {detailsModal?.submission?.teamName}
                    </Col>
                    <Col span={12}>
                      <Text strong>Hạng mục:</Text>{' '}
                      <Tag color="purple">{detailsModal?.track?.name}</Tag>
                    </Col>
                    <Col span={24}>
                      <Text strong>Thử thách trong hạng mục:</Text>
                      <div className="mt-2">
                        <Space wrap>
                          {detailsModal?.track?.challenges?.length > 0 ? (
                            detailsModal.track?.challenges?.map((ch) => (
                              <Button
                                key={ch?.challengeId}
                                size="small"
                                type="primary"
                                ghost
                                className="text-xs"
                                onClick={() =>
                                  navigate(
                                    `${PATH_NAME?.JUDGE_CHALLENGES}/${ch?.challengeId}`,
                                  )
                                }
                              >
                                {ch?.title}
                              </Button>
                            ))
                          ) : (
                            <Tag color="default">Chưa có thử thách</Tag>
                          )}
                        </Space>
                      </div>
                    </Col>
                  </Row>
                </Card>

                <Card
                  title={
                    <>
                      <TrophyOutlined /> Tiêu chí chấm điểm
                    </>
                  }
                >
                  {detailsModal?.submission?.relevantCriteria?.length > 0 ? (
                    <Collapse>
                      {detailsModal?.submission?.relevantCriteria?.map(
                        (crit) => {
                          const score = detailsModal?.submission?.scores?.find(
                            (s) => s.criteriaName === crit.name,
                          );
                          return (
                            <Collapse.Panel
                              key={crit?.criteriaId}
                              header={
                                <div className="flex justify-between">
                                  <span className="font-medium">
                                    {crit?.name}
                                  </span>
                                  <Space>
                                    <Tag>Trọng số: {crit?.weight}%</Tag>
                                    {score && (
                                      <Tag color="green">
                                        Điểm: {score?.scoreValue}
                                      </Tag>
                                    )}
                                  </Space>
                                </div>
                              }
                            >
                              {score?.comment && (
                                <div>
                                  <Text type="secondary">Nhận xét:</Text>
                                  <br />
                                  <Text>{score.comment}</Text>
                                </div>
                              )}
                            </Collapse.Panel>
                          );
                        },
                      )}
                    </Collapse>
                  ) : (
                    <Empty description="Không có tiêu chí" />
                  )}
                </Card>

                <Card className="bg-gradient-to-r from-emerald-900 to-green-900 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <Text className="text-green-200 text-lg">
                        Tổng điểm cuối cùng
                      </Text>
                      <Title level={1} className="!text-white !mt-0">
                        {detailsModal?.submission?.totalScore}
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
            open={editModal?.open}
            onCancel={() => {
              form.resetFields();
              setEditModal({ 
                open: false,
                submission: null,
                track: null,
                criteria: [],
                existingScores: [],
                isReScore: false,
                appeal: null,
              });
            }}
            footer={[
              <Button
                key="close"
                onClick={() => {
                  form.resetFields();
                  setEditModal({ 
                    open: false,
                    submission: null,
                    track: null,
                    criteria: [],
                    existingScores: [],
                    isReScore: false,
                    appeal: null,
                  });
                }}
              >
                Hoàn tất
              </Button>,
            ]}
            width={900}
            title={

              <Space>
                {editModal?.isReScore ? <FileTextOutlined /> : <EditOutlined />}
                <Text strong>
                  {editModal?.isReScore
                    ? '🔄 Chấm phúc khảo'
                    : 'Chấm điểm thường'}
                  : {editModal.submission?.teamName}
                </Text>
              </Space>
            }
          >
            <Form 
              key={`score-form-${editModal?.submission?.submissionId}-${editModal.existingScores?.length || 0}`}
              form={form} 
              layout="vertical" 
              onFinish={handleSubmitAllScores}
            >
              {editModal?.isReScore && editModal?.appeal && (
                <Alert
                  className="mb-4"
                  message={
                    <Space direction="vertical" size={4}>
                      <Text strong className="text-orange-500">
                        🔄 Chấm phúc khảo - Bài nộp này đã được duyệt khiếu nại
                      </Text>
                      <Text>
                        <strong>Lý do khiếu nại:</strong>{' '}
                        {editModal.appeal.reason ||
                          editModal.appeal.message ||
                          'Không có lý do'}
                      </Text>
                      {editModal.appeal.adminResponse && (
                        <Text>
                          <strong>Phản hồi admin:</strong>{' '}
                          {editModal.appeal.adminResponse}
                        </Text>
                      )}
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        <strong>Ngày duyệt:</strong>{' '}
                        {editModal.appeal.reviewedAt
                          ? new Date(
                              editModal.appeal.reviewedAt,
                            ).toLocaleString('vi-VN')
                          : '--'}
                      </Text>
                    </Space>
                  }
                  type="warning"
                  showIcon
                  banner
                />
              )}

              <Alert
                className="mb-4"
                message={
                  <Space>
                    <Text strong>Hạng mục:</Text>{" "}
                    <Tag color="purple">{editModal.track?.name}</Tag>
                  </Space>
                }
                type="info"
                showIcon
              />

              <Card className="bg-gradient-to-r from-emerald-900 to-green-900 text-white mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <Text className="text-green-200 text-lg">
                      Tổng điểm hiện tại
                    </Text>
                    <Title level={1} className="!text-white !mt-0">
                      {liveTotalScore.toFixed(2)}
                    </Title>
                  </div>
                  <TrophyOutlined className="text-6xl opacity-80" />
                </div>
              </Card>

              {editModal.track?.challenges?.length > 0 && (
                <Card
                  size="small"
                  title="Các thử thách trong hạng mục"
                  className="mb-6 bg-neutral-800"
                >
                  <Space wrap>
                    {editModal?.track?.challenges?.map((ch) => (
                      <Button
                        key={ch?.challengeId}
                        size="small"
                        type="primary"
                        ghost
                        className="text-xs"
                        onClick={() =>
                          navigate(
                            `${PATH_NAME.JUDGE_CHALLENGES}/${ch.challengeId}`,
                          )
                        }
                      >
                        {ch.title}
                      </Button>
                    ))}
                  </Space>
                </Card>
              )}

              <Title level={5}>Chấm điểm theo tiêu chí</Title>
              {editModal?.criteria?.map((crit) => {
                const existing = editModal.existingScores.find(
                  (s) => s.criteriaName === crit.name,
                );

                const scoreValidator = (_, value) => {
                  if (value === undefined || value === null || value === '') {
                    return Promise.reject(new Error('Vui lòng nhập điểm!'));
                  }
                  if (value < 0) {
                    return Promise.reject(new Error('Điểm phải từ 0 trở lên!'));
                  }
                  if (value > 10) {
                    return Promise.reject(new Error('Điểm tối đa là 10!'));
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
                      <Text strong className="text-lg">
                        {crit.name}
                      </Text>
                      <Tag color="blue" className="text-sm">
                        Trọng số: {crit.weight}%
                      </Tag>
                    </div>

                    <Row gutter={16}>
                      <Col span={10}>
                        <Form.Item
                          name={`score_${crit.criteriaId}`}
                          label="Thang điểm (0 - 10)"
                          initialValue={existing?.scoreValue ?? undefined}
                          rules={[
                            { required: true },
                            { validator: scoreValidator },
                          ]}
                          validateTrigger={['onChange', 'onBlur']}
                        >
                          <InputNumber
                            min={0}
                            max={10}
                            step={0.1}
                            precision={2}
                            className="w-full"
                            placeholder="Nhập điểm từ 0 - 10"
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

              <div className="flex justify-end gap-3 pt-6 border-t border-neutral-800">
                <Button
                  onClick={() => {
                    form.resetFields();
                    setEditModal({ 
                      open: false,
                      submission: null,
                      track: null,
                      criteria: [],
                      existingScores: [],
                      isReScore: false,
                      appeal: null,
                    });
                  }}
                  className="!text-text-primary !bg-dark-accent/30 hover:!bg-dark-accent/60 !border !border-dark-accent rounded-md transition-colors duration-200"
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<TrophyOutlined />}
                  loading={
                    createScore.isPending ||
                    updateScoreBatch.isPending ||
                    updateScoreById.isPending ||
                    reScore.isPending
                  }
                  className="bg-primary hover:bg-primary/90 transition-colors duration-150"
                >
                  Lưu tất cả điểm
                </Button>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default PhaseScores;
