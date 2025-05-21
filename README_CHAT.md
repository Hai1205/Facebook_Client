# Hướng dẫn sử dụng hệ thống chat

Hệ thống chat của ứng dụng Facebook hỗ trợ chat 1-1, chat nhóm với các tính năng: gửi tin nhắn văn bản, chia sẻ hình ảnh, tệp đính kèm, hiển thị trạng thái online, xóa tin nhắn, v.v.

## Các thành phần chính

1. **WebSocket Service**: Xử lý kết nối thời gian thực
2. **ChatWindow**: Giao diện cửa sổ chat
3. **ChatAPI**: Các API gọi đến server
4. **Kho lưu trữ Zustand**: Quản lý trạng thái chat

## Cách sử dụng

### 1. Thiết lập kết nối WebSocket

```tsx
// Trong file App.tsx hoặc layout chính
import { useEffect } from "react";
import { connectToWebSocket } from "@/utils/service/webSocketService";
import { useAuthStore } from "@/stores/useAuthStore";

const AppLayout = () => {
  const { userAuth } = useAuthStore();

  useEffect(() => {
    if (userAuth?.id) {
      connectToWebSocket(userAuth.id, import.meta.env.VITE_API_URL || "");
    }

    return () => {
      if (userAuth?.id) {
        disconnectWebSocket(userAuth.id);
      }
    };
  }, [userAuth?.id]);

  return <>{/* Layout của ứng dụng */}</>;
};
```

### 2. Sử dụng cửa sổ chat

```tsx
import { ChatWindow } from "@/pages/chat/ChatWindow";
import { useChatStore } from "@/stores/useChatStore";

const ChatPage = () => {
  const { activeChats, startChat, closeChat } = useChatStore();

  return (
    <div>
      {activeChats.map((user) => (
        <ChatWindow
          key={user.id}
          user={user}
          onClose={() => closeChat(user.id)}
          isMinimized={false}
          onToggleMinimize={() => {
            /* Xử lý thu nhỏ */
          }}
        />
      ))}
    </div>
  );
};
```

### 3. Kiểm tra kết nối WebSocket

Sử dụng component `TestWebSocketConnection` để kiểm tra kết nối WebSocket:

```tsx
import TestWebSocketConnection from "@/components/TestWebSocketConnection";

const DebugPage = () => {
  return <TestWebSocketConnection />;
};
```

## Cách xử lý sự kiện WebSocket

### Đăng ký lắng nghe tin nhắn mới

```tsx
import { subscribeToConversation } from "@/utils/service/webSocketService";

// Trong component hoặc hook
useEffect(() => {
  if (conversation?.id) {
    subscribeToConversation(conversation.id, (message) => {
      // Xử lý tin nhắn mới
      console.log("Nhận tin nhắn mới:", message);
    });
  }
}, [conversation?.id]);
```

### Đăng ký lắng nghe trạng thái đang nhập

```tsx
import { subscribeToTypingStatus } from "@/utils/service/webSocketService";

// Trong component hoặc hook
useEffect(() => {
  if (conversation?.id) {
    subscribeToTypingStatus(conversation.id, (typingData) => {
      setIsTyping(typingData.isTyping && typingData.userId === otherUser.id);
    });
  }
}, [conversation?.id]);
```

### Gửi thông báo đang nhập

```tsx
import { sendTypingStatus } from "@/utils/service/webSocketService";

// Trong event handler của input
const handleInputChange = (e) => {
  setInput(e.target.value);

  if (conversation?.id && userAuth?.id) {
    sendTypingStatus(conversation.id, userAuth.id, true);

    // Hủy trạng thái đang nhập sau 2 giây không nhập
    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      sendTypingStatus(conversation.id, userAuth.id, false);
    }, 2000);

    setTypingTimeout(timeout);
  }
};
```

## Xử lý lỗi phổ biến

1. **Lỗi kết nối**

   - Kiểm tra server Spring Boot đã chạy chưa
   - Kiểm tra cấu hình CORS trên server
   - Kiểm tra cấu hình WebSocket trên server

2. **Tin nhắn không gửi được**

   - Kiểm tra xem kết nối WebSocket có hoạt động không
   - Kiểm tra xem người dùng có trong cuộc trò chuyện không

3. **Tệp đính kèm không tải lên được**
   - Kiểm tra cấu hình AWS S3 hoặc hệ thống lưu trữ

## Cấu hình WebSocket trên Server

### Các endpoint WebSocket

- `/ws`: Endpoint gốc cho WebSocket
- `/topic/conversation.{id}`: Kênh nhận tin nhắn cho cuộc trò chuyện
- `/topic/conversation.{id}.typing`: Kênh nhận trạng thái đang nhập
- `/topic/conversation.{id}.read`: Kênh nhận trạng thái đã đọc
- `/topic/conversation.{id}.delete`: Kênh nhận thông báo xóa tin nhắn
- `/topic/user.status`: Kênh nhận trạng thái người dùng (online/offline)

### Cấu hình biến môi trường

Đảm bảo thiết lập các biến môi trường sau trong file `.env`:

```
VITE_API_URL=http://localhost:8080
```

## Phát triển thêm

Một số tính năng có thể phát triển thêm:

1. Hỗ trợ emoji và sticker
2. Tin nhắn thoại
3. Tính năng chia sẻ vị trí
4. Chuyển tiếp tin nhắn
5. Trích dẫn tin nhắn
