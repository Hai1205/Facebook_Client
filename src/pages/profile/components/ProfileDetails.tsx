import { useCallback, useEffect, useState } from "react";
import { COMMENT, POST, USER } from "@/utils/interface";
import { usePostStore } from "@/stores/usePostStore";
import MutualFriends from "./MutualFriends";
import EditBioDialog from "./dialogs/EditBioDialog";
import ProfilePosts from "./tabs/ProfilePosts";
import ProfileAbout from "./tabs/ProfileAbout";
import ProfilePhotos from "./tabs/ProfilePhotos";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "react-toastify";

interface ProfileDetailsProps {
  activeTab: "posts" | "about" | "friends" | "photos";
  profileData: USER;
  isOwner: boolean;
}

const ProfileDetails = ({
  activeTab,
  profileData,
  isOwner,
}: ProfileDetailsProps) => {
  const { likePost, commentPost, sharePost } =
    usePostStore();
    const {userAuth} = useAuthStore();

  const [isEditBioModel, setIsEditBioModel] = useState(false);
  const [likePosts, setLikePosts] = useState(new Set());
  const [userPosts, setUserPosts] = useState<POST[]>([]);

  const fetchUserPosts = useCallback(() => {
    if (!profileData) {
      return;
    }

    const posts = profileData.posts.reverse();
    if (posts) {
      setUserPosts(posts);
    }
  }, [profileData]);

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
    if (!userAuth) {
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

    await likePost(postId, userAuth?.id as string);
  };

  const handleCommentPost = async (postId: string, comment: COMMENT) => {
    if (!userAuth?.id) {
      toast.error("Please login to add a comment");
      return;
    }

    const formData = new FormData();
    formData.append("text", comment?.text);

    await commentPost(postId, userAuth?.id, formData);
  };

  const handleSharePost = async (postId: string) => {
    if (!userAuth) {
      return;
    }

    await sharePost(postId, userAuth?.id as string);
  };

  // Render appropriate component based on activeTab
  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <ProfilePosts
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
        return <MutualFriends user={profileData} isOwner={isOwner} />;
      case "photos":
        return <ProfilePhotos posts={userPosts} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {renderTabContent()}

      <EditBioDialog
        isOpen={isEditBioModel}
        onClose={() => setIsEditBioModel(false)}
        profileData={profileData}
      />
    </div>
  );
};

export default ProfileDetails;
