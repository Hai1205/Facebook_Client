import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePostStore } from "@/stores/usePostStore";
import { COMMENT, POST } from "@/utils/interface";
import { toast } from "react-toastify";
import PostCard from "./components/PostCard";
import { useParams } from "react-router-dom";

const PostDetails = () => {
  const { likePost, commentPost, sharePost, getPost, post } = usePostStore();
  const { userAuth } = useAuthStore();
  
  const params = useParams();
  const postId = params.postId;

  const [likePosts, setLikePosts] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saveLikes = sessionStorage.getItem("likePosts");
    if (saveLikes) {
      setLikePosts(new Set(JSON.parse(saveLikes)));
    }
  }, []);

  useEffect(() => {

    if (postId) {
      setIsLoading(true);
      getPost(postId);
      setIsLoading(false);
    }
  }, [getPost, postId]);

  const handleLike = async (postId: string) => {
    if (!userAuth) {
      toast.error("Please login to like post");
      return null;
    }

    const updatedLikePost = new Set(likePosts);
    if (updatedLikePost.has(postId)) {
      updatedLikePost.delete(postId);
    } else {
      updatedLikePost.add(postId);
    }
    setLikePosts(updatedLikePost);
    localStorage.setItem(
      "likePosts",
      JSON.stringify(Array.from(updatedLikePost))
    );

    await likePost(postId, userAuth?.id as string);
  };

  const handleComment = async (postId: string, comment: COMMENT) => {
    if (!userAuth?.id) {
      toast.error("Please login to add a comment");
      return;
    }

    const formData = new FormData();
    formData.append("text", comment?.text);

    await commentPost(postId, userAuth?.id, formData);
  };

  const handleShare = async (postId: string) => {
    if (!userAuth?.id) {
      toast.error("Please login to share the post");
      return;
    }

    await sharePost(postId, userAuth?.id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-full">
      <div key={post?.id}>
        <PostCard
          post={post as POST}
          isLiked={likePosts.has(post?.id)}
          onLike={() => handleLike(post?.id as string)}
          onComment={handleComment}
          onShare={() => handleShare(post?.id || "")}
        />
      </div>
    </div>
  );
};

export default PostDetails;
