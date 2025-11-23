import axios from 'axios';
import Cookies from 'js-cookie';
import { callRefreshToken } from '../services/auth';
import { useLogout } from '../hooks/useLogout';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "https://sealfall25.somee.com/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const logout = useLogout();

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get('refreshToken');

      if (refreshToken) {
        try {
          const res = await callRefreshToken(refreshToken);

          if (res && res.status === 200) {
            const newAccessToken = res.data.accessToken;
            const newRefreshToken = res.data.refreshToken;

            Cookies.set('accessToken', newAccessToken);
            Cookies.set('refreshToken', newRefreshToken);

            originalRequest.headers['Authorization'] =
              `Bearer ${newAccessToken}`;
            axiosClient.defaults.headers.common['Authorization'] =
              `Bearer ${newAccessToken}`;

            return axiosClient(originalRequest);
          }
        } catch (error) {
          console.error('err', error);
          logout();
        }
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
