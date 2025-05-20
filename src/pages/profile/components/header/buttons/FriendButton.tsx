import { useState, useEffect, ButtonHTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  UserCheck,
  UserRoundX,
  Bell,
  Check,
  X,
  UserMinus,
} from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { FRIEND_STATUS, RESPOND_STATUS } from "@/utils/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface FriendButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  targetUserId: string;
  friendRequestStatus?: FRIEND_STATUS;
  onStatusChange?: (newStatus: FRIEND_STATUS) => void;
  onFollowChange?: (isFollowing: boolean) => void;
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  showText?: boolean;
  variant?: "default" | "secondary" | "outline" | "ghost";
}

export function FriendButton({
  targetUserId,
  friendRequestStatus,
  onStatusChange,
  onFollowChange,
  size = "default",
  showIcon = true,
  showText = true,
  variant = "default",
  ...props
}: FriendButtonProps) {
  const { userAuth } = useAuthStore();
  const { sendFriendRequest, responseFriendRequest, unFriend } = useUserStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStatus, setCurrentStatus] = useState<FRIEND_STATUS>(
    friendRequestStatus || "NONE"
  );

  useEffect(() => {
    if (friendRequestStatus !== undefined) {
      setCurrentStatus(friendRequestStatus);
    }
  }, [friendRequestStatus]);

  const handleClick = async () => {
    if (!userAuth?.id || !targetUserId || isLoading) return;

    try {
      setIsLoading(true);

      if (currentStatus === "NONE") {
        const prevStatus = currentStatus;
        setCurrentStatus("SENT");
        onStatusChange?.("SENT");
        onFollowChange?.(true)

        const result = await sendFriendRequest(userAuth.id, targetUserId);
        if (!result) {
          setCurrentStatus(prevStatus);
          onStatusChange?.(prevStatus);
        }
      } else if (currentStatus === "SENT") {
        const prevStatus = currentStatus;
        setCurrentStatus("NONE");
        onStatusChange?.("NONE");

        const result = await sendFriendRequest(userAuth.id, targetUserId);
        if (!result) {
          setCurrentStatus(prevStatus);
          onStatusChange?.(prevStatus);
        }
      }
    } catch (error) {
      console.error("Friend action failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfriend = async () => {
    if (!userAuth?.id || !targetUserId || isLoading) return;

    try {
      setIsLoading(true);
      const prevStatus = currentStatus;
      setCurrentStatus("NONE");
      onStatusChange?.("NONE");
      onFollowChange?.(false);

      const result = await unFriend(userAuth.id, targetUserId);
      if (!result) {
        setCurrentStatus(prevStatus);
        onStatusChange?.(prevStatus);
      }
    } catch (error) {
      console.error("Unfriend action failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponseFriendRequest = async (action: RESPOND_STATUS) => {
    if (!userAuth?.id || !targetUserId || isLoading) return;

    try {
      setIsLoading(true);
      const prevStatus = currentStatus;

      if (action === "ACCEPT") {
        setCurrentStatus("FRIEND");
        onStatusChange?.("FRIEND");
      } else {
        setCurrentStatus("NONE");
        onStatusChange?.("NONE");
      }

      const formData = new FormData();
      formData.append("status", action);

      const result = await responseFriendRequest(
        userAuth.id,
        targetUserId,
        formData
      );

      if (!result) {
        setCurrentStatus(prevStatus);
      }
    } catch (error) {
      console.error("Friend action failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonContent = () => {
    const status = friendRequestStatus || currentStatus;

    switch (status) {
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

  const displayStatus = friendRequestStatus || currentStatus;

  if (displayStatus === "PENDING") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant || buttonVariant}
            size={size}
            disabled={isLoading}
            {...props}
          >
            {isLoading ? (
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
            ) : (
              showIcon && icon
            )}
            {showText && text}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => handleResponseFriendRequest("ACCEPT")}
            className="cursor-pointer"
          >
            <Check className="h-4 w-4 mr-2" /> Confirm
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleResponseFriendRequest("REJECT")}
            className="cursor-pointer"
          >
            <X className="h-4 w-4 mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (displayStatus === "FRIEND") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant || buttonVariant}
            size={size}
            disabled={isLoading}
            {...props}
          >
            {isLoading ? (
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
            ) : (
              showIcon && icon
            )}
            {showText && text}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleUnfriend} className="cursor-pointer">
            <UserMinus className="h-4 w-4 mr-2" /> Unfriend
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

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
