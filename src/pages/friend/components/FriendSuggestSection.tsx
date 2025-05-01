import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { USER } from "@/utils/interface";
import { useAuthStore } from "@/stores/useAuthStore";
import FriendSuggestCard from "./cards/FriendSuggestCard";
import { useUserStore } from "@/stores/useUserStore";
import { Link } from "react-router-dom";
import { useOpenStore } from "@/stores/useOpenStore";

interface FriendSuggestSectionProps {
  limit?: number;
}

const FriendSuggestSection = ({ limit }: FriendSuggestSectionProps) => {
  const { userAuth } = useAuthStore();
  const { getSuggestedUsers, sendFriendRequest } = useUserStore();
  const { setActiveTab } = useOpenStore();

  const [friendSuggest, setFriendSuggest] = useState<USER[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchStories = useCallback(async () => {
    const friendSuggest = await getSuggestedUsers(userAuth?.id as string);

    if (friendSuggest) {
      if (limit) {
        setFriendSuggest(friendSuggest.slice(0, limit));
      } else {
        setFriendSuggest(friendSuggest);
      }
    }
  }, [getSuggestedUsers, limit, userAuth]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const updateMaxScroll = () => {
        setMaxScroll(container.scrollWidth - container.offsetWidth);
        setScrollPosition(container.scrollLeft);
      };
      updateMaxScroll();
      window.addEventListener("resize", updateMaxScroll);
      return () => window.removeEventListener("resize", updateMaxScroll);
    }
  }, []);

  const scroll = (direction: string) => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      setScrollPosition(container.scrollLeft);
    }
  };

  useEffect(() => {
    const fetchFriendRequests = async () => {
      const result = await getSuggestedUsers(userAuth?.id as string);

      if (result) {
        setFriendSuggest(result);
      }
    };

    fetchFriendRequests();
  }, [getSuggestedUsers, userAuth]);

  const handleSendFriendRequest = (userId: string) => {
    sendFriendRequest(userAuth?.id as string, userId);
  };

  const handleAddFriend = (userId: string) => {
    const container = containerRef.current;
    if (container) {
      container.scrollBy({ left: 252, behavior: "smooth" });
    }

    handleSendFriendRequest(userId);
  };

  const handleDelete = (userId: string) => {
    setFriendSuggest(friendSuggest.filter((suggest) => suggest.id !== userId));
  };

  const handleCancelRequest = (userId: string) => {
    handleSendFriendRequest(userId);
  };

  return (
    <div className="relative rounded-xl bg-white dark:bg-zinc-900 p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          <h2 className="font-semibold text-lg">Friend Suggestions</h2>
        </div>
        {friendSuggest.length > 0 && (
          <Link to="/friends/suggestions">
            <button
              className="text-blue-500 text-xs hover:underline"
              onClick={() => setActiveTab("friends")}
            >
              See All
            </button>
          </Link>
        )}
      </div>

      {friendSuggest.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <Users className="h-12 w-12 mb-2 opacity-50" />
          <p className="text-center">No friend suggestions</p>
        </div>
      ) : (
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex space-x-3 overflow-x-hidden py-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <motion.div
            className="flex space-x-3"
            drag="x"
            dragConstraints={{
              right: 0,
              left:
                -(friendSuggest.length * 200) +
                (containerRef.current ? containerRef.current.offsetWidth : 0),
            }}
          >
            {friendSuggest?.map((suggest) => (
              <FriendSuggestCard
                key={suggest.id}
                opponent={suggest}
                onAddFriend={handleAddFriend}
                onDelete={handleDelete}
                onCancelRequest={handleCancelRequest}
                className={
                  "bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all w-60"
                }
              />
            ))}
          </motion.div>

          {/* Left side scroll button */}
          {scrollPosition > 0 && (
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-zinc-800 rounded-full shadow-md hover:shadow-lg transition-all"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Right side scroll button */}
          {scrollPosition < maxScroll && friendSuggest.length > 2 && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-zinc-800 rounded-full shadow-md hover:shadow-lg transition-all"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default FriendSuggestSection;
