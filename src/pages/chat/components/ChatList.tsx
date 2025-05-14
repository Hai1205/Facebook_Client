import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useChatStore } from '@/stores/useChatStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search } from 'lucide-react';
import { USER } from '@/utils/interface';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, isToday, isYesterday } from 'date-fns';
import { vi } from 'date-fns/locale';

export function ChatList() {
  const { userAuth } = useAuthStore();
  const { getUsersWithConversation, openChat, isUserOnline, conversations, unreadMessages } = useChatStore();
  const [users, setUsers] = useState<USER[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userAuth?.id) {
      fetchUsers();
    }
  }, [userAuth]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getUsersWithConversation(userAuth?.id as string);
      if (response) {
        // Gán conversationId cho mỗi user từ danh sách conversations
        const usersWithConversationId = response.map((user: USER) => {
          const conversation = conversations.find(conv => 
            conv.participants?.some(p => p.user.id === user.id)
          );
          
          return {
            ...user,
            conversationId: conversation?.id
          };
        });
        
        setUsers(usersWithConversationId);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = (user: USER) => {
    openChat(user);
  };

  const formatLastTime = (timestamp: string) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm', { locale: vi });
    } else if (isYesterday(date)) {
      return 'Hôm qua';
    } else {
      return format(date, 'dd/MM', { locale: vi });
    }
  };

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-gray-100 mb-2">Tin nhắn</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm bạn bè"
            className="pl-9 bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có cuộc trò chuyện nào'}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredUsers.map((user) => {
              const isOnline = isUserOnline(user.id as string);
              const conversation = conversations.find(c => c.id === user.conversationId);
              const lastMessage = conversation?.lastMessage || '';
              const lastTime = formatLastTime(conversation?.updatedAt || '');
              const unreadCount = user.conversationId ? unreadMessages[user.conversationId] || 0 : 0;
              
              return (
                <div
                  key={user.id}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => handleStartChat(user)}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatarPhotoUrl} />
                      <AvatarFallback className="bg-blue-600">
                        {user.fullName?.substring(0, 2) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-800"></span>
                    )}
                  </div>
                  
                  <div className="ml-3 flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-100 truncate">{user.fullName}</p>
                      {lastTime && (
                        <span className="text-xs text-gray-400">{lastTime}</span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-400 truncate">{lastMessage}</p>
                      {unreadCount > 0 && (
                        <div className="bg-blue-600 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
} 