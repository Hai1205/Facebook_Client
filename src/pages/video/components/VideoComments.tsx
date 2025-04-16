import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formateDateAgo } from "@/lib/utils";
import { COMMENT } from "@/utils/types";

interface VideoCommentsProps {
  comments: COMMENT[];
}

const VideoComments = ({ comments }: VideoCommentsProps) => {
  return (
    <>
      {comments?.map((comment: COMMENT) => (
        <div key={comment?.id} className="flex items-start space-x-2 mb-4">
          <Avatar className="h-8 w-8 ">
            {comment?.user?.avatarPhotoUrl ? (
              <AvatarImage
                src={comment?.user?.avatarPhotoUrl}
                alt={comment?.user?.fullName}
              />
            ) : (
              <AvatarFallback className="dark:bg-gray-400">
                {comment?.user?.fullName?.substring(0, 2)}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
              <p className="font-semibold text-sm">{comment?.user?.fullName}</p>

              <p className="text-sm">{comment?.text}</p>
            </div>

            <div className="flex items-center mt-1 text-xs text-gray-400">
              <Button variant="ghost" size="sm">
                Like
              </Button>

              <Button variant="ghost" size="sm">
                Reply
              </Button>

              <span>{formateDateAgo(comment.createdAt)}</span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default VideoComments;
