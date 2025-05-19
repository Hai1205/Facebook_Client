import { motion } from "framer-motion";
import PostComments from "./PostComments";
import { COMMENT, POST } from "@/utils/interface";

interface CommentProps {
  post: POST;
  comments: COMMENT[];
  handleAddComment: (comment: COMMENT) => void;
  commentInputRef: React.RefObject<HTMLInputElement>;
  className?: string;
}

export const Comment = ({
  post,
  comments,
  handleAddComment,
  commentInputRef,
  className,
}: CommentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <PostComments
        post={{ ...post, comments }}
        onComment={handleAddComment}
        commentInputRef={commentInputRef}
      />
    </motion.div>
  );
};
