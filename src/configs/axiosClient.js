import axios from 'axios';
import Cookies from 'js-cookie';
import { callRefreshToken } from '../services/auth';
import { performLogout } from '../hooks/useLogout';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get('refreshToken');

      if (refreshToken) {
        try {
          const res = await callRefreshToken(refreshToken);
          if (res?.status === 200) {
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data;

            Cookies.set("accessToken", newAccessToken);
            if (newRefreshToken) Cookies.set("refreshToken", newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            axiosClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

            return axiosClient(originalRequest);
          }
        } catch (refreshError) {
          console.error("Refresh token failed", refreshError);
          performLogout(); // ← Gọi hàm thuần, không dùng hook
          return Promise.reject(refreshError);
        }
      } else {
        performLogout();
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;