import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { FriendItems } from "./FriendItems";
import { USER } from "@/utils/interface";
import { useAuthStore } from "@/stores/useAuthStore";
import { getMutualFriends } from "@/lib/utils";

interface FriendsProps {
  user: USER;
}

const Friends = ({ user }: FriendsProps) => {
  const { userAuth } = useAuthStore();

  const [mutualFriends, setMutualFriends] = useState<USER[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (userAuth?.id === user?.id) {
        setMutualFriends([]);
        return;
      }

      if (user) {
        const result = getMutualFriends(user, userAuth as USER);

        setMutualFriends(result);
      }
    };

    fetchData();
  }, [user, userAuth]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-4"
    >
      <Card>
        {mutualFriends?.length > 0 && (
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-300">
              Mutual Friends
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mutualFriends?.map((friend) => (
                <FriendItems key={friend?.id} friend={friend} />
              ))}
            </div>
          </CardContent>
        )}

        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-300">
            Friends
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user?.friends?.map((friend) => (
              <FriendItems key={friend?.id} friend={friend} />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Friends;
