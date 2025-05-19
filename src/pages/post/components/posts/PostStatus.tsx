import { formatNumberStyle } from "@/lib/utils"
import { COMMENT } from "@/utils/interface";

interface PostStatusProps {
    likeCount: number;
    comments: COMMENT[];
    shareCount: number;
    showComments: boolean;
    setShowComments: (showComments: boolean) => void;
}

export const PostStatus = ({ 
    likeCount,
    comments,
    shareCount,
    showComments,
    setShowComments,
 }: PostStatusProps) => {
    return (
        <div className="flex justify-between items-center mb-4 px-4">
        <span className="text-sm text-gray-500 dark:text-gray-400 hover:border-b-2 border-gray-400 cursor-pointer">
          {formatNumberStyle(likeCount)} {likeCount < 2 ? "like" : "likes"}
        </span>

        <div className="flex gap-3">
          <span
            className="text-sm text-gray-500 dark:text-gray-400 hover:border-b-2 border-gray-400 cursor-pointer"
            onClick={() => setShowComments(!showComments)}
          >
            {formatNumberStyle(comments.length)}{" "}
            {comments.length < 2 ? "comment" : "comments"}
          </span>

          <span className="text-sm text-gray-500 dark:text-gray-400 hover:border-b-2 border-gray-400 cursor-pointer">
            {formatNumberStyle(shareCount)}{" "}
            {shareCount < 2 ? "share" : "shares"}
          </span>
        </div>
      </div>
    )
}