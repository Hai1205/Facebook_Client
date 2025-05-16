import { BadgeCheck, ChevronDown, ChevronUp, Send } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COMMENT, POST, USER } from "@/utils/interface";
import { useAuthStore } from "@/stores/useAuthStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import ExtendOption from "./ExtendOption";
import { formateDateAgo } from "@/lib/utils";
import { Link } from "react-router-dom";

interface PostCommentsProps {
  post: POST;
  onComment: (comment: COMMENT) => void;
  commentInputRef: React.RefObject<HTMLInputElement>;
}

const PostComments = ({
  post,
  onComment,
  commentInputRef,
}: PostCommentsProps) => {
  const { userAuth } = useAuthStore();

  const [showAllComments, setShowAllComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const visibleComments: COMMENT[] = showAllComments
    ? (post?.comments
        ?.map((comment) =>
          typeof comment === "string" ? { text: comment } : comment
        )
        .reverse() as COMMENT[])
    : (post?.comments
        ?.slice(0, 2)
        .map((comment) =>
          typeof comment === "string" ? { text: comment } : comment
        )
        .reverse() as COMMENT[]);

  const handleCommentSubmit = async () => {
    if (commentText.trim()) {
      onComment({
        text: commentText,
        user: userAuth as USER,
      });
      setCommentText("");
    }
  };

  return (
    // comments section list
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Comments</h3>

      <ScrollArea className="h-[170px]">
        <div className="pr-2">
          {post?.comments?.length > 2 && (
            <p
              className="w-40 mt-2 text-blue-500 dark:text-gray-300 cursor-pointer"
              onClick={() => setShowAllComments(!showAllComments)}
            >
              {showAllComments ? (
                <>
                  Show less <ChevronUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Show more <ChevronDown className="ml-2 h-4 w-4" />
                </>
              )}
            </p>
          )}

          {visibleComments?.map((comment, index) => (
            <div key={index} className="flex items-start space-x-2 mb-2">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={comment?.user?.avatarPhotoUrl}
                  alt={comment?.user?.fullName}
                />

                <AvatarFallback className="bg-zinc-700 text-xl text-white">
                  {comment?.user?.fullName.substring(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col flex-grow">
                <div className="rounded-lg flex justify-between items-start">
                  <div>
                    <Link to={`/profile/${comment?.user?.id}`}>
                      <p className="text-s font-bold flex items-center">
                        {comment?.user?.fullName || "Facebook User"}

                        {comment?.user?.celebrity && (
                          <BadgeCheck className="ml-2 h-4 w-4 text-[#1877F2]" />
                        )}
                      </p>
                    </Link>

                    <p className="text-sm">{comment?.text}</p>
                  </div>

                  {comment?.id && (
                    <ExtendOption
                      content={comment}
                      contentType="COMMENT"
                      postId={post?.id}
                    />
                  )}
                </div>

                <div className="flex items-center text-xs text-gray-400">
                  <span>{formateDateAgo(comment?.createdAt || "")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {userAuth && (
        <div className="flex items-center space-x-2 mt-4">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={userAuth?.avatarPhotoUrl}
              alt={userAuth?.fullName}
            />

            <AvatarFallback className="bg-zinc-700 text-xl">
              {userAuth?.fullName.substring(0, 2)}
            </AvatarFallback>
          </Avatar>

          <Input
            value={commentText}
            ref={commentInputRef as React.RefObject<HTMLInputElement>}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
            placeholder="Write a comment..."
            className="flex-grow cursor-pointer rounded-full h-12 dark:bg-[rgb(58,59,60)]"
          />
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-transparent"
            onClick={handleCommentSubmit}
          >
            <Send className="h-5 w-5 text-blue-500" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostComments;
