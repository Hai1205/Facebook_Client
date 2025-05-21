import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './polyfill';

if (typeof window !== 'undefined') {
    (window as any).global = window;
}

export const createStompClient = (userId: string, onMessage: (message: any) => void, onTyping: (status: any) => void) => {
    const client = new Client({
        webSocketFactory: () => new SockJS('http://localhost:4040/ws'),
        connectHeaders: {
            userId: userId
        },
        debug: function (str) {
            console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
        console.log('Connected to WebSocket');

        // Subscribe to personal messages
        client.subscribe(`/user/${userId}/queue/messages`, (message) => {
            const newMessage = JSON.parse(message.body);
            onMessage(newMessage);
        });

        // Subscribe to typing status
        client.subscribe(`/topic/typing/${userId}`, (message) => {
            const typingStatus = JSON.parse(message.body);
            onTyping(typingStatus);
        });
    };

    client.onStompError = (frame) => {
        console.error('STOMP error:', frame);
    };

    client.onWebSocketError = (event) => {
        console.error('WebSocket error:', event);
    };

    client.onWebSocketClose = (event) => {
        console.log('WebSocket closed:', event);
    };

    return client;
}; 