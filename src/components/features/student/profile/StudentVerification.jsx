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
  Image,
} from 'antd';
import { useState, useEffect } from 'react';
import { useSubmitVerification } from '../../../../hooks/student/verify';

const StudentVerification = ({ verificationStatus, setVerificationStatus, refetchVerification, verificationData }) => {
  const [verificationForm] = Form.useForm();
  const [frontCardImage, setFrontCardImage] = useState(null);
  const [backCardImage, setBackCardImage] = useState(null);

  const submitVerificationMutation = useSubmitVerification();

  // Check if user is already verified
  const isVerified = verificationStatus === 'verified';

  const handleVerificationSubmit = async (values) => {
    // Prevent submission if user is already verified
    if (isVerified) {
      message.warning('Bạn đã được xác minh rồi, không thể gửi đơn xác minh mới.');
      return;
    }

    try {
      const verificationData = {
        universityName: values.universityName,
        studentCode: values.studentCode,
        fullName: values.fullName,
        major: values.major,
        yearOfAdmission: values.yearOfAdmission,
        frontCardImage: frontCardImage,
        backCardImage: backCardImage,
        isVerified: isVerified, // Pass isVerified to prevent submission in hook
      };

      await submitVerificationMutation.mutateAsync(verificationData);
      message.success('Đơn xác minh đã được gửi thành công!');
      setVerificationStatus('pending');
      verificationForm.resetFields();
      setFrontCardImage(null);
      setBackCardImage(null);
      // Refetch verification data to update status
      if (refetchVerification) {
        refetchVerification();
      }
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
            description="Đơn xác minh của bạn đang được xem xét. Vui lòng đợi phản hồi từ chapter."
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

      {!isVerified && verificationStatus !== 'verified' && (
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
              disabled={isVerified}
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

      {(verificationStatus === 'verified' || verificationStatus === 'pending') && verificationData?.hasSubmitted && verificationData?.data && (
        <Card className="bg-card-background border border-card-border backdrop-blur-xl">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Thông tin đã nộp để xác minh
          </h3>
          <Form
            layout="vertical"
            className="space-y-4"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tên trường đại học"
                >
                  <Input 
                    value={verificationData.data.universityName} 
                    readOnly 
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Mã số sinh viên"
                >
                  <Input 
                    value={verificationData.data.studentCode} 
                    readOnly 
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Họ và tên đầy đủ"
                >
                  <Input 
                    value={verificationData.data.fullName} 
                    readOnly 
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Chuyên ngành"
                >
                  <Input 
                    value={verificationData.data.major} 
                    readOnly 
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Năm nhập học"
            >
              <Input 
                type="number"
                value={verificationData.data.yearOfAdmission} 
                readOnly 
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-text-secondary mb-2">
                  Ảnh thẻ sinh viên (mặt trước)
                </label>
                {verificationData.data.frontCardImage ? (
                  <div className="border border-card-border rounded-lg p-2 bg-slate-800/30">
                    <Image
                      src={verificationData.data.frontCardImage}
                      alt="Mặt trước thẻ sinh viên"
                      className="w-full rounded"
                      preview={{
                        mask: 'Xem ảnh',
                      }}
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-card-border rounded-lg p-6 text-center bg-slate-800/30">
                    <p className="text-muted-foreground">Chưa có ảnh</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-text-secondary mb-2">
                  Ảnh thẻ sinh viên (mặt sau)
                </label>
                {verificationData.data.backCardImage ? (
                  <div className="border border-card-border rounded-lg p-2 bg-slate-800/30">
                    <Image
                      src={verificationData.data.backCardImage}
                      alt="Mặt sau thẻ sinh viên"
                      className="w-full rounded"
                      preview={{
                        mask: 'Xem ảnh',
                      }}
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-card-border rounded-lg p-6 text-center bg-slate-800/30">
                    <p className="text-muted-foreground">Chưa có ảnh</p>
                  </div>
                )}
              </div>
            </div>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default StudentVerification;
