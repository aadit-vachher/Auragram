// src/api/leaderboard.js
import axiosInstance from './axiosInstance.js';

export const getGlobalLeaderboardApi = async (limit = 100) => {
  const { data } = await axiosInstance.get('/leaderboard/global', { params: { limit } });
  return data.data;
};

export const getCategoryLeaderboardApi = async (category, limit = 100) => {
  const { data } = await axiosInstance.get(`/leaderboard/category/${category}`, { params: { limit } });
  return data.data;
};

export const getMyRankApi = async () => {
  const { data } = await axiosInstance.get('/leaderboard/me/rank');
  return data.data;
};
