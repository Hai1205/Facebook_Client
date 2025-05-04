import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";
import {
  Camera,
  PenLine,
  Save,
  Upload,
  UserRoundX,
  BadgeCheck,
  MessageCircle,
} from "lucide-react";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { USER } from "@/utils/interface";
import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore";
import EditUserDialog from "@/pages/admin/userManagement/components/EditUserDialog";
import { formatNumberStyle } from "@/lib/utils";
import { FriendButton } from "@/layout/components/navbar/components/FriendButton";
import { FollowButton } from "@/layout/components/navbar/components/FollowButton";
import { FRIEND_STATUS } from "@/utils/types";

interface ProfileHeaderProps {
  userId: string | undefined;
  profileData: USER;
  friendStatus: FRIEND_STATUS;
  isOwner: boolean;
  setProfileData: (profileData: USER) => void;
}

const ProfileHeader = ({
  userId,
  profileData,
  isOwner,
  friendStatus,
  setProfileData,
}: ProfileHeaderProps) => {
  const { userAuth } = useAuthStore();
  const { isLoading, updateCoverPhoto } = useUserStore();

  const [isEditProfileModel, setIsEditProfileModel] = useState(false);
  const [isEditCoverModel, setIsEditCoverModel] = useState(false);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(
    null
  );
  const [coverPhotoFile, setCoverPhotoFile] = useState<string | null>(null);
  const [friendRequestStatus, setFriendRequestStatus] =
    useState<FRIEND_STATUS>(friendStatus);

  const coverImageInputRef = useRef<HTMLInputElement | null>(null);

  const handleFriendStatusChange = (newStatus: FRIEND_STATUS) => {
    setFriendRequestStatus(newStatus);

    if (newStatus === "FRIEND" && userAuth?.id) {
      const updatedFriends = [...(profileData.friends || [])];
      const friendExists = updatedFriends.some(
        (friend) => friend.id === userAuth.id
      );

      if (!friendExists) {
        updatedFriends.push(userAuth as USER);
        setProfileData({
          ...profileData,
          friends: updatedFriends,
        });
      }
    }

    if (newStatus === "NONE" && userAuth?.id) {
      setProfileData({
        ...profileData,
        friends:
          profileData.friends?.filter((friend) => friend.id !== userAuth.id) ||
          [],
      });
    }
  };

  const handleFollowChange = (isFollowing: boolean) => {
    if (!userAuth?.id) return;

    let updatedFollowers = [...(profileData.followers || [])];

    if (isFollowing) {
      const userExists = updatedFollowers.some(
        (follower) => follower.id === userAuth.id
      );
      if (!userExists) {
        updatedFollowers.push(userAuth as USER);
      }
    } else {
      updatedFollowers = updatedFollowers.filter(
        (follower) => follower.id !== userAuth.id
      );
    }

    setProfileData({
      ...profileData,
      followers: updatedFollowers,
    });
  };

  const onSubmitCoverPhoto = async (e: any) => {
    e.preventDefault();

    if (!userId) {
      return;
    }

    const formData = new FormData();
    if (coverPhotoFile) {
      formData.append("coverPhoto", coverPhotoFile);
    }
    const updateProfile = await updateCoverPhoto(userId, formData);
    setProfileData({
      ...profileData,
      coverPhotoUrl: updateProfile.coverPhotoUrl,
    });
    setIsEditCoverModel(false);
    setCoverPhotoFile(null);
  };

  const handleCoverPhotoChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhotoFile(file);

      const previewUrl = URL.createObjectURL(file);
      setCoverPhotoPreview(previewUrl);
    }
  };

  return (
    <div className="relative">
      <div className="relative h-64 md:h-80 bg-gray-300 overflow-hidden">
        {profileData?.coverPhotoUrl ? (
          <img
            src={profileData.coverPhotoUrl}
            alt="cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: "#1010D5",
              backgroundImage:
                "linear-gradient(to right, #1010D5 0%, #323257 100%)",
            }}
            aria-label={`${profileData?.fullName || "User"}'s cover`}
          />
        )}

        {isOwner && (
          <Button
            className="absolute bottom-4 right-4 flex items-center z-20"
            variant="secondary"
            size="sm"
            onClick={() => setIsEditCoverModel(true)}
          >
            <Camera className="mr-0 md:mr-2 h-4 w-4" />
            <span className="hidden md:block">Edit Cover Photo</span>
          </Button>
        )}
      </div>

      {/* profile section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end md:space-x-5 ">
          <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-700">
            <AvatarImage
              src={profileData?.avatarPhotoUrl}
              alt={profileData.fullName}
            />

            <AvatarFallback className="dark:bg-zinc-700 text-3xl">
              {profileData?.fullName
                ?.split(" ")
                .map((name) => name[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="mt-4 mdLmt-0 text-center md:text-left flex-grow">
            <h1 className="text-3xl font-bold flex items-center">
              {profileData?.fullName}

              {profileData.followers.length > 5000 && (
                <BadgeCheck className="ml-2 h-6 w-6 text-[#1877F2]" />
              )}
            </h1>

            <p className="text-gray-400 font-semibold">
              {formatNumberStyle(profileData?.followers?.length)}{" "}
              {profileData?.followers?.length > 1 ? "followers" : "follower"}
            </p>
          </div>

          {isOwner ? (
            <Button
              className="mt-4 md:mt-0 cursor-pointer bg-[#1877F2] hover:bg-[#166FE5] text-white"
              onClick={() => {
                setIsEditProfileModel(true);
              }}
            >
              <PenLine className="w-4 h-4" />
              Edit profile
            </Button>
          ) : (
            <>
              {userAuth && (
                <div className="mt-4 md:mt-0 flex space-x-2">
                  <FriendButton
                    targetUserId={profileData.id || ""}
                    initialStatus={friendRequestStatus}
                    onStatusChange={handleFriendStatusChange}
                    className="bg-zinc-800 hover:bg-zinc-900 text-white"
                  />

                  <FollowButton
                    targetUserId={profileData.id || ""}
                    profileData={profileData}
                    className="cursor-pointer bg-zinc-800 hover:bg-zinc-900 text-white"
                    onFollowChange={handleFollowChange}
                  />

                  <Button
                    variant="secondary"
                    className="cursor-pointer bg-[#1877F2] hover:bg-[#166FE5] text-white"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* edit profile model */}
      <EditUserDialog
        isOpen={isEditProfileModel}
        onOpenChange={setIsEditProfileModel}
        user={profileData}
      />

      {/* edit cover model */}
      <AnimatePresence>
        {isEditCoverModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className=" bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Edit Cover Photo
                </h2>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditCoverModel(false)}
                >
                  <UserRoundX className="w-4 h-4" />
                </Button>
              </div>

              <form className="space-y-4">
                <div className="flex flex-col items-center mb-4">
                  {coverPhotoPreview && (
                    <img
                      src={coverPhotoPreview}
                      alt="cover-photo"
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={coverImageInputRef}
                    onChange={handleCoverPhotoChange}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      coverImageInputRef.current?.click();
                    }}
                  >
                    <Upload className="h-4 w-4" />
                    Select New Cover Photo
                  </Button>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-400 text-white"
                  onClick={onSubmitCoverPhoto}
                  disabled={!coverPhotoFile}
                  type="button"
                >
                  <Save className="w-4 h-4" />{" "}
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileHeader;
