import { useEffect } from 'react';
import { useChatStore } from '@/stores/useChatStore';
import { useAuthStore } from '@/stores/useAuthStore';
import webSocketService from '@/utils/socket/WebSocketService';

/**
 * Hook để đăng ký nhận tin nhắn từ WebSocket
 */
export function useMessagesSubscription() {
    const { isWebSocketConnected, setCurrentUserId } = useChatStore();
    const { userAuth } = useAuthStore();

    // Kết nối WebSocket khi component được mount và đặt currentUserId
    useEffect(() => {
        if (userAuth?.id) {
            // Thiết lập ID người dùng hiện tại trong store
            setCurrentUserId(userAuth.id);

            // Kết nối WebSocket nếu chưa kết nối
            if (!isWebSocketConnected) {
                const connectWebSocket = async () => {
                    try {
                        await webSocketService.ensureConnected();
                        console.log("Đã kết nối WebSocket và đăng ký nhận tin nhắn");
                    } catch (error) {
                        console.error("Lỗi kết nối WebSocket:", error);
                    }
                };

                connectWebSocket();
            }
        }
    }, [userAuth?.id, isWebSocketConnected, setCurrentUserId]);

    // Theo dõi các cuộc trò chuyện hiện tại
    useEffect(() => {
        if (isWebSocketConnected && userAuth?.id) {
            // Đăng ký nhận tin nhắn cá nhân
            webSocketService.subscribeToUserMessages();
        }
    }, [isWebSocketConnected, userAuth?.id]);

    return null;
} 