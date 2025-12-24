import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileTextOutlined,
  PlusOutlined,
  SendOutlined
} from '@ant-design/icons';
import { Button, Card, Form, Input, Modal, Space, Spin, Table, Tag, Tooltip, message } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import {
  useCreateDraftSubmission,
  useGetSubmissionsByPhase,
  useSetFinalSubmission,
} from '../../../../hooks/student/submission';
import { useIsTeamLeader } from '../../../../hooks/student/team-member';

// eslint-disable-next-line no-unused-vars
const SubmissionSection = ({ teamId, phaseId, selectedTrack, isLeader: propIsLeader, userInfo }) => {
  const [form] = Form.useForm();
  const [submissionModalVisible, setSubmissionModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [finalSubmissionModalVisible, setFinalSubmissionModalVisible] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [pendingSubmissionId, setPendingSubmissionId] = useState(null);
  const [showSubmissionSelection, setShowSubmissionSelection] = useState(false);
  
  
  // Check if user is leader using API
  const { data: isLeaderData, isLoading: isLeaderLoading, isError: isLeaderError } = useIsTeamLeader(teamId, {
    enabled: !!teamId,
  });
  
  // Determine isLeader: use API result if available, fallback to prop
  const isLeader = React.useMemo(() => {
    // Debug log
    console.log('[SubmissionSection] Leader check:', {
      teamId,
      isLeaderData,
      propIsLeader,
      isLeaderError,
      isLeaderLoading,
    });

    // If API is loading, use prop as fallback
    if (isLeaderLoading) {
      return propIsLeader || false;
    }

    // If API has error, use prop as fallback
    if (isLeaderError) {
      console.warn('[SubmissionSection] API error checking leader, using prop:', propIsLeader);
      return propIsLeader || false;
    }

    // If API returned data
    if (isLeaderData !== undefined && isLeaderData !== null) {
      // API returns boolean or object with isLeader property
      const apiIsLeader = typeof isLeaderData === 'boolean' 
        ? isLeaderData 
        : isLeaderData.isLeader || isLeaderData.data?.isLeader || false;
      
      console.log('[SubmissionSection] API says isLeader:', apiIsLeader);
      return apiIsLeader;
    }
    
    // Fallback to prop if API not available
    console.log('[SubmissionSection] Using prop isLeader:', propIsLeader);
    return propIsLeader || false;
  }, [isLeaderData, propIsLeader, isLeaderLoading, isLeaderError, teamId]);

  // Get submissions for this phase - API: /api/Submission/phase/{phaseId}
  const {
    data: submissionsData,
    isLoading: submissionsLoading,
    isError: submissionsError,
    refetch: refetchSubmissions,
  } = useGetSubmissionsByPhase(phaseId, {
    enabled: !!phaseId && typeof phaseId === 'number',
  });

  // Process submissions data
  const submissions = React.useMemo(() => {
    if (!submissionsData) return [];
    
    // Handle different response formats
    return Array.isArray(submissionsData)
      ? submissionsData
      : Array.isArray(submissionsData?.data)
        ? submissionsData.data
        : Array.isArray(submissionsData?.submissions)
          ? submissionsData.submissions
          : [];
  }, [submissionsData]);

  const createDraftMutation = useCreateDraftSubmission();
  const setFinalMutation = useSetFinalSubmission();

  const handleCreateDraft = async (values) => {
    if (!teamId || !phaseId) {
      const missing = [];
      if (!teamId) missing.push('team');
      if (!phaseId) missing.push('phase');
      console.error('[SubmissionSection] Missing info:', { teamId, phaseId, missing });
      message.error(`Thiếu thông tin ${missing.join(' và ')}. TeamId: ${teamId || 'null'}, PhaseId: ${phaseId || 'null'}`);
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

  const handleSetFinal = (submissionId) => {
    if (!isLeader) {
      message.error('Chỉ team leader mới có thể nộp bài final');
      return;
    }

    setPendingSubmissionId(submissionId);
    setFinalSubmissionModalVisible(true);
  };

  const handleSetFinalFromHeader = () => {
    if (!isLeader) {
      message.error('Chỉ team leader mới có thể nộp bài final');
      return;
    }

    // Tìm submission draft mới nhất (chưa nộp final)
    const draftSubmissions = submissions.filter(s => !s.isFinal);
    
    if (draftSubmissions.length === 0) {
      message.warning('Không có bản nháp nào để nộp');
      return;
    }

    // Nếu chỉ có 1 draft, nộp luôn
    if (draftSubmissions.length === 1) {
      handleSetFinal(draftSubmissions[0].submissionId || draftSubmissions[0].id);
      return;
    }

    // Nếu có nhiều draft, mở modal chọn
    setShowSubmissionSelection(true);
    setFinalSubmissionModalVisible(true);
  };

  const handleConfirmFinalSubmission = async () => {
    if (!pendingSubmissionId || !teamId) {
      message.warning('Vui lòng chọn bài nộp để nộp final');
      return;
    }

    try {
      await setFinalMutation.mutateAsync({
        submissionId: pendingSubmissionId,
        teamId: parseInt(teamId),
      });
      message.success('Nộp bài final thành công!');
      setFinalSubmissionModalVisible(false);
      setPendingSubmissionId(null);
      setShowSubmissionSelection(false);
      refetchSubmissions();
    } catch (error) {
      console.error('Set final error:', error);
      message.error(error?.response?.data?.message || 'Không thể nộp bài final. Vui lòng thử lại.');
    }
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
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setSubmissionModalVisible(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500"
            >
              Tạo bản nháp
            </Button>
            {isLeader && (
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={() => handleSetFinalFromHeader()}
                className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
                disabled={!submissions || submissions.length === 0 || submissions.every(s => s.isFinal)}
                title={!submissions || submissions.length === 0 
                  ? 'Chưa có bài nộp nào' 
                  : submissions.every(s => s.isFinal) 
                    ? 'Tất cả bài đã nộp final' 
                    : 'Nộp bài final'}
              >
                Nộp bài final
              </Button>
            )}
          </Space>
        </div>

        <div className="mb-4">
          {isLeaderLoading ? (
            <div className="flex items-center gap-2">
              <Spin size="small" />
              <p className="text-sm text-muted-foreground">Đang kiểm tra quyền...</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {isLeader
                  ? 'Bạn là team leader. Bạn có thể tạo bản nháp và nộp bài final.'
                  : 'Bạn là team member. Bạn chỉ có thể tạo bản nháp. Chỉ team leader mới có thể nộp bài final.'}
              </p>
              
            </div>
          )}
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

      {/* Final Submission Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3">
            <span className="text-white">
              {showSubmissionSelection ? 'Chọn bài nộp final' : 'Xác nhận nộp bài'}
            </span>
          </div>
        }
        open={finalSubmissionModalVisible}
        onOk={handleConfirmFinalSubmission}
        onCancel={() => {
          setFinalSubmissionModalVisible(false);
          setPendingSubmissionId(null);
          setShowSubmissionSelection(false);
        }}
        okText={showSubmissionSelection ? 'Nộp bài đã chọn' : 'Xác nhận'}
        cancelText="Hủy"
        okButtonProps={{
          loading: setFinalMutation.isPending,
          disabled: showSubmissionSelection && !pendingSubmissionId,
          className: 'bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white border-0',
        }}
        cancelButtonProps={{
          className: 'bg-white/10 hover:bg-white/20 text-white border-white/20',
        }}
        width={showSubmissionSelection ? 700 : 500}
        className="[&_.ant-modal-content]:bg-gray-900/95 [&_.ant-modal-content]:backdrop-blur-xl [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white [&_.ant-modal-mask]:bg-black/50"
      >
        {showSubmissionSelection ? (
          <div className="py-4">
            <p className="text-text-secondary text-base mb-4">
              Chọn bài nộp bạn muốn nộp làm bài nộp chính thức:
            </p>
            <div className="space-y-3 max-h-96 pr-2 overflow-y-auto">
              {submissions
                .filter(s => !s.isFinal)
                .map((submission) => {
                  const isSelected = pendingSubmissionId === (submission.submissionId || submission.id);
                  return (
                    <div
                      key={submission.submissionId || submission.id}
                      onClick={() => setPendingSubmissionId(submission.submissionId || submission.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-white/10 bg-white/5 hover:border-green-500/50 hover:bg-green-500/5'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isSelected && (
                          <CheckCircleOutlined className="text-green-500 text-xl flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-3">
                            <p className="text-white font-semibold text-base">
                              {submission.title || 'Chưa có tiêu đề'}
                            </p>
                            <Tag color="orange" size="small">Bản nháp</Tag>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 text-sm">
                            {submission.phaseName && (
                              <div className="flex items-center gap-1.5 text-gray-300">
                                <FileTextOutlined className="text-primary text-xs" />
                                <span>{submission.phaseName}</span>
                              </div>
                            )}
                            
                            {submission.trackName && (
                              <Tag color="blue" size="small">{submission.trackName}</Tag>
                            )}
                            
                            {submission.submittedAt && (
                              <div className="flex items-center gap-1.5 text-gray-400">
                                <CalendarOutlined className="text-xs" />
                                <span>{dayjs(submission.submittedAt).format('DD/MM/YYYY HH:mm')}</span>
                              </div>
                            )}
                          </div>
                          
                          {submission.filePath && (
                            <div className="mt-2 pt-2 border-t border-white/10">
                              <a
                                href={submission.filePath}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300"
                                title={submission.filePath}
                              >
                                <DownloadOutlined />
                                <span className="truncate">
                                  {submission.filePath.length > 60 
                                    ? submission.filePath.substring(0, 60) + '...' 
                                    : submission.filePath}
                                </span>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            {submissions.filter(s => !s.isFinal).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileTextOutlined className="text-4xl mb-2 opacity-50" />
                <p>Không có bản nháp nào để nộp</p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-4">
            <p className="text-text-secondary text-base leading-relaxed">
              Bạn có chắc chắn muốn nộp bài này làm bài nộp chính thức? Sau khi nộp, bạn không thể chỉnh sửa.
            </p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default SubmissionSection;

