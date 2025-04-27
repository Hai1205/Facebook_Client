import { Shield, User } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";
import React, { useState } from "react";
import GeneralTab from "@/pages/settings/components/GeneralTab";
import SecurityTab from "@/pages/settings/components/SecurityTab";
import { USER } from "@/utils/interface";

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
  rePassword: string;
}

const SettingPage = () => {
  const { userAuth, isLoading: isAuthLoading, changePassword } = useAuthStore();
  const { isLoading: isUserLoading, updateUser } = useUserStore();

  const [userData, setUserData] = useState<USER | null>(userAuth);
  const [changePasswordData, setChangePasswordData] = useState<ChangePassword>({
    currentPassword: "",
    newPassword: "",
    rePassword: "",
  });

  const [previewAvatar, setPreviewAvatar] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

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
      // formData.append("country", userData.country || "");
      // formData.append("biography", userData.biography || "");
      // formData.append("website", userData.website || "");
      // formData.append("instagram", userData.instagram || "");
      // formData.append("twitter", userData.twitter || "");
      // formData.append("facebook", userData.facebook || "");
      // formData.append("youtube", userData.youtube || "");

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      updateUser(userAuth.id || "", formData);
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

      const res = await changePassword(userAuth.id || "", formData);
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
      </Tabs>
    </div>
  );
};

export default SettingPage;
