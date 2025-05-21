import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { serverUrl } from '@/lib/utils';

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
        this.apiUrl = serverUrl || "http://localhost:4040";
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
            console.log("WebSocket is connected");
            return Promise.resolve();
        }

        console.log(`Connect to WebSocket (STOMP) at ${this.apiUrl} with userId=${this.userId}`);

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
                console.log("✅ WebSocket connection successfully:", frame);
                this.connected = true;
                this.retryCount = 0;

                this.sendUserConnectMessage();

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
                console.log("WebSocket stopped:", event);
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

        this.subscriptions['user-status'] = this.stompClient.subscribe('/topic/user.status', (message) => {
            try {
                const statusData = JSON.parse(message.body);
                console.log("Get notification user status:", statusData);
                // Handle update user status here
            } catch (error) {
                console.error('Error handling user status:', error);
            }
        });

        this.subscriptions['user-errors'] = this.stompClient.subscribe(`/topic/errors.${this.userId}`, (message) => {
            try {
                const errorData = message.body;
                console.error('Error from server:', errorData);
            } catch (error) {
                console.error('Error handling error notification:', error);
            }
        });

        this.subscriptions['notifications'] = this.stompClient.subscribe(`/topic/notifications.${this.userId}`, (message) => {
            try {
                const notification = JSON.parse(message.body);
                console.log("Get notification:", notification);
                // this.notifySubscribers('notification', notification);
            } catch (error) {
                console.error('Error handling notification:', error);
            }
        });
    }

    // private notifySubscribers(topic: string, data: any) {
    // }

    reconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }

        if (this.retryCount >= this.maxRetries) {
            console.error(`Max reconnection attempts reached (${this.maxRetries})`);
            return;
        }

        const baseDelay = 1000;
        const maxDelay = 30000;
        let delay = Math.min(maxDelay, baseDelay * Math.pow(2, this.retryCount));
        delay = delay * (0.5 + Math.random() * 0.5);

        this.retryCount++;
        console.log(`Reconnecting in ${(delay / 1000).toFixed(1)} seconds (attempt ${this.retryCount}/${this.maxRetries})...`);

        this.reconnectTimeout = setTimeout(() => {
            this.connect().catch((err) => {
                console.error("Reconnection failed:", err);
            });
        }, delay);
    }

    // subscribeToNotifications(callback: Function) {
    //     console.log("Subscribe to notifications - this feature uses STOMP/SockJS");
    //     // Implement a more efficient callback registration model
    // }

    // subscribeToLikeUpdates(callback: Function) {
    //     console.log("Subscribe to like updates - this feature uses STOMP/SockJS");
    //     // Implement similar logic
    // }

    // subscribeToCommentUpdates(callback: Function) {
    //     console.log("Subscribe to comment updates - this feature uses STOMP/SockJS");
    //     // Implement similar logic
    // }

    // subscribeToFollow(callback: Function) {
    //     console.log("Subscribe to follow notification - this feature uses STOMP/SockJS");
    //     // Implement similar logic
    // }

    disconnect() {
        console.log("WebSocket is disconnecting");

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
                this.stompClient.publish({
                    destination: '/app/user.disconnect',
                    body: JSON.stringify({ userId: this.userId })
                });
            }

            // Unsubscribe from all subscriptions
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
        console.log("WebSocket is disconnected");
    }

    isConnected() {
        return this.connected && !!this.stompClient?.connected;
    }
}

export default new NotificationSocketService(); 