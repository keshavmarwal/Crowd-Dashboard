import axios from 'axios';
import { tokenStorage } from '../utils/tokenStorage';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://hiring-dev.internal.kloudspot.com',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});


let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};


client.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const isLoginCall = error.config?.url?.includes('/api/auth/login');
    if (status === 401 && !isLoginCall && onUnauthorized) onUnauthorized();
    return Promise.reject(error);
  }
);

export default client;
