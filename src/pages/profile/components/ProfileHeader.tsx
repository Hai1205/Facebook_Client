import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, PenLine, BadgeCheck, MessageCircle } from "lucide-react";
import { useState } from "react";
import { USER } from "@/utils/interface";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import EditUserDialog from "@/pages/admin/userManagement/components/EditUserDialog";
import { formatNumberStyle } from "@/lib/utils";
import { FriendButton } from "@/pages/profile/components/buttons/FriendButton";
import { FollowButton } from "@/pages/profile/components/buttons/FollowButton";
import { FRIEND_STATUS } from "@/utils/types";
import EditCoverPhotoDialog from "./dialogs/EditCoverPhotoDialog";
import ExtendOption from "@/pages/post/components/ExtendOption";

interface ProfileHeaderProps {
  userId: string | undefined;
  profileData: USER;
  friendRequestStatus: FRIEND_STATUS;
  isOwner: boolean;
  setProfileData: (profileData: USER) => void;
  setFriendRequestStatus: (friendRequestStatus: FRIEND_STATUS) => void;
}

const ProfileHeader = ({
  profileData,
  isOwner,
  friendRequestStatus,
  setProfileData,
  setFriendRequestStatus,
}: ProfileHeaderProps) => {
  const { userAuth } = useAuthStore();
  const { startChat } = useChatStore();

  const [isEditProfileModel, setIsEditProfileModel] = useState(false);
  const [isEditCoverPhotoModel, setIsEditCoverPhotoModel] = useState(false);

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

  const handleStartChat = () => {
    startChat(profileData);
  };

  return (
    <div className="relative">
      <div className="relative h-64 md:h-80 bg-gray-300 overflow-hidden">
        {profileData?.coverPhotoUrl ? (
          <img
            src={profileData.coverPhotoUrl}
            alt={`${profileData.fullName}'s cover`}
            className="w-full h-full object-cover"
            style={{
              background: "linear-gradient(135deg, #1010D5 0%, #323257 100%)",
            }}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: "linear-gradient(135deg, #1010D5 0%, #323257 100%)",
            }}
            aria-label={`${profileData.fullName}'s cover`}
          />
        )}

        <div className="absolute top-4 right-4 z-20">
          {
            !isOwner && (
              <ExtendOption content={profileData} contentType="USER" />
            )
          }
        </div>

        {isOwner && (
          <div className="absolute bottom-4 right-4 z-20">
            <Button
              className="flex items-center cursor-pointer"
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsEditCoverPhotoModel(true);
              }}
            >
              <Camera className="mr-0 md:mr-2 h-4 w-4" />
              <span className="hidden md:block">Edit Cover Photo</span>
            </Button>
          </div>
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

            <AvatarFallback className="bg-zinc-700 text-6xl">
              {profileData?.fullName?.substring(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="mt-4 mdLmt-0 text-center md:text-left flex-grow">
            <h1 className="text-3xl font-bold flex items-center">
              {profileData?.fullName}

              {profileData.celebrity && (
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
                    friendRequestStatus={friendRequestStatus}
                    onStatusChange={handleFriendStatusChange}
                    onFollowChange={handleFollowChange}
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
                    onClick={handleStartChat}
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

      {/* edit cover photo model */}
      <EditCoverPhotoDialog
        isOpen={isEditCoverPhotoModel}
        onOpenChange={setIsEditCoverPhotoModel}
        user={profileData}
      />

      {/* edit profile model */}
      <EditUserDialog
        isOpen={isEditProfileModel}
        onOpenChange={setIsEditProfileModel}
        user={profileData}
        isAdmin={false}
      />
    </div>
  );
};

export default ProfileHeader;
