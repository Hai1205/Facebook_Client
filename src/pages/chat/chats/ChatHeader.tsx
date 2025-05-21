import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Video, Minus, X } from "lucide-react";
import { USER } from "@/utils/interface";

interface ChatHeaderProps {
  user: USER;
  isUserOnline: boolean;
  onToggleMinimize: () => void;
  onClose: () => void;
  handlePhoneClick: () => void;
  handleVideoClick: () => void;
  handleViewProfile: () => void;
}

export function ChatHeader({
  user,
  isUserOnline,
  onToggleMinimize,
  onClose,
  handlePhoneClick,
  handleVideoClick,
  handleViewProfile,
}: ChatHeaderProps) {
  return (
    <div
      className="flex items-center justify-between p-2 bg-gray-900 rounded-t-lg cursor-pointer"
      onClick={handleViewProfile}
    >
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={user?.avatarPhotoUrl}
            alt={user?.fullName}
          />

          <AvatarFallback className="bg-zinc-800">
            {user?.fullName?.substring(0, 2) || "FU"}
          </AvatarFallback>
        </Avatar>

        <div>
          <div className="text-sm font-medium text-white">
            {user?.fullName || "Chat User"}
          </div>
          <div className="text-xs text-gray-400">
            {isUserOnline ? "Active now" : "Offline"}
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePhoneClick();
          }}
          className="text-gray-400 hover:text-white p-1"
        >
          <Phone size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleVideoClick();
          }}
          className="text-gray-400 hover:text-white p-1"
        >
          <Video size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleMinimize();
          }}
          className="text-gray-400 hover:text-white p-1"
        >
          <Minus size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="text-gray-400 hover:text-white p-1"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
