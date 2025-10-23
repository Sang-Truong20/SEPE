import { Button, Form, Input, Modal, Select } from 'antd';

const { Option } = Select;

const CreateTeamModal = ({
  visible,
  onCancel,
  onSubmit,
  loading = false,
  form,
}) => {
  return (
    <Modal
      title="Tạo đội mới"
      open={visible}
      onCancel={onCancel}
      footer={null}
      className="[&_.ant-modal-content]:bg-gray-900/95 [&_.ant-modal-content]:backdrop-blur-xl [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white [&_.ant-modal-mask]:bg-black/50"
    >
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item
          label="Tên đội"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên đội!' }]}
        >
          <Input placeholder="Nhập tên đội của bạn" />
        </Form.Item>

        <Form.Item
          label="Hackathon"
          name="hackathon"
          rules={[{ required: true, message: 'Vui lòng chọn hackathon!' }]}
        >
          <Select placeholder="Chọn hackathon">
            <Option value="ai-revolution">AI Revolution 2024</Option>
            <Option value="web3-hackathon">Web3 Future Hackathon</Option>
            <Option value="green-tech">Green Tech Challenge</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Mô tả đội" name="description">
          <Input.TextArea
            rows={3}
            placeholder="Mô tả về đội và dự án của bạn..."
          />
        </Form.Item>

        <Form.Item label="Kỹ năng cần thiết" name="skills">
          <Select
            mode="multiple"
            placeholder="Chọn các kỹ năng cần thiết"
            style={{ width: '100%' }}
          >
            <Option value="python">Python</Option>
            <Option value="javascript">JavaScript</Option>
            <Option value="react">React</Option>
            <Option value="nodejs">Node.js</Option>
            <Option value="machine-learning">Machine Learning</Option>
            <Option value="blockchain">Blockchain</Option>
            <Option value="mobile">Mobile Development</Option>
            <Option value="ui/ux">UI/UX Design</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={onCancel}>Hủy</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 border-0"
            >
              {loading ? 'Đang tạo...' : 'Tạo đội'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTeamModal;
