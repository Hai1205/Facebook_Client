import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { FRIEND_REQUEST } from "@/utils/interface";
import { countMutualFriends } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface FriendRequestCardProps {
  request: FRIEND_REQUEST;
  onAccept: (id: string) => void;
  onDelete: (id: string) => void;
}

const FriendRequestCard = ({
  request,
  onAccept,
  onDelete,
}: FriendRequestCardProps) => {
  const mutualFriendsCount = countMutualFriends(request.from, request.to);

  return (
    <Card
      key={request.id}
      className="bg-zinc-900 border-zinc-800 overflow-hidden"
    >
      <div className="aspect-square relative">
        <Avatar className="w-full h-full rounded-none">
          <AvatarImage
            src={request.from.avatarPhotoUrl || "/placeholder.svg"}
            alt={request.from.fullName}
            className="object-cover"
          />

          <AvatarFallback className="w-full h-full rounded-none bg-zinc-800 text-zinc-400 text-8xl">
            {request.from.fullName.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="p-3">
        <h3 className="font-medium truncate text-white">
          {request.from.fullName}
        </h3>

        {mutualFriendsCount > 0 ? (
          <div className="flex items-center text-sm text-zinc-400 mt-1">
            <Users className="h-3.5 w-3.5 mr-1" />
            {mutualFriendsCount} mutual
            {mutualFriendsCount > 1 ? " friends" : " friend"}
          </div>
        ) : (
          <div className="h-6" />
        )}

        <div className="grid grid-cols-1 gap-2 mt-3">
          <Button
            className="w-full bg-blue-600 hover:bg-[#166FE5] text-white"
            onClick={() => onAccept(request.id as string)}
          >
            Accept
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-gray-700 hover:bg-red-600 text-white border-gray-600 text-xs h-8 px-3 rounded-md"
            onClick={() => onDelete(request.id as string)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FriendRequestCard;
