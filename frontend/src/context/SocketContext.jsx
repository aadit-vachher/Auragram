// src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserScore } from '../store/authSlice.js';
import { addNotification, addToast } from '../store/uiSlice.js';
import { updateGlobalLeaderboard } from '../store/leaderboardSlice.js';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const { user, accessToken } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user || !accessToken) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
      }
      return;
    }

    const socket = io('/', {
      withCredentials: true,
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id);
      setConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
      setConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
    });

    // Server → Client events
    socket.on('aura_update', (data) => {
      if (data.userId === user._id?.toString()) {
        dispatch(updateUserScore({ newScore: data.newScore, tier: data.tier }));
      }
    });

    socket.on('tier_change', (data) => {
      dispatch(addNotification({
        type: 'tier_change',
        title: '🌟 Tier Upgrade!',
        message: `You've reached ${data.newTier} tier!`,
        data,
      }));
      dispatch(addToast({
        type: 'tier_change',
        title: `🎉 You're now ${data.newTier}!`,
        message: `Congratulations on reaching the ${data.newTier} tier!`,
        tier: data.newTier,
      }));
    });

    socket.on('new_notification', (data) => {
      dispatch(addNotification({
        type: 'general',
        ...data,
      }));
    });

    socket.on('leaderboard_update', (data) => {
      if (data.type === 'global') {
        dispatch(updateGlobalLeaderboard(data.data));
      }
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id, accessToken]);

  const joinLeaderboard = () => socketRef.current?.emit('join_leaderboard');
  const leaveLeaderboard = () => socketRef.current?.emit('leave_leaderboard');

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected, joinLeaderboard, leaveLeaderboard }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  return useContext(SocketContext);
}

export default SocketContext;
