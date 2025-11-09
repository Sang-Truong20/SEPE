import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { PATH_NAME } from '../../constants';
import { loginGoogle } from '../../services/auth';
import { notify } from '../../utils/index';

function Login() {
  // const navigate = useNavigate();

  const { mutate: mutateLoginGoogle } = useMutation({
    mutationFn: loginGoogle,
    onSuccess: (res) => {
      notify('success', { description: 'Đăng nhập thành công' });
      console.log('check res', res);

      const accessToken = res?.data?.accessToken;
      const refreshToken = res?.data?.refreshToken;

      if (accessToken && refreshToken) {
        Cookies.set('accessToken', accessToken);
        Cookies.set('refreshToken', refreshToken);
        const decoded = jwtDecode(accessToken);
        console.log('chec decoded', decoded);
        const role =
          decoded[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ];
        console.log('check role', role);
        if (role === 'Admin') {
          // navigate(PATH_NAME.ADMIN_DASHBOARD);
          window.location.href = PATH_NAME.ADMIN_DASHBOARD;
        } else {
          // navigate(PATH_NAME.HOME);
          window.location.reload();
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

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
  });

  return (
    <GoogleLogin
      text="signin_with"
      theme="outline"
      size="large"
      width="100%"
      onSuccess={(credentialResponse) => {
        console.log(credentialResponse);
        mutateLoginGoogle({ token: credentialResponse?.credential });
      }}
      onError={() => {
        console.log('Login Failed');
      }}
    />
  );
}

export default Login;
