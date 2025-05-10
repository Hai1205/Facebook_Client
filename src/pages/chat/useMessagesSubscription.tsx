import { useEffect, useState } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { WebSocketApi } from "@/utils/socket/WebSocketApi";

interface UseMessagesSubscriptionProps {
  onNewMessage?: (message: any) => void;
}

export const useMessagesSubscription = ({
  onNewMessage,
}: UseMessagesSubscriptionProps = {}) => {
  const {
    isWebSocketConnected,
    conversations,
    addMessage,
    currentUserId,
    updateConversationWithLatestMessage,
  } = useChatStore();
  const { userAuth } = useAuthStore();
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const userId = userAuth?.id || currentUserId;
    if (!userId || !isWebSocketConnected) return;

    const subscribeToUserMessages = async () => {
      try {
        await WebSocketApi.ensureConnected();

        // Đăng ký nhận tin nhắn cá nhân
        WebSocketApi.subscribeToUserMessages();

        // Đăng ký nhận thông báo
        const notificationSubscription = WebSocketApi.subscribe(
          `/user/${userId}/queue/notifications`,
          (message) => {
            try {
              const notification = JSON.parse(message.body);

              // Hiển thị thông báo nếu trình duyệt hỗ trợ
              if (
                notification.type === "NEW_MESSAGE" &&
                Notification.permission === "granted"
              ) {
                new Notification("Tin nhắn mới", {
                  body: `${notification.senderName} đã gửi cho bạn một tin nhắn mới`,
                  icon: "/favicon.ico",
                });
              }
            } catch (error) {
              console.error("Error processing notification:", error);
            }
          }
        );

        // Đăng ký theo dõi tất cả các cuộc trò chuyện hiện tại
        for (const conversation of conversations) {
          if (conversation.id) {
            await WebSocketApi.subscribeToConversation(conversation.id);
          }
        }

        setIsSubscribed(true);

        return () => {
          // Cleanup subscriptions
          if (notificationSubscription) {
            notificationSubscription.unsubscribe();
          }
        };
      } catch (error) {
        console.error("Error subscribing to messages:", error);
      }
    };

    const cleanup = subscribeToUserMessages();

    // Yêu cầu quyền thông báo nếu chưa được cấp
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }

    return () => {
      // Cleanup subscriptions
      if (cleanup) {
        cleanup.then((unsubscribe) => {
          if (unsubscribe) unsubscribe();
        });
      }
    };
  }, [isWebSocketConnected, currentUserId, userAuth?.id, conversations]);

  return { isSubscribed };
};
