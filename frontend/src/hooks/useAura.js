// src/hooks/useAura.js
// Hook for live aura score updates via socket
import { useState, useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext.jsx';
import { getUserApi } from '../api/users.js';
import { getMyRankApi } from '../api/leaderboard.js';

/**
 * Hook to track a user's aura score with live socket updates.
 * @param {string} userId
 * @returns {{ user, loading, rank }}
 */
export function useAura(userId) {
  const [user, setUser] = useState(null);
  const [rank, setRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocketContext() || {};

  useEffect(() => {
    if (!userId) return;

    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const userData = await getUserApi(userId);
        if (mounted) setUser(userData);
      } catch (err) {
        console.error('[useAura] Failed to load user:', err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [userId]);

  useEffect(() => {
    if (!socket || !userId) return;

    const handleAuraUpdate = (data) => {
      if (data.userId === userId) {
        setUser((prev) => prev ? { ...prev, auraScore: data.newScore, tier: data.tier } : prev);
      }
    };

    socket.on('aura_update', handleAuraUpdate);
    return () => socket.off('aura_update', handleAuraUpdate);
  }, [socket, userId]);

  return { user, loading, rank };
}

export default useAura;
