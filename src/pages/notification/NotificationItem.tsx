import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDateInDDMMYYY } from "@/lib/utils";
import { NOTIFICATION } from "@/utils/interface";
import { MessageSquareMore, ThumbsUp, UserRoundPlus } from "lucide-react";

interface NotificationItemProps {
  notification: NOTIFICATION;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => (
  <div
    className={`p-3 hover:bg-gray-700 cursor-pointer flex items-start ${
      !notification.read ? "bg-gray-700/50" : ""
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
          notification.type === "follow"
            ? "bg-purple-500"
            : notification.type === "like"
            ? "bg-green-500"
            : "bg-[#1877F2]"
        }`}
      >
        {notification.type === "follow" ? (
          <UserRoundPlus className="h-5 w-5" />
        ) : notification.type === "like" ? (
          <ThumbsUp className="h-5 w-5" />
        ) : (
          <MessageSquareMore className="h-5 w-5" />
        )}
      </div>
    </div>

    <div className="flex-1">
      <p className="text-sm">
        <span className="font-semibold">{notification.from.fullName}</span>
        {notification.type === "follow"
          ? " followed you"
          : notification.type === "like"
          ? " liked your post"
          : " commented on your post"}
      </p>

      <p className="text-xs text-gray-400 mt-1">
        {formatDateInDDMMYYY(notification?.createdAt || "")}
      </p>
    </div>

    {!notification.read && (
      <div className="h-2 w-2 rounded-full bg-[#1877F2] mt-2"></div>
    )}
  </div>
);
