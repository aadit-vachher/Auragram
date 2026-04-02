// src/api/events.js
import axiosInstance from './axiosInstance.js';

export const submitEventApi = async (eventData) => {
  const { data } = await axiosInstance.post('/events', eventData);
  return data.data;
};
