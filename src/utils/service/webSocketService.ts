import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { MESSAGE } from '../interface';

// Các biến lưu trữ thông tin kết nối
let stompClient: Client | null = null;
let connected = false;
const subscriptions: { [key: string]: any } = {};

// Map các callbacks theo loại sự kiện
const eventCallbacks: {
    [key: string]: Array<(data: any) => void>
} = {
    'message': [],
    'status': [],
    'typing': [],
    'read': [],
    'delete': [],
    'error': []
};

// Function khởi tạo và kết nối WebSocket
export const connectToWebSocket = (userId: string, serverUrl: string): Promise<boolean> => {
    return new Promise((resolve) => {
        if (connected && stompClient) {
            console.log('Đã kết nối WebSocket rồi');
            resolve(true);
            return;
        }

        // Đảm bảo luôn sử dụng cổng 4040 cho kết nối websocket
        const effectiveUrl = serverUrl || 'http://localhost:4040';
        console.log(`Kết nối đến WebSocket tại ${effectiveUrl}/ws`);

        const socket = new SockJS(`${effectiveUrl}/ws`);
        stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            connectHeaders: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'X-XSRF-TOKEN': localStorage.getItem('XSRF-TOKEN') || '',
                'Content-Type': 'application/json',
                'user-id': userId
            }
        });

        // Bật chế độ debug để xem các tin nhắn bị bỏ qua
        stompClient.debug = function (str) {
            console.log(`STOMP: ${str}`);
        };

        stompClient.onConnect = (frame) => {
            console.log('Kết nối WebSocket thành công:', frame);
            connected = true;

            // Thông báo trên server về việc người dùng này kết nối
            sendUserConnectMessage(userId);

            // Đăng ký kênh nhận cập nhật trạng thái online của người dùng
            subscribeToUserStatus();

            // Nhận thông báo lỗi cho người dùng này
            subscribeToUserErrors(userId);

            resolve(true);
        };

        stompClient.onStompError = (frame) => {
            console.error('Lỗi STOMP:', frame);
            triggerCallbacks('error', { message: 'Lỗi kết nối WebSocket', frame });
            connected = false;
            resolve(false);
        };

        stompClient.activate();
    });
};

// Ngắt kết nối WebSocket
export const disconnectWebSocket = (userId: string): Promise<boolean> => {
    return new Promise((resolve) => {
        if (!connected || !stompClient) {
            resolve(true);
            return;
        }

        // Thông báo cho server biết người dùng này đã ngắt kết nối
        sendUserDisconnectMessage(userId);

        // Hủy tất cả các đăng ký
        Object.keys(subscriptions).forEach(subId => {
            if (subscriptions[subId]) {
                subscriptions[subId].unsubscribe();
                delete subscriptions[subId];
            }
        });

        stompClient.deactivate();
        stompClient = null;
        connected = false;
        resolve(true);
    });
};

// Gửi thông báo rằng người dùng đã kết nối
const sendUserConnectMessage = (userId: string) => {
    if (!connected || !stompClient) return;

    stompClient.publish({
        destination: '/app/user.connect',
        body: JSON.stringify({ userId })
    });
};

// Gửi thông báo rằng người dùng đã ngắt kết nối
const sendUserDisconnectMessage = (userId: string) => {
    if (!connected || !stompClient) return;

    stompClient.publish({
        destination: '/app/user.disconnect',
        body: JSON.stringify({ userId })
    });
};

// Đăng ký nhận cập nhật trạng thái người dùng
const subscribeToUserStatus = () => {
    if (!connected || !stompClient) return;

    const subscription = stompClient.subscribe('/topic/user.status', (message: IMessage) => {
        try {
            const statusData = JSON.parse(message.body);
            triggerCallbacks('status', statusData);
        } catch (error) {
            console.error('Lỗi xử lý thông tin trạng thái:', error);
        }
    });

    subscriptions['user-status'] = subscription;
};

