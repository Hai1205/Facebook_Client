import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { MESSAGE } from '../interface';
import { serverUrl } from '@/lib/utils';

type EVENT_TYPES = 'message' | 'status' | 'typing' | 'read' | 'delete' | 'error';

let stompClient: Client | null = null;
let connected = false;
const subscriptions: { [key: string]: any } = {};

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
        if (connected && stompClient) {
            // console.log('WebSocket is already connected');
            resolve(true);
            return;
        }

        const effectiveUrl = serverUrl || 'http://localhost:4040';
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

        // stompClient.debug = function (str) {
        //     console.log(`STOMP: ${str}`);
        // };

        stompClient.onConnect = () => {
            // console.log('WebSocket connection successful:', frame);
            connected = true;

            sendUserConnectMessage(userId);

            subscribeToUserStatus();

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

export const disconnectWebSocket = (userId: string): Promise<boolean> => {
    return new Promise((resolve) => {
        if (!connected || !stompClient) {
            resolve(true);
            return;
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
    if (!connected || !stompClient) {
        // console.error('Chưa kết nối WebSocket');
        return false;
    }

    if (subscriptions[`conversation-${conversationId}`]) {
        subscriptions[`conversation-${conversationId}`].unsubscribe();
    }

    // console.log(`Subscribe to receive messages for conversation ${conversationId}`);

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
    if (!connected || !stompClient) {
        // console.error('No WebSocket connection');
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
    if (!connected || !stompClient) {
        // console.error('No WebSocket connection');
        // console.log('Trying to send typing status when not connected:', {
        //     conversationId, userId, isTyping
        // });
        return true;
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
    return connected && !!stompClient?.connected;
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