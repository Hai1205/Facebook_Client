import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserX } from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";
import { USER } from "@/utils/interface";
import { useAuthStore } from "@/stores/useAuthStore";
import { getMutualFriends } from "@/lib/utils";

interface MutualFriendsProps {
  user: USER;
  isOwner: boolean;
}

const MutualFriends = ({ user, isOwner }: MutualFriendsProps) => {
  const { followUser } = useUserStore();
  const { userAuth } = useAuthStore();

  const [mutualFriends, setMutualFriends] = useState<USER[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const result = getMutualFriends(user, userAuth as USER);

        setMutualFriends(result);
      }
    };

    fetchData();
  }, [user, userAuth]);

  const handleUnfollow = async (opponentId: string) => {
    if (!userAuth) {
      return;
    }

    await followUser(userAuth?.id as string, opponentId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-4"
    >
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-300">
            Mutual Friends
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mutualFriends?.map((friend) => (
              <div
                key={friend?.id}
                className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex items-start justify-between"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    {friend?.avatarPhotoUrl ? (
                      <AvatarImage
                        src={friend?.avatarPhotoUrl}
                        alt={friend?.fullName}
                      />
                    ) : (
                      <AvatarFallback className="dark:bg-gray-400">
                        {friend?.fullName?.substring(0, 2)}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div>
                    <p className="font-semibold dark:text-gray-100">
                      {friend?.fullName}
                    </p>

                    <p className="text-sm text-gray-400">
                      {friend?.followers?.length}{" "}
                      {friend?.followers?.length === 1
                        ? "follower"
                        : "followers"}
                    </p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4 text-gray-300" />
                    </Button>
                  </DropdownMenuTrigger>

                  {isOwner && (
                    <DropdownMenuContent
                      align="end"
                      onClick={() => handleUnfollow(friend?.id as string)}
                    >
                      <DropdownMenuItem>
                        <UserX className="h-4 w-4 mr-2" /> Unfollow
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  )}
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MutualFriends;
