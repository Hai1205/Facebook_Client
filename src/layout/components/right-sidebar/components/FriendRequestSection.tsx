import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface FriendRequestSectionProps {
  requests: {
    id: string;
    fullName: string;
    avatarPhotoUrl: string;
    time: string;
    mutualFriends: number;
  }[];
}

export const FriendRequestSection = ({
  requests,
}: FriendRequestSectionProps) => (
  <div>
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-gray-400 font-semibold text-sm">Friend Requests</h3>

      <a className="text-blue-500 text-xs hover:underline">See All</a>
    </div>

    <div className="space-y-3">
      {requests.map((request) => (
        <div key={request.id} className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={request.avatarPhotoUrl || "/placeholder.svg"} />

              <AvatarFallback className="bg-gray-600">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-sm">{request.fullName}</h4>

                <span className="text-xs text-gray-400">{request.time}</span>
              </div>

              <p className="text-xs text-gray-400 mt-1">
                {request.mutualFriends} mutual friends
              </p>
              <div className="flex space-x-2 mt-2">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-3 rounded-md"
                >
                  Confirm
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 hover:bg-red-600 text-white border-gray-600 text-xs h-8 px-3 rounded-md"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