// Đăng ký nhận thông báo lỗi
const subscribeToUserErrors = (userId: string) => {
    if (!connected || !stompClient) return;

    const subscription = stompClient.subscribe(`/topic/errors.${userId}`, (message: IMessage) => {
        try {
            const errorData = message.body;
            triggerCallbacks('error', { message: errorData });
        } catch (error) {
            console.error('Lỗi xử lý thông báo lỗi:', error);
        }
    });

    subscriptions['user-errors'] = subscription;
};

// Đăng ký nhận tin nhắn từ một cuộc trò chuyện
export const subscribeToConversation = (conversationId: string, callback: (message: MESSAGE) => void) => {
    if (!connected || !stompClient) {
        console.error('Chưa kết nối WebSocket');
        return false;
    }

    // Hủy đăng ký cũ nếu có
    if (subscriptions[`conversation-${conversationId}`]) {
        subscriptions[`conversation-${conversationId}`].unsubscribe();
    }

    // Đăng ký mới - Topic đúng từ MessageWebSocketController.java: @SendTo("/topic/conversation.{conversationId}")
    console.log(`Đăng ký nhận tin nhắn cho cuộc trò chuyện ${conversationId}`);

    try {
        const subscription = stompClient.subscribe(`/topic/conversation.${conversationId}`, (message: IMessage) => {
            try {
                console.log(`Nhận tin nhắn từ cuộc trò chuyện ${conversationId}:`, message.body);
                const messageData = JSON.parse(message.body) as MESSAGE;
                triggerCallbacks('message', messageData);

                // Gọi callback cụ thể cho cuộc trò chuyện này
                if (callback) {
                    callback(messageData);
                }
            } catch (error) {
                console.error('Lỗi xử lý tin nhắn:', error);
            }
        });

        subscriptions[`conversation-${conversationId}`] = subscription;
        console.log(`Đã đăng ký thành công cho cuộc trò chuyện ${conversationId}`);
        return true;
    } catch (e) {
        console.error(`Lỗi khi đăng ký nhận tin nhắn cho cuộc trò chuyện ${conversationId}:`, e);
        return false;
    }
};

// Đăng ký nhận cập nhật về việc tin nhắn đã đọc
export const subscribeToMessageReadStatus = (conversationId: string, callback: (userId: string) => void) => {
    if (!connected || !stompClient) {
        console.error('Chưa kết nối WebSocket');
        return false;
    }

    // Hủy đăng ký cũ nếu có
    if (subscriptions[`read-${conversationId}`]) {
        subscriptions[`read-${conversationId}`].unsubscribe();
    }

    // Đăng ký mới
    const subscription = stompClient.subscribe(`/topic/conversation.${conversationId}.read`, (message: IMessage) => {
        try {
            const userId = message.body;
            triggerCallbacks('read', { conversationId, userId });

            // Gọi callback cụ thể cho cuộc trò chuyện này
            if (callback) {
                callback(userId);
            }
        } catch (error) {
            console.error('Lỗi xử lý cập nhật đã đọc:', error);
        }
    });

    subscriptions[`read-${conversationId}`] = subscription;
    return true;
};

// Đăng ký nhận cập nhật về việc tin nhắn đã xóa
export const subscribeToMessageDeletion = (conversationId: string, callback: (message: MESSAGE) => void) => {
    if (!connected || !stompClient) {
        console.error('Chưa kết nối WebSocket');
        return false;
    }

    // Hủy đăng ký cũ nếu có
    if (subscriptions[`delete-${conversationId}`]) {
        subscriptions[`delete-${conversationId}`].unsubscribe();
    }

    // Đăng ký mới
    const subscription = stompClient.subscribe(`/topic/conversation.${conversationId}.delete`, (message: IMessage) => {
        try {
            const messageData = JSON.parse(message.body) as MESSAGE;
            triggerCallbacks('delete', messageData);

            // Gọi callback cụ thể cho cuộc trò chuyện này
            if (callback) {
                callback(messageData);
            }
        } catch (error) {
            console.error('Lỗi xử lý cập nhật xóa tin nhắn:', error);
        }
    });

    subscriptions[`delete-${conversationId}`] = subscription;
    return true;
};

