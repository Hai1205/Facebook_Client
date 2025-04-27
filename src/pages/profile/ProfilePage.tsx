import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileHeader from "./components/ProfileHeader";
import ProfileTabs from "./components/ProfileTabs";
import { USER } from "@/utils/interface";
import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { ProfileHeaderSkeleton } from "./components/ProfileHeaderSkeleton";
// import { mockUsers } from "@/utils/fakeData";

const ProfilePage = () => {
  const params = useParams();
  const userId = params.id;
  const [profileData, setProfileData] = useState<USER | null>(null);
  const [isOwner, setIsOwner] = useState(true);
  // const [profileData, setProfileData] = useState<USER | null>(mockUsers[0]);
  // const [isOwner, setIsOwner] = useState(false);

  const { getUser } = useUserStore();
  const { userAuth } = useAuthStore();

  const fetchProfile = useCallback(async () => {
    if (userId) {
      const currentUser = await getUser(userId);

      if (currentUser) {
        setProfileData(currentUser.profile);

        const isMyProfile = currentUser?.id === userAuth?.id;
        setIsOwner(isMyProfile);
      }
    }
  }, [userId, getUser, userAuth]);

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
        setProfileData={setProfileData}
      />

      <ProfileTabs
        profileData={profileData as USER}
        isOwner={isOwner}
        userId={userId}
      />
    </div>
  );
};

export default ProfilePage;
