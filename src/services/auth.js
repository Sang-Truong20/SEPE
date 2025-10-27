import axiosClient from '../configs/axiosClient';

const loginGoogle = (payload) => {
  return axiosClient.post(`/Auth/google-login-Test-BE`, payload);
};

const getMe = () => {
  return axiosClient.get(`/Auth/me`);
};

const logout = () => {
  return axiosClient.post(`/Auth/logout`);
};

const callRefreshToken = (payload) => {
  return axiosClient.post(`/Auth/refresh-token`, payload);
};

export { loginGoogle, logout, callRefreshToken, getMe };
