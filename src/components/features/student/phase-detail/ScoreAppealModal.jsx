import { Form, Input, Modal } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetMyScoresGrouped, useGetTeamOverview } from '../../../../hooks/student/score';

const ScoreAppealModal = ({
  visible,
  onClose,
  onSubmit,
  selectedCriteriaScore,
  form,
  loading,
  teamId,
  hasJoinedHackathon,
}) => {
  const { phaseId } = useParams();

  // Get scores data for submissionId and judgeId
  const { data: scoresData } = useGetMyScoresGrouped(
    phaseId,
    { enabled: !!phaseId && hasJoinedHackathon }
  );

  const { data: teamOverviewData } = useGetTeamOverview(
    teamId,
    phaseId,
    { enabled: !!teamId && !!phaseId && hasJoinedHackathon }
  );

  // Get criteria for mapping criterionId to name
  

  const handleSubmit = (values) => {
    // If judgeId and submissionId are provided in selectedCriteriaScore (from judges structure), use them
    // Otherwise, try to get from teamOverviewData or scoresData
    const scoreData = {
      submissionId: selectedCriteriaScore?.submissionId || 
                     teamOverviewData?.submissionId || 
                     scoresData?.submissionId,
      judgeId: selectedCriteriaScore?.judgeId || 
               teamOverviewData?.judgeId || 
               scoresData?.judgeId,
      teamOverviewData,
    };
    onSubmit(values, scoreData);
  };
  return (
    <Modal
      title="Phúc khảo điểm"
      open={visible}
      onOk={() => {
        form.validateFields().then(handleSubmit);
      }}
      onCancel={onClose}
      okText="Gửi phúc khảo"
      cancelText="Hủy"
      okButtonProps={{
        loading: loading,
        className: 'bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0',
      }}
      width={600}
      className="[&_.ant-modal-content]:bg-gray-900/95 [&_.ant-modal-content]:backdrop-blur-xl [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white [&_.ant-modal-mask]:bg-black/50"
    >
      {selectedCriteriaScore && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          {selectedCriteriaScore.judgeName && (
            <p className="text-text-secondary text-sm mb-1">
              <span className="font-medium">Giám khảo:</span> {selectedCriteriaScore.judgeName}
            </p>
          )}
          {selectedCriteriaScore.submissionTitle && (
            <p className="text-text-secondary text-sm">
              <span className="font-medium">Submission:</span> {selectedCriteriaScore.submissionTitle}
            </p>
          )}
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="[&_.ant-form-item-label>label]:text-text-primary [&_.ant-input]:bg-white/5 [&_.ant-input]:border-white/10 [&_.ant-input]:text-white [&_.ant-input]:placeholder:text-gray-500 [&_.ant-textarea]:bg-white/5 [&_.ant-textarea]:border-white/10 [&_.ant-textarea]:text-white"
      >
        <Form.Item
          name="reason"
          label="Lý do phúc khảo"
          rules={[{ required: true, message: 'Vui lòng nhập lý do phúc khảo' }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Nhập lý do phúc khảo điểm..."
            className="bg-white/5 border-white/10 text-white"
          />
        </Form.Item>

        <Form.Item
          name="message"
          label="Nội dung chi tiết (tùy chọn)"
        >
          <Input.TextArea
            rows={4}
            placeholder="Nhập nội dung chi tiết về phúc khảo điểm..."
            className="bg-white/5 border-white/10 text-white"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ScoreAppealModal;

