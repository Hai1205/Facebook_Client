import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usePostStore } from "@/stores/usePostStore";
import { COMMENT, POST } from "@/utils/interface";
import { useAuthStore } from "@/stores/useAuthStore";
import VideoCard from "./components/VideoCard";

const VideoPage = () => {
  const { getAllPost, likePost, sharePost, commentPost } = usePostStore();
  const { userAuth } = useAuthStore();

  const [posts, setPosts] = useState<POST[]>([]);
  const [likePosts, setLikePosts] = useState(new Set());

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

  const videoPosts = posts?.filter((post) => post.mediaType === "VIDEO");

  const handleComment = async (postId: string, comment: COMMENT) => {
    if (!userAuth?.id) {
      toast.error("Please login to add a comment");
      return;
    }

    const formData = new FormData();
    formData.append("text", comment?.text);

    await commentPost(postId, userAuth?.id, formData);
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
    <div className="min-h-screen w-full flex justify-center">
      <main className="ml-0 md:ml-0 p-6 max-w-3xl">
        <div className="mx-auto">
          {videoPosts.map((post) => (
            <VideoCard
              key={post?.id}
              post={post}
              isLiked={likePosts.has(post?.id || "")}
              onLike={() => handleLike(post?.id || "")}
              onComment={(comment: COMMENT) =>
                handleComment(post?.id || "", comment)
              }
              onShare={() => handleShare(post?.id || "")}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default VideoPage;
