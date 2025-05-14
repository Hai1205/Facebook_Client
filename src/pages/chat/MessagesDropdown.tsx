import { Search } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CHAT, USER } from "@/utils/interface";
import { ChatMessageItem } from "@/pages/chat/components/ChatMessageItem";
import { mockChatBot } from "@/utils/fakeData";

interface MessagesDropdownProps {
  onChatStart: (user: USER) => void;
}

export function MessagesDropdown({ onChatStart }: MessagesDropdownProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [chats, setChats] = useState<CHAT[]>([]);
  useEffect(() => {
    const fetchChatBot = async () => {
      // getContacts(userAuth?.id as string).then(_setChats);
      setChats([])
    };

    fetchChatBot();
  }, []);

  const filteredChats = useMemo(() => {
    return chats.filter((contact) =>
      contact.user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [chats, searchTerm]);

  return (
    <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-50">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold">Messages</h3>
      </div>

      <div className="p-3 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />

          <input
            type="text"
            placeholder="Search chats"
            className="bg-gray-800 rounded-full pl-10 pr-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="h-[300px]">
        <ChatMessageItem
          isChatBot={true}
          onClick={() => onChatStart(mockChatBot)}
        />

        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatMessageItem
              key={chat.id}
              chat={chat}
              onClick={() => onChatStart(chat.user)}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-400">
            No conversation found
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
