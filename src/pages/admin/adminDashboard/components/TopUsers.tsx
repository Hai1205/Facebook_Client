import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStatStore } from "@/stores/useStatStore";
import { USER } from "@/utils/interface";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserSkeletonLoading } from "./skeletons/UserSkeletonLoading";
import { formatNumberStyle } from "@/lib/utils";
import { BadgeCheck } from "lucide-react";

export function TopUsers() {
  const { isLoading, getTopUsersStat } = useStatStore();

  const [users, setUsers] = useState<USER[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getTopUsersStat();

      if (result) {
        setUsers(result);
      }
    };

    fetchUsers();
  }, [getTopUsersStat]);

  if (isLoading) {
    return <UserSkeletonLoading />;
  }

  return (
    <ScrollArea className="h-[310px] pr-4">
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between gap-4 rounded-lg border p-3 hover:bg-muted/50"
          >
            <div>
              <Link
                to={`/profile/${user?.id}`}
                className="flex items-center gap-3"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatarPhotoUrl} alt={user.fullName} />

                  <AvatarFallback className="text-white">
                    {user.fullName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="cursor-pointer">
                  <p className="text-s font-bold flex items-center">
                    <span className="font-medium hover:underline text-white">
                      {user?.fullName || "Facebook User"}
                    </span>

                    {user?.celebrity && (
                      <BadgeCheck className="ml-2 h-4 w-4 text-[#1877F2]" />
                    )}
                  </p>

                  <div className="text-sm text-muted-foreground hover:underline">
                    {user.email}
                  </div>
                </div>
              </Link>
            </div>

            <div className="text-sm text-muted-foreground">
              {formatNumberStyle(user.followers.length)}{" "}
              {user.followers.length > 1 ? "followers" : "follower"}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
