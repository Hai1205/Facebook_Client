import { User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CONVERSATION } from "@/utils/interface";
import { mockChatBot } from "@/utils/fakeData";
import { useMemo } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { formateDateAgo } from "@/lib/utils";

interface ChatMessageItemProps {
  conversation?: CONVERSATION;
  isChatBot?: boolean;
  onClick: () => void;
}

export function ChatMessageItem({
  conversation,
  onClick,
  isChatBot,
}: ChatMessageItemProps) {
  const { userAuth } = useAuthStore();

  const otherParticipant = useMemo(() => {
    return conversation?.participants?.find(
      (participant) => participant?.user?.id !== userAuth?.id
    );
  }, [conversation?.participants, userAuth?.id]);

  console.log(conversation)
  return (
    <div
      className={`p-3 hover:bg-gray-800 cursor-pointer flex items-center ${
        conversation?.unread ? "bg-gray-800/50" : ""
      }`}
      onClick={onClick}
    >
      <div className="mr-3 relative">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={
              isChatBot
                ? mockChatBot.avatarPhotoUrl
                : otherParticipant?.user?.avatarPhotoUrl
            }
          />

          <AvatarFallback className="bg-gray-600">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>

        {/* {conversation?.online && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-800" />
        )} */}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-semibold truncate">
            {isChatBot
              ? mockChatBot.fullName
              : otherParticipant?.user?.fullName}
          </p>

          <p className="text-xs text-gray-400">
            {isChatBot
              ? ""
              : conversation?.lastMessage?.createdAt
              ? formateDateAgo(conversation.lastMessage.createdAt)
              : ""}
          </p>
        </div>

        <p className="text-sm text-gray-400 truncate">
          {isChatBot
            ? "AI ready to answer your questions"
            : conversation?.lastMessage?.content || "Start a conversation..."}
        </p>
      </div>

      {conversation?.unread && (
        <div className="h-2 w-2 rounded-full bg-[#1877F2] ml-2" />
      )}
    </div>
  );
}
