import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash, UserPlus, X, Users } from "lucide-react";
import { USER } from "@/utils/interface";
import { countMutualFriends } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";

interface FriendSuggestCardProps {
  opponent: USER;
  onAddFriend: (id: string) => void;
  onDelete: (id: string) => void;
  onCancelRequest: (id: string) => void;
  className: string;
}

const FriendSuggestCard = ({
  opponent,
  onAddFriend,
  onDelete,
  onCancelRequest,
  className,
}: FriendSuggestCardProps) => {
  const { userAuth } = useAuthStore();
  const mutualFriendsCount = countMutualFriends(opponent, userAuth as USER);
  const [requested, setRequested] = useState(false);

  const handleAddFriend = () => {
    setRequested(true);
    onAddFriend(opponent.id as string);
  };

  const handleCancelRequest = () => {
    setRequested(false);
    onCancelRequest(opponent.id as string);
  };

  const handleDelete = () => {
    onDelete(opponent.id as string);
  };

  return (
    <Card
      key={opponent.id}
      className={`${className}`}
    >
      <div className="aspect-square relative">
        <Avatar className="w-full h-full rounded-none">
          <AvatarImage
            src={opponent?.avatarPhotoUrl || "/placeholder.svg"}
            alt={opponent?.fullName}
            className="object-cover"
          />

          <AvatarFallback className="w-full h-full text-8xl rounded-none bg-blue-100 dark:bg-zinc-700 text-blue-600 dark:text-zinc-200">
            {opponent?.fullName.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="p-4">
        <h3 className="font-semibold truncate text-zinc-900 dark:text-white">
          {opponent?.fullName}
        </h3>

        {mutualFriendsCount > 0 ? (
          <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            <Users className="h-3.5 w-3.5 mr-1" />
            {mutualFriendsCount} mutual friends
          </div>
        ) : (
          <div className="h-5" />
        )}

        <div className="grid grid-cols-1 gap-2 mt-3">
          {!requested ? (
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-1.5"
              onClick={handleAddFriend}
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Friend</span>
            </Button>
          ) : (
            <Button
              className="w-full bg-gray-500 hover:bg-gray-600 text-white transition-colors flex items-center justify-center gap-1.5"
              onClick={handleCancelRequest}
            >
              <X className="w-4 h-4" />
              <span>Cancel Request</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            className="bg-gray-700 hover:bg-red-600 text-white border-gray-600 text-xs h-8 px-3 rounded-md"
            onClick={handleDelete}
          >
            <Trash className="w-4 h-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FriendSuggestCard;
