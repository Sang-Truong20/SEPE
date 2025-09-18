import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  MailOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Link } from 'react-router-dom';

function Register({ onSwitchToLogin }) {
  const recaptchaSiteKey = import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY || '';
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const onCaptchaChange = (value) => {
    if (value) {
      setCaptchaVerified(true);
    } else {
      setCaptchaVerified(false);
    }
  };

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async (values) => {
    setLoading(true);

    if (!captchaVerified) {
      toast.message('warning', 'Vui lòng xác nhận reCAPTCHA', 3);
      return;
    }
    setTimeout(() => {
      console.log('Register data:', values);
      setLoading(false);
      onSwitchToLogin();
    }, 1500);
  };

  return (
    <div className="bg-white relative rounded-2xl shadow-xl p-8 md:p-10">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-green-600 rounded-b-full" />

      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <UserAddOutlined className="text-3xl text-green-900" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng ký</h1>
        <p className="text-gray-600">
          Chào mừng đến với Hệ thống Quản lý SEAL Hackathon FPT
        </p>
      </div>

      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        scrollToFirstError
      >
        <Form.Item
          name="fullname"
          rules={[
            { required: true, message: 'Vui lòng nhập họ và tên!' },
            { min: 3, message: 'Họ và tên tối thiểu 3 ký tự' },
            {
              pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
              message: 'Họ và tên chỉ được chứa chữ cái và khoảng trắng',
            },
          ]}
          className="[&_.ant-form-item-explain]:text-left"
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Họ và tên"
            autoFocus
            size="large"
            className="!py-3 !px-4 !text-base !rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="usernameOrEmail"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tên đăng nhập hoặc email!',
            },
            { min: 8, message: 'Tên đăng nhập tối thiểu 8 ký tự' },
            {
              pattern: /^[a-zA-Z0-9._@]+$/,
              message: 'Tên đăng nhập chỉ được chứa chữ cái, số và ký tự . _ @',
            },
          ]}
          className="[&_.ant-form-item-explain]:text-left"
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Tên đăng nhập hoặc Email"
            size="large"
            className="!py-3 !px-4 !text-base !rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { min: 8, message: 'Mật khẩu tối thiểu 8 ký tự' },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
              message:
                'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
            },
          ]}
          className="[&_.ant-form-item-explain]:text-left"
        >
          <Input
            prefix={<LockOutlined />}
            type={showPassword ? 'text' : 'password'}
            placeholder="Mật khẩu"
            size="large"
            className="!py-3 !px-4 !text-base !rounded-lg"
            suffix={
              <div onClick={togglePassword} className="cursor-pointer">
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </div>
            }
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Mật khẩu xác nhận không khớp!'),
                );
              },
            }),
          ]}
          className="[&_.ant-form-item-explain]:text-left"
        >
          <Input
            prefix={<LockOutlined />}
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Xác nhận mật khẩu"
            size="large"
            className="!py-3 !px-4 !text-base !rounded-lg"
            suffix={
              <div onClick={toggleConfirmPassword} className="cursor-pointer">
                {showConfirmPassword ? (
                  <EyeInvisibleOutlined />
                ) : (
                  <EyeOutlined />
                )}
              </div>
            }
          />
        </Form.Item>
        <div className="mb-3 flex w-full max-w-[300px] justify-start">
          <ReCAPTCHA sitekey={recaptchaSiteKey} onChange={onCaptchaChange} />
        </div>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="w-full flex justify-center items-center !h-12 !text-lg !font-semibold !border-0 !rounded-lg"
          size="large"
        >
          Đăng ký
        </Button>

        <div className="text-center mt-6">
          <span className="text-gray-600">Đã có tài khoản? </span>
          <Link
            className="text-primary hover:underline hover:text-primary font-semibold transition-colors"
            onClick={onSwitchToLogin}
          >
            Đăng nhập ngay
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default Register;
