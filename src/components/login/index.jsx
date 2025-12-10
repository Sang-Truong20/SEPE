import { GoogleLogin } from '@react-oauth/google';
import { useMutation } from '@tanstack/react-query';
import { message, Spin } from 'antd';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { PATH_NAME } from '../../constants';
import { loginGoogle } from '../../services/auth';
import { notify } from '../../utils/index';
import { useLoading } from '../../context/LoadingContext.jsx';

function Login() {
  const { showLoading, hideLoading } = useLoading();

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
        console.log('check decoded', decoded);
        const role =
          decoded[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
            ];
        console.log('check role', role);

        // Giữ spinner hiển thị trong khi chuyển trang
        if (role === 'Admin') {
          window.location.href = PATH_NAME.ADMIN;
        }
        else if (role === 'Partner') {
          window.location.href = PATH_NAME.PARTNER;
        }
        else if (role === 'Judge') {
          window.location.href = PATH_NAME.JUDGE;
        }
        else {
          window.location.href = PATH_NAME.HOME;
        }
      }
    },
    onError: (err) => {
      hideLoading(); // Tắt spinner khi có lỗi
      if (err && err.status === 401) {
        message('error', { description: 'Thông tin đăng nhập không hợp lệ' });
        return;
      }
      message('error', { description: 'Lỗi hệ thống' });
    },
  });

  return (
    <>
      <GoogleLogin
        text="signin_with"
        theme="outline"
        size="large"
        width="400px"
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
          showLoading() ;// Bật spinner
          mutateLoginGoogle({ token: credentialResponse?.credential });
        }}
        onError={() => {
          console.log('Login Failed');
          hideLoading();
        }}
      />
    </>
  );
}

export default Login;