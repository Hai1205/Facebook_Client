import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileHeader from "./components/ProfileHeader";
import ProfileTabs from "./components/ProfileTabs";
import { USER } from "@/utils/interface";
import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { ProfileHeaderSkeleton } from "./components/ProfileHeaderSkeleton";
import { FRIEND_STATUS } from "@/utils/types";

const ProfilePage = () => {
  const { getUserProfile } = useUserStore();
  const { userAuth } = useAuthStore();

  const params = useParams();
  const userId = params.userId;
  const [profileData, setProfileData] = useState<USER | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  const [friendRequestStatus, setFriendRequestStatus] =
    useState<FRIEND_STATUS>("NONE");

  const fetchProfile = useCallback(async () => {
    if (userId) {
      const { user: targetUser, friendStatus } = await getUserProfile(userAuth?.id as string, userId);

      if (targetUser) {
        setProfileData(targetUser);
        setFriendRequestStatus(friendStatus);

        const isMyProfile = targetUser?.id === userAuth?.id;
        setIsOwner(isMyProfile);
      }
    }
  }, [userId, getUserProfile, userAuth]);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [fetchProfile, userId]);

  if (!profileData) {
    return <ProfileHeaderSkeleton />;
  }

  return (
    <div className="w-full">
      <ProfileHeader
        profileData={profileData as USER}
        isOwner={isOwner}
        userId={userId}
        friendRequestStatus={friendRequestStatus}
        setProfileData={setProfileData}
        setFriendRequestStatus={setFriendRequestStatus}
      />

      <ProfileTabs profileData={profileData as USER} isOwner={isOwner} />
    </div>
  );
};

export default ProfilePage;
