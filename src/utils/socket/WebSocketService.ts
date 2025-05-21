import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useChatStore } from "@/stores/useChatStore";
import { serverUrl } from "@/lib/utils";

class WebSocketService {
  private stompClient: any;
  private connected: boolean;
  private connecting: boolean;
  private subscriptions: any[];
  private reconnectTimeout: any;
  private apiUrl: string;
  private connectionCheckInterval: any;
  private retryCount: number;
  private maxRetries: number;
  private dispatch: any;

  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.connecting = false;
    this.subscriptions = [];
    this.reconnectTimeout = null;
    this.apiUrl = serverUrl || "http://localhost:4040";
    this.connectionCheckInterval = null;
    this.retryCount = 0;
    this.maxRetries = 5;

    if (typeof window !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          console.log("Tab became visible, checking WebSocket connection...");
          if (!this.isReallyConnected()) {
            console.log(
              "WebSocket disconnected while inactive, reconnecting..."
            );
            this.reconnect();
          }
        }
      });

      window.addEventListener("online", () => {
        console.log("Network connection restored, reconnecting WebSocket...");
        this.reconnect();
      });
    }
  }

  isReallyConnected(): boolean {
    return this.stompClient && this.connected && this.stompClient.connected;
  }

  startConnectionMonitoring(): void {
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
    }

    this.connectionCheckInterval = setInterval(() => {
      if (
        this.connected &&
        (!this.stompClient || !this.stompClient.connected)
      ) {
        console.warn(
          "WebSocket connection state mismatch detected, reconnecting..."
        );
        this.connected = false;
        if (this.dispatch) {
          useChatStore.getState().setWebSocketConnected(false);
        }
        this.reconnect();
      }

      if (this.stompClient && this.stompClient.connected) {
        try {
          const ws = this.stompClient.ws;
          const isConnected =
            ws?.readyState === 1 || ws?._transport?.readyState === 1;

          if (!isConnected) {
            throw new Error("WebSocket connection appears broken");
          }
        } catch (e) {
          console.warn("Error checking WebSocket connection status:", e);
          this.connected = false;
          if (this.dispatch) {
            useChatStore.getState().setWebSocketConnected(false);
          }
          this.reconnect();
        }
      }
    }, 30000);
  }

  init(dispatch: any): void {
    if (!dispatch) {
      console.error("WebSocketService init requires a dispatch function");
      return;
    }

    this.dispatch = dispatch;

    if (dispatch.getState) {
      this.dispatch._getState = dispatch.getState;
    }

    console.log("WebSocketService initialized with dispatch");
  }

  getUserId(): any {
    const state = this.getReduxState();
    const reduxUserId = state?.chat?.currentUserId || state?.login?.userInfo?.id;

    const localStorageUserId = localStorage.getItem('userId') || localStorage.getItem('user_id');

    const zustandUserId = useChatStore.getState().currentUserId;

    return reduxUserId || zustandUserId || (localStorageUserId ? parseInt(localStorageUserId) : null);
  }

  ensureUserId(): Promise<any> {
    const userId = this.getUserId();
    if (!userId) {
      console.error("No user ID available from any source");
      return Promise.reject(new Error("No user ID available"));
    }
    return Promise.resolve(userId);
  }

  getReduxState(): any {
    if (!this.dispatch || !this.dispatch._getState) {
      return null;
    }
    return this.dispatch._getState();
  }

  connect(): Promise<any> {
    if (this.isReallyConnected()) return Promise.resolve();

    if (this.connecting) {
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (this.isReallyConnected()) {
            clearInterval(checkInterval);
            resolve(void 0);
          } else if (!this.connecting) {
            clearInterval(checkInterval);
            reject(new Error("Connection attempt failed"));
          }
        }, 100);

        setTimeout(() => {
          if (!this.isReallyConnected()) {
            clearInterval(checkInterval);
            this.connecting = false;
            reject(new Error("Connection timeout"));
          }
        }, 30000);
      });
    }

    this.connecting = true;
    this.retryCount = 0;
    console.log("Connecting to WebSocket...");

    return new Promise((resolve, reject) => {
      try {
        if (this.stompClient) {
          try {
            this.disconnect();
          } catch (e) {
            console.warn("Error disconnecting old client:", e);
          }
        }

        const wsBaseUrl = this.apiUrl;

        console.log(`Connecting to WebSocket at ${wsBaseUrl}/ws`);
        const socket = new SockJS(`${wsBaseUrl}/ws`);
        this.stompClient = Stomp.over(socket);

        this.stompClient.debug = () => { };

        const headers: Record<string, string> = {};
        const token = localStorage.getItem("accessToken");
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        this.stompClient.connect(
          headers,
          (frame: any) => {
            console.log("WebSocket connected successfully!");
            this.connected = true;
            this.connecting = false;
            this.retryCount = 0;

            if (this.dispatch) {
              useChatStore.getState().setWebSocketConnected(true);
            }

            this.subscribeToUserMessages();
            this._resubscribeToActiveConversations();

            resolve(frame);
          },
          (error: any) => {
            console.error("WebSocket connection error:", error);
            console.error(
              "Error detail:",
              typeof error === "string"
                ? error
                : error.message || "Unknown error"
            );
            this.connected = false;
            this.connecting = false;

            if (this.dispatch) {
              useChatStore.getState().setWebSocketConnected(false);
            }

            reject(error);
          }
        );
      } catch (error) {
        console.error("Error setting up WebSocket:", error);
        this.connected = false;
        this.connecting = false;
        reject(error);
      }
    });
  }

  reconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.retryCount >= this.maxRetries) {
      console.error(
        `Exceeded maximum reconnection attempts (${this.maxRetries})`
      );
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.retryCount), 30000);
    this.retryCount++;

    console.log(
      `Attempting to reconnect WebSocket in ${delay / 1000} seconds (attempt ${this.retryCount
      }/${this.maxRetries})...`
    );

    this.reconnectTimeout = setTimeout(() => {
      this.connect().catch((err: any) => {
        console.error("Reconnection failed:", err);
      });
    }, delay);
  }

  subscribeToUserMessages(): void {
    if (!this.connected || !this.stompClient) {
      console.warn(
        "Cannot subscribe to user messages: Not connected, will try after connecting"
      );
      return;
    }

    const userId = this.getUserId();
    if (!userId) {
      console.error("Cannot subscribe to user messages: No user ID available");
      const state = this.getReduxState();
      const potentialUserId =
        state?.login?.userInfo?.id || state?.chat?.currentUserId;
      if (potentialUserId) {
        console.log(`Found userId ${potentialUserId} from Redux store`);
        this._doSubscribeToUserMessages(potentialUserId);
      } else {
        console.error("No user ID found in Redux store either");
      }
      return;
    }

    this._doSubscribeToUserMessages(userId);
  }

  _doSubscribeToUserMessages(userId: any): void {
    const existingSub = this.subscriptions.find(
      (sub) => sub.id === `user-${userId}`
    );
    if (existingSub) {
      console.log(`Already subscribed to user ${userId} messages`);
      return;
    }

    try {
      console.log(`Subscribing to user ${userId} messages queue`);

      const subscription1 = this.stompClient.subscribe(
        `/user/${userId}/queue/messages`,
        (message: any) => this._handleIncomingMessage(message, "user-queue")
      );

      subscription1.id = `user-${userId}-queue`;
      this.subscriptions.push(subscription1);

      const subscription2 = this.stompClient.subscribe(
        `/user/${userId}/queue/notifications`,
        (message: any) => this._handleIncomingMessage(message, "notification-queue")
      );

      subscription2.id = `user-${userId}-notifications`;
      this.subscriptions.push(subscription2);

      console.log(`Successfully subscribed to both queues for user ${userId}`);
    } catch (error) {
      console.error(`Error subscribing to user ${userId} messages:`, error);
    }
  }

  _handleIncomingMessage(message: any, source: string): void {
    try {
      const receivedMessage = JSON.parse(message.body);
      console.log(`Received message from ${source}:`, receivedMessage);

      if (!this.dispatch) {
        console.error("No dispatch function available to process message");
        return;
      }

      const enhancedMessage = {
        ...receivedMessage,
        fromWebSocket: true,
        messageSource: source,
        receivedAt: new Date().toISOString(),
      };

      useChatStore.getState().addMessage(enhancedMessage);

      if (enhancedMessage.conversationId) {
        useChatStore.getState().updateConversationWithLatestMessage(enhancedMessage);

        const currentState = this.getReduxState();
        const zustandState = useChatStore.getState();

        const currentConversationId =
          currentState?.chat?.currentConversation?.id ||
          zustandState.currentConversation?.id;

        if (currentConversationId === enhancedMessage.conversationId) {
          console.log(
            `Message belongs to current conversation, marking as read`
          );

          const currentUserId =
            currentState?.chat?.currentUserId ||
            zustandState.currentUserId;

          this.markAsRead(
            enhancedMessage.conversationId,
            currentUserId
          ).catch((err: any) =>
            console.error("Error marking message as read:", err)
          );
        }
      }
    } catch (error) {
      console.error(`Error processing message from ${source}:`, error);
    }
  }

  subscribeToConversation(conversationId: string): Promise<any> {
    if (!conversationId) {
      console.error(
        "Cannot subscribe to conversation: No conversation ID provided"
      );
      return Promise.reject(new Error("No conversation ID provided"));
    }

    const existingSubscription = this.subscriptions.find(
      (sub) => sub.id === `conversation-${conversationId}`
    );

    if (existingSubscription) {
      console.log(`Already subscribed to conversation ${conversationId}`);
      return Promise.resolve();
    }

    if (!this.connected || !this.stompClient) {
      return this.connect().then(() =>
        this._doSubscribeToConversation(conversationId)
      );
    }

    return Promise.resolve().then(() =>
      this._doSubscribeToConversation(conversationId)
    );
  }

  _doSubscribeToConversation(conversationId: string): void {
    try {
      console.log(`Subscribing to conversation ${conversationId}`);
      const subscription = this.stompClient.subscribe(
        `/topic/conversation.${conversationId}`,
        (message: any) => {
          try {
            const receivedMessage = JSON.parse(message.body);
            console.log("Received message via WebSocket:", receivedMessage);

            if (this.dispatch) {
              useChatStore.getState().addMessage({
                ...receivedMessage,
                fromWebSocket: true,
              });
            }
          } catch (error) {
            console.error("Error processing message:", error);
          }
        }
      );

      subscription.id = `conversation-${conversationId}`;
      this.subscriptions.push(subscription);
    } catch (error) {
      console.error(
        `Error subscribing to conversation ${conversationId}:`,
        error
      );
    }
  }

  sendMessage(message: any): Promise<any> {
    if (!message || !message.conversationId) {
      console.error("Cannot send message: Invalid message data", message);
      return Promise.reject(new Error("Invalid message data"));
    }

    if (!this.connected || !this.stompClient) {
      console.log("Connecting before sending message");
      return this.connect()
        .then(() => this._doSendMessage(message))
        .catch((err: any) => {
          console.error("Failed to connect for sending message:", err);
          return Promise.reject(err);
        });
    }

    return this._doSendMessage(message);
  }

  _doSendMessage(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.stompClient || !this.connected) {
        console.error("STOMP client not connected in _doSendMessage");
        return reject(new Error("STOMP client not connected"));
      }

      try {
        console.log(
          `Sending message to conversation ${message.conversationId}:`,
          message
        );

        const messageToSend = {
          id: message.id,
          conversationId: message.conversationId,
          senderId: message.senderId,
          content: message.content,
        };

        this.stompClient.send(
          `/app/chat/${message.conversationId}`,
          {
            "content-type": "application/json",
          },
          JSON.stringify(messageToSend)
        );

        console.log("Message sent successfully via WebSocket");
        resolve(true);
      } catch (error) {
        console.error("Error sending message via WebSocket:", error);
        this.handleConnectionError();
        reject(error);
      }
    });
  }

  markAsRead(conversationId: string, userId: string): Promise<any> {
    if (!conversationId || !userId) {
      console.error("Cannot mark as read: Missing conversationId or userId");
      return Promise.reject(new Error("Missing conversationId or userId"));
    }

    if (!this.connected || !this.stompClient) {
      console.log("Connecting before marking as read");
      return this.connect()
        .then(() => this._doMarkAsRead(conversationId, userId))
        .catch((err: any) => {
          console.error("Failed to connect for marking as read:", err);
          return Promise.reject(err);
        });
    }

    return this._doMarkAsRead(conversationId, userId);
  }

  _doMarkAsRead(conversationId: string, userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        console.log(
          `Marking conversation ${conversationId} as read by user ${userId}`
        );

        this.stompClient.send(
          `/app/chat/${conversationId}/read`,
          {},
          userId.toString()
        );

        useChatStore.getState().markMessagesAsRead({ conversationId, userId });

        resolve(true);
      } catch (error) {
        console.error("Error marking as read:", error);
        reject(error);
      }
    });
  }

  handleConnectionError(): void {
    console.log("Connection error detected, attempting to reconnect...");
    this.connected = false;
    if (this.dispatch) {
      useChatStore.getState().setWebSocketConnected(false);
    }
    this.reconnect();
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
      this.connectionCheckInterval = null;
    }

    this.subscriptions.forEach((subscription) => {
      try {
        if (subscription && typeof subscription.unsubscribe === "function") {
          subscription.unsubscribe();
        }
      } catch (e) {
        console.warn("Error unsubscribing:", e);
      }
    });
    this.subscriptions = [];

    if (this.stompClient) {
      try {
        if (this.connected && this.stompClient.connected) {
          this.stompClient.disconnect();
          console.log("WebSocket disconnected");
        }
      } catch (e) {
        console.error("Error disconnecting WebSocket:", e);
      }
      this.stompClient = null;
    }

    this.connected = false;
    this.connecting = false;

    if (this.dispatch) {
      useChatStore.getState().setWebSocketConnected(false);
    }
  }

  isConnected(): boolean {
    return this.connected && this.stompClient && this.stompClient.connected;
  }

  ensureConnected(): Promise<any> {
    if (this.isConnected()) {
      return Promise.resolve();
    }

    console.log("WebSocket not connected, establishing connection...");
    return this.connect();
  }

  initialSetupForConversation(conversationId: string, userId: string): Promise<any> {
    if (!conversationId || !userId)
      return Promise.reject(new Error("Missing parameters"));

    // Lưu userId vào Zustand store
    useChatStore.getState().setCurrentUserId(userId);

    return this.connect()
      .then(() => {
        return this._doSubscribeToConversation(conversationId);
      })
      .then(() => {
        console.log(`Successfully set up conversation ${conversationId}`);
        return true;
      })
      .catch((err: any) => {
        console.error("Error setting up conversation:", err);
        return false;
      });
  }

  _resubscribeToActiveConversations(): void {
    const currentState = this.getReduxState();
    const zustandState = useChatStore.getState();

    const conversationId =
      currentState?.chat?.currentConversation?.id ||
      zustandState.currentConversation?.id;

    if (conversationId) {
      console.log(`Re-subscribing to active conversation: ${conversationId}`);
      this._doSubscribeToConversation(conversationId);
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
