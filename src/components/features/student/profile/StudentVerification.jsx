import {
  IdcardOutlined,
  CheckCircleOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Row,
  Form,
  Input,
  Upload,
  message,
  Alert,
} from 'antd';
import { useState } from 'react';
import { useSubmitVerification } from '../../../../hooks/student/verify';

const StudentVerification = ({ verificationStatus, setVerificationStatus }) => {
  const [verificationForm] = Form.useForm();
  const [frontCardImage, setFrontCardImage] = useState(null);
  const [backCardImage, setBackCardImage] = useState(null);

  const submitVerificationMutation = useSubmitVerification();

  const handleVerificationSubmit = async (values) => {
    try {
      const verificationData = {
        universityName: values.universityName,
        studentCode: values.studentCode,
        fullName: values.fullName,
        major: values.major,
        yearOfAdmission: values.yearOfAdmission,
        frontCardImage: frontCardImage,
        backCardImage: backCardImage,
      };

      await submitVerificationMutation.mutateAsync(verificationData);
      message.success('Đơn xác minh đã được gửi thành công!');
      setVerificationStatus('pending');
      verificationForm.resetFields();
      setFrontCardImage(null);
      setBackCardImage(null);
    } catch (error) {
      message.error('Có lỗi xảy ra khi gửi đơn xác minh. Vui lòng thử lại.');
      console.error('Verification submission error:', error);
    }
  };

  const handleImageUpload = (file, type) => {
    if (file && file.type.startsWith('image/')) {
      if (type === 'front') {
        setFrontCardImage(file);
      } else {
        setBackCardImage(file);
      }
      return false; // Prevent automatic upload
    }
    message.error('Chỉ cho phép tải lên file hình ảnh!');
    return true; // Prevent upload
  };

  const getVerificationStatusDisplay = () => {
    switch (verificationStatus) {
      case 'verified':
        return (
          <Alert
            message="Đã xác minh"
            description="Tài khoản của bạn đã được xác minh thành công."
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
            className="mb-6"
          />
        );
      case 'pending':
        return (
          <Alert
            message="Đang chờ xác minh"
            description="Đơn xác minh của bạn đang được xem xét. Vui lòng đợi phản hồi từ admin."
            type="warning"
            showIcon
            icon={<ExclamationCircleOutlined />}
            className="mb-6"
          />
        );
      default:
        return (
          <Alert
            message="Chưa xác minh"
            description="Bạn cần xác minh thông tin sinh viên để tham gia đầy đủ các hoạt động."
            type="info"
            showIcon
            icon={<IdcardOutlined />}
            className="mb-6"
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {getVerificationStatusDisplay()}

      {verificationStatus !== 'verified' && (
        <Card className="bg-card-background border border-card-border backdrop-blur-xl">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Xác minh thông tin sinh viên
          </h3>
          <p className="text-muted-foreground mb-6">
            Vui lòng cung cấp thông tin chính xác để xác minh tài khoản sinh
            viên của bạn.
          </p>

          <Form
            form={verificationForm}
            layout="vertical"
            onFinish={handleVerificationSubmit}
            className="space-y-4"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tên trường đại học"
                  name="universityName"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập tên trường đại học!',
                    },
                  ]}
                >
                  <Input placeholder="Ví dụ: Đại học FPT" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Mã số sinh viên"
                  name="studentCode"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập mã số sinh viên!',
                    },
                  ]}
                >
                  <Input placeholder="Ví dụ: SE123456" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Họ và tên đầy đủ"
                  name="fullName"
                  rules={[
                    { required: true, message: 'Vui lòng nhập họ và tên!' },
                  ]}
                >
                  <Input placeholder="Ví dụ: Nguyễn Văn A" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Chuyên ngành"
                  name="major"
                  rules={[
                    { required: true, message: 'Vui lòng nhập chuyên ngành!' },
                  ]}
                >
                  <Input placeholder="Ví dụ: Kỹ thuật phần mềm" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Năm nhập học"
              name="yearOfAdmission"
              rules={[
                { required: true, message: 'Vui lòng nhập năm nhập học!' },
              ]}
            >
              <Input type="number" placeholder="Ví dụ: 2023" />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-text-secondary mb-2">
                  Ảnh thẻ sinh viên (mặt trước)
                </label>
                <Upload
                  beforeUpload={(file) => handleImageUpload(file, 'front')}
                  showUploadList={false}
                  accept="image/*"
                >
                  <div className="border-2 border-dashed border-card-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    {frontCardImage ? (
                      <div className="space-y-2">
                        <CheckCircleOutlined className="text-green-400 text-2xl" />
                        <p className="text-green-400">Đã tải lên mặt trước</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <UploadOutlined className="text-muted-foreground text-2xl" />
                        <p className="text-muted-foreground">
                          Tải lên ảnh mặt trước
                        </p>
                      </div>
                    )}
                  </div>
                </Upload>
              </div>

              <div>
                <label className="block text-text-secondary mb-2">
                  Ảnh thẻ sinh viên (mặt sau)
                </label>
                <Upload
                  beforeUpload={(file) => handleImageUpload(file, 'back')}
                  showUploadList={false}
                  accept="image/*"
                >
                  <div className="border-2 border-dashed border-card-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    {backCardImage ? (
                      <div className="space-y-2">
                        <CheckCircleOutlined className="text-green-400 text-2xl" />
                        <p className="text-green-400">Đã tải lên mặt sau</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <UploadOutlined className="text-muted-foreground text-2xl" />
                        <p className="text-muted-foreground">
                          Tải lên ảnh mặt sau
                        </p>
                      </div>
                    )}
                  </div>
                </Upload>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-6">
              <p className="text-yellow-200 text-sm">
                <ExclamationCircleOutlined className="mr-2" />
                Lưu ý: Ảnh thẻ sinh viên phải rõ nét, không bị mờ hoặc cắt xén.
                Đơn xác minh sẽ được xem xét trong vòng 1-3 ngày làm việc.
              </p>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={submitVerificationMutation.isPending}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0"
              icon={<IdcardOutlined />}
            >
              {submitVerificationMutation.isPending
                ? 'Đang gửi...'
                : 'Gửi xác minh'}
            </Button>
          </Form>
        </Card>
      )}

      {verificationStatus === 'verified' && (
        <Card className="bg-card-background border border-card-border backdrop-blur-xl">
          <div className="text-center space-y-4">
            <CheckCircleOutlined className="text-green-400 text-4xl" />
            <div>
              <h3 className="text-lg font-semibold text-green-400">
                Xác minh thành công!
              </h3>
              <p className="text-muted-foreground">
                Tài khoản của bạn đã được xác minh và có thể tham gia đầy đủ các
                hoạt động.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentVerification;
