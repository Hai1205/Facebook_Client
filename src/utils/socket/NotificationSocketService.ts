import io from "socket.io-client";
import { socketUrl } from "@/lib/utils";

class NotificationSocketService {
  private socket: any;
  private connected: boolean;
  private apiUrl: string;
  private reconnectTimeout: any;
  private retryCount: number;
  private maxRetries: number;
  private heartbeatInterval: any;
  private isReconnecting: boolean;
  private userId: string = '';

  constructor() {
    this.socket = null;
    this.connected = false;
    this.apiUrl = socketUrl || "http://localhost:4041";
    this.reconnectTimeout = null;
    this.retryCount = 0;
    this.maxRetries = 10;
    this.heartbeatInterval = null;
    this.isReconnecting = false;
  }

  init(userId: string): void {
    if (!userId) {
      console.error("WebSocketService init requires userId");
      return;
    }
    this.userId = userId;
    console.log(`Initializing WebSocket for userId=${userId}`);
    this.connect();
  }

  connect(): Promise<void> {
    if (this.connected && this.socket?.connected) {
      console.log("Socket.IO already connected");
      return Promise.resolve();
    }

    if (this.isReconnecting) {
      console.log("Already attempting to reconnect...");
      return Promise.resolve();
    }

    this.isReconnecting = true;

    console.log(
      `Connecting to Socket.IO at ${this.apiUrl} with userId=${this.userId}`
    );

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.socket = io(this.apiUrl, {
      query: { userId: this.userId },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000
    });

    return new Promise<void>((resolve, reject) => {
      this.socket.on("connect", () => {
        console.log("✅ Socket.IO connected, socketId: ", this.socket.id);
        this.connected = true;
        this.retryCount = 0;
        this.isReconnecting = false;

        this.setupHeartbeat();

        resolve();
      });

      this.socket.on("connect_error", (error: any) => {
        console.error("Socket.IO connection error:", error);
        this.connected = false;
        this.isReconnecting = false;
        this.reconnect();
        reject(error);
      });

      this.socket.on("disconnect", (reason: string) => {
        console.log("Socket.IO disconnected, reason:", reason);
        this.connected = false;

        if (reason === "io server disconnect") {
          console.log("Server disconnected us, reconnecting...");
          this.reconnect();
        } else if (reason === "transport close") {
          console.log("Network issue detected, socket.io will auto-reconnect");
        }
      });

      this.socket.on("reconnect_attempt", (attempt: number) => {
        console.log(`Socket.IO reconnection attempt #${attempt}`);
      });

      this.socket.on("reconnect", (attempt: number) => {
        console.log(`Socket.IO reconnected after ${attempt} attempts`);
        this.connected = true;
        this.isReconnecting = false;
      });

      this.socket.on("reconnect_error", (error: any) => {
        console.error("Socket.IO reconnection error:", error);
      });

      this.socket.on("reconnect_failed", () => {
        console.error("Socket.IO reconnection failed after all attempts");
        this.isReconnecting = false;
        this.cleanupAndRetry();
      });

      this.socket.on("me", (userId: string) => {
        console.log("Received 'me' event: userId=", userId);
      });

      this.socket.on("error", (error: any) => {
        console.error("Socket.IO error:", error);
        this.reconnect();
      });

      this.socket.onAny((event: string, ...args: any[]) => {
        console.log(`Received event: ${event}`, args);
      });
    });
  }

