import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileTextOutlined,
  PlusOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { Button, Card, Form, Input, Modal, Space, Spin, Table, Tag, Tooltip, message } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import {
  useCreateDraftSubmission,
  useGetSubmissionsByTeam,
  useSetFinalSubmission,
} from '../../../../hooks/student/submission';

const SubmissionSection = ({ teamId, phaseId, selectedTrack, isLeader, userInfo }) => {
  const [form] = Form.useForm();
  const [submissionModalVisible, setSubmissionModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Get submissions for this team - API: /api/Submission/team/{teamId}
  // Currently hardcoded to teamId = 8 for testing
  const {
    data: submissionsData,
    isLoading: submissionsLoading,
    isError: submissionsError,
    refetch: refetchSubmissions,
  } = useGetSubmissionsByTeam(teamId, {
    enabled: !!teamId && typeof teamId === 'number',
  });

  // Filter submissions by phaseId or phaseName
  const submissions = React.useMemo(() => {
    if (!submissionsData) return [];
    
    // Handle different response formats
    const allSubmissions = Array.isArray(submissionsData)
      ? submissionsData
      : Array.isArray(submissionsData?.data)
        ? submissionsData.data
        : Array.isArray(submissionsData?.submissions)
          ? submissionsData.submissions
          : [];
    
    if (!phaseId) return allSubmissions;
    
    // Filter by phaseId or phaseChallengeId if available
    // If phaseId doesn't match, return all submissions (API already filters by team)
    return allSubmissions.filter(sub => {
      if (sub.phaseId === parseInt(phaseId) || sub.phaseChallengeId === parseInt(phaseId)) {
        return true;
      }
      // If no phaseId match, show all submissions for this team
      return true;
    });
  }, [submissionsData, phaseId]);

  const createDraftMutation = useCreateDraftSubmission();
  const setFinalMutation = useSetFinalSubmission();

  const handleCreateDraft = async (values) => {
    if (!teamId || !phaseId) {
      message.error('Thiếu thông tin team hoặc phase');
      return;
    }

    try {
      await createDraftMutation.mutateAsync({
        teamId: parseInt(teamId),
        phaseId: parseInt(phaseId),
        title: values.title,
        filePath: values.filePath || '',
      });
      form.resetFields();
      setSubmissionModalVisible(false);
      refetchSubmissions();
    } catch (error) {
      console.error('Create draft error:', error);
    }
  };

  const handleSetFinal = async (submissionId) => {
    if (!isLeader) {
      message.error('Chỉ team leader mới có thể nộp bài final');
      return;
    }

    Modal.confirm({
      title: 'Xác nhận nộp bài',
      content: 'Bạn có chắc chắn muốn nộp bài này làm bài nộp chính thức? Sau khi nộp, bạn không thể chỉnh sửa.',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await setFinalMutation.mutateAsync(submissionId);
          refetchSubmissions();
        } catch (error) {
          console.error('Set final error:', error);
        }
      },
    });
  };

  const handleViewDetail = (submission) => {
    setSelectedSubmission(submission);
    setDetailModalVisible(true);
  };

  const handleDownloadFile = (filePath) => {
    if (filePath) {
      window.open(filePath, '_blank');
    } else {
      message.warning('Không có file để tải xuống');
    }
  };

  const getSubmissionStatusColor = (isFinal) => {
    return isFinal ? 'green' : 'default';
  };

  const getSubmissionStatusIcon = (isFinal) => {
    return isFinal ? <CheckCircleOutlined /> : <ClockCircleOutlined />;
  };

  const getSubmissionStatusText = (isFinal) => {
    return isFinal ? 'Đã nộp' : 'Bản nháp';
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (
        <span className="font-medium text-white">{text || 'Chưa có tiêu đề'}</span>
      ),
    },
    {
      title: 'Phase',
      dataIndex: 'phaseName',
      key: 'phaseName',
      render: (text) => (
        <span className="text-gray-300">{text || 'N/A'}</span>
      ),
    },
    {
      title: 'Track',
      dataIndex: 'trackName',
      key: 'trackName',
      render: (text) => (
        <span className="text-gray-300">{text || 'N/A'}</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isFinal',
      key: 'isFinal',
      render: (isFinal) => (
        <Tag
          color={getSubmissionStatusColor(isFinal)}
          icon={getSubmissionStatusIcon(isFinal)}
        >
          {getSubmissionStatusText(isFinal)}
        </Tag>
      ),
    },
    {
      title: 'Ngày nộp',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date) => (
        <span className="text-gray-400">
          {date ? dayjs(date).format('DD/MM/YYYY HH:mm') : 'N/A'}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              className="text-white hover:text-green-400"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          {!record.isFinal && isLeader && (
            <Tooltip title="Nộp bài final">
              <Button
                type="text"
                className="text-white hover:text-green-400"
                icon={<SendOutlined />}
                onClick={() => handleSetFinal(record.submissionId || record.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // Tạm thời disable để test UI
  // if (!selectedTrack) {
  //   return (
  //     <Card className="bg-card-background border border-card-border backdrop-blur-xl">
  //       <div className="text-center py-8">
  //         <p className="text-muted-foreground">Vui lòng chọn track trước khi nộp bài</p>
  //       </div>
  //     </Card>
  //   );
  // }

  return (
    <>
      <Card className="bg-card-background border border-card-border backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileTextOutlined className="text-primary text-xl" />
            <h2 className="text-xl font-bold text-text-primary">Nộp bài</h2>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setSubmissionModalVisible(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500"
          >
            Tạo bản nháp
          </Button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {isLeader
              ? 'Bạn là team leader. Bạn có thể tạo bản nháp và nộp bài final.'
              : 'Bạn là team member. Bạn chỉ có thể tạo bản nháp. Chỉ team leader mới có thể nộp bài final.'}
          </p>
        </div>

        {submissionsError ? (
          <div className="text-center py-8">
            <p className="text-red-400">Có lỗi xảy ra khi tải danh sách bài nộp</p>
            <Button onClick={() => refetchSubmissions()} className="mt-4">
              Thử lại
            </Button>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={submissions}
            loading={submissionsLoading}
            rowKey={(record) => record.submissionId || record.id || `submission-${record.title}`}
            pagination={false}
            locale={{
              emptyText: 'Chưa có bài nộp nào',
            }}
          />
        )}
      </Card>

      {/* Create Draft Modal */}
      <Modal
        title="Tạo bản nháp bài nộp"
        open={submissionModalVisible}
        onCancel={() => {
          setSubmissionModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
        className="[&_.ant-modal-content]:bg-gray-900/95 [&_.ant-modal-content]:backdrop-blur-xl [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white [&_.ant-modal-mask]:bg-black/50"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateDraft}
          className="mt-4"
        >
          <Form.Item
            label={<span className="text-white">Tiêu đề</span>}
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề bài nộp" className="bg-gray-800 border-gray-700 text-white" />
          </Form.Item>

          <Form.Item
            label={<span className="text-white">Đường dẫn file</span>}
            name="filePath"
            rules={[
              { required: true, message: 'Vui lòng nhập đường dẫn file' },
            ]}
          >
            <Input placeholder="Nhập đường dẫn file (ví dụ: /files/submission.pdf)" className="bg-gray-800 border-gray-700 text-white" />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => {
                setSubmissionModalVisible(false);
                form.resetFields();
              }}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createDraftMutation.isPending}
                className="bg-green-500 hover:bg-green-600"
              >
                Tạo bản nháp
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết bài nộp"
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedSubmission(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setDetailModalVisible(false);
            setSelectedSubmission(null);
          }}>
            Đóng
          </Button>,
          selectedSubmission?.filePath && (
            <Button
              key="download"
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadFile(selectedSubmission.filePath)}
            >
              Tải xuống
            </Button>
          ),
        ]}
        width={700}
        className="[&_.ant-modal-content]:bg-gray-900/95 [&_.ant-modal-content]:backdrop-blur-xl [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white [&_.ant-modal-mask]:bg-black/50"
      >
        {selectedSubmission && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Tiêu đề</p>
              <p className="text-white font-medium">{selectedSubmission.title || 'Chưa có tiêu đề'}</p>
            </div>

            {selectedSubmission.teamName && (
              <div>
                <p className="text-sm text-muted-foreground">Team</p>
                <p className="text-white">{selectedSubmission.teamName}</p>
              </div>
            )}

            {selectedSubmission.phaseName && (
              <div>
                <p className="text-sm text-muted-foreground">Phase</p>
                <p className="text-white">{selectedSubmission.phaseName}</p>
              </div>
            )}

            {selectedSubmission.trackName && (
              <div>
                <p className="text-sm text-muted-foreground">Track</p>
                <p className="text-white">{selectedSubmission.trackName}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground">Trạng thái</p>
              <Tag
                color={getSubmissionStatusColor(selectedSubmission.isFinal)}
                icon={getSubmissionStatusIcon(selectedSubmission.isFinal)}
              >
                {getSubmissionStatusText(selectedSubmission.isFinal)}
              </Tag>
            </div>

            {selectedSubmission.filePath && (
              <div>
                <p className="text-sm text-muted-foreground">Đường dẫn file</p>
                <a
                  href={selectedSubmission.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 break-all"
                >
                  {selectedSubmission.filePath}
                </a>
              </div>
            )}

            {selectedSubmission.submittedAt && (
              <div>
                <p className="text-sm text-muted-foreground">Ngày nộp</p>
                <p className="text-white">
                  {dayjs(selectedSubmission.submittedAt).format('DD/MM/YYYY HH:mm')}
                </p>
              </div>
            )}

            {selectedSubmission.submittedBy && (
              <div>
                <p className="text-sm text-muted-foreground">Người nộp (ID)</p>
                <p className="text-white">{selectedSubmission.submittedBy}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default SubmissionSection;

