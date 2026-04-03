// src/hooks/useLeaderboard.js
// Hook for leaderboard data with socket live updates
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGlobalLeaderboard, fetchCategoryLeaderboard, fetchMyRank } from '../store/leaderboardSlice.js';
import { useSocketContext } from '../context/SocketContext.jsx';

/**
 * Hook for leaderboard data with joining the real-time socket room.
 * @param {string} [category]
 */
export function useLeaderboard(category) {
  const dispatch = useDispatch();
  const { joinLeaderboard, leaveLeaderboard } = useSocketContext() || {};
  const { global: globalBoard, byCategory, myRank, loading } = useSelector((s) => s.leaderboard);

  useEffect(() => {
    dispatch(fetchGlobalLeaderboard());
    if (category) dispatch(fetchCategoryLeaderboard(category));
  }, [category]);

  useEffect(() => {
    joinLeaderboard?.();
    return () => leaveLeaderboard?.();
  }, []);

  return {
    global: globalBoard,
    category: category ? (byCategory[category] || []) : [],
    myRank,
    loading,
  };
}

export default useLeaderboard;
