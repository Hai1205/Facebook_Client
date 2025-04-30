import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BadgeCheck,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
  ThumbsUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import VideoComments from "./VideoComments";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { COMMENT, POST, USER } from "@/utils/interface";
import { useAuthStore } from "@/stores/useAuthStore";
import { clientUrl, formateDateAgo } from "@/lib/utils";

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
  const { userAuth } = useAuthStore();

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const commentInputRef = useRef<HTMLInputElement | null>(null);

  const handleCommentClick = () => {
    setShowComments(true);
    setTimeout(() => {
      commentInputRef?.current?.focus();
    }, 0);
  };

  const handleCommentSubmit = async () => {
    if (commentText.trim()) {
      onComment({
        text: commentText,
        user: userAuth as USER,
      });
      setCommentText("");
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
              <AvatarFallback className="bg-gray-400 text-white">
                {post?.user?.fullName?.substring(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="text-xl font-bold flex items-center">
                {post?.user?.fullName}

                {post?.user?.followers.length > 5000 && (
                  <BadgeCheck className="ml-2 h-4 w-4 text-[#1877F2]" />
                )}
              </p>

              <p className="font-sm text-gray-500">
                {formateDateAgo(post?.createdAt as string)}
              </p>
            </div>
          </div>

          <Button variant="ghost" className="dark:hover:bg-gray-500">
            <MoreHorizontal className="dark:text-white h-4 w-4" />
          </Button>
        </div>

        <div className="relative aspect-video bg-black mb-4">
          {post?.mediaUrl && (
            <video controls className="w-full h-[500px] mb-4">
              <source src={post?.mediaUrl} type="video/mp4" />
              Your browser does not support the video tag
            </video>
          )}
        </div>

        <div className="md:flex justify-between px-2 mb-2 items-center">
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              className={`flex dark:hover:bg-gray-600 items-center  ${
                isLiked ? "text-blue-600" : ""
              }`}
              onClick={onLike}
            >
              <ThumbsUp className="mr-2 h-4 w-4" />

              <span>Like</span>
            </Button>

            <Button
              variant="ghost"
              className={`flex items-center dark:hover:bg-gray-600 `}
              onClick={handleCommentClick}
            >
              <MessageCircle className="mr-2 h-4 w-4" />

              <span>Comment</span>
            </Button>
            <Dialog
              open={isShareDialogOpen}
              onOpenChange={setIsShareDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center dark:hover:bg-gray-500"
                  onClick={onShare}
                >
                  <Share2 className="mr-2 h-4 w-4" />

                  <span>share</span>
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

          <div className="flex space-x-4 ml-2 text-sm text-gray-500 dark:text-gray-400">
            <Button variant="ghost" size="sm">
              {post?.likes?.length}{" "}
              {post?.likes?.length === 1 ? "like" : "likes"}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
            >
              {post?.comments?.length}{" "}
              {post?.comments?.length === 1 ? "comment" : "comments"}
            </Button>

            <Button variant="ghost" size="sm">
              {post?.shares?.length}{" "}
              {post?.shares?.length === 1 ? "share" : "shares"}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                <VideoComments comments={(post?.comments as COMMENT[]) || []} />
              </ScrollArea>

              {userAuth && (
                <div className="flex items-center mt-4 p-2">
                  <Avatar className="h-10 w-10 rounded mr-3">
                    <AvatarImage
                      src={userAuth?.avatarPhotoUrl}
                      alt={userAuth?.fullName}
                    />
                    <AvatarFallback className="dark:bg-gray-400">
                      {userAuth?.fullName?.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <Input
                    className="flex-1 mr-2 dark:border-gray-400"
                    placeholder="Write a comment..."
                    value={commentText}
                    ref={commentInputRef}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleCommentSubmit()
                    }
                  />

                  <Button onClick={handleCommentSubmit}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default VideoCard;
