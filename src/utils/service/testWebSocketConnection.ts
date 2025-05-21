import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

/**
 * Hàm kiểm tra kết nối WebSocket
 * @param serverUrl URL của server (ví dụ: http://localhost:8080)
 * @param onSuccess Hàm callback khi kết nối thành công
 * @param onError Hàm callback khi có lỗi
 */
export const testWebSocketConnection = (
    serverUrl: string,
    onSuccess: (frame: any) => void,
    onError: (error: any) => void
): void => {
    console.log('Bắt đầu kiểm tra kết nối WebSocket đến:', serverUrl);

    // Khởi tạo SockJS
    const socket = new SockJS(`${serverUrl}/ws`);

    // Khởi tạo STOMP client
    const stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
            console.log('STOMP Debug:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
    });

    // Xử lý sự kiện kết nối thành công
    stompClient.onConnect = (frame) => {
        console.log('Kết nối WebSocket thành công:', frame);

        // Đăng ký nhận tin nhắn ping-pong để kiểm tra
        const subscription = stompClient.subscribe('/topic/pong', (message) => {
            console.log('Nhận message pong:', message.body);

            // Hủy đăng ký sau khi nhận được phản hồi
            subscription.unsubscribe();

            // Ngắt kết nối
            stompClient.deactivate();

            // Gọi callback thành công
            onSuccess(frame);
        });

        // Gửi message ping để kiểm tra
        stompClient.publish({
            destination: '/app/ping',
            body: 'ping'
        });
    };

    // Xử lý lỗi STOMP
    stompClient.onStompError = (frame) => {
        console.error('Lỗi STOMP:', frame);
        onError(frame);
    };

    // Bắt đầu kết nối
    stompClient.activate();
}; 