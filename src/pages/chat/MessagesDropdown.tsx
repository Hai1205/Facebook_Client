import { User, Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { mockUserChats } from "@/utils/fakeData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { USER } from "@/utils/interface";

interface MessagesDropdownProps {
  onChatStart: (user: USER) => void;
}

interface CHAT {
  id: string;
  user: USER;
  lastMessage: string;
  time: string;
  unread: boolean;
  online: boolean;
}

export function MessagesDropdown({ onChatStart }: MessagesDropdownProps) {
  const [chats, setChats] = useState<CHAT[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchChats = async () => {
      setChats(mockUserChats);
    };

    fetchChats();
  }, []);

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

      <ScrollArea className="max-h-96 h-[80vh] overflow-hidden">
        {chats
          .filter((chat) =>
            chat.user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((chat) => (
            <div
              key={chat.id}
              className={`p-3 hover:bg-gray-800 cursor-pointer flex items-center ${
                chat.unread ? "bg-gray-800/50" : ""
              }`}
              onClick={() => onChatStart(chat.user)}
            >
              <div className="mr-3 relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={chat.user.avatarPhotoUrl} />

                  <AvatarFallback className="bg-gray-600">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>

                {chat.online && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-800"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-semibold truncate">{chat.user.fullName}</p>

                  <p className="text-xs text-gray-400">{chat.time}</p>
                </div>

                <p className="text-sm text-gray-400 truncate">
                  {chat.lastMessage}
                </p>
              </div>

              {chat.unread && (
                <div className="h-2 w-2 rounded-full bg-[#1877F2] ml-2" />
              )}
            </div>
          ))}
      </ScrollArea>
    </div>
  );
}
