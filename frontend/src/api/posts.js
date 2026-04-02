// src/api/posts.js
import axiosInstance from './axiosInstance.js';

export const getFeedApi = async ({ cursor, limit = 20, category } = {}) => {
  const params = { limit };
  if (cursor) params.cursor = cursor;
  if (category) params.category = category;
  const { data } = await axiosInstance.get('/feed', { params });
  return data.data;
};

export const createPostApi = async (postData) => {
  const { data } = await axiosInstance.post('/posts', postData);
  return data.data;
};

export const getPostApi = async (id) => {
  const { data } = await axiosInstance.get(`/posts/${id}`);
  return data.data;
};

export const deletePostApi = async (id) => {
  const { data } = await axiosInstance.delete(`/posts/${id}`);
  return data.data;
};

export const likePostApi = async (id) => {
  const { data } = await axiosInstance.post(`/posts/${id}/like`);
  return data.data;
};

export const commentPostApi = async (id, content) => {
  const { data } = await axiosInstance.post(`/posts/${id}/comment`, { content });
  return data.data;
};

export const getCommentsApi = async (id, { cursor, limit = 20 } = {}) => {
  const params = { limit };
  if (cursor) params.cursor = cursor;
  const { data } = await axiosInstance.get(`/posts/${id}/comments`, { params });
  return data.data;
};

export const sharePostApi = async (id) => {
  const { data } = await axiosInstance.post(`/posts/${id}/share`);
  return data.data;
};

export const bookmarkPostApi = async (id) => {
  const { data } = await axiosInstance.post(`/posts/${id}/bookmark`);
  return data.data;
};

export const reportPostApi = async (id, reason) => {
  const { data } = await axiosInstance.post(`/posts/${id}/report`, { reason });
  return data.data;
};
