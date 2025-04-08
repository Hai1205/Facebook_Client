import { CircleUserRound, Loader2, User } from "lucide-react";
import { Link } from "react-router-dom";
import { User as USER } from "@/utils/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserResultsProps {
  users: USER[];
  query: string;
  isLoading: boolean;
}

export function UserResults({ users, query, isLoading }: UserResultsProps) {
  if (isLoading) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-center"
        style={{ marginTop: "100px" }}
      >
        <Loader2 className="h-12 w-12 text-muted-foreground mb-4 animate-spin" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-center"
        style={{ marginTop: "50px" }}
      >
        <CircleUserRound className="h-12 w-12 text-muted-foreground mb-4" />

        <h3 className="text-lg font-medium">No user found</h3>

        <p className="text-muted-foreground mt-1">
          We couldn't find any user matching "{query}"
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {users.map((user) => (
        <Link to={`/profile/${user?.id}`} key={user.id}>
          <div className="flex flex-col overflow-hidden rounded-lg border transition-all hover:shadow-md">
            <div className="relative aspect-square overflow-hidden">
              <Avatar className="absolute inset-0 w-full h-full !rounded-none">
                <AvatarImage
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />

                <AvatarFallback className="absolute inset-0 flex items-center justify-center text-8xl font-bold !rounded-none">
                  <User className="h-20 w-20" />
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex flex-col p-4">
              <h3 className="hover:underline font-semibold line-clamp-1">
                {user.fullName}
              </h3>

              <p className="hover:underline text-sm text-muted-foreground">
                @{user.username}
              </p>

              <div className="mt-2">
                <span className="text-xs text-muted-foreground">
                  {user.albums.length}{" "}
                  {user.albums.length > 1 ? " albums" : " album"}
                </span>

                <span className="ml-2 text-xs text-muted-foreground">
                  {user.songs.length}{" "}
                  {user.songs.length > 1 ? " songs" : " song"}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
