import webSocketService from './WebSocketService';
import { useChatStore } from '@/stores/useChatStore';

// Định nghĩa kiểu cho message
interface MessageToSend {
    conversation: {
        id: string;
    };
    sender: {
        id: string;
    };
    content: string;
}

interface StompSubscription {
    id: string;
    unsubscribe: () => void;
}

interface MessageEvent {
    body: string;
    headers: Record<string, string>;
}

/**
 * Interface WebSocket API cung cấp các phương thức tiện ích cho việc tương tác với WebSocket
 */
export const WebSocketApi = {
    /**
     * Thiết lập kết nối WebSocket
     */
    connect: async (): Promise<void> => {
        try {
            await webSocketService.connect();
            console.log("Kết nối WebSocket thành công");
        } catch (error) {
            console.error("Lỗi kết nối WebSocket:", error);
            throw error;
        }
    },

    /**
     * Kiểm tra xem đã có kết nối hay chưa
     */
    isConnected: (): boolean => {
        return webSocketService.isConnected();
    },

    /**
     * Đảm bảo kết nối WebSocket đã được thiết lập
     */
    ensureConnected: async (): Promise<void> => {
        if (!webSocketService.isConnected()) {
            return webSocketService.connect();
        }
    },

    /**
     * Đăng ký nhận tin nhắn từ một cuộc trò chuyện
     */
    subscribeToConversation: async (conversationId: string): Promise<void> => {
        try {
            await webSocketService.ensureConnected();
            await webSocketService.subscribeToConversation(conversationId);
        } catch (error) {
            console.error(`Lỗi đăng ký cuộc trò chuyện ${conversationId}:`, error);
            throw error;
        }
    },

    /**
     * Đăng ký nhận thông báo khi nhận được tin nhắn mới
     */
    subscribeToUserMessages: (): void => {
        webSocketService.subscribeToUserMessages();
    },

    /**
     * Gửi tin nhắn qua WebSocket
     */
    sendMessage: async (message: MessageToSend): Promise<boolean> => {
        try {
            await webSocketService.ensureConnected();
            return await webSocketService.sendMessage(message);
        } catch (error) {
            console.error("Lỗi gửi tin nhắn:", error);
            throw error;
        }
    },

    /**
     * Đánh dấu tin nhắn là đã đọc
     */
    markMessageAsRead: async (conversationId: string, userId: string): Promise<void> => {
        try {
            await webSocketService.ensureConnected();
            webSocketService.markMessageAsRead(conversationId, userId);
        } catch (error) {
            console.error(`Lỗi đánh dấu đã đọc cho cuộc trò chuyện ${conversationId}:`, error);
            throw error;
        }
    },

    /**
     * Gửi thông báo đang nhập
     */
    sendTypingNotification: async (
        conversationId: string,
        userId: string,
        username: string,
        isTyping: boolean
    ): Promise<void> => {
        try {
            await webSocketService.ensureConnected();
            webSocketService.sendTypingNotification(conversationId, userId, username, isTyping);
        } catch (error) {
            console.error(`Lỗi gửi thông báo đang nhập cho cuộc trò chuyện ${conversationId}:`, error);
            throw error;
        }
    },

    /**
     * Gửi thông báo trạng thái online của người dùng hiện tại
     */
    sendOnlineStatus: async (userId: string, status: boolean): Promise<void> => {
        try {
            await webSocketService.ensureConnected();
            console.log(`Gửi trạng thái ${status ? 'online' : 'offline'} cho user ${userId}`);
            webSocketService.send('/app/userStatus', {}, JSON.stringify({
                userId: userId,
                online: status,
                timestamp: new Date().toISOString()
            }));
        } catch (error) {
            console.error('Lỗi gửi trạng thái online:', error);
        }
    },

    /**
     * Đăng ký nhận cập nhật trạng thái online
     */
    subscribeToOnlineStatus: (callback: (onlineUsers: string[]) => void): (() => void) => {
        try {
            webSocketService.ensureConnected();

            const subscription = webSocketService.subscribe('/topic/onlineUsers', (message: any) => {
                try {
                    const data = JSON.parse(message.body);
                    if (data && data.onlineUsers) {
                        useChatStore.getState().updateOnlineUsers(data.onlineUsers);
                        callback(data.onlineUsers);
                    }
                } catch (error) {
                    console.error('Lỗi xử lý trạng thái online:', error);
                }
            });

            return () => {
                try {
                    if (subscription && typeof subscription.unsubscribe === 'function') {
                        subscription.unsubscribe();
                    }
                } catch (error) {
                    console.error('Lỗi hủy đăng ký:', error);
                }
            };
        } catch (error) {
            console.error('Lỗi đăng ký trạng thái online:', error);
            return () => { };
        }
    },

    /**
     * Cập nhật danh sách người dùng online
     */
    updateOnlineStatus: async (): Promise<void> => {
        try {
            await webSocketService.ensureConnected();
            webSocketService.send('/app/getOnlineUsers', {});
        } catch (error) {
            console.error('Lỗi yêu cầu cập nhật trạng thái online:', error);
        }
    },

    /**
     * Ping server để kiểm tra kết nối
     */
    ping: async (): Promise<void> => {
        try {
            await webSocketService.ensureConnected();
            webSocketService.send('/app/ping', {});
        } catch (error) {
            console.error('Lỗi ping server:', error);
        }
    },

    /**
     * Ngắt kết nối WebSocket
     */
    disconnect: (): void => {
        webSocketService.disconnect();
    }
}; 