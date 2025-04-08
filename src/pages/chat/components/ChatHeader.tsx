import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/useChatStore";
import { Link } from "react-router-dom";

const ChatHeader = () => {
  const { selectedUser, onlineUsers } = useChatStore();

  if (!selectedUser) return null;

  return (
    <div className="p-4 border-b border-zinc-800">
      <div className="flex items-center gap-3">
        <Link to={`/profile/${selectedUser?.id}`}>
          <Avatar>
            <AvatarImage src={selectedUser.avatarUrl} />

            <AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
          </Avatar>
        </Link>

        <div>
          <Link to={`/profile/${selectedUser?.id}`}>
            <h2 className="font-medium hover:underline cursor-pointer">
              {selectedUser.fullName}
            </h2>
          </Link>

          <p className="text-sm text-zinc-400">
            {onlineUsers.has(selectedUser.id) ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;
