import React, { useEffect } from 'react';
import { ChatList } from './ChatList';
import { ChatContainer } from './ChatContainer';
import { useAuthStore } from '@/stores/useAuthStore';
import { useChatStore } from '@/stores/useChatStore';
import { useNavigate } from 'react-router-dom';

export function ChatPage() {
  const { userAuth, isAuthenticated } = useAuthStore();
  const { getUserConversations, setCurrentUserId } = useChatStore();
  const navigate = useNavigate();

  // Kiểm tra xác thực và chuyển hướng nếu chưa đăng nhập
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Thiết lập ID người dùng hiện tại và lấy danh sách cuộc trò chuyện
  useEffect(() => {
    if (userAuth?.id) {
      setCurrentUserId(userAuth.id);
      getUserConversations(userAuth.id);
    }
  }, [userAuth?.id, setCurrentUserId, getUserConversations]);

  if (!isAuthenticated) {
    return null; // Sẽ chuyển hướng đến trang đăng nhập
  }

  return (
    <div className="flex h-full">
      <div className="w-1/4 p-4">
        <ChatList />
      </div>
      
      <div className="w-3/4 p-4">
        <div className="h-full flex flex-col rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-800 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white">Tin nhắn</h1>
            <p className="text-gray-400">Chọn một cuộc trò chuyện hoặc bắt đầu trò chuyện mới</p>
          </div>
          
          <div className="flex-1 flex items-center justify-center bg-gray-800 text-gray-400 p-8">
            <div className="text-center">
              <div className="border-4 border-gray-700 rounded-full p-4 inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-300 mb-2">Tin nhắn của bạn</h2>
              <p className="max-w-md">
                Gửi ảnh và tin nhắn cho bạn bè hoặc nhóm của bạn
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cửa sổ chat nổi */}
      <ChatContainer />
    </div>
  );
} 