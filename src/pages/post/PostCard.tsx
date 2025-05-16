import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BadgeCheck, MessageCircle, Share2, ThumbsUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import PostComments from "./components/PostComments";
import { COMMENT, POST, USER } from "@/utils/interface";
import { formateDateAgo, formatNumberStyle } from "@/lib/utils";
import { Link } from "react-router-dom";
import ExtendOption from "./components/ExtendOption";
import { useAuthStore } from "@/stores/useAuthStore";

interface PostCardProps {
  post: POST;
  isLiked?: boolean;
  onShare: () => void;
  onComment: (postId: string, comment: COMMENT) => void;
  onLike: () => void;
}

const PostCard = ({
  post,
  isLiked: initialIsLiked = false,
  onShare,
  onComment,
  onLike,
}: PostCardProps) => {
  const { userAuth } = useAuthStore();
  const [showComments, setShowComments] = useState(false);
  const commentInputRef = useRef<HTMLInputElement | null>(null);

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(post?.likes?.length || 0);
  const [shareCount, setShareCount] = useState(post?.share?.length || 0);
  const [comments, setComments] = useState<COMMENT[]>(post?.comments || []);

  useEffect(() => {
    if (post?.likes && userAuth) {
      const userLiked = post.likes.some(
        (user: USER) => user.id === userAuth.id
      );
      setIsLiked(userLiked);
      setLikeCount(post.likes.length);
    }

    if (post?.comments) {
      setComments(post.comments);
    }
  }, [post, userAuth]);

  const handleLikeClick = () => {
    if (isLiked) {
      setLikeCount((prev) => Math.max(0, prev - 1));
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);

    onLike();
  };

  const handleShareClick = async () => {
    onShare();

    setShareCount((prev) => prev + 1);
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
    if (!showComments) {
      setTimeout(() => {
        commentInputRef?.current?.focus();
      }, 0);
    }
  };

  const handleAddComment = (comment: COMMENT) => {
    setComments((prev) => [...prev, comment]);

    onComment(post?.id || "", comment);
  };

  return (
    <motion.div
      key={post?.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent className="p-6 dark:text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 cursor-pointer">
              <Link to={`/profile/${post?.user?.id}`}>
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={post?.user?.avatarPhotoUrl}
                    alt={post?.user?.fullName}
                  />
                  <AvatarFallback className="bg-zinc-700 text-white text-2xl">
                    {post?.user?.fullName?.substring(0, 2) || "FU"}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <div>
                <Link to={`/profile/${post?.user?.id}`}>
                  <p className="text-s font-bold flex items-center">
                    {post?.user?.fullName || "Facebook User"}

                    {post?.user?.celebrity && (
                      <BadgeCheck className="ml-2 h-4 w-4 text-[#1877F2]" />
                    )}
                  </p>
                </Link>

                <p className="font-sm text-gray-500">
                  {formateDateAgo(post?.createdAt as string)}
                </p>
              </div>
            </div>

            <ExtendOption content={post} contentType="POST" />
          </div>

          <p className="mb-4">{post?.content}</p>

          {post?.mediaUrl && post.mediaType === "IMAGE" && (
            <img
              src={post?.mediaUrl}
              alt="post_image"
              className="w-full h-auto rounded-lg mb-4"
            />
          )}

          {post?.mediaUrl && post.mediaType === "VIDEO" && (
            <video controls className="w-full h-[500px] rounded-lg mb-4">
              <source src={post?.mediaUrl} type="video/mp4" />
              Your browser does not support the video tag
            </video>
          )}

          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 hover:border-b-2 border-gray-400 cursor-pointer ">
              {formatNumberStyle(likeCount)} {likeCount < 2 ? "like" : "likes"}
            </span>

            <div className="flex gap-3">
              <span
                className="text-sm text-gray-500 dark:text-gray-400 hover:border-b-2 border-gray-400 cursor-pointer "
                onClick={() => setShowComments(!showComments)}
              >
                {formatNumberStyle(comments.length)}{" "}
                {comments.length < 2 ? "comment" : "comments"}
              </span>

              <span className="text-sm text-gray-500 dark:text-gray-400 hover:border-b-2 border-gray-400 cursor-pointer ">
                {formatNumberStyle(shareCount)}{" "}
                {shareCount < 2 ? "share" : "shares"}
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
              onClick={handleLikeClick}
            >
              <ThumbsUp
                className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`}
              />
              {isLiked ? "Liked" : "Like"}
            </Button>

            <Button
              variant="ghost"
              className={`flex-1 dark:hover:bg-gray-600 `}
              onClick={handleCommentClick}
            >
              <MessageCircle className="mr-2 h-4 w-4" /> Comment
            </Button>

            <Button
              variant="ghost"
              className={`flex-1 dark:hover:bg-gray-600 `}
              onClick={handleShareClick}
            >
              <Share2 className="mr-2 h-4 w-4" /> share
            </Button>
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
                  post={{ ...post, comments }}
                  onComment={handleAddComment}
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

export default PostCard;
