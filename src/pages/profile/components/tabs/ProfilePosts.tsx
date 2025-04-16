import { COMMENT, POST } from "@/utils/types";
import PostsContent from "../PostContent";
import ProfileIntro from "./ProfileIntro";
import NewPostForm from "@/pages/post/components/NewPostForm";
import { useState } from "react";

interface ProfilePostsProps {
  userPosts: POST[];
  likePosts: Set<unknown>;
  profileData: any;
  isOwner: boolean;
  onEditBio: () => void;
  onLike: (postId: string) => void;
  onComment: (comment: COMMENT, postId: string) => void;
  onShare: (postId: string) => void;
}

const ProfilePosts = ({
  userPosts,
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
        <NewPostForm
          isPostFormOpen={isPostFormOpen}
          setIsPostFormOpen={setIsPostFormOpen}
        />

        {userPosts?.map((post) => (
          <PostsContent
            key={post?.id}
            post={post}
            isLiked={likePosts.has(post?.id)}
            onLike={() => onLike(post?.id || "")}
            onComment={(comment: COMMENT) => onComment(comment, post?.id || "")}
            onShare={() => onShare(post?.id || "")}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfilePosts;
