import axiosClient from '../configs/axiosClient';

const loginGoogle = (payload) => {
  return axiosClient.post(`/Auth/google-login`, payload);
};

const logout = () => {
  return axiosClient.post(`/Auth/logout`);
};

const refreshToken = (payload) => {
  return axiosClient.post(`/Auth/refresh-token`, payload);
};

export { loginGoogle, logout, refreshToken };
