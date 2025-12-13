import { Input, Modal } from 'antd';
import { useState, useEffect } from 'react';

const JoinTeamModal = ({ visible, onCancel, onSubmit, loading }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!visible) {
      setMessage('');
    }
  }, [visible]);

  const handleSubmit = () => {
    onSubmit(message || 'Tôi muốn tham gia đội của bạn');
  };

  return (
    <Modal
      title="Xin gia nhập đội"
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Gửi yêu cầu"
      cancelText="Hủy"
      confirmLoading={loading}
      className="[&_.ant-modal-content]:bg-darkv2-secondary [&_.ant-modal-header]:bg-darkv2-secondary [&_.ant-modal-title]:text-white [&_.ant-modal-close]:text-white/70 [&_.ant-modal-close]:hover:text-white [&_.ant-input]:bg-darkv2-primary [&_.ant-input]:text-white [&_.ant-input]:border-white/10 [&_.ant-input]:placeholder:text-gray-500 [&_.ant-input:focus]:border-green-500 [&_.ant-btn-primary]:bg-green-500 [&_.ant-btn-primary]:hover:bg-green-600 [&_.ant-btn-primary]:border-0"
    >
      <div className="space-y-4">
        <p className="text-gray-300 mb-4">
          Nhập lời nhắn để gửi yêu cầu tham gia đội (tùy chọn):
        </p>
        <Input.TextArea
          rows={4}
          placeholder="Ví dụ: Tôi muốn tham gia đội của bạn vì..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={500}
          showCount
          className="bg-darkv2-primary text-white border-white/10 placeholder:text-gray-500 focus:border-green-500"
        />
      </div>
    </Modal>
  );
};

export default JoinTeamModal;

