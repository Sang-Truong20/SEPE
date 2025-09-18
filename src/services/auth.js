import axiosClient from '../configs/axiosClient';

const login = (payload) => {
  return axiosClient.post(`/login`);
};
const register = (payload) => {
  return axiosClient.post(`/register`);
};

export { login, register };
