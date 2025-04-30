import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { countMutualFriends, formateDateAgo } from "@/lib/utils";
import { useOpenStore } from "@/stores/useOpenStore";
import { FRIEND_REQUEST } from "@/utils/interface";
import { Link } from "react-router-dom";

interface FriendRequestSectionProps {
  requests: FRIEND_REQUEST[];
  onAccept: (id: string) => void;
  onDelete: (id: string) => void;
}

export const FriendRequestSection = ({
  requests,
  onAccept,
  onDelete,
}: FriendRequestSectionProps) => {
  const { setActiveTab } = useOpenStore();

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-gray-400 font-semibold text-sm">Friend Requests</h3>

        <Link to="/friend-requests">
          <button
            className="text-blue-500 text-xs hover:underline"
            onClick={() => setActiveTab("friends")}
          >
            See All
          </button>
        </Link>
      </div>

      <div className="space-y-3">
        {requests.map((request) => {
          const mutualFriendsCount = countMutualFriends(
            request.from,
            request.to
          );

          return (
            <div key={request.id} className="bg-gray-800 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={request.from.avatarPhotoUrl || "/placeholder.svg"}
                  />

                  <AvatarFallback className="bg-gray-600">
                    {request.from.fullName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">
                      {request.from.fullName}
                    </h4>

                    <span className="text-xs text-blue-500">
                      {formateDateAgo(request.from.createdAt as string)}
                    </span>
                  </div>

                  {mutualFriendsCount > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      {mutualFriendsCount} mutual
                      {mutualFriendsCount > 1 ? " friends" : " friend"}
                    </p>
                  )}
                  <div className="flex space-x-2 mt-2">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-[#166FE5] text-white text-xs h-8 px-3 rounded-md"
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
