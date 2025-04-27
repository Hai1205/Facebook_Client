import { useCallback, useEffect, useState } from "react";
import { COMMENT, POST, USER } from "@/utils/interface";
import { usePostStore } from "@/stores/usePostStore";
import MutualFriends from "./MutualFriends";
import EditBio from "./EditBio";
import ProfilePosts from "./tabs/ProfilePosts";
import ProfileAbout from "./tabs/ProfileAbout";
import ProfilePhotos from "./tabs/ProfilePhotos";

interface ProfileDetailsProps {
  activeTab: "posts" | "about" | "friends" | "photos";
  userId: string | undefined;
  profileData: USER;
  isOwner: boolean;
}

const ProfileDetails = ({
  activeTab,
  userId,
  profileData,
  isOwner,
}: ProfileDetailsProps) => {
  const [isEditBioModel, setIsEditBioModel] = useState(false);
  const [likePosts, setLikePosts] = useState(new Set());
  const [userPosts, setUserPosts] = useState<POST[]>([]);

  const { likePost, addCommentToPost, sharePost, getUserPosts } =
    usePostStore();

  const fetchUserPosts = useCallback(async () => {
    if (!userId) {
      return;
    }

    const posts = await getUserPosts(userId);
    if (posts) {
      setUserPosts(posts);
    }
  }, [userId, getUserPosts]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  useEffect(() => {
    const saveLikes = sessionStorage.getItem("likePosts");
    if (saveLikes) {
      setLikePosts(new Set(JSON.parse(saveLikes)));
    }
  }, []);

  const handleLikePost = async (postId: string) => {
    if (!userId) {
      return;
    }

    const updatedLikePost = new Set(likePosts);
    if (updatedLikePost.has(postId)) {
      updatedLikePost.delete(postId);
    } else {
      updatedLikePost.add(postId);
    }
    setLikePosts(updatedLikePost);
    sessionStorage.setItem(
      "likePosts",
      JSON.stringify(Array.from(updatedLikePost))
    );

    await likePost(postId, userId);
    fetchUserPosts();
  };

  const handleCommentPost = async (comment: COMMENT, postId: string) => {
    if (!userId) {
      return;
    }

    await addCommentToPost(postId, userId, comment.text);
    await fetchUserPosts();
  };

  const handleSharePost = async (postId: string) => {
    if (!userId) {
      return;
    }

    await sharePost(postId, userId);
    await fetchUserPosts();
  };

  // Render appropriate component based on activeTab
  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <ProfilePosts
            userPosts={userPosts}
            likePosts={likePosts}
            profileData={profileData}
            isOwner={isOwner}
            onEditBio={() => setIsEditBioModel(true)}
            onLike={handleLikePost}
            onComment={handleCommentPost}
            onShare={handleSharePost}
          />
        );
      case "about":
        return <ProfileAbout profileData={profileData} />;
      case "friends":
        return <MutualFriends userId={userId} isOwner={isOwner} />;
      case "photos":
        return <ProfilePhotos posts={userPosts} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {renderTabContent()}

      <EditBio
        isOpen={isEditBioModel}
        onClose={() => setIsEditBioModel(false)}
        initialData={profileData?.bio}
        userId={userId}
      />
    </div>
  );
};

export default ProfileDetails;
