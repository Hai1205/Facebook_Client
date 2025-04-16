import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, MoreHorizontal, Share2, ThumbsUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formateDateAgo, clientUrl } from "@/lib/utils";
import { COMMENT, POST } from "@/utils/types";
import PostComments from "@/pages/post/components/PostComments";

interface PostContentProps {
  post: POST;
  isLiked: boolean;
  onShare: () => void;
  onComment: (comment: COMMENT) => void;
  onLike: () => void;
}

const PostsContent = ({
  post,
  isLiked,
  onShare,
  onComment,
  onLike,
}: PostContentProps) => {
  const [showComments, setShowComments] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const commentInputRef = useRef<HTMLInputElement | null>(null);

  const handleCommentClick = () => {
    setShowComments(true);
    setTimeout(() => {
      commentInputRef?.current?.focus();
    }, 0);
  };

  const handleShare = (platform: string) => {
    const url = `${clientUrl}/${post?.id}`;
    let shareUrl;

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setIsShareDialogOpen(false);
        return;
      default:
        return;
    }
    window.open(shareUrl, "_blank");
    setIsShareDialogOpen(false);
  };
  return (
    <motion.div
      key={post?.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent className="p-6  dark:text-white ">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 cursor-pointer">
              <Avatar>
                {post?.user?.avatarPhotoUrl ? (
                  <AvatarImage
                    src={post?.user?.avatarPhotoUrl}
                    alt={post?.user?.fullName}
                  />
                ) : (
                  <AvatarFallback className="dark:bg-gray-400">
                    {post?.user?.fullName?.substring(0, 2)}
                  </AvatarFallback>
                )}
              </Avatar>

              <div>
                <p className="font-semibold dark:text-white">
                  {post?.user?.fullName}
                </p>

                <p className="font-sm text-gray-500">
                  {formateDateAgo(post?.createdAt || "")}
                </p>
              </div>
            </div>

            <Button variant="ghost" className="dark:hover:bg-gray-500">
              <MoreHorizontal className="dark:text-white h-4 w-4" />
            </Button>
          </div>

          <p className="mb-4">{post?.content}</p>

          {post?.mediaUrl && post.mediaType === "image" && (
            <img
              src={post?.mediaUrl}
              alt="post_image"
              className="w-full h-auto rounded-lg mb-4"
            />
          )}

          {post?.mediaUrl && post.mediaType === "video" && (
            <video controls className="w-full h-[500px] rounded-lg mb-4">
              <source src={post?.mediaUrl} type="video/mp4" />
              Your browser does not support the video tag
            </video>
          )}

          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 hover:border-b-2 border-gray-400 cursor-pointer ">
              {post?.likes?.length}{" "}
              {post?.likes?.length === 1 ? "like" : "likes"}
            </span>
            <div className="flex gap-3">
              <span
                className="text-sm text-gray-500 dark:text-gray-400 hover:border-b-2 border-gray-400 cursor-pointer "
                onClick={() => setShowComments(!showComments)}
              >
                {post?.comments?.length}{" "}
                {post?.comments?.length === 1 ? "comment" : "comments"}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 hover:border-b-2 border-gray-400 cursor-pointer ">
                {post?.shares?.length}{" "}
                {post?.shares?.length === 1 ? "share" : "shares"}
              </span>
            </div>
          </div>

          <Separator className="mb-2 dark:bg-gray-400" />

          <div className="flex justify-between mb-2">
            <Button
              variant="ghost"
              className={`flex-1 dark:hover:bg-gray-600 ${
                isLiked ? "text-blue-600" : ""
              }`}
              onClick={onLike}
            >
              <ThumbsUp className="mr-2 h-4 w-4" /> Like
            </Button>

            <Button
              variant="ghost"
              className={`flex-1 dark:hover:bg-gray-600 `}
              onClick={handleCommentClick}
            >
              <MessageCircle className="mr-2 h-4 w-4" /> Comment
            </Button>

            <Dialog
              open={isShareDialogOpen}
              onOpenChange={setIsShareDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 dark:hover:bg-gray-500"
                  onClick={onShare}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  share
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share This Post</DialogTitle>

                  <DialogDescription>
                    Choose how you want to share this post
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col space-y-4 ">
                  <Button onClick={() => handleShare("facebook")}>
                    Share on Facebook
                  </Button>

                  <Button onClick={() => handleShare("twitter")}>
                    Share on Twitter
                  </Button>

                  <Button onClick={() => handleShare("linkedin")}>
                    Share on Linkedin
                  </Button>

                  <Button onClick={() => handleShare("copy")}>Copy Link</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Separator className="mb-2 dark:bg-gray-400" />

          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PostComments
                  post={post}
                  onComment={onComment}
                  commentInputRef={commentInputRef}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PostsContent;
