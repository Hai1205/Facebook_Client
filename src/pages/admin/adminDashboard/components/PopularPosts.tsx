import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStatStore } from "@/stores/useStatStore";
import { Link } from "react-router-dom";
import { POST } from "@/utils/interface";
import { PostSkeletonLoading } from "./PostSkeletonLoading";
import { formatNumberStyle } from "@/lib/utils";

export function PopularPosts() {
  const { isLoading, popularPosts, getPopularPostStat } = useStatStore();

  const [posts, setPosts] = useState<POST[]>(popularPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      const result = await getPopularPostStat();

      if (result) {
        setPosts(result);
      }
    };

    fetchPosts();
  }, [getPopularPostStat]);

  if (isLoading) {
    return <PostSkeletonLoading />;
  }

  return (
    <ScrollArea className="h-[310px] pr-4">
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post?.id}
            className="relative flex items-center justify-between gap-4 rounded-lg border p-3 pr-12 hover:bg-muted/50 group"
          >
            <div className="flex items-center gap-3">
              <div>
                <div className="text-white">
                  {/* <Link
                    to={`/post-details/${post.id}`}
                    className="font-medium hover:underline"
                  > */}
                  {post?.content?.substring(0, 25)}...
                  {/* </Link> */}
                </div>

                <div>
                  <Link
                    to={`/profile/${post?.user?.id}`}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    by {post?.user?.fullName || "Facebook User"}
                  </Link>
                </div>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <span>👍 {formatNumberStyle(post?.likes?.length)}</span>

                <span>💬 {formatNumberStyle(post?.comments?.length)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
