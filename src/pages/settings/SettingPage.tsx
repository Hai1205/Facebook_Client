import { Mic2, Shield, User } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";
import React, { useEffect, useState } from "react";
import { ArtistApplication, User as USER } from "@/utils/types";
import GeneralTab from "@/pages/settings/components/GeneralTab";
import SecurityTab from "@/pages/settings/components/SecurityTab";
import ArtistApplicationTab from "./components/ArtistApplicationTab";

export interface SongSample {
  title: string;
  file?: File | null;
}

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
  rePassword: string;
}

const SettingPage = () => {
  const {
    isAdmin,
    isArtist,
    user: userAuth,
    isLoading: isAuthLoading,
    changePassword,
  } = useAuthStore();
  const {
    isLoading: isUserLoading,
    updateUser,
    getArtistApplication,
    requireUpdateUserToArtist,
  } = useUserStore();

  const [userData, setUserData] = useState<USER | null>(userAuth);
  const [changePasswordData, setChangePasswordData] = useState<ChangePassword>({
    currentPassword: "",
    newPassword: "",
    rePassword: "",
  });
  const [applicationData, setApplicationData] = useState<ArtistApplication>({
    achievements: "",
    reason: "",
    id: "",
    user: null,
    songs: [],
    biography: "",
    status: "",
    submitDate: "",
  });
  const [songData, setSongData] = useState<SongSample[]>([
    { title: "", file: null },
    { title: "", file: null },
    { title: "", file: null },
  ]);
  const [previewAvatar, setPreviewAvatar] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Initialize userData when userAuth is available or changes
  useEffect(() => {
    const fetchData = async () => {
      if (!userAuth) {
        return;
      }

      const res = await getArtistApplication(userAuth.id);
      if(!res){
        return;
      }

      setApplicationData(res)
      setSongData(res.songs || [])
      setPreviewAvatar(userAuth.avatarUrl || "");
    }

    fetchData();
  }, [getArtistApplication, userAuth]);

  const handleInfoChange = (field: keyof USER, value: string | File | null) => {
    setUserData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSecurityChange = (
    field: keyof ChangePassword,
    value: string | File | null
  ) => {
    setChangePasswordData((prev: ChangePassword) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplicationChange = (
    name: string,
    value: string | File | null
  ) => {
    if (name.startsWith("song")) {
      const index = parseInt(name.match(/\d+/)?.[0] || "0", 10) - 1; // Extract song index (e.g., song1Title -> index 0)
      const field = name.replace(/\d+/, ""); // Extract field name (e.g., song1Title -> title)

      setSongData((prev) => {
        const updatedSongs = [...prev];
        if (!updatedSongs[index]) {
          updatedSongs[index] = { title: "", file: null }; // Initialize if undefined
        }
        if (field === "File") {
          updatedSongs[index].file = value as File;
        } else {
          updatedSongs[index] = { ...updatedSongs[index], [field]: value };
        }
        return updatedSongs;
      });
    } else {
      setApplicationData((prev) =>
        prev ? { ...prev, [name as keyof ArtistApplication]: value } : prev
      );
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleSaveInfo = () => {
    if (userData && userAuth) {
      const formData = new FormData();
      formData.append("fullName", userData.fullName || "");
      formData.append("country", userData.country || "");
      formData.append("biography", userData.biography || "");
      formData.append("website", userData.website || "");
      formData.append("instagram", userData.instagram || "");
      formData.append("twitter", userData.twitter || "");
      formData.append("facebook", userData.facebook || "");
      formData.append("youtube", userData.youtube || "");

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      updateUser(userAuth.id, formData);
    }
  };

  const handleChangePassword = async () => {
    if (changePasswordData && userAuth) {
      const formData = new FormData();
      formData.append(
        "currentPassword",
        changePasswordData.currentPassword || ""
      );
      formData.append("newPassword", changePasswordData.newPassword || "");
      formData.append("rePassword", changePasswordData.rePassword || "");

      const res = await changePassword(userAuth.id, formData);
      if (!res) {
        return;
      }

      setChangePasswordData({
        currentPassword: "",
        newPassword: "",
        rePassword: "",
      });
    }
  };

  const handleRequireApplication = () => {
    if (userData && userAuth) {
      const formData = new FormData();
      formData.append("achievements", applicationData?.achievements || "");
      formData.append("reason", applicationData?.reason || "");
      formData.append("song1Title", songData[0].title || "");
      formData.append("song2Title", songData[1].title || "");
      formData.append("song3Title", songData[2].title || "");

      if (songData[0].file) {
        formData.append("song1Audio", songData[0].file);
      }
      if (songData[1].file) {
        formData.append("song2Audio", songData[1].file);
      }
      if (songData[2].file) {
        formData.append("song3Audio", songData[2].file);
      }

      requireUpdateUserToArtist(userAuth.id, formData);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>

        <p className="text-muted-foreground">
          Manage your account settings and platform preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <User className="h-4 w-4" />

            <span className="hidden sm:inline-block">General</span>
          </TabsTrigger>

          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />

            <span className="hidden sm:inline-block">Security</span>
          </TabsTrigger>

          {!(isArtist || isAdmin) && (
            <TabsTrigger
              value="application"
              className="flex items-center gap-2"
            >
              <Mic2 className="h-4 w-4" />

              <span className="hidden sm:inline-block">Apply to Artist</span>
            </TabsTrigger>
          )}
        </TabsList>

        {userData && userAuth && (
          <GeneralTab
            userData={userData}
            handleInfoChange={handleInfoChange}
            handleSaveInfo={handleSaveInfo}
            isUserLoading={isUserLoading}
            previewAvatar={previewAvatar}
            userAuth={userAuth}
            handleAvatarChange={handleAvatarChange}
          />
        )}

        <SecurityTab
          changePasswordData={changePasswordData}
          handleSecurityChange={handleSecurityChange}
          handleChangePassword={handleChangePassword}
          isAuthLoading={isAuthLoading}
        />

        <ArtistApplicationTab
          applicationData={applicationData}
          songData={songData}
          handleApplicationChange={handleApplicationChange}
          handleRequireApplication={handleRequireApplication}
          isUserLoading={isUserLoading}
        />
      </Tabs>
    </div>
  );
};

export default SettingPage;
