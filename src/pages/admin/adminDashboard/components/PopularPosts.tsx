import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStatStore } from "@/stores/useStatStore";
import { Link } from "react-router-dom";
import { POST } from "@/utils/interface";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PostSkeletonLoading } from "./PostSkeletonLoading";
import { formatNumberStyle } from "@/lib/utils";

export function PopularPosts() {
  const { isLoading, getPopularPostStat } = useStatStore();

  const [posts, setPosts] = useState<POST[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const result = await getPopularPostStat();

      if (result) {
        setPosts(result);
      }
    };

    fetchPosts();
  }, [getPopularPostStat]);

  const mediaTypeStyles = {
    IMAGE: "text-blue-500 border-blue-500",
    VIDEO: "text-purple-500 border-purple-500",
  };
  
  const privacyStyles = {
    PUBLIC: "text-green-500 border-green-500",
    PRIVATE: "text-gray-500 border-gray-500",
  };

  if (isLoading) {
    return <PostSkeletonLoading />;
  }

  return (
    <ScrollArea className="h-[310px] pr-4">
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="relative flex items-center justify-between gap-4 rounded-lg border p-3 pr-12 hover:bg-muted/50 group"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 rounded-md">
                <AvatarImage src={post.mediaUrl} alt={post.id} />

                <AvatarFallback>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="text-white">
                  {/* <Link
                    to={`/post-details/${post.id}`}
                    className="font-medium hover:underline"
                  > */}
                  {post.content.substring(0, 20)}...
                  {/* </Link> */}
                </div>

                <div>
                  <Link
                    to={`/profile/${post.user.id}`}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    by {post.user.fullName}
                  </Link>
                </div>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-end gap-1">
              <Badge
                variant="outline"
                className={mediaTypeStyles[post.mediaType]}
              >
                {post.mediaType}
              </Badge>
            </div>

            <div className="hidden md:flex flex-col items-end gap-1">
              <Badge
                variant="outline"
                className={privacyStyles[post.privacy]}
              >
                {post.privacy}
              </Badge>
            </div>

            <div className="hidden md:flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <span>👍 {formatNumberStyle(post.likes.length)}</span>

                <span>💬 {formatNumberStyle(post.comments.length)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
