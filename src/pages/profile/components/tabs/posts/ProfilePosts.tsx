import { COMMENT, POST } from "@/utils/interface";
import ProfileIntro from "./ProfileIntro";
import NewPostForm from "@/pages/post/components/posts/NewPostForm";
import { useState } from "react";
import PostCard from "@/pages/post/components/PostCard";

interface ProfilePostsProps {
  likePosts: Set<unknown>;
  profileData: any;
  isOwner: boolean;
  onEditBio: () => void;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: COMMENT) => void;
  onShare: (postId: string) => void;
}

const ProfilePosts = ({
  likePosts,
  profileData,
  isOwner,
  onEditBio,
  onLike,
  onComment,
  onShare,
}: ProfilePostsProps) => {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-[30%]">
        <ProfileIntro
          profileData={profileData}
          isOwner={isOwner}
          onEditBio={onEditBio}
        />
      </div>

      <div className="w-full lg:w-[70%] space-y-6 mb-4">
        {isOwner && (
          <NewPostForm
            isPostFormOpen={isPostFormOpen}
            setIsPostFormOpen={setIsPostFormOpen}
          />
        )}

        {profileData.posts?.map((post: POST) => (
          <PostCard
            post={post}
            isLiked={likePosts.has(post?.id)}
            onLike={() => onLike(post?.id || "")}
            onComment={onComment}
            onShare={() => onShare(post?.id || "")}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfilePosts;
