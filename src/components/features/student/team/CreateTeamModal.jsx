import { Button, Form, Input, Modal, Select, Spin } from 'antd';
import { useGetChapters } from '../../../../hooks/student/chapter';

const { Option } = Select;

const CreateTeamModal = ({
  visible,
  onCancel,
  onSubmit,
  loading = false,
  form,
}) => {
  const { data: chapters = [], isLoading: chaptersLoading } = useGetChapters();

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
          label={<span className="text-white">Tên đội</span>}
          name="teamName"
          rules={[{ required: true, message: 'Vui lòng nhập tên đội!' }]}
        >
          <Input placeholder="Nhập tên đội của bạn" />
        </Form.Item>

        <Form.Item
          label={<span className="text-white">Chapter</span>}
          name="chapterId"
          rules={[{ required: true, message: 'Vui lòng chọn chapter!' }]}
        >
          <Select 
            placeholder="Chọn chapter"
            loading={chaptersLoading}
            notFoundContent={chaptersLoading ? <Spin size="small" /> : 'Không có chapter nào'}
          >
            {chapters.map((chapter) => (
              <Option key={chapter.chapterId || chapter.id} value={chapter.chapterId || chapter.id}>
                {chapter.chapterName || chapter.name}
              </Option>
            ))}
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
