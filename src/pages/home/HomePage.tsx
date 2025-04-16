import { useAuthStore } from "@/stores/useAuthStore";
import { usePostStore } from "@/stores/usePostStore";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import StorySection from "../story/StorySection";
import NewPostForm from "../post/components/NewPostForm";
import PostCard from "../post/components/PostCard";
import { COMMENT, POST } from "@/utils/types";

const HomePage = () => {
  const [posts, setPosts] = useState<POST[]>([]);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [likePosts, setLikePosts] = useState(new Set());
  const { getAllPost, likePost, addCommentToPost, sharePost } = usePostStore();
  const { userAuth } = useAuthStore();

  const fetchPost = useCallback(async () => {
    const posts = await getAllPost();

    if (posts) {
      setPosts(posts);
    }
  }, [getAllPost]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    const saveLikes = sessionStorage.getItem("likePosts");
    if (saveLikes) {
      setLikePosts(new Set(JSON.parse(saveLikes)));
    }
  }, []);

  const handleLike = async (postId: string) => {
    if (!userAuth) {
      return null;
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

    await likePost(userAuth?.id as string, postId);
    await fetchPost();
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="p-6 max-w-3xl w-full">
        <div className="flex flex-col w-full">
          <NewPostForm
            isPostFormOpen={isPostFormOpen}
            setIsPostFormOpen={setIsPostFormOpen}
          />

          <StorySection />

          <div className="mt-6 space-y-6 mb-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isLiked={likePosts.has(post?.id)}
                onLike={() => handleLike(post?.id as string)}
                onComment={async (comment: COMMENT) => {
                  if (!userAuth) {
                    return null;
                  }

                  await addCommentToPost(
                    userAuth?.id as string,
                    post?.id as string,
                    comment.text
                  );
                  await fetchPost();
                }}
                onShare={async () => {
                  if (!userAuth) {
                    return null;
                  }

                  await sharePost(userAuth?.id as string, post?.id as string);
                  await fetchPost();
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
