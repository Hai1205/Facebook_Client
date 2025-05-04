import { useState, useEffect, ButtonHTMLAttributes } from "react";
import { Button } from "../../../../components/ui/button";
import { UserPlus, UserCheck, UserRoundX, Bell } from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { FRIEND_STATUS } from "@/utils/types";

export interface FriendButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  targetUserId: string;
  initialStatus?: FRIEND_STATUS;
  onStatusChange?: (newStatus: FRIEND_STATUS) => void;
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  showText?: boolean;
  variant?: "default" | "secondary" | "outline" | "ghost";
}

export function FriendButton({
  targetUserId,
  initialStatus,
  onStatusChange,
  size = "default",
  showIcon = true,
  showText = true,
  variant = "default",
  ...props
}: FriendButtonProps) {
  const { userAuth } = useAuthStore();
  const { sendFriendRequest, responseFriendRequest, unFriend } = useUserStore();

  const [friendStatus, setFriendStatus] = useState<FRIEND_STATUS>(
    initialStatus || "NONE"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialStatus !== undefined) {
      setFriendStatus(initialStatus);
    }
  }, [initialStatus]);

  const handleClick = async () => {
    if (!userAuth?.id || !targetUserId || isLoading) return;

    try {
      setIsLoading(true);

      if (friendStatus === "NONE") {
        const prevStatus = friendStatus;
        setFriendStatus("SENT");
        onStatusChange?.("SENT");

        const result = await sendFriendRequest(userAuth.id, targetUserId);
        if (!result) {
          setFriendStatus(prevStatus);
          onStatusChange?.(prevStatus);
        }
      } else if (friendStatus === "SENT") {
        const prevStatus = friendStatus;
        setFriendStatus("NONE");
        onStatusChange?.("NONE");

        const result = await sendFriendRequest(userAuth.id, targetUserId);
        if (!result) {
          setFriendStatus(prevStatus);
          onStatusChange?.(prevStatus);
        }
      } else if (friendStatus === "PENDING") {
        const prevStatus = friendStatus;
        setFriendStatus("FRIEND");
        onStatusChange?.("FRIEND");

        const result = await responseFriendRequest(userAuth.id, targetUserId);
        if (!result) {
          setFriendStatus(prevStatus);
          onStatusChange?.(prevStatus);
        }
      } else if (friendStatus === "FRIEND") {
        const prevStatus = friendStatus;
        setFriendStatus("NONE");
        onStatusChange?.("NONE");

        const result = await unFriend(userAuth.id, targetUserId);
        if (!result) {
          setFriendStatus(prevStatus);
          onStatusChange?.(prevStatus);
        }
      }
    } catch (error) {
      console.error("Friend action failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonContent = () => {
    switch (friendStatus) {
      case "FRIEND":
        return {
          icon: <UserCheck className={"h-4 w-4"} />,
          text: "Friend",
          variant: "secondary" as const,
        };
      case "SENT":
        return {
          icon: <UserRoundX className={"h-4 w-4"} />,
          text: "Cancel Request",
          variant: "outline" as const,
        };
      case "PENDING":
        return {
          icon: <Bell className={"h-4 w-4"} />,
          text: "Respond",
          variant: "secondary" as const,
        };
      case "NONE":
      default:
        return {
          icon: <UserPlus className={"h-4 w-4"} />,
          text: "Add friend",
          variant: "default" as const,
        };
    }
  };

  const { icon, text, variant: buttonVariant } = getButtonContent();

  return (
    <Button
      variant={variant || buttonVariant}
      size={size}
      disabled={isLoading}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
      ) : (
        showIcon && icon
      )}
      {showText && text}
    </Button>
  );
}
