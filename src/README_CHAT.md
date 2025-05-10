# Hệ thống Chat - Tài liệu tổng quan

## Giới thiệu

Hệ thống chat trong ứng dụng cho phép người dùng gửi và nhận tin nhắn theo thời gian thực giữa hai người dùng. Hệ thống sử dụng WebSocket (qua SockJS và STOMP) để cung cấp giao tiếp hai chiều giữa client và server.

## Kiến trúc

### Frontend

- **WebSocketService**: Singleton service quản lý kết nối WebSocket và các phương thức tương tác cơ bản
- **WebSocketApi**: API wrapper cho WebSocketService với các phương thức cao cấp hơn
- **ChatContainer**: Component chính quản lý hiển thị nhiều cửa sổ chat
- **ChatWindow**: Component hiển thị một cửa sổ chat cụ thể
- **ChatList**: Component hiển thị danh sách các cuộc trò chuyện của người dùng
- **ChatPage**: Trang chính hiển thị danh sách chat và giao diện chat
- **WebSocketProvider**: Provider component để quản lý trạng thái WebSocket trong toàn ứng dụng

### Backend

- **WebSocketConfig**: Cấu hình WebSocket/STOMP trên Spring Boot
- **MessageWebSocketController**: Controller xử lý các message WebSocket
- **MessageApi**: Service xử lý logic lưu trữ và truy vấn tin nhắn
- **Entities**: Message, Conversation, Participant, User

## Luồng dữ liệu

1. Khi ứng dụng khởi động, WebSocketProvider kết nối đến server WebSocket
2. Người dùng mở ChatPage hoặc tương tác với các người dùng khác để bắt đầu cuộc trò chuyện
3. Khi người dùng gửi tin nhắn, thông tin được gửi đến server qua WebSocket
4. Server lưu tin nhắn vào database và gửi tín hiệu đến người nhận qua WebSocket
5. Người nhận nhận được tin nhắn theo thời gian thực thông qua kênh đã đăng ký

## Tính năng chính

- **Chat theo thời gian thực**: Tin nhắn được gửi và nhận ngay lập tức
- **Trạng thái online**: Hiển thị người dùng đang online
- **Chỉ báo đang nhập**: Hiển thị khi người dùng đang nhập tin nhắn
- **Chỉ báo đã đọc**: Hiển thị khi tin nhắn đã được đọc
- **Đếm tin nhắn chưa đọc**: Đếm và hiển thị số tin nhắn chưa đọc
- **Cửa sổ chat có thể thu gọn**: Cho phép thu gọn/mở rộng cửa sổ chat
- **Tự động kết nối lại**: Tự động thử kết nối lại khi mất kết nối

## WebSocket Endpoints

### Client → Server

- `/app/chat/{conversationId}`: Gửi tin nhắn đến cuộc trò chuyện
- `/app/chat/private/{userId}`: Gửi tin nhắn riêng tư đến người dùng
- `/app/chat/{conversationId}/read`: Đánh dấu tin nhắn đã đọc
- `/app/chat/typing/{conversationId}`: Gửi trạng thái đang nhập
- `/app/userStatus`: Cập nhật trạng thái online
- `/app/ping`: Kiểm tra kết nối

### Server → Client

- `/topic/conversation.{conversationId}`: Nhận tin nhắn từ cuộc trò chuyện
- `/user/{userId}/queue/messages`: Nhận tin nhắn riêng tư
- `/topic/conversation.{conversationId}.read`: Nhận thông báo đã đọc
- `/topic/conversation.{conversationId}.typing`: Nhận thông báo đang nhập
- `/topic/onlineUsers`: Nhận danh sách người dùng đang online
- `/topic/userStatus`: Nhận cập nhật trạng thái online/offline
- `/topic/pong`: Nhận phản hồi ping

## Xử lý lỗi và phục hồi

- **Exponential Backoff**: Thử kết nối lại với thời gian chờ tăng dần
- **Heartbeat**: Gửi ping định kỳ để duy trì kết nối
- **Giao diện người dùng đáp ứng**: Hiển thị trạng thái kết nối và thông báo lỗi
- **Retry Logic**: Tự động thử lại các thao tác thất bại

## Khả năng mở rộng

Hệ thống chat được thiết kế để dễ dàng mở rộng với các tính năng mới:

- Nhóm chat (sẵn sàng hỗ trợ)
- Gửi hình ảnh và tệp
- Tin nhắn thoại
- Gọi âm thanh/video (đã tích hợp sẵn)

## Phần cải tiến

- **UI/UX**: Giao diện người dùng hiện đại, thân thiện, và đáp ứng
- **Xử lý kết nối**: Cơ chế kết nối mạnh mẽ với xử lý lỗi tốt
- **Tối ưu hóa**: Hiệu suất tốt với số lượng lớn tin nhắn
