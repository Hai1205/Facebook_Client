import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, MessageCircle, Share2, ThumbsUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { COMMENT, POST } from "@/utils/interface";
import { clientUrl, formateDateAgo, formatNumberStyle } from "@/lib/utils";
import ExtendOption from "@/pages/post/components/ExtendOption";
import PostComments from "@/pages/post/components/PostComments";
import { Separator } from "@/components/ui/separator";

interface VideoCardProps {
  post: POST;
  isLiked: boolean;
  onShare: () => void;
  onComment: (comment: COMMENT) => void;
  onLike: () => void;
}

const VideoCard = ({
  post,
  isLiked,
  onShare,
  onComment,
  onLike,
}: VideoCardProps) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const commentInputRef = useRef<HTMLInputElement | null>(null);

  const handleCommentClick = () => {
    setShowComments(!showComments);
    if (!showComments) {
      setTimeout(() => {
        commentInputRef?.current?.focus();
      }, 0);
    }
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
      className="bg-white dark:bg-[rgb(36,37,38)] rounded-lg shadow-lg overflow-hidden mb-4"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 cursor-pointer ml-4 mt-4">
            <Avatar>
              <AvatarImage
                src={post?.user?.avatarPhotoUrl}
                alt={post?.user?.fullName}
              />

              <AvatarFallback className="bg-gray-800 text-white">
                {post?.user?.fullName?.substring(0, 2) || "FU"}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="text-s font-bold flex items-center">
                {post?.user?.fullName || "Facebook User"}

                {post?.user?.celebrity && (
                  <BadgeCheck className="ml-2 h-4 w-4 text-[#1877F2]" />
                )}
              </p>

              <p className="font-sm text-gray-500">
                {formateDateAgo(post?.createdAt as string)}
              </p>
            </div>
          </div>

          <ExtendOption content={post} contentType="POST" />
        </div>

        <div className="relative aspect-video bg-black mb-4">
          {post?.mediaUrl && (
            <video controls className="w-full h-[500px] mb-4">
              <source src={post?.mediaUrl} type="video/mp4" />
              Your browser does not support the video tag
            </video>
          )}
        </div>

        <div className="flex justify-between items-center mb-4 px-4">
          <span className="text-sm text-gray-500 dark:text-gray-400 hover:border-b-2 border-gray-400 cursor-pointer">
            {formatNumberStyle(post?.likes?.length)}{" "}
            {post?.likes?.length < 2 ? "like" : "likes"}
          </span>

          <div className="flex gap-3">
            <span
              className="text-sm text-gray-500 dark:text-gray-400 hover:border-b-2 border-gray-400 cursor-pointer"
              onClick={() => setShowComments(!showComments)}
            >
              {formatNumberStyle(post?.comments?.length)}{" "}
              {post?.comments?.length < 2 ? "comment" : "comments"}
            </span>

            <span className="text-sm text-gray-500 dark:text-gray-400 hover:border-b-2 border-gray-400 cursor-pointer">
              {formatNumberStyle(post?.share?.length)}{" "}
              {post?.share?.length < 2 ? "share" : "shares"}
            </span>
          </div>
        </div>

        <Separator className="mb-2 dark:bg-gray-400 mx-4" />

        <div className="flex justify-between mb-2 px-4">
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
            className="flex-1 dark:hover:bg-gray-600"
            onClick={handleCommentClick}
          >
            <MessageCircle className="mr-2 h-4 w-4" /> Comment
          </Button>

          <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="flex-1 dark:hover:bg-gray-500"
                onClick={onShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share This Post</DialogTitle>

                <DialogDescription>
                  Choose how you want to share this post
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col space-y-4">
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

        <Separator className="mb-2 dark:bg-gray-400 mx-4" />

        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="px-4 pb-4"
            >
              <PostComments
                post={post}
                onComment={(comment) => onComment(comment)}
                commentInputRef={commentInputRef}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default VideoCard;
