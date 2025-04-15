import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import { usePostStore } from "@/stores/usePostStore";
import { useNavigate } from "react-router-dom";
import { COMMENT, POST } from "@/utils/types";
import { useAuthStore } from "@/stores/useAuthStore";
import LeftSideBar from "@/layout/components/LeftSidebar";
import VideoCard from "./components/VideoCard";

const VideoPage = () => {
  const { getAllPost, likePost, sharePost, addCommentToPost } = usePostStore();
  const { userAuth } = useAuthStore();

  const [posts, setPosts] = useState<POST[]>([]);
  const [likePosts, setLikePosts] = useState(new Set());
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    const posts = await getAllPost();
    setPosts(posts);
  }, [getAllPost]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const saveLikes = sessionStorage.getItem("likePosts");
    if (saveLikes) {
      setLikePosts(new Set(JSON.parse(saveLikes)));
    }
  }, []);

  const handleLike = async (postId: string) => {
    if (!userAuth?.id) {
      toast.error("Please login to like or unlike the post");

      return;
    }

    const updatedLikePost = new Set(likePosts);
    if (updatedLikePost.has(postId)) {
      updatedLikePost.delete(postId);
      toast.error("post disliked successfully");
    } else {
      updatedLikePost.add(postId);
      toast.success("post like successfully");
    }
    setLikePosts(updatedLikePost);
    localStorage.setItem(
      "likePosts",
      JSON.stringify(Array.from(updatedLikePost))
    );

    await likePost(userAuth?.id, postId);
    await fetchPosts();
  };

  const handleBack = () => {
    navigate("/");
  };

  const videoPost = posts?.filter((post) => post.mediaType === "video");

  const handleComment = async (postId: string, comment: COMMENT) => {
    if (!userAuth?.id) {
      toast.error("Please login to add a comment");
      return;
    }

    await addCommentToPost(postId, userAuth?.id, comment?.text);
    await fetchPosts();
  };

  const handleShare = async (postId: string) => {
    if (!userAuth?.id) {
      toast.error("Please login to share the post");
      return;
    }

    await sharePost(postId, userAuth?.id);
    await fetchPosts();
  };

  return (
    <div className="mt-12 min-h-screen">
      <LeftSideBar />

      <main className="ml-0 md:ml-64 p-6">
        <Button variant="ghost" className="mb-4" onClick={handleBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to feed
        </Button>

        <div className="max-w-3xl mx-auto">
          {videoPost.map((post) => (
            <VideoCard
              key={post?.id}
              post={post}
              isLiked={likePosts.has(post?.id || "")}
              onLike={() => handleLike(post?.id || "")}
              onComment={(comment: COMMENT) => handleComment(post?.id || "", comment)}
              onShare={() => handleShare(post?.id || "")}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default VideoPage;
