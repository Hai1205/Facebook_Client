import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
// import { useUserStore } from "@/stores/useUserStore";
import { User } from "@/utils/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);

  const { selectedUser, isLoading, setSelectedUser, onlineUsers } =
    useChatStore();
  // const { getFollowings } = useUserStore();
  const { user: userAuth } = useAuthStore();

  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        if (!userAuth) {
          return;
        }

        // const followings = await getFollowings(userAuth?.id);
        const userFollowing = userAuth?.following as User[];

        setUsers(userFollowing);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFollowings();
  }, [userAuth]);

  return (
    <div className="border-r border-zinc-800">
      <div className="flex flex-col h-full">
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-2 p-4">
            {isLoading ? (
              <UsersListSkeleton />
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center justify-center lg:justify-start gap-3 p-3 
    rounded-lg transition-colors
    ${selectedUser?.id === user.id ? "bg-zinc-800" : "hover:bg-zinc-800/50"}`}
                >
                  <div className="relative">
                    <Avatar className="size-8 md:size-12 cursor-pointer">
                      <AvatarImage src={user.avatarUrl} />

                      <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                    </Avatar>

                    <div
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-zinc-900
      ${onlineUsers.has(user.id) ? "bg-green-500" : "bg-zinc-500"}`}
                    />
                  </div>

                  <div className="flex-1 min-w-0 lg:block hidden">
                    <Link
                      to={`/profile/${user?.id}`}
                      className="font-medium truncate hover:underline text-white"
                      onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click lan ra ngoài
                    >
                      {user.fullName}
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default UsersList;
