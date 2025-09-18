import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  SafetyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Checkbox, Form, Input } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../../services/auth';

function Login({ onSwitchToLogin }) {
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword((prev) => !prev);

  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate('/');
    },
    onError: (err) => {
      console.error('err', err);
    },
  });

  const handleSubmit = async (values) => {
    loginMutate(values);
  };

  return (
    <div className="bg-white relative rounded-2xl shadow-xl p-8 md:p-10">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-green-600 rounded-b-full" />
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <SafetyOutlined className="text-3xl text-green-900" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
        <p className="text-gray-600">
          Hệ thống Quản lý Cuộc thi SEAL Hackathon
        </p>
        <p
          onClick={() => navigate('/')}
          className="mt-2 text-green-600 hover:text-green-800 cursor-pointer font-medium transition-colors"
        >
          Quay về trang chủ
        </p>
      </div>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{ rememberMe: false }}
        requiredMark={false}
      >
        <Form.Item
          name="usernameOrEmail"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập email hoặc số điện thoại!',
            },
            { min: 8, message: 'Tối thiểu 8 ký tự' },
          ]}
          className="mb-7"
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Email hoặc số điện thoại"
            autoFocus
            size="large"
            className="!py-3 !px-4 !text-base !rounded-lg"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { min: 8, message: 'Mật khẩu tối thiểu 8 ký tự' },
          ]}
          className="mb-2"
        >
          <Input
            prefix={<LockOutlined className="text-gray-400" />}
            type={showPassword ? 'text' : 'password'}
            placeholder="Mật khẩu"
            size="large"
            className="!py-3 !px-4 !text-base !rounded-lg"
            suffix={
              <button
                type="button"
                onClick={togglePassword}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </button>
            }
          />
        </Form.Item>
        <div className="flex items-center justify-between mb-6">
          <Form.Item name="rememberMe" valuePropName="checked" noStyle>
            <Checkbox className="text-gray-600">Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>
          <Link
            to="/forgot-password"
            className="text-primary hover:text-primary hover:underline text-sm font-medium transition-colors"
          >
            Quên mật khẩu?
          </Link>
        </div>
        <Button
          type="primary"
          htmlType="submit"
          loading={isPending}
          className="w-full !h-12 !text-base !font-semibold !border-0 !rounded-lg"
          size="large"
        >
          Đăng nhập
        </Button>
        <div className="mt-4 flex items-center justify-center text-center">
          <div className="mr-2 h-[1px] w-full bg-[#e6e8eb]"></div>
          <span className="text-[#999999]">hoặc</span>
          <div className="ml-2 h-[1px] w-full bg-[#e6e8eb]"></div>
        </div>
        <Button className="mx-auto mt-5 block !h-12 w-full rounded-[5px] border border-gray-300 bg-[#fff] text-[grey] shadow-none hover:!border-primary hover:!bg-transparent hover:!text-primary">
          <div className="flex items-center justify-center tracking-wider">
            <img
              src="https://freesvg.org/img/1534129544.png"
              width={30}
              height={30}
              alt=""
              className="mr-2"
            />
            Tiếp tục với Google
          </div>
        </Button>

        <div className="text-center mt-6">
          <span className="text-gray-600">Bạn chưa có tài khoản? </span>
          <Link
            className="text-primary hover:underline hover:text-primary font-semibold transition-colors"
            onClick={onSwitchToLogin}
          >
            Đăng ký ngay
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default Login;
