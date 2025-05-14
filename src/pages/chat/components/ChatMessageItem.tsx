import { User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CHAT } from "@/utils/interface";
import { mockChatBot } from "@/utils/fakeData";

interface ChatMessageItemProps {
  chat?: CHAT;
  isChatBot?: boolean;
  onClick: () => void;
}

export function ChatMessageItem({
  chat,
  onClick,
  isChatBot,
}: ChatMessageItemProps) {
  return (
    <div
      className={`p-3 hover:bg-gray-800 cursor-pointer flex items-center ${
        chat?.unread ? "bg-gray-800/50" : ""
      }`}
      onClick={onClick}
    >
      <div className="mr-3 relative">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={
              isChatBot
                ? mockChatBot.avatarPhotoUrl
                : chat?.user?.avatarPhotoUrl
            }
          />

          <AvatarFallback className="bg-gray-600">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>

        {chat?.online && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-800" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-semibold truncate">
            {isChatBot ? mockChatBot.fullName : chat?.user?.fullName}
          </p>

          <p className="text-xs text-gray-400">{chat?.time}</p>
        </div>

        <p className="text-sm text-gray-400 truncate">{chat?.lastMessage}</p>
      </div>

      {chat?.unread && (
        <div className="h-2 w-2 rounded-full bg-[#1877F2] ml-2" />
      )}
    </div>
  );
}
