import { GoogleLogin } from '@react-oauth/google';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../constants';
import { loginGoogle } from '../../services/auth';
import { notify } from '../../utils/index';

function Login() {
  const navigate = useNavigate();

  const { mutate: mutateLoginGoogle } = useMutation({
    mutationFn: loginGoogle,
    onSuccess: (res) => {
      notify('success', { description: 'Đăng nhập thành công' });

      const accessToken = res?.data?.accessToken;
      const refreshToken = res?.data?.refreshToken;

      if (accessToken && refreshToken) {
        Cookies.set('accessToken', accessToken);
        Cookies.set('refreshToken', refreshToken);
        const decoded = jwtDecode(accessToken);
        const role = decoded['role'];
        if (role === 'ADMIN') {
          navigate(PATH_NAME.ADMIN_DASHBOARD);
        } else {
          navigate(PATH_NAME.HOME);
        }
      }
    },
    onError: (err) => {
      if (err && err.status === 401) {
        notify('error', { description: 'Thông tin đăng nhập không hợp lệ' });
        return;
      }
      notify('error', { description: 'Lỗi hệ thống' });
    },
  });

  return (
    <GoogleLogin
      text="signin_with"
      theme="outline"
      size="large"
      width="100%"
      onSuccess={(credentialResponse) => {
        mutateLoginGoogle(credentialResponse?.credential);
      }}
      onError={() => {
        console.log('Login Failed');
      }}
    />
  );
}

export default Login;
