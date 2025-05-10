import axios, {InternalAxiosRequestConfig} from 'axios';
// import type { InternalAxiosRequestConfig } from 'axios'; 
import { useAuthStore } from '../stores/auth';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore();

    if (authStore.token) {
      config.headers = config.headers || {};
      config.headers.set('Authorization', `Bearer ${authStore.token}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { api };