import { useState, useMemo } from 'react';
import {
  ConfigProvider,
  theme,
  Modal,
  Form,
  Input,
  Button,
  Space,
} from 'antd';
import { ExclamationCircleOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useChapters } from '../../hooks/chapter/useChapters';
import EntityTable from '../../components/ui/EntityTable.jsx';

const ChapterManagement = () => {
  const { fetchChapters, createChapter, updateChapter, deleteChapter } = useChapters();
  const { data: chaptersData = [], isLoading } = fetchChapters;
  
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, chapterId: null });

  // Table model configuration
  const tableModel = useMemo(() => ({
    entityName: 'chapter',
    rowKey: 'chapterId',
    createButton: {
      label: 'Tạo mới chapter',
      action: () => {
        setEditingChapter(null);
        form.resetFields();
        setIsModalOpen(true);
      },
      icon: true
    },
    columns: [
      {
        title: 'Tên chapter',
        dataIndex: 'chapterName',
        key: 'chapterName',
        type: 'text',
        className: 'font-medium text-white'
      },
      {
        title: 'Mô tả',
        dataIndex: 'description',
        key: 'description',
        type: 'text',
        className: 'text-gray-400',
        transform: (val) => val || '—'
      }
    ],
    actions: {
      view: false,
      edit: true,
      delete: true,
    }
  }), []);

  // Handlers for table actions
  const handlers = useMemo(() => ({
    onEdit: (record) => {
      setEditingChapter(record);
      form.setFieldsValue({
        chapterName: record.chapterName,
        description: record.description || '',
      });
      setIsModalOpen(true);
    },
    onDelete: (record) => {
      setConfirmModal({ open: true, chapterId: record.chapterId });
    },
  }), [form]);

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingChapter) {
        await updateChapter.mutateAsync({
          id: editingChapter.chapterId,
          ...values,
        });
      } else {
        await createChapter.mutateAsync(values);
      }
      
      setIsModalOpen(false);
      setEditingChapter(null);
      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingChapter(null);
    form.resetFields();
  };

  const handleConfirmOk = async () => {
    if (confirmModal.chapterId) {
      await deleteChapter.mutateAsync(confirmModal.chapterId);
      setConfirmModal({ open: false, chapterId: null });
    }
  };

  const handleConfirmCancel = () => {
    setConfirmModal({ open: false, chapterId: null });
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgContainer: '#111111',
          colorBorder: '#2f2f2f',
          colorText: '#ffffff',
          colorTextPlaceholder: '#9ca3af',
          colorPrimary: '#10b981',
          borderRadius: 6,
        },
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            Quản lý Chapter
          </h1>
          <p className="text-muted-foreground mt-2">
            Tạo, chỉnh sửa và xóa các chapter
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl p-6 shadow-md">
          <EntityTable
            model={tableModel}
            data={chaptersData}
            loading={isLoading}
            handlers={handlers}
            emptyText="Không có chapter nào"
          />
        </div>

        {/* Create/Edit Modal */}
        <Modal
          title={editingChapter ? 'Chỉnh sửa chapter' : 'Tạo mới chapter'}
          open={isModalOpen}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          okText={editingChapter ? 'Cập nhật' : 'Tạo mới'}
          cancelText="Hủy"
          confirmLoading={editingChapter ? updateChapter.isPending : createChapter.isPending}
          centered
        >
          <Form
            form={form}
            layout="vertical"
            className="mt-4"
          >
            <Form.Item
              label="Tên chapter"
              name="chapterName"
              rules={[
                { required: true, message: 'Vui lòng nhập tên chapter!' },
                { max: 255, message: 'Tên chapter không được vượt quá 255 ký tự!' }
              ]}
            >
              <Input placeholder="Nhập tên chapter" />
            </Form.Item>

            <Form.Item
              label="Mô tả"
              name="description"
              rules={[
                { max: 1000, message: 'Mô tả không được vượt quá 1000 ký tự!' }
              ]}
            >
              <Input.TextArea
                placeholder="Nhập mô tả (tùy chọn)"
                rows={4}
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          title="Xác nhận xóa"
          open={confirmModal.open}
          onOk={handleConfirmOk}
          onCancel={handleConfirmCancel}
          okText="Xóa"
          okButtonProps={{ danger: true }}
          cancelText="Hủy"
          confirmLoading={deleteChapter.isPending}
          centered
        >
          <div className="flex items-start gap-3">
            <ExclamationCircleOutlined className="text-yellow-500 text-xl mt-1" />
            <span>Bạn có chắc chắn muốn xóa chapter này không? Hành động này không thể hoàn tác.</span>
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default ChapterManagement;