// Đăng ký nhận cập nhật về việc người dùng đang nhập
export const subscribeToTypingStatus = (conversationId: string, callback: (typingData: any) => void) => {
    if (!connected || !stompClient) {
        console.error('Chưa kết nối WebSocket');
        return false;
    }

    // Hủy đăng ký cũ nếu có
    if (subscriptions[`typing-${conversationId}`]) {
        subscriptions[`typing-${conversationId}`].unsubscribe();
    }

    // Đăng ký mới
    const subscription = stompClient.subscribe(`/topic/conversation.${conversationId}.typing`, (message: IMessage) => {
        try {
            const typingData = JSON.parse(message.body);
            triggerCallbacks('typing', typingData);

            // Gọi callback cụ thể cho cuộc trò chuyện này
            if (callback) {
                callback(typingData);
            }
        } catch (error) {
            console.error('Lỗi xử lý trạng thái đang nhập:', error);
        }
    });

    subscriptions[`typing-${conversationId}`] = subscription;
    return true;
};

// Gửi tin nhắn
export const sendMessage = (messageData: any) => {
    if (!connected || !stompClient) {
        console.error('Chưa kết nối WebSocket');
        return false;
    }

    try {
        console.log('Gửi tin nhắn:', messageData);

        // Điều chỉnh dữ liệu để phù hợp với cấu trúc server
        // MessageWebSocketController.java trong method forwardMessage cần đúng định dạng này
        const enhancedMessage = {
            id: messageData.id, // Thêm id để đảm bảo tin nhắn được xử lý đúng
            conversation: {
                id: messageData.conversationId
            },
            sender: {
                id: messageData.senderId
            },
            content: messageData.content,
            isRead: false,
            createdAt: new Date().toISOString() // Thêm thời gian tạo
        };

        // Endpoint đúng từ MessageWebSocketController.java: @MessageMapping("/chat/{conversationId}")
        const endpoint = `/app/chat/${messageData.conversationId}`;

        // Thêm kiểm tra trạng thái kết nối trước khi gửi
        if (!stompClient.connected) {
            console.error('STOMP client không ở trạng thái kết nối, đang thử kết nối lại...');
            return false;
        }

        // Gửi tin nhắn với đủ headers
        stompClient.publish({
            destination: endpoint,
            body: JSON.stringify(enhancedMessage),
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'user-id': messageData.senderId
            }
        });

        // In log chi tiết để debug
        console.log(`Đã gửi tin nhắn đến ${endpoint}:`, enhancedMessage);
        console.log('Trạng thái kết nối khi gửi tin nhắn:', {
            connected: connected,
            stompClientConnected: stompClient.connected,
            stompClientActive: stompClient.active,
            subscriptionKeys: Object.keys(subscriptions)
        });

        return true;
    } catch (error) {
        console.error('Lỗi khi gửi tin nhắn:', error);
        return false;
    }
};

// Gửi trạng thái đang nhập
export const sendTypingStatus = (conversationId: string, userId: string, isTyping: boolean) => {
    if (!connected || !stompClient) {
        console.error('Chưa kết nối WebSocket');
        // Trả về true để không gây lỗi UI và ghi log để debug
        console.log('Đang cố gắng gửi trạng thái đang nhập khi chưa kết nối:', {
            conversationId, userId, isTyping
        });
        return true;
    }

    try {
        console.log('Gửi trạng thái đang nhập:', { conversationId, userId, isTyping });

        stompClient.publish({
            destination: '/app/chat.typing',
            body: JSON.stringify({
                conversationId,
                userId,
                isTyping
            })
        });
        return true;
    } catch (error) {
        console.error('Lỗi khi gửi trạng thái đang nhập:', error);
        return false;
    }
};

