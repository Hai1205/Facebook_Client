import { useEffect, useState } from "react";
import { FRIEND_REQUEST } from "@/utils/interface";
import FriendRequestCard from "../cards/FriendRequestCard";
import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { UserPlus } from "lucide-react";

export default function FriendRequestTab() {
  const { getUserFriendsRequests } = useUserStore();
  const { userAuth } = useAuthStore();

  const [friendRequests, setFriendRequests] =
    useState<FRIEND_REQUEST[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      setLoading(true);
      try {
        const result = await getUserFriendsRequests(userAuth?.id as string);
        if (result) {
          setFriendRequests(result);
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, [getUserFriendsRequests, userAuth]);

  const handleAccept = (id: string) => {
    setFriendRequests(friendRequests.filter((request) => request.id !== id));
  };

  const handleDelete = (id: string) => {
    setFriendRequests(friendRequests.filter((request) => request.id !== id));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white dark:bg-zinc-900 p-6">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus className="h-5 w-5 text-blue-500" />
        <h2 className="font-semibold text-lg">Friend Requests</h2>
        {friendRequests.length > 0 && (
          <span className="bg-blue-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
            {friendRequests.length}
          </span>
        )}
      </div>

      {friendRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <UserPlus className="h-12 w-12 mb-3 opacity-50" />
          <p className="text-center">No friend requests</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {friendRequests.map((request) => (
            <FriendRequestCard
              key={request.id}
              request={request}
              onAccept={handleAccept}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
