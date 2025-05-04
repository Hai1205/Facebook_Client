import { useState, useEffect, ButtonHTMLAttributes } from "react";
import { Button } from "../../../../components/ui/button";
import { UserX, Bell } from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { USER } from "@/utils/interface";

export interface FollowButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  targetUserId: string;
  profileData: USER;
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  showText?: boolean;
  variant?: "default" | "secondary" | "outline" | "ghost";
  onFollowChange?: (isFollowing: boolean) => void;
}

export function FollowButton({
  targetUserId,
  profileData,
  size = "default",
  showIcon = true,
  showText = true,
  variant = "secondary",
  onFollowChange,
  ...props
}: FollowButtonProps) {
  const { userAuth } = useAuthStore();
  const { followUser } = useUserStore();

  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userAuth?.id && profileData.followers) {
      const isUserFollowing = profileData.followers.some(
        (follower) => follower.id === userAuth.id
      );
      setIsFollowing(isUserFollowing);
    }
  }, [userAuth?.id, profileData.followers]);

  const handleFollow = async () => {
    if (!userAuth?.id || !targetUserId || isLoading) return;

    try {
      console.log("1");
      setIsLoading(true);

      const newFollowState = !isFollowing;
      setIsFollowing(newFollowState);
      onFollowChange?.(newFollowState);

      const result = await followUser(userAuth.id, targetUserId);

      if (!result) {
        setIsFollowing(!newFollowState);
        onFollowChange?.(!newFollowState);
      }
    } catch (error) {
      console.error("Follow action failed:", error);
      setIsFollowing(!isFollowing);
      onFollowChange?.(!isFollowing);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isLoading}
      onClick={handleFollow}
      className={props.className}
      {...props}
    >
      {isLoading ? (
        <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
      ) : (
        showIcon &&
        (isFollowing ? (
          <Bell className="h-4 w-4 mr-2" />
        ) : (
          <UserX className="h-4 w-4 mr-2" />
        ))
      )}

      {showText && (isFollowing ? "Following" : "Follow")}
    </Button>
  );
}