// Gửi xác nhận đã đọc
export const sendReadReceipt = (conversationId: string, userId: string) => {
    if (!connected || !stompClient) {
        console.error('Chưa kết nối WebSocket');
        // Trả về true để không gây lỗi UI và ghi log để debug
        console.log('Đang cố gắng gửi xác nhận đã đọc khi chưa kết nối:', {
            conversationId, userId
        });
        return true;
    }

    try {
        console.log('Gửi xác nhận đã đọc:', { conversationId, userId });

        stompClient.publish({
            destination: '/app/chat.read',
            body: JSON.stringify({
                conversationId,
                userId
            })
        });
        return true;
    } catch (error) {
        console.error('Lỗi khi gửi xác nhận đã đọc:', error);
        return false;
    }
};

// Đăng ký callback xử lý sự kiện
export const onEvent = (eventType: 'message' | 'status' | 'typing' | 'read' | 'delete' | 'error', callback: (data: any) => void) => {
    if (eventCallbacks[eventType]) {
        eventCallbacks[eventType].push(callback);
    }
};

// Hủy đăng ký callback xử lý sự kiện
export const offEvent = (eventType: 'message' | 'status' | 'typing' | 'read' | 'delete' | 'error', callback: (data: any) => void) => {
    if (eventCallbacks[eventType]) {
        eventCallbacks[eventType] = eventCallbacks[eventType].filter(cb => cb !== callback);
    }
};

// Gọi tất cả các callback đã đăng ký cho một loại sự kiện
const triggerCallbacks = (eventType: string, data: any) => {
    if (eventCallbacks[eventType]) {
        eventCallbacks[eventType].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Lỗi trong callback ${eventType}:`, error);
            }
        });
    }
};

// Trạng thái kết nối
export const isConnected = () => {
    return connected && !!stompClient?.connected;
};

// Gửi tin nhắn qua REST API thay vì WebSocket
export const sendChatMessageWithREST = async (messageData: any): Promise<boolean> => {
    try {
        console.log('Gửi tin nhắn qua REST API:', messageData);

        // URL cho REST API
        const url = 'http://localhost:4040/api/messages/send';

        // Gửi request bằng fetch API
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(messageData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Kết quả gửi tin nhắn qua REST API:', result);

        return true;
    } catch (error) {
        console.error('Lỗi khi gửi tin nhắn qua REST API:', error);
        return false;
    }
};

// Kiểm tra kết nối và debug
export const checkConnection = () => {
    const status = {
        connected: connected,
        clientConnected: !!stompClient?.connected,
        clientActive: !!stompClient?.active,
        clientState: stompClient ? 'initialized' : 'null',
        subscriptions: Object.keys(subscriptions)
    };

    console.log('Trạng thái kết nối WebSocket:', status);
    return status;
};

// Hàm kiểm tra subscribe đến tất cả các topic có thể
export const testSubscribe = (conversationId: string) => {
    if (!connected || !stompClient) {
        console.error('Chưa kết nối WebSocket, không thể test subscribe');
        return false;
    }

    const testTopics = [
        `/topic/conversation.${conversationId}`,
        `/topic/chat.${conversationId}`,
        `/topic/messages.${conversationId}`,
        `/user/queue/messages`,
        `/queue/messages`,
        `/topic/public`
    ];

    testTopics.forEach(topic => {
        try {
            const sub = stompClient!.subscribe(topic, (message) => {
                console.log(`Nhận tin nhắn từ ${topic}:`, message.body);
            });
            console.log(`Đã đăng ký ${topic} thành công`);

            // Lưu subscription để có thể hủy sau này
            subscriptions[`test-${topic}`] = sub;
        } catch (error) {
            console.error(`Lỗi khi đăng ký ${topic}:`, error);
        }
    });

    return true;
};

// Hủy đăng ký tất cả các subscription
export const unsubscribeFromAllTopics = () => {
    console.log('Hủy đăng ký tất cả các subscription');

    Object.keys(subscriptions).forEach(subId => {
        if (subscriptions[subId]) {
            try {
                subscriptions[subId].unsubscribe();
                console.log(`Đã hủy đăng ký subscription: ${subId}`);
            } catch (error) {
                console.error(`Lỗi khi hủy đăng ký subscription ${subId}:`, error);
            }
            delete subscriptions[subId];
        }
    });
}; 