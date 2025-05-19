import { Button } from "@/components/ui/button"
import { MessageCircle, Share2, ThumbsUp } from "lucide-react"

interface PostControllerProps {
    isLiked: boolean;
    handleLikeClick: () => void;
    handleCommentClick: () => void;
    handleShareClick: () => void;   
}

export const PostController = ({ 
    isLiked,
    handleLikeClick,
    handleCommentClick,
    handleShareClick,
 }: PostControllerProps) => {
    return (
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
    )
}