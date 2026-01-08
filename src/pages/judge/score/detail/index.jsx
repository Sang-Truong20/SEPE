import { useSearchParams, useNavigate } from 'react-router-dom';
import { ConfigProvider, theme, Card, Tag, Table, Row, Col, Divider, Collapse } from 'antd';
import {TrophyOutlined, UserOutlined, FileTextOutlined, BarsOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import { useSubmission } from '../../../../hooks/admin/submission/useSubmission.js';
import { useCriteria } from '../../../../hooks/admin/criterias/useCriteria.js';
import EntityDetail from '../../../../components/ui/EntityDetail.jsx';
import { PATH_NAME } from '../../../../constants/index.js';

const ScoreDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const submissionId = searchParams.get('submissionId');
  const phaseId = searchParams.get('phaseId');
  const hackathonId = searchParams.get('hackathonId');

  const { fetchSubmissionsByPhase } = useSubmission();
  const { fetchCriteria } = useCriteria();

  const { data: submissionsData = [], isLoading: submissionsLoading } = fetchSubmissionsByPhase(phaseId);
  const { data: criteriaData = [], isLoading: criteriaLoading } = fetchCriteria(phaseId);

  const submission = submissionsData.find(s => s.id === parseInt(submissionId));
  const submissionScore = submission?.scores || {};

  const criteriaColumns = [
    {
      title: 'Tiêu chí',
      dataIndex: 'criteriaName',
      key: 'criteriaName',
      width: '25%',
      render: (text) => <span className="font-medium text-white">{text}</span>,
    },
    {
      title: 'Trọng số',
      key: 'weight',
      width: '12%',
      render: (_, record) => {
        const criterion = criteriaData.find(c => c.name === record.criteriaName);
        return criterion ? (
          <Tag color="blue">{criterion.weight}</Tag>
        ) : '-';
      },
    },
    {
      title: 'Điểm',
      dataIndex: 'scoreValue',
      key: 'scoreValue',
      width: '12%',
      render: (value) => (
        <Tag color="orange" className="text-lg font-semibold">
          {value}
        </Tag>
      ),
    },
    {
      title: 'Nhận xét',
      dataIndex: 'comment',
      key: 'comment',
      width: '35%',
      render: (text) => text || <i className="text-gray-500">Không có nhận xét</i>,
    },
    {
      title: 'Thời gian chấm',
      dataIndex: 'scoredAt',
      key: 'scoredAt',
      width: '16%',
      render: (text) => (
        <span className="text-gray-400 text-sm">
          {text ? new Date(text).toLocaleString('vi-VN') : '--'}
        </span>
      ),
    },
  ];

  const detailModel = useMemo(() => ({
    modelName: 'Submission Score',
    fields: [
      { key: 'Submission', name: 'submissionName', type: 'input' },
      {
        key: 'Tổng điểm',
        name: 'totalScore',
        type: 'custom',
        render: (data) => (
          <Tag color="gold" className="text-2xl font-bold">
            <TrophyOutlined /> {data.totalScore ?? 0}
          </Tag>
        ),
      },
      { key: 'Submission ID', name: 'submissionId', type: 'id' },
    ],
  }), []);

  if (!submission) {
    return (
      <div className="text-center py-16 text-gray-400">
        Không tìm thấy bài làm cho submission này
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
          colorPrimary: '#10b981',
        },
      }}
    >
      <div className="min-h-screen bg-dark-secondary p-6">

        <EntityDetail
          entityName="Chi tiết điểm số"
          model={detailModel}
          data={submissionScore}
          onBack={() =>  navigate(`${PATH_NAME.JUDGE_TEAM_SCORES}/?phaseId=${phaseId}&hackathonId=${hackathonId}`)}
          showEdit={false}
        >
          {/* Challenge Information Card */}
          {submission && submission.challenge && (
            <Card
              title={
                <div className="flex items-center gap-3">
                  <FileTextOutlined className="text-blue-500 text-xl" />
                  <span className="text-xl font-semibold">Thông tin Bài làm</span>
                </div>
              }
              className="mt-8 border border-blue-500/30 bg-blue-500/5"
            >
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <div>
                    <span className="text-gray-400 block mb-1">Challenge</span>
                    <div className="text-white text-lg font-bold">{submission.challenge.title}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <span className="text-gray-400 block mb-1">Đội thi</span>
                    <div className="text-white font-semibold flex items-center gap-2">
                      <UserOutlined /> {submission.team?.name || 'N/A'}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <span className="text-gray-400 block mb-1">Trạng thái</span>
                    <Tag color={submissionScore?.status === 'scored' ? 'green' : 'orange'}>
                      {submissionScore?.status === 'scored' ? 'Đã chấm' : 'Chờ chấm'}
                    </Tag>
                  </div>
                </Col>
                {submission.challenge.description && (
                  <Col span={24}>
                    <Divider />
                    <div>
                      <span className="text-gray-400 block mb-2">Mô tả bài làm</span>
                      <div className="text-gray-200 bg-black/30 p-4 rounded border border-gray-700">
                        {submission.challenge.description}
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
            </Card>
          )}

          {/* Criteria Reference Card */}
          {criteriaData.length > 0 && (
            <Card
              title={
                <div className="flex items-center gap-3">
                  <BarsOutlined className="text-yellow-500 text-xl" />
                  <span className="text-xl font-semibold">Tiêu chí chấm điểm (Tham khảo)</span>
                </div>
              }
              className="mt-6 border border-yellow-500/30 bg-yellow-500/5"
            >
              <Collapse
                items={criteriaData.map((criterion) => {
                  const scoredItem = submissionScore?.scores?.find(
                    (s) => s.criteriaName === criterion.name
                  );
                  return {
                    key: criterion.id,
                    label: (
                      <div className="flex items-center justify-between w-full pr-4">
                        <span className="font-semibold text-white">{criterion.name}</span>
                        <div className="flex items-center gap-3">
                          <Tag color="blue">Weight: {criterion.weight}</Tag>
                          {scoredItem && (
                            <Tag color="green">
                              Điểm: {scoredItem.scoreValue}
                            </Tag>
                          )}
                        </div>
                      </div>
                    ),
                    children: (
                      <div className="space-y-2">
                        <div>
                          <span className="text-gray-400">Trọng số:</span>
                          <span className="text-white ml-2 font-semibold">{criterion.weight} %</span>
                        </div>
                      </div>
                    ),
                  };
                })}
              />
            </Card>
          )}

          {/* Scores Details Table */}
          <Card
            title={
              <div className="flex items-center gap-3">
                <TrophyOutlined className="text-yellow-500 text-xl" />
                <span className="text-xl font-semibold">Chi tiết điểm số các tiêu chí</span>
              </div>
            }
            className="mt-6 border border-white/10 bg-white/5"
          >
            <Table
              columns={criteriaColumns}
              dataSource={submissionScore?.scores || []}
              rowKey="scoreId"
              pagination={false}
              loading={submissionsLoading || criteriaLoading}
              locale={{ emptyText: 'Chưa chấm tiêu chí nào' }}
              className="[&_.ant-table]:bg-transparent [&_th]:!bg-white/5 [&_th]:!text-white [&_td]:!text-gray-300"
            />
          </Card>
        </EntityDetail>
      </div>
    </ConfigProvider>
  );
};

export default ScoreDetail;