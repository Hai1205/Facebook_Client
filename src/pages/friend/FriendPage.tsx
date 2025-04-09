import { useEffect, useState } from "react";
import FriendRequest from "./components/FriendRequest";
import FriendsSuggestion from "./components/FriendsSuggestion";
import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore";
import LeftSideBar from "@/layout/components/LeftSidebar";
import { FriendCardSkeleton, NoFriendsMessage } from "@/layout/components/Skeleton";
import { USER } from "@/utils/types";

export interface FriendComponentProps {
  friend: USER;
  isLoading: boolean;
  onAction: (id: string) => void;
}

const Page = () => {
  const { userAuth } = useAuthStore();
  const { isLoading, followUser, getUserFriendsRequests, getSuggestedUsers } =
    useUserStore();

  const [friendRequests, setFriendRequests] = useState<USER[]>([]);
  const [friendSuggestions, setFriendSuggestions] = useState<USER[]>([]);

  useEffect(() => {
    const fetchData =async()=>{
      if (userAuth) {
       const friendRequests = await getUserFriendsRequests(userAuth?.id);
        const friendSuggestions = await getSuggestedUsers(userAuth?.id);

        setFriendRequests(friendRequests);
        setFriendSuggestions(friendSuggestions);
      }
    }

    fetchData();
  }, [getSuggestedUsers, getUserFriendsRequests, userAuth]);

  const handleFollowUser = async (opponentId: string) => {
    if (userAuth) {
      await followUser(userAuth?.id, opponentId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[rgb(36,37,38)] ">
      <LeftSideBar />
      <main className="ml-0 md:ml-64 mt-16 p-6">
        <h1 className="text-2xl font-bold mb-6">Friends Requests</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6  ">
          {isLoading ? (
            <FriendCardSkeleton />
          ) : friendRequests?.length === 0 ? (
            <NoFriendsMessage
              text="No Friend Requests"
              description="Looks like you are all caught up! Why not explore and connect with new people?"
            />
          ) : (
            friendRequests?.map((friend) => (
              <FriendRequest
                key={friend.id}
                friend={friend}
                isLoading={isLoading}
                onAction={handleFollowUser}
              />
            ))
          )}
        </div>

        <h1 className="text-2xl font-bold mb-6">People you may know</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6  ">
          {isLoading ? (
            <FriendCardSkeleton />
          ) : friendSuggestions?.length === 0 ? (
            <NoFriendsMessage
              text="No Friend Suggestion"
              description="Looks like you are all caught up! Why not explore and connect with new people?"
            />
          ) : (
            friendSuggestions?.map((friend) => (
              <FriendsSuggestion
                key={friend.id}
                friend={friend}
                isLoading={isLoading}
                onAction={handleFollowUser}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Page;