  private setupHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.connected) {
        this.socket.emit("ping", { timestamp: Date.now() });

        if (!this.socket.connected) {
          console.warn("Socket appears connected but is actually disconnected");
          this.connected = false;
          this.reconnect();
        }
      }
    }, 30000);
  }

  private cleanupAndRetry() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    if (this.socket) {
      this.socket.removeAllListeners();
      try {
        this.socket.disconnect();
      } catch (e) {
        console.error("Error during socket cleanup:", e);
      }
      this.socket = null;
    }

    this.connected = false;

    setTimeout(() => {
      this.retryCount = 0;
      this.connect();
    }, 10000);
  }

  reconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.retryCount >= this.maxRetries) {
      console.error(
        `Exceeded maximum reconnection attempts (${this.maxRetries})`
      );
      this.cleanupAndRetry();
      return;
    }

    const baseDelay = 1000;
    const maxDelay = 30000;

    let delay = Math.min(maxDelay, baseDelay * Math.pow(2, this.retryCount));

    delay = delay * (0.5 + Math.random() * 0.5);

    this.retryCount++;
    console.log(
      `Đang kết nối lại sau ${(delay / 1000).toFixed(1)} giây (lần thứ ${this.retryCount}/${this.maxRetries})...`
    );

    this.reconnectTimeout = setTimeout(() => {
      if (!this.isReconnecting) {
        this.connect().catch((err) => {
          console.error("Reconnection failed:", err);
        });
      }
    }, delay);
  }

  subscribeToNotifications(callback: any) {
    if (!this.socket) {
      console.warn("Cannot subscribe to notifications: Socket not initialized");
      return;
    }

    this.socket.off("notification");

    console.log(`Subscribing to notifications for userId=${this.userId}`);
    this.socket.on("notification", (data: any) => {
      console.log("Raw notification data:", data);
      let notification;
      try {
        const jsonData = Array.isArray(data) ? data[0] : data;
        notification =
          typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
        console.log("Parsed notification:", notification);
        if (typeof callback === "function") {
          callback(notification);
        }
      } catch (e) {
        console.error(
          "Error parsing or processing notification:",
          e,
          "Raw data:",
          data
        );
        return;
      }
    });

    if (!this.connected) {
      console.warn("Socket not connected when subscribing to notifications");
    }
  }

  subscribeToLikeUpdates(callback: any) {
    if (!this.socket) {
      console.warn("Cannot subscribe to like updates: Socket not initialized");
      return;
    }

    this.socket.off("like_update");

    this.socket.on("like_update", (data: any) => {
      console.log("Received like update:", data);
      if (typeof callback === "function") {
        callback(data);
      }
    });
  }

  subscribeToCommentUpdates(callback: any) {
    if (!this.socket) {
      console.warn(
        "Cannot subscribe to comment updates: Socket not initialized"
      );
      return;
    }

    this.socket.off("comment_update");

    console.log(`Subscribing to comment updates for userId=${this.userId}`);
    this.socket.on("comment_update", (data: any) => {
      console.log("Raw comment update data:", data);
      let comment;
      try {
        const jsonData = Array.isArray(data) ? data[0] : data;
        comment =
          typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
        console.log("Parsed comment:", comment);
        if (typeof callback === "function") {
          callback(comment);
        }
      } catch (e) {
        console.error("Error parsing comment update:", e, "Raw data:", data);
        return;
      }
    });

    if (!this.connected) {
      console.warn("Socket not connected when subscribing to comment updates");
    }
  }

  subscribeToFollow(callback: any) {
    if (!this.socket) {
      console.warn(
        "Cannot subscribe to follow updates: Socket not initialized"
      );
      return;
    }

    this.socket.off("receiveFollowNotification");

    this.socket.on("receiveFollowNotification", (data: any) => {
      console.log("Raw follow update data:", data);
      let follow;
      try {
        const jsonData = Array.isArray(data) ? data[0] : data;
        follow = typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
        console.log("Parsed follow:", follow);
        if (typeof callback === "function") {
          callback(follow);
        }
      } catch (e) {
        console.error("Error parsing follow update:", e, "Raw data:", data);
        return;
      }
    });

    if (!this.connected) {
      console.warn("Socket not connected when subscribing to follow updates");
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      console.log("Socket.IO đã ngắt kết nối");
    }

    this.connected = false;
    this.isReconnecting = false;
    this.retryCount = 0;
  }

  isConnected() {
    return this.connected && this.socket && this.socket.connected;
  }
}

const notificationSocket = new NotificationSocketService();
export default notificationSocket;
