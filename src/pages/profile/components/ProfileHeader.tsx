import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";
import { Camera, PenLine, Save, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { USER } from "@/utils/types";
import { useUserBioStore } from "@/stores/useUserBioStore";
import { useUserStore } from "@/stores/useUserStore";
import { GENDER_CHOICE, CHOICE } from "@/utils/choice";

interface ProfileHeaderProps {
  userId: string | undefined;
  profileData: USER;
  isOwner: boolean;
  setProfileData: (profileData: USER) => void;
}

const ProfileHeader = ({
  userId,
  profileData,
  isOwner,
  setProfileData,
}: ProfileHeaderProps) => {
  const [isEditProfileModel, setIsEditProfileModel] = useState(false);
  const [isEditCoverModel, setIsEditCoverModel] = useState(false);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(
    null
  );
  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(null);
  const [profilePictureFile, setProfilePictureFile] = useState<string | null>(
    null
  );
  const [coverPhotoFile, setCoverPhotoFile] = useState<string | null>(null);
  const { isLoading, updateUserBio, updateCoverPhoto } = useUserBioStore();
  const { getUser } = useUserStore();

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      fullName: profileData?.fullName,
      dateOfBirth: profileData?.dateOfBirth?.split("T")[0],
      gender: profileData?.gender,
    },
  });

  const profileImageInputRef = useRef<HTMLInputElement | null>(null);
  const coverImageInputRef = useRef<HTMLInputElement | null>(null);

  const onSubmitProfile = async (data: any) => {
    if (!userId) {
      return;
    }

    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("dateOfBirth", data.dateOfBirth);
    formData.append("gender", data.gender);

    if (profilePictureFile) {
      formData.append("profilePicture", profilePictureFile);
    }

    const updateProfile = await updateUserBio(userId, formData);
    setProfileData({ ...profileData, ...updateProfile });
    setIsEditProfileModel(false);
    setProfilePicturePreview(null);
    await getUser(userId);
  };

  const handleProfilePictureChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);

      const previewUrl = URL.createObjectURL(file);
      setProfilePicturePreview(previewUrl);
    }
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
      <div className="relative h-64 md:h-80 bg-gray-300 overflow-hidden ">
        <img
          src={profileData?.coverPhotoUrl}
          alt="cover"
          className="w-full h-full object-cover"
        />

        {isOwner && (
          <Button
            className="absolute bottom-4 right-4 flex items-center"
            variant="secondary"
            size="sm"
            onClick={() => setIsEditCoverModel(true)}
          >
            <Camera className=" mr-0 md:mr-2 h-4 w-4" />
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

            <AvatarFallback className="dark:bg-gray-400">
              {profileData?.fullName
                ?.split(" ")
                .map((name) => name[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="mt-4 mdLmt-0 text-center md:text-left flex-grow">
            <h1 className="text-3xl font-bold">{profileData?.fullName}</h1>

            <p className="text-gray-400 font-semibold">
              {profileData?.followers?.length}{" "}
              {profileData?.followers?.length === 1 ? "follower" : "followers"}
            </p>
          </div>

          {isOwner && (
            <Button
              className="mt-4 md:mt-0 cursor-pointer"
              onClick={() => setIsEditProfileModel(true)}
            >
              <PenLine className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* edit profile model */}
      <AnimatePresence>
        {isEditProfileModel && (
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
                  Edit Profile
                </h2>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditProfileModel(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form
                className="space-y-4"
                onSubmit={handleSubmit(onSubmitProfile)}
              >
                <div className="flex flex-col items-center mb-4">
                  <Avatar className="w-24 h-24 border-4 border-white dark:border-gray-700 mb-2">
                    <AvatarImage
                      src={profilePicturePreview || profileData?.avatarPhotoUrl}
                      alt={profileData?.fullName}
                    />

                    <AvatarFallback className="dark:bg-gray-400">
                      {profileData?.fullName?.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={profileImageInputRef}
                    onChange={handleProfilePictureChange}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => profileImageInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Change Profile Picture
                  </Button>
                </div>

                <div>
                  <Label htmlFor="fullName">Full Name</Label>

                  <Input id="fullName" {...register("fullName")} />
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>

                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...register("dateOfBirth")}
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>

                  <Select
                    onValueChange={(value) => setValue("gender", value)}
                    defaultValue={profileData?.gender}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>

                    <SelectContent>
                      {GENDER_CHOICE.map((item: CHOICE) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-400 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />{" "}
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  <X className="w-4 h-4" />
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
                    onClick={() => coverImageInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select New Cover Photo
                  </Button>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-400 text-white"
                  onClick={onSubmitCoverPhoto}
                  disabled={!coverPhotoFile}
                  type="button"
                >
                  <Save className="w-4 h-4 mr-2" />{" "}
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
