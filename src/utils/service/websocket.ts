// 
// File này được tạo để thông báo rằng Socket.IO đã bị vô hiệu hóa
// Tất cả các kết nối WebSocket phải sử dụng SockJS/STOMP thay vì Socket.IO
//

import { useEffect } from "react";

console.warn("[WebSocket] Socket.IO đã bị vô hiệu hóa. Ứng dụng sẽ sử dụng SockJS/STOMP.");

// Hook giả để thay thế useWebSocket cũ
export function useWebSocket() {
    useEffect(() => {
        console.warn("[WebSocket] Cố gắng sử dụng Socket.IO đã bị chặn. Hãy dùng SockJS/STOMP.");
    }, []);

    return {
        me: '',
        stream: null,
        remoteStream: null,
        receivingCall: false,
        callAccepted: false,
        isVideoCallActive: false,
        caller: '',
        name: '',
        callUser: () => console.warn("[WebSocket] Socket.IO callUser() đã bị vô hiệu hóa."),
        answerCall: () => console.warn("[WebSocket] Socket.IO answerCall() đã bị vô hiệu hóa."),
        leaveCall: () => console.warn("[WebSocket] Socket.IO leaveCall() đã bị vô hiệu hóa."),
        sendFollowNotification: () => console.warn("[WebSocket] Socket.IO sendFollowNotification() đã bị vô hiệu hóa."),
        sendMessage: () => console.warn("[WebSocket] Socket.IO sendMessage() đã bị vô hiệu hóa."),
        // Thêm các phương thức mock khác nếu cần thiết
    };
} 