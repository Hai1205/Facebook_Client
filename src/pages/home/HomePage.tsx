import { useAuthStore } from "@/stores/useAuthStore";
import { usePostStore } from "@/stores/usePostStore";
import { useCallback, useEffect, useState } from "react";
import StorySection from "../story/StorySection";
import NewPostForm from "../post/components/NewPostForm";
import PostCard from "../post/PostCard";
import { COMMENT, POST } from "@/utils/interface";
import { toast } from "react-toastify";
import VideoCard from "../video/components/VideoCard";
import FriendSuggestSection from "../friend/components/FriendSuggestSection";

const HomePage = () => {
  const { getUserFeed, getAllPost, likePost, commentPost, sharePost } =
    usePostStore();
  const { userAuth } = useAuthStore();
  const [posts, setPosts] = useState<POST[]>([]);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [likePosts, setLikePosts] = useState(new Set());

  const fetchPosts = useCallback(async () => {
    let posts = [];
    if (userAuth) {
      posts = await getUserFeed(userAuth?.id as string);
    } else {
      posts = await getAllPost();
    }

    if (posts) {
      setPosts(posts);
    }
  }, [getUserFeed, getAllPost, userAuth]);

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

    await likePost(userAuth?.id as string, postId);
    await fetchPosts();
  };

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
    <div className="flex justify-center items-center h-full">
      <div className="p-6 max-w-3xl w-full">
        <div className="flex flex-col w-full">
          {userAuth && (
            <>
              <NewPostForm
                isPostFormOpen={isPostFormOpen}
                setIsPostFormOpen={setIsPostFormOpen}
              />

              <StorySection />

              <FriendSuggestSection limit={10} />
            </>
          )}

          <div className="mt-1 space-y-6 mb-4">
            {posts.map((post) => (
              <div key={post.id}>
                {post.mediaType === "VIDEO" ? (
                  <VideoCard
                    post={post}
                    isLiked={likePosts.has(post?.id || "")}
                    onLike={() => handleLike(post?.id || "")}
                    onComment={(comment: COMMENT) =>
                      handleComment(post?.id || "", comment)
                    }
                    onShare={() => handleShare(post?.id || "")}
                  />
                ) : (
                  <PostCard
                    post={post}
                    isLiked={likePosts.has(post?.id)}
                    onLike={() => handleLike(post?.id as string)}
                    onComment={(comment: COMMENT) =>
                      handleComment(post?.id || "", comment)
                    }
                    onShare={() => handleShare(post?.id || "")}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
