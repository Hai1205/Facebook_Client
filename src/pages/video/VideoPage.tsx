import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { usePostStore } from "@/stores/usePostStore";
import { COMMENT, POST } from "@/utils/interface";
import { useAuthStore } from "@/stores/useAuthStore";
import PostCard from "../post/components/PostCard";

const VideoPage = () => {
  const { homePosts, likePost, sharePost, commentPost } = usePostStore();
  const { userAuth } = useAuthStore();

  const [likePosts, setLikePosts] = useState(new Set());

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
  };

  const videoPosts = useMemo(() => {
    return homePosts
      ?.filter((post) => post.mediaTypes.includes("VIDEO"))
      .map((post) => {
        const firstVideoIndex = post.mediaTypes.findIndex((type: string) => type === "VIDEO");
  
        if (firstVideoIndex === -1) return post;
  
        return {
          ...post,
          mediaUrls: [post.mediaUrls[firstVideoIndex]],
          mediaTypes: ["VIDEO"],
        };
      });
  }, [homePosts]);

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

  return (
    <div className="min-h-screen w-full flex justify-center">
      <main className="ml-0 md:ml-0 p-6 max-w-3xl">
        <div className="mx-auto">
          {videoPosts.map((video) => (
            <PostCard
              key={video?.id}
              post={video as POST}
              isLiked={likePosts.has(video?.id || "")}
              onLike={() => handleLike(video?.id || "")}
              onComment={handleComment}
              onShare={() => handleShare(video?.id || "")}
              isVideoCard={true}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default VideoPage;
