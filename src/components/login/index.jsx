import { GoogleLogin } from '@react-oauth/google';
import { useMutation } from '@tanstack/react-query';
import { message, Form, Input, Button, Divider } from 'antd';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { PATH_NAME } from '../../constants';
import { loginGoogle, login } from '../../services/auth';
import { notify } from '../../utils/index';
import useLoadingStore from '../../store/loadingStore';

function Login() {
  const { showLoading, hideLoading } = useLoadingStore();
  const [form] = Form.useForm();

  const handleLoginSuccess = (res) => {
    notify('success', { description: 'Đăng nhập thành công' });
    console.log('check res', res);

    const accessToken = res?.data?.accessToken;
    const refreshToken = res?.data?.refreshToken;

    if (accessToken && refreshToken) {
      Cookies.set('accessToken', accessToken);
      Cookies.set('refreshToken', refreshToken);
      const decoded = jwtDecode(accessToken);
      console.log('check decoded', decoded);
      const role =
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      console.log('check role', role);

      // Giữ spinner hiển thị trong khi chuyển trang
      if (role === 'Admin') {
        window.location.href = PATH_NAME.ADMIN;
      } else if (role === 'Partner') {
        window.location.href = PATH_NAME.PARTNER;
      } else if (role === 'Judge') {
        window.location.href = PATH_NAME.JUDGE;
      } else if (role === 'Member') {
        window.location.href = PATH_NAME.STUDENT;
      } else if (role === 'Mentor') {
        window.location.href = PATH_NAME.MENTOR;
      } else if (role === 'ChapterLeader') {
        window.location.href = PATH_NAME.CHAPTER;
      } else {
        window.location.href = PATH_NAME.HOME;
      }
    }
  };

  const handleLoginError = (err) => {
    hideLoading(); // Tắt spinner khi có lỗi
    if (err && err.status === 401) {
      message.error('Thông tin đăng nhập không hợp lệ');
      return;
    }
    message.error('Lỗi hệ thống');
  };

  const { mutate: mutateLoginGoogle } = useMutation({
    mutationFn: loginGoogle,
    onSuccess: handleLoginSuccess,
    onError: handleLoginError,
  });

  const { mutate: mutateLogin, isPending: isLoginPending } = useMutation({
    mutationFn: login,
    onSuccess: handleLoginSuccess,
    onError: handleLoginError,
  });

  const onFinish = (values) => {
    showLoading();
    mutateLogin({ email: values.email, password: values.password });
  };

  return (
    <div className="w-full space-y-6">
      {/* Form Login bình thường */}
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="space-y-4"
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập email',
            },
            {
              type: 'email',
              message: 'Email không hợp lệ',
            },
          ]}
        >
          <Input
            type="email"
            placeholder="Nhập email của bạn"
            size="large"
            className="
    bg-white/5 h-12 border-white/20 text-white
    hover:border-green-500 focus:border-green-500
    [&::placeholder]:!text-gray-400
  "
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              borderRadius: '8px',
            }}
            styles={{
              input: {
                color: 'white',
              },
            }}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu',
            },
          ]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu"
            size="large"
            className="bg-white/5 h-12 border-white/20 text-white hover:border-green-500 focus:border-green-500 [&_input::placeholder]:!text-gray-400"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              borderRadius: '8px',
            }}
            styles={{
              input: {
                color: 'white',
              },
            }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isLoginPending}
            className="w-full h-12 bg-green-500 hover:bg-green-600 border-none font-semibold"
            style={{
              borderRadius: '8px',
            }}
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>

      <Divider className="!border-white/20 !text-gray-400">Hoặc</Divider>

      {/* Google Login */}
      <div className="flex justify-center">
        <GoogleLogin
          text="signin_with"
          theme="outline"
          size="large"
          width="400px"
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
            showLoading();
            mutateLoginGoogle({ token: credentialResponse?.credential });
          }}
          onError={() => {
            console.log('Login Failed');
            hideLoading();
          }}
        />
      </div>
    </div>
  );
}

export default Login;
