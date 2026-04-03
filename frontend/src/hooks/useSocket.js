// src/hooks/useSocket.js
// Convenience hook for accessing the socket context
import { useSocketContext } from '../context/SocketContext.jsx';

export function useSocket() {
  return useSocketContext();
}

export default useSocket;
