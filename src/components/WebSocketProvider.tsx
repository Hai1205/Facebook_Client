import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useChatStore } from '@/stores/useChatStore';
import webSocketService from '@/utils/socket/WebSocketService';

interface WebSocketContextType {
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false
});

export const useWebSocket = () => useContext(WebSocketContext);

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const { userAuth } = useAuthStore();
  const { isWebSocketConnected, setWebSocketConnected, setCurrentUserId } = useChatStore();

  // Kết nối WebSocket khi component được mount
  useEffect(() => {
    const connectWebSocket = async () => {
      if (userAuth?.id && !isWebSocketConnected) {
        try {
          // Thiết lập userId trong store
          setCurrentUserId(userAuth.id);
          
          // Kết nối WebSocket
          await webSocketService.connect();
          console.log("Kết nối WebSocket thành công từ Provider");
        } catch (error) {
          console.error("Lỗi kết nối WebSocket trong Provider:", error);
        }
      }
    };

    connectWebSocket();

    // Hủy kết nối khi component unmount
    return () => {
      // Thực hiện khi ứng dụng đóng
      if (process.env.NODE_ENV !== 'development') {
        webSocketService.disconnect();
      }
    };
  }, [userAuth?.id, isWebSocketConnected, setCurrentUserId, setWebSocketConnected]);

  // Thiết lập trình xử lý khi cửa sổ đóng
  useEffect(() => {
    const handleBeforeUnload = () => {
      webSocketService.disconnect();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const value = {
    isConnected: isWebSocketConnected
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
} 