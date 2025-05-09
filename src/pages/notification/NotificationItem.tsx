import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDateInDDMMYYY } from "@/lib/utils";
import { NOTIFICATION } from "@/utils/interface";
import { MessageSquareMore, ThumbsUp, UserRoundPlus } from "lucide-react";

interface NotificationItemProps {
  notification: NOTIFICATION;
}

export default function NotificationItem({
  notification,
}: NotificationItemProps) {
  const typesStyles = {
    FOLLOW: "text-purple-500 border-purple-500",
    LIKE: "text-green-500 border-green-500",
    COMMENT: "text-blue-500 border-blue-500",
    FRIEND_REQUEST: "text-yellow-500 border-yellow-500",
  };

  return (
    <div
      className={`p-3 hover:bg-gray-800 cursor-pointer flex items-start ${
        !notification.read ? "bg-gray-800/50" : ""
      }`}
    >
      <div className="mr-3 relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={notification?.from?.avatarPhotoUrl || ""} />

          <AvatarFallback className="bg-gray-600">
            <UserRoundPlus className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>

        <div
          className={`absolute -bottom-1 -right-1 rounded-full p-1 ${
            typesStyles[notification.type] || "text-gray-500 border-gray-500"
          }`}
        >
          {notification.type === "FOLLOW" ? (
            <UserRoundPlus className="h-5 w-5" />
          ) : notification.type === "LIKE" ? (
            <ThumbsUp className="h-5 w-5" />
          ) : notification.type === "FRIEND_REQUEST" ? (
            <UserRoundPlus className="h-5 w-5" />
          ) : (
            <MessageSquareMore className="h-5 w-5" />
          )}
        </div>
      </div>

      <div className="flex-1">
        <p className="text-sm">
          <span className="font-semibold">{notification.from.fullName}</span>
          {notification.type === "FOLLOW"
            ? " followed you"
            : notification.type === "LIKE"
            ? " liked your post"
            : notification.type === "FRIEND_REQUEST"
            ? " sent you a friend request"
            : " commented on your post"}
        </p>

        <p className="text-xs text-gray-400 mt-1">
          {formatDateInDDMMYYY(notification?.createdAt || "")}
        </p>
      </div>

      {!notification.read && (
        <div className="h-2 w-2 rounded-full bg-[#1877F2] mt-2" />
      )}
    </div>
  );
}
