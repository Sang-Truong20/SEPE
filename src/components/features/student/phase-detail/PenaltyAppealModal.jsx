import { Form, Input, Modal, Tag } from 'antd';
import React from 'react';

const PenaltyAppealModal = ({
  visible,
  onClose,
  onSubmit,
  selectedPenalty,
  form,
  loading,
}) => {
  return (
    <Modal
      title="Kháng cáo Penalty"
      open={visible}
      onOk={() => form.submit()}
      onCancel={onClose}
      okText="Gửi kháng cáo"
      cancelText="Hủy"
      okButtonProps={{
        loading: loading,
        className: 'bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white border-0',
      }}
      width={600}
      className="[&_.ant-modal-content]:bg-gray-900/95 [&_.ant-modal-content]:backdrop-blur-xl [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white [&_.ant-modal-mask]:bg-black/50"
    >
      {selectedPenalty && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-400 font-semibold">
              {selectedPenalty.type === 'late_submission' && 'Nộp bài muộn'}
              {selectedPenalty.type === 'rule_violation' && 'Vi phạm quy tắc'}
              {selectedPenalty.type === 'abandonment' && 'Bỏ thi giữa chừng'}
              {!selectedPenalty.type && 'Penalty'}
            </span>
            <Tag color="red" size="small">
              -{Math.abs(selectedPenalty.points || selectedPenalty.penaltyPoints || 0)} điểm
            </Tag>
          </div>
          {selectedPenalty.reason && (
            <p className="text-text-secondary text-sm">
              <span className="font-medium">Lý do penalty:</span> {selectedPenalty.reason}
            </p>
          )}
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        className="[&_.ant-form-item-label>label]:text-text-primary [&_.ant-input]:bg-white/5 [&_.ant-input]:border-white/10 [&_.ant-input]:text-white [&_.ant-input]:placeholder:text-gray-500 [&_.ant-textarea]:bg-white/5 [&_.ant-textarea]:border-white/10 [&_.ant-textarea]:text-white"
      >
        <Form.Item
          name="reason"
          label="Lý do kháng cáo"
          rules={[{ required: true, message: 'Vui lòng nhập lý do kháng cáo' }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Nhập lý do kháng cáo..."
            className="bg-white/5 border-white/10 text-white"
          />
        </Form.Item>

        <Form.Item
          name="message"
          label="Nội dung chi tiết (tùy chọn)"
        >
          <Input.TextArea
            rows={4}
            placeholder="Nhập nội dung chi tiết về kháng cáo..."
            className="bg-white/5 border-white/10 text-white"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PenaltyAppealModal;

