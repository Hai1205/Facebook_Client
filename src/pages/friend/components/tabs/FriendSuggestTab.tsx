import { useEffect, useState } from "react";
import { USER } from "@/utils/interface";
import FriendSuggestCard from "../cards/FriendSuggestCard";
import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Users } from "lucide-react";

export default function FriendSuggestTab() {
  const { getSuggestedUsers, sendFriendRequest } = useUserStore();
  const { userAuth } = useAuthStore();

  const [friendSuggestions, setFriendSuggestions] = useState<USER[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendSuggestions = async () => {
      setLoading(true);

      const result = await getSuggestedUsers(userAuth?.id as string);
      if (result) {
        setFriendSuggestions(result);
      }
      
      setLoading(false);
    };

    fetchFriendSuggestions();
  }, [getSuggestedUsers, userAuth]);

  const handleSendFriendRequest = (userId: string) => {
    sendFriendRequest(userAuth?.id as string, userId);
  };

  const handleAddFriend = (userId: string) => {
    handleSendFriendRequest(userId);
  };

  const handleDelete = (userId: string) => {
    setFriendSuggestions(
      friendSuggestions.filter((suggest) => suggest.id !== userId)
    );
  };

  const handleCancelRequest = (userId: string) => {
    handleSendFriendRequest(userId);
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
        <Users className="h-5 w-5 text-blue-500" />
        <h2 className="font-semibold text-lg">People you may know</h2>
        {friendSuggestions.length > 0 && (
          <span className="bg-blue-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
            {friendSuggestions.length}
          </span>
        )}
      </div>

      {friendSuggestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Users className="h-12 w-12 mb-3 opacity-50" />
          <p className="text-center">No friend suggestions</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {friendSuggestions.map((suggest) => (
            <FriendSuggestCard
              key={suggest.id}
              opponent={suggest}
              onAddFriend={handleAddFriend}
              onDelete={handleDelete}
              onCancelRequest={handleCancelRequest}
              className={
                "bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all w-50"
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}