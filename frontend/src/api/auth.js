// src/api/auth.js
import axiosInstance from './axiosInstance.js';

export const loginApi = async (credentials) => {
  const { data } = await axiosInstance.post('/auth/login', credentials);
  return data.data;
};

export const registerApi = async (userData) => {
  const { data } = await axiosInstance.post('/auth/register', userData);
  return data.data;
};

export const logoutApi = async () => {
  const { data } = await axiosInstance.post('/auth/logout');
  return data.data;
};

export const refreshApi = async () => {
  const { data } = await axiosInstance.post('/auth/refresh');
  return data.data;
};

export const getMeApi = async () => {
  const { data } = await axiosInstance.get('/auth/me');
  return data.data;
};
