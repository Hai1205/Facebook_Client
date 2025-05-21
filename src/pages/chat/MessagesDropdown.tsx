import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CONVERSATION, USER } from "@/utils/interface";
import { mockChatBot } from "@/utils/fakeData";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { ChatMessageItem } from "./components/ChatMessageItem";

interface MessagesDropdownProps {
  onChatStart: (user: USER) => void;
}

export function MessagesDropdown({ onChatStart }: MessagesDropdownProps) {
  const { conversations } = useChatStore();
  const { userAuth } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      const otherParticipant = conversation?.participants?.find(
        (participant) => participant?.user?.id !== userAuth?.id
      );

      return otherParticipant?.user?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [conversations, searchTerm, userAuth]);

  const handleChatStart = (conversation: CONVERSATION) => {
    const otherParticipant = conversation?.participants?.find(
      (participant) => participant?.user?.id !== userAuth?.id
    );

    onChatStart(otherParticipant?.user as USER);
  };

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

        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <ChatMessageItem
              key={conversation?.id}
              conversation={conversation}
              onClick={() => handleChatStart(conversation)}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-400">
            No conversations found
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
