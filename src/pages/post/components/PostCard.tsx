import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { COMMENT, POST, USER } from "@/utils/interface";
import { formateDateAgo } from "@/lib/utils";
import { Link } from "react-router-dom";
import { VideoContent } from "@/pages/post/components/medias/VideoContent";
import ExtendOption from "./ExtendOption";
import { MediaContent } from "./medias/MediaContent";
import { PostStatus } from "./posts/PostStatus";
import { PostController } from "./posts/PostController";
import { Comment } from "./comments/Comment";
import { MediaViewer } from "./medias/MediaViewer";
import { useAuthStore } from "@/stores/useAuthStore";

interface PostCardProps {
  post: POST;
  isLiked?: boolean;
  onShare: () => void;
  onComment: (postId: string, comment: COMMENT) => void;
  onLike: () => void;
  isVideoCard?: boolean;
}

const PostCard = ({
  post,
  isLiked: initialIsLiked = false,
  onShare,
  onComment,
  onLike,
  isVideoCard = false,
}: PostCardProps) => {
  const { userAuth } = useAuthStore();

  const [showComments, setShowComments] = useState(false);
  const commentInputRef = useRef<HTMLInputElement | null>(null);

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(post?.likes?.length || 0);
  const [shareCount, setShareCount] = useState(post?.share?.length || 0);
  const [comments, setComments] = useState<COMMENT[]>(post?.comments || []);
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const medias =
    post?.mediaUrls || (post?.mediaUrls[0] ? [post.mediaUrls[0]] : []);
  const mediaTypes =
    post?.mediaTypes || (post?.mediaTypes[0] ? [post.mediaTypes[0]] : []);

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

  const openMediaViewer = (index: number) => {
    setCurrentMediaIndex(index);
    setShowMediaViewer(true);
    document.body.style.overflow = "hidden";
  };

  const closeMediaViewer = () => {
    setShowMediaViewer(false);
    document.body.style.overflow = "auto";
  };

  const goToNextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % medias.length);
  };

  const goToPrevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + medias.length) % medias.length);
  };

  const getMediaGridLayout = () => {
    const count = medias.length;

    if (count === 0) return "";
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2 grid-rows-1";
    if (count === 3) return "grid-cols-2 grid-rows-2";
    return "grid-cols-2 grid-rows-2";
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

          {medias.length > 0 &&
            (isVideoCard ? (
              <VideoContent video={post} />
            ) : (
              <MediaContent
                medias={medias}
                mediaTypes={mediaTypes}
                openMediaViewer={openMediaViewer}
                getMediaGridLayout={getMediaGridLayout}
              />
            ))}

          <PostStatus
            likeCount={likeCount}
            comments={comments}
            shareCount={shareCount}
            showComments={showComments}
            setShowComments={setShowComments}
          />

          <Separator className="mb-2 dark:bg-gray-400" />

          <PostController
            isLiked={isLiked}
            handleLikeClick={handleLikeClick}
            handleCommentClick={handleCommentClick}
            handleShareClick={handleShareClick}
          />

          <AnimatePresence>
            {showComments && (
              <Comment
                post={post}
                comments={comments}
                handleAddComment={handleAddComment}
                commentInputRef={commentInputRef}
              />
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {showMediaViewer && (
        <MediaViewer
          medias={medias}
          currentMediaIndex={currentMediaIndex}
          closeMediaViewer={closeMediaViewer}
          mediaTypes={mediaTypes}
          goToPrevMedia={goToPrevMedia}
          goToNextMedia={goToNextMedia}
          setCurrentMediaIndex={setCurrentMediaIndex}
        />
      )}
    </motion.div>
  );
};

export default PostCard;
