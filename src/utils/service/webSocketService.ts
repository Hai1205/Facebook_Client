import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { MESSAGE } from '../interface';
import { serverUrl } from '@/lib/utils';

type EVENT_TYPES = 'message' | 'status' | 'typing' | 'read' | 'delete' | 'error';

let stompClient: Client | null = null;
let connected = false;
const subscriptions: { [key: string]: any } = {};
let currentUserId: string = '';
let currentServerUrl: string = '';
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
let reconnectTimer: NodeJS.Timeout | null = null;
let connectionHeartbeatInterval: NodeJS.Timeout | null = null;

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

export const connectToWebSocket = (userId: string, serverUrl: string): Promise<boolean> => {
    return new Promise((resolve) => {
        // Lưu thông tin kết nối để dùng cho việc kết nối lại sau
        currentUserId = userId;
        currentServerUrl = serverUrl || 'http://localhost:4040';

        if (connected && stompClient?.connected) {
            // console.log('WebSocket is already connected');
            resolve(true);
            return;
        }

        // Hủy bỏ timer tái kết nối cũ nếu có
        if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
        }

        // Reset số lần thử kết nối
        reconnectAttempts = 0;

        const effectiveUrl = currentServerUrl;
        // console.log(`Connect to WebSocket at ${effectiveUrl}/ws`);

        const socket = new SockJS(`${effectiveUrl}/ws`);
        stompClient = new Client({
            webSocketFactory: () => socket,
            // debug: (str) => {
            //     console.log(str);
            // },
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

        stompClient.onConnect = () => {
            // console.log('WebSocket connection successful:', frame);
            connected = true;
            reconnectAttempts = 0;

            sendUserConnectMessage(userId);

            subscribeToUserStatus();

            subscribeToUserErrors(userId);

            // Bắt đầu kiểm tra kết nối định kỳ
            startConnectionHeartbeat();

            resolve(true);
        };

        stompClient.onStompError = (frame) => {
            console.error('Lỗi STOMP:', frame);
            triggerCallbacks('error', { message: 'Lỗi kết nối WebSocket', frame });
            connected = false;

            // Thử kết nối lại
            attemptReconnect();

            resolve(false);
        };

        stompClient.onDisconnect = () => {
            console.log('WebSocket disconnected');
            connected = false;

            // Thử kết nối lại
            attemptReconnect();
        };

        stompClient.activate();
    });
};

export const disconnectWebSocket = (userId: string): Promise<boolean> => {
    return new Promise((resolve) => {
        if (!connected || !stompClient) {
            resolve(true);
            return;
        }

        // Dừng heartbeat và các timer tái kết nối
        if (connectionHeartbeatInterval) {
            clearInterval(connectionHeartbeatInterval);
            connectionHeartbeatInterval = null;
        }

        if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
        }

        sendUserDisconnectMessage(userId);

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

const sendUserConnectMessage = (userId: string) => {
    if (!connected || !stompClient) return;

    stompClient.publish({
        destination: '/app/user.connect',
        body: JSON.stringify({ userId })
    });
};

const sendUserDisconnectMessage = (userId: string) => {
    if (!connected || !stompClient) return;

    stompClient.publish({
        destination: '/app/user.disconnect',
        body: JSON.stringify({ userId })
    });
};

const subscribeToUserStatus = () => {
    if (!connected || !stompClient) return;

    const subscription = stompClient.subscribe('/topic/user.status', (message: IMessage) => {
        try {
            const statusData = JSON.parse(message.body);
            triggerCallbacks('status', statusData);
        } catch (error) {
            console.error('Error processing user status:', error);
        }
    });

    subscriptions['user-status'] = subscription;
};

const subscribeToUserErrors = (userId: string) => {
    if (!connected || !stompClient) return;

    const subscription = stompClient.subscribe(`/topic/errors.${userId}`, (message: IMessage) => {
        try {
            const errorData = message.body;
            triggerCallbacks('error', { message: errorData });
        } catch (error) {
            console.error('Error processing error notification:', error);
        }
    });

    subscriptions['user-errors'] = subscription;
};

export const subscribeToConversation = (conversationId: string, callback: (message: MESSAGE) => void) => {
    if (!stompClient || !isConnected()) {
        console.error(`Chưa kết nối WebSocket khi thử đăng ký conversation ${conversationId}`);

        // Lưu lại thông tin đăng ký để thử lại sau
        if (currentUserId && currentServerUrl) {
            console.log(`Đang thử kết nối lại để đăng ký kênh ${conversationId}...`);

            connectToWebSocket(currentUserId, currentServerUrl).then(success => {
                if (success) {
                    // Thử đăng ký lại sau khi kết nối
                    setTimeout(() => subscribeToConversation(conversationId, callback), 500);
                }
            });
        }

        return false;
    }

    if (subscriptions[`conversation-${conversationId}`]) {
        subscriptions[`conversation-${conversationId}`].unsubscribe();
    }

    try {
        const subscription = stompClient.subscribe(`/topic/conversation.${conversationId}`, (message: IMessage) => {
            try {
                // console.log(`Receive message from conversation ${conversationId}:`, message.body);
                const messageData = JSON.parse(message.body) as MESSAGE;
                triggerCallbacks('message', messageData);

                if (callback) {
                    callback(messageData);
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        });

        subscriptions[`conversation-${conversationId}`] = subscription;
        // console.log(`Successfully subscribed to conversation ${conversationId}`);
        return true;
    } catch (e) {
        console.error(`Error subscribing to conversation ${conversationId}:`, e);
        return false;
    }
};

export const subscribeToMessageReadStatus = (conversationId: string, callback: (userId: string) => void) => {
    if (!connected || !stompClient) {
        // console.error('No WebSocket connection');
        return false;
    }

    if (subscriptions[`read-${conversationId}`]) {
        subscriptions[`read-${conversationId}`].unsubscribe();
    }

    const subscription = stompClient.subscribe(`/topic/conversation.${conversationId}.read`, (message: IMessage) => {
        try {
            const userId = message.body;
            triggerCallbacks('read', { conversationId, userId });

            if (callback) {
                callback(userId);
            }
        } catch (error) {
            console.error('Error processing read status:', error);
        }
    });

    subscriptions[`read-${conversationId}`] = subscription;
    return true;
};

export const subscribeToMessageDeletion = (conversationId: string, callback: (message: MESSAGE) => void) => {
    if (!connected || !stompClient) {
        // console.error('No WebSocket connection');
        return false;
    }

    if (subscriptions[`delete-${conversationId}`]) {
        subscriptions[`delete-${conversationId}`].unsubscribe();
    }

    const subscription = stompClient.subscribe(`/topic/conversation.${conversationId}.delete`, (message: IMessage) => {
        try {
            const messageData = JSON.parse(message.body) as MESSAGE;
            triggerCallbacks('delete', messageData);

            if (callback) {
                callback(messageData);
            }
        } catch (error) {
            console.error('Error processing message deletion:', error);
        }
    });

    subscriptions[`delete-${conversationId}`] = subscription;
    return true;
};

export const subscribeToTypingStatus = (conversationId: string, callback: (typingData: any) => void) => {
    if (!connected || !stompClient) {
        // console.error('No WebSocket connection');
        return false;
    }

    if (subscriptions[`typing-${conversationId}`]) {
        subscriptions[`typing-${conversationId}`].unsubscribe();
    }

    const subscription = stompClient.subscribe(`/topic/conversation.${conversationId}.typing`, (message: IMessage) => {
        try {
            const typingData = JSON.parse(message.body);
            triggerCallbacks('typing', typingData);

            if (callback) {
                callback(typingData);
            }
        } catch (error) {
            console.error('Error processing typing status:', error);
        }
    });

    subscriptions[`typing-${conversationId}`] = subscription;
    return true;
};

export const sendMessage = (messageData: any) => {
    if (!stompClient || !isConnected()) {
        console.log('WebSocket không kết nối, đang thử kết nối lại...');

        // Thử kết nối lại và gửi tin nhắn
        if (currentUserId && currentServerUrl) {
            connectToWebSocket(currentUserId, currentServerUrl).then(success => {
                if (success) {
                    // Thử gửi lại tin nhắn sau khi kết nối
                    setTimeout(() => sendMessage(messageData), 500);
                } else {
                    console.error('Không thể kết nối lại WebSocket để gửi tin nhắn');
                }
            });
        }

        return false;
    }

    try {
        // console.log('Send message:', messageData);

        const enhancedMessage = {
            id: messageData.id,
            conversation: {
                id: messageData.conversationId
            },
            sender: {
                id: messageData.senderId
            },
            content: messageData.content,
            isRead: false,
            createdAt: new Date().toISOString()
        };

        const endpoint = `/app/chat/${messageData.conversationId}`;

        if (!stompClient.connected) {
            // console.error('STOMP client is not connected, trying to reconnect...');
            return false;
        }

        stompClient.publish({
            destination: endpoint,
            body: JSON.stringify(enhancedMessage),
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'user-id': messageData.senderId
            }
        });

        // console.log(`Sent message to ${endpoint}:`, enhancedMessage);
        // console.log('Connection status when sending message:', {
        //     connected: connected,
        //     stompClientConnected: stompClient.connected,
        //     stompClientActive: stompClient.active,
        //     subscriptionKeys: Object.keys(subscriptions)
        // });

        return true;
    } catch (error) {
        console.error('Error sending message:', error);
        return false;
    }
};

export const sendTypingStatus = (conversationId: string, userId: string, isTyping: boolean) => {
    if (!stompClient || !isConnected()) {
        console.log('WebSocket không kết nối, đang bỏ qua gửi trạng thái đang nhập...');
        // Không cần kết nối lại cho tính năng này vì không quan trọng
        return false;
    }

    try {
        // console.log('Sending typing status:', { conversationId, userId, isTyping });

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
        console.error('Error sending typing status:', error);
        return false;
    }
};

export const sendReadReceipt = (conversationId: string, userId: string) => {
    if (!connected || !stompClient) {
        // console.error('No WebSocket connection');
        // console.log('Trying to send read receipt when not connected:', {
        //     conversationId, userId
        // });
        return true;
    }

    try {
        // console.log('Sending read receipt:', { conversationId, userId });

        stompClient.publish({
            destination: '/app/chat.read',
            body: JSON.stringify({
                conversationId,
                userId
            })
        });
        return true;
    } catch (error) {
        console.error('Error sending read receipt:', error);
        return false;
    }
};

export const onEvent = (eventType: EVENT_TYPES, callback: (data: any) => void) => {
    if (eventCallbacks[eventType]) {
        eventCallbacks[eventType].push(callback);
    }
};

export const offEvent = (eventType: EVENT_TYPES, callback: (data: any) => void) => {
    if (eventCallbacks[eventType]) {
        eventCallbacks[eventType] = eventCallbacks[eventType].filter(cb => cb !== callback);
    }
};

const triggerCallbacks = (eventType: string, data: any) => {
    if (eventCallbacks[eventType]) {
        eventCallbacks[eventType].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in callback ${eventType}:`, error);
            }
        });
    }
};

export const isConnected = () => {
    return connected && !!stompClient && stompClient.connected;
};

export const sendChatMessageWithREST = async (messageData: any): Promise<boolean> => {
    try {
        // console.log('Sending message via REST API:', messageData);

        // const url = 'http://localhost:4040/api/messages/send';
        const url = `${serverUrl}/api/messages/send`;

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

        await response.json();
        // console.log('Result of sending message via REST API:', result);

        return true;
    } catch (error) {
        console.error('Error sending message via REST API:', error);
        return false;
    }
};

export const checkConnection = () => {
    const status = {
        connected: connected,
        clientConnected: !!stompClient?.connected,
        clientActive: !!stompClient?.active,
        clientState: stompClient ? 'initialized' : 'null',
        subscriptions: Object.keys(subscriptions)
    };

    // console.log('WebSocket connection status:', status);
    return status;
};

export const testSubscribe = (conversationId: string) => {
    if (!connected || !stompClient) {
        // console.error('WebSocket is not connected, cannot test subscribe');
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
                console.log(`Receive message from ${topic}:`, message.body);
            });
            // console.log(`Successfully subscribed to ${topic}`);

            subscriptions[`test-${topic}`] = sub;
        } catch (error) {
            console.error(`Error subscribing to ${topic}:`, error);
        }
    });

    return true;
};

export const unsubscribeFromAllTopics = () => {
    // console.log('Unsubscribe from all subscriptions');

    Object.keys(subscriptions).forEach(subId => {
        if (subscriptions[subId]) {
            try {
                subscriptions[subId].unsubscribe();
                // console.log(`Successfully unsubscribed from subscription: ${subId}`);
            } catch (error) {
                console.error(`Error unsubscribing from subscription ${subId}:`, error);
            }
            delete subscriptions[subId];
        }
    });
};

// Thêm hàm tự động kết nối lại
const attemptReconnect = () => {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.log(`Đã vượt quá số lần thử kết nối tối đa (${MAX_RECONNECT_ATTEMPTS})`);
        reconnectAttempts = 0;
        return;
    }

    reconnectAttempts++;
    const delay = Math.min(1000 * (2 ** reconnectAttempts), 30000); // Tối đa 30 giây

    console.log(`Thử kết nối lại lần ${reconnectAttempts} sau ${delay / 1000} giây...`);

    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
    }

    reconnectTimer = setTimeout(() => {
        if (currentUserId && currentServerUrl) {
            console.log('Đang thử kết nối lại WebSocket...');
            connectToWebSocket(currentUserId, currentServerUrl);
        }
    }, delay);
};

export const startConnectionHeartbeat = () => {
    // Xóa interval cũ nếu có
    if (connectionHeartbeatInterval) {
        clearInterval(connectionHeartbeatInterval);
    }

    // Kiểm tra kết nối mỗi 30 giây
    connectionHeartbeatInterval = setInterval(() => {
        if (!isConnected() && currentUserId && currentServerUrl) {
            console.log('Heartbeat: Phát hiện mất kết nối, đang thử kết nối lại...');
            connectToWebSocket(currentUserId, currentServerUrl);
        }
    }, 30000); // 30 giây
}; 