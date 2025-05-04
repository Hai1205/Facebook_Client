import { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { USER } from "@/utils/interface";
import { countMutualFriends } from "@/lib/utils";

interface SearchResultsProps {
  isSearching: boolean;
  searchQuery: string;
  users: USER[];
  currentUser: USER | null;
  onUserClick: (userId: string) => void;
}

const SearchResultsComponent = ({
  isSearching,
  searchQuery,
  users,
  currentUser,
  onUserClick,
}: SearchResultsProps) => {
  const getMutualFriendsCount = (user: USER) => {
    if (!currentUser || !user) return 0;
    return countMutualFriends(currentUser, user);
  };

  return (
    <div className="absolute top-full left-0 w-full bg-zinc-800 border border-zinc-700 rounded-md shadow-lg mt-1 z-50">
      <div className="p-2">
        {isSearching ? (
          <div className="flex justify-center items-center py-4">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : users.length > 0 ? (
          <>
            <div className="px-3 py-2 text-sm font-semibold text-zinc-400 border-b border-zinc-700">
              Search results
            </div>

            <ScrollArea className="max-h-72">
              <div className="p-1">
                {users.map((user) => {
                  const mutualCount = getMutualFriendsCount(user);

                  return (
                    <div
                      className="flex items-center gap-3 p-2 hover:bg-zinc-700 rounded-md cursor-pointer transition-colors duration-200"
                      key={user?.id}
                      onClick={() => onUserClick(user?.id || "")}
                    >
                      <Avatar className="h-10 w-10 border border-zinc-700">
                        <AvatarImage
                          src={user?.avatarPhotoUrl}
                          alt={user?.fullName}
                        />
                        <AvatarFallback className="bg-zinc-800">
                          {user?.fullName?.substring(0, 2) || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {user?.fullName}
                        </span>

                        {mutualCount > 0 && (
                          <span className="text-xs text-zinc-400">
                            {mutualCount}
                            {mutualCount > 1
                              ? " mutual friends"
                              : " mutual friend"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </>
        ) : searchQuery ? (
          <div className="p-4 text-zinc-400 text-sm text-center">
            No result for "{searchQuery}"
          </div>
        ) : (
          <div className="p-4 text-zinc-400 text-sm text-center">
            Input for searching
          </div>
        )}
      </div>
    </div>
  );
};

export const SearchResults = memo(SearchResultsComponent);
