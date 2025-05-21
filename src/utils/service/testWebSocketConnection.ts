import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const testWebSocketConnection = (
    serverUrl: string,
    onSuccess: (frame: any) => void,
    onError: (error: any) => void
): void => {
    console.log('Start testing WebSocket connection to:', serverUrl);

    const socket = new SockJS(`${serverUrl}/ws`);

    const stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
            console.log('STOMP Debug:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
    });

    stompClient.onConnect = (frame) => {
        console.log('WebSocket connection successful:', frame);

        const subscription = stompClient.subscribe('/topic/pong', (message) => {
            console.log('Receive message pong:', message.body);

            subscription.unsubscribe();

            stompClient.deactivate();

            onSuccess(frame);
        });

        stompClient.publish({
            destination: '/app/ping',
            body: 'ping'
        });
    };

    stompClient.onStompError = (frame) => {
        console.error('Lỗi STOMP:', frame);
        onError(frame);
    };

    stompClient.activate();
}; 