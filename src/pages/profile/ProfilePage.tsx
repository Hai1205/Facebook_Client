import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileHeader from "./components/ProfileHeader";
import ProfileTabs from "./components/ProfileTabs";
import { USER } from "@/utils/types";
import { mockUsers } from "@/utils/fakeData";
// import ProfileHeader from "../ProfileHeader";
// import ProfileTabs from "../ProfileTabs";
// import { useParams } from "next/navigation";
// import { useUserStore } from "@/stores/useUserStore";
// import { fetchUserProfile } from "@/service/user.service";

const ProfilePage = () => {
  const params = useParams();
  const userId = params.id;
  const [profileData, setProfileData] = useState<USER | null>(mockUsers[0]);
  // const [profileData, setProfileData] = useState<USER | null>(null);
  const [isOwner, setIsOwner] = useState(true);
  // const [isOwner, setIsOwner] = useState(false);

  // const { getUser } = useUserStore();

  const fetchProfile = useCallback(async () => {
    setProfileData(mockUsers[0]);
    setIsOwner(true);
  }, []);

  // const fetchProfile = useCallback(async () => {
  //   if (userId) {
  //     const result = await getUser(userId);

  //     if (result) {
  //       setProfileData(result.profile);
  //       setIsOwner(result.isOwner);
  //     }
  //   }
  // }, [userId, getUser]);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [fetchProfile, userId]);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <ProfileHeader
        profileData={profileData}
        isOwner={isOwner}
        userId={userId}
        setProfileData={setProfileData}
      />

      <ProfileTabs
        profileData={profileData}
        isOwner={isOwner}
        userId={userId}
      />
    </div>
  );
};

export default ProfilePage;
