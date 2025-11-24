import { useSearchParams, useNavigate } from 'react-router-dom';
import { ConfigProvider, theme, Button, Card, Tag, Table } from 'antd';
import { ArrowLeftOutlined, TrophyOutlined, UserOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import { useScores } from '../../../../hooks/admin/score/useScore.js';
import EntityDetail from '../../../../components/ui/EntityDetail.jsx';

const ScoreDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const submissionId = searchParams.get('submissionId');
  const phaseId = searchParams.get('phaseId');
  const hackathonId = searchParams.get('hackathonId');

  const { fetchMyScoresGrouped } = useScores();
  const { data: allScores = [], isLoading } = fetchMyScoresGrouped(phaseId);

  const submissionScore = allScores.find(s => s.submissionId === parseInt(submissionId));

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

  const criteriaColumns = [
    {
      title: 'Tiêu chí',
      dataIndex: 'criteriaName',
      key: 'criteriaName',
      render: (text) => <span className="font-medium text-white">{text}</span>,
    },
    {
      title: 'Điểm',
      dataIndex: 'scoreValue',
      key: 'scoreValue',
      render: (value) => (
        <Tag color="orange" className="text-lg">
          {value}
        </Tag>
      ),
    },
    {
      title: 'Nhận xét',
      dataIndex: 'comment',
      key: 'comment',
      render: (text) => text || <i className="text-gray-500">Không có nhận xét</i>,
    },
    {
      title: 'Thời gian chấm',
      dataIndex: 'scoredAt',
      key: 'scoredAt',
      render: (text) => (
        <span className="text-gray-400 text-sm">
          {text ? new Date(text).toLocaleString('vi-VN') : '--'}
        </span>
      ),
    },
  ];

  if (!submissionScore) {
    return (
      <div className="text-center py-16 text-gray-400">
        Không tìm thấy điểm số cho submission này
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
        <Button
          onClick={() => navigate(-1)}
          type="link"
          icon={<ArrowLeftOutlined />}
          className="mb-6 !text-light-primary hover:!text-primary"
        >
          Quay lại bảng điểm
        </Button>

        <EntityDetail
          entityName="Chi tiết điểm số"
          model={detailModel}
          data={submissionScore}
          onBack={() => navigate(-1)}
          showEdit={false}
        >
          <Card
            title={
              <div className="flex items-center gap-3">
                <TrophyOutlined className="text-yellow-500 text-xl" />
                <span className="text-xl font-semibold">Chi tiết các tiêu chí</span>
              </div>
            }
            className="mt-8 border border-white/10 bg-white/5"
          >
            <Table
              columns={criteriaColumns}
              dataSource={submissionScore.scores || []}
              rowKey="scoreId"
              pagination={false}
              loading={isLoading}
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