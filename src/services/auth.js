import axiosClient from '../configs/axiosClient';

const loginGoogle = (payload) => {
  return axiosClient.post(`/Auth/google-login`, payload);
};

const login = (payload) => {
  return axiosClient.post(`/Auth/login`, payload);
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

export { loginGoogle, login, logout, callRefreshToken, getMe };
