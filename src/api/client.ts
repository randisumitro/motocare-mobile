import axios, { AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://staging-api.motocare.id/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 400) return 'Request tidak valid';
    if (status === 401) return 'Session berakhir';
    if (status === 403) return 'Tidak memiliki akses';
    if (status === 404) return 'Data tidak ditemukan';
    if (status === 422) return error.response?.data?.message || 'Periksa input';
    if (status === 429) return 'Terlalu banyak request';
    if (status && status >= 500) return 'Server mengalami masalah';
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') return 'Periksa koneksi internet';
  }
  return 'Terjadi kesalahan tidak terduga';
};
