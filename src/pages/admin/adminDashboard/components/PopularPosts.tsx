import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStatStore } from "@/stores/useStatStore";
import { Link } from "react-router-dom";
import { POST } from "@/utils/interface";
import { PostSkeletonLoading } from "./skeletons/PostSkeletonLoading";
import { formatNumberStyle } from "@/lib/utils";
import { BadgeCheck } from "lucide-react";
import { ViewPostModal } from "@/pages/post/components/posts/ViewPostModal";

export function PopularPosts() {
  const { isLoading, popularPosts, getPopularPostStat } = useStatStore();

  const [posts, setPosts] = useState<POST[]>(popularPosts);
  const [isViewOpen, setViewOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<POST | null>(null);

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
    <>
      <ScrollArea className="h-[310px] pr-4">
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post?.id}
              className="relative flex items-center justify-between gap-4 rounded-lg border p-3 pr-12 hover:bg-muted/50 group cursor-pointer"
              onClick={() => {
                setSelectedPost(post);
                setViewOpen(true);
              }}
            >
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-white">
                    {post?.content?.substring(0, 25)}{" "}
                    {post?.content?.length > 25 && "..."}
                  </div>

                  <div>
                    <Link
                      to={`/profile/${post?.user?.id}`}
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      <p className="text-s font-bold flex items-center">
                        <span className="font-medium hover:underline text-white">
                          {post?.user?.fullName || "Facebook User"}
                        </span>

                        {post?.user?.celebrity && (
                          <BadgeCheck className="ml-2 h-4 w-4 text-[#1877F2]" />
                        )}
                      </p>
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
      
      <ViewPostModal
        isOpen={isViewOpen}
        onOpenChange={setViewOpen}
        post={selectedPost as POST}
      />
    </>
  );
}
