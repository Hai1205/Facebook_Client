import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class NotificationSocketService {
    private stompClient: Client | null;
    private connected: boolean;
    private apiUrl: string;
    private reconnectTimeout: any;
    private retryCount: number;
    private maxRetries: number;
    private heartbeatInterval: any;
    private userId: string = '';
    private subscriptions: { [key: string]: any } = {};

    constructor() {
        this.stompClient = null;
        this.connected = false;
        this.apiUrl = "http://localhost:4040"; // Luôn sử dụng cổng 4040 của Spring Boot
        this.reconnectTimeout = null;
        this.retryCount = 0;
        this.maxRetries = 10;
        this.heartbeatInterval = null;
    }

    init(userId: string): void {
        if (!userId) {
            console.error("WebSocketService init requires userId");
            return;
        }
        this.userId = userId;
        this.connect();
    }

    connect(): Promise<void> {
        if (this.connected && this.stompClient?.connected) {
            console.log("WebSocket đã kết nối");
            return Promise.resolve();
        }

        console.log(`Kết nối đến WebSocket (STOMP) tại ${this.apiUrl} với userId=${this.userId}`);

        if (this.stompClient) {
            this.stompClient.deactivate();
            this.stompClient = null;
        }

        const socket = new SockJS(`${this.apiUrl}/ws`);
        this.stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.debug(str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000
        });

        return new Promise<void>((resolve, reject) => {
            if (!this.stompClient) {
                reject(new Error("STOMP client is null"));
                return;
            }

            this.stompClient.onConnect = (frame) => {
                console.log("✅ WebSocket kết nối thành công:", frame);
                this.connected = true;
                this.retryCount = 0;

                // Thông báo server rằng người dùng này đã kết nối
                this.sendUserConnectMessage();

                // Đăng ký nhận thông báo
                this.subscribeToServerTopics();

                this.setupHeartbeat();
                resolve();
            };

            this.stompClient.onStompError = (frame) => {
                console.error("Lỗi STOMP:", frame);
                this.connected = false;
                this.reconnect();
                reject(frame);
            };

            this.stompClient.onWebSocketClose = (event) => {
                console.log("WebSocket đã đóng:", event);
                this.connected = false;
                this.reconnect();
            };

            this.stompClient.activate();
        });
    }

    private setupHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }

        this.heartbeatInterval = setInterval(() => {
            if (this.stompClient && this.connected) {
                this.stompClient.publish({
                    destination: '/app/ping',
                    body: JSON.stringify({ timestamp: Date.now() })
                });
            }
        }, 30000);
    }

    private sendUserConnectMessage() {
        if (this.stompClient && this.connected) {
            this.stompClient.publish({
                destination: '/app/user.connect',
                body: JSON.stringify({ userId: this.userId })
            });
        }
    }

    private subscribeToServerTopics() {
        if (!this.stompClient || !this.connected) return;

        // Đăng ký nhận thông báo trạng thái người dùng
        this.subscriptions['user-status'] = this.stompClient.subscribe('/topic/user.status', (message) => {
            try {
                const statusData = JSON.parse(message.body);
                console.log("Nhận thông báo trạng thái người dùng:", statusData);
                // Xử lý cập nhật trạng thái người dùng ở đây
            } catch (error) {
                console.error('Lỗi xử lý thông tin trạng thái:', error);
            }
        });

        // Đăng ký nhận thông báo lỗi
        this.subscriptions['user-errors'] = this.stompClient.subscribe(`/topic/errors.${this.userId}`, (message) => {
            try {
                const errorData = message.body;
                console.error('Lỗi từ server:', errorData);
            } catch (error) {
                console.error('Lỗi xử lý thông báo lỗi:', error);
            }
        });

        // Đăng ký nhận thông báo chung
        this.subscriptions['notifications'] = this.stompClient.subscribe(`/topic/notifications.${this.userId}`, (message) => {
            try {
                const notification = JSON.parse(message.body);
                console.log("Nhận thông báo:", notification);
                this.notifySubscribers('notification', notification);
            } catch (error) {
                console.error('Lỗi xử lý thông báo:', error);
            }
        });
    }

    private notifySubscribers(topic: string, data: any) {
        // Triển khai theo cách gọi các callback đã đăng ký
        // (code sẽ được thêm khi cần thiết)
    }

    reconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }

        if (this.retryCount >= this.maxRetries) {
            console.error(`Quá số lần kết nối lại tối đa (${this.maxRetries})`);
            return;
        }

        const baseDelay = 1000;
        const maxDelay = 30000;
        let delay = Math.min(maxDelay, baseDelay * Math.pow(2, this.retryCount));
        delay = delay * (0.5 + Math.random() * 0.5);

        this.retryCount++;
        console.log(`Đang kết nối lại sau ${(delay / 1000).toFixed(1)} giây (lần thứ ${this.retryCount}/${this.maxRetries})...`);

        this.reconnectTimeout = setTimeout(() => {
            this.connect().catch((err) => {
                console.error("Kết nối lại thất bại:", err);
            });
        }, delay);
    }

    subscribeToNotifications(callback: Function) {
        console.log("Đăng ký nhận thông báo - chức năng này sử dụng STOMP/SockJS");
        // Triển khai một mô hình đăng ký callback hiệu quả hơn
    }

    subscribeToLikeUpdates(callback: Function) {
        console.log("Đăng ký nhận cập nhật like - chức năng này sử dụng STOMP/SockJS");
        // Triển khai tương tự
    }

    subscribeToCommentUpdates(callback: Function) {
        console.log("Đăng ký nhận cập nhật comment - chức năng này sử dụng STOMP/SockJS");
        // Triển khai tương tự
    }

    subscribeToFollow(callback: Function) {
        console.log("Đăng ký nhận thông báo follow - chức năng này sử dụng STOMP/SockJS");
        // Triển khai tương tự
    }

    disconnect() {
        console.log("WebSocket đang ngắt kết nối");

        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }

        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        if (this.stompClient) {
            if (this.connected) {
                // Thông báo cho server biết người dùng đã ngắt kết nối
                this.stompClient.publish({
                    destination: '/app/user.disconnect',
                    body: JSON.stringify({ userId: this.userId })
                });
            }

            // Hủy các đăng ký
            Object.keys(this.subscriptions).forEach(key => {
                if (this.subscriptions[key]) {
                    this.subscriptions[key].unsubscribe();
                    delete this.subscriptions[key];
                }
            });

            this.stompClient.deactivate();
            this.stompClient = null;
        }

        this.connected = false;
        console.log("WebSocket đã ngắt kết nối");
    }

    isConnected() {
        return this.connected && !!this.stompClient?.connected;
    }
}

export default new NotificationSocketService(); 