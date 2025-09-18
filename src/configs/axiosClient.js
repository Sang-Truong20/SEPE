import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  },
);

export default axiosClient;
