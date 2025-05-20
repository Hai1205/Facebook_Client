import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck } from "lucide-react";
import { USER } from "@/utils/interface";
import { Link } from "react-router-dom";

interface FriendItemsProps {
  friend: USER;
}

export const FriendItems = ({
  friend,
}: FriendItemsProps) => {
  return (
    <div
      className="bg-zinc-900 p-4 rounded-lg flex items-start justify-between"
    >
      <div className="flex items-center space-x-4">
        <Link to={`/profile/${friend?.id}`}>
          <Avatar>
            <AvatarImage src={friend?.avatarPhotoUrl} alt={friend?.fullName} />

            <AvatarFallback className="bg-zinc-700 text-white">
              {friend?.fullName?.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div>
          <Link to={`/profile/${friend?.id}`}>
            <p className="font-bold flex items-center">
              <span className="text-xl text-white">{friend?.fullName}</span>

              {friend?.celebrity && (
                <BadgeCheck className="ml-2 h-4 w-4 text-[#1877F2]" />
              )}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};
