import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Import polyfill cho WebSocket
import "@/utils/service/sockjs-setup";

// Mock socket.io-client để tránh lỗi kết nối
import { MockSocketIO } from "@/utils/service/socketConfig";

import "@/index.css";
import App from "@/App.tsx";

// Tạo biến global cho môi trường browser
if (typeof window !== "undefined") {
  window.global = window;

  // Vô hiệu hóa hoàn toàn Socket.IO, chỉ sử dụng SockJS/STOMP qua Spring Boot
  (window as any).io = () => {
    console.warn("Socket.IO đã bị vô hiệu hóa. Đang sử dụng SockJS/STOMP.");
    return new MockSocketIO();
  };
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
