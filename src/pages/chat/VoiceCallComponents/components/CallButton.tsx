import { Phone, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallStore } from "@/stores/useCallStore";
import { USER } from "@/utils/interface";

interface CallButtonProps {
  user: USER;
  type: "voice" | "video";
  isGroupCall?: boolean;
  participants?: USER[];
  size?: "sm" | "md" | "lg";
}

export function CallButton({
  user,
  type,
  isGroupCall = false,
  participants = [],
  size = "md",
}: CallButtonProps) {
  const { isCallActive, startCall } = useCallStore();

  const handleCall = () => {
    if (isCallActive) {
      // Có thể hiển thị thông báo rằng đang có cuộc gọi khác
      return;
    }

    startCall(user, type, isGroupCall, participants);
  };

  const sizeClasses = {
    sm: "p-1.5 rounded-full",
    md: "p-2 rounded-full",
    lg: "p-3 rounded-full",
  };

  const iconSize = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCall}
      className={`${sizeClasses[size]} hover:bg-gray-200 dark:hover:bg-gray-800`}
    >
      {type === "voice" ? (
        <Phone className={iconSize[size]} />
      ) : (
        <Video className={iconSize[size]} />
      )}
    </Button>
  );
}
