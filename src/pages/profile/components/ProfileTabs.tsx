import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import ProfileDetails from "./ProfileDetails";
import { USER } from "@/utils/types";
import { CHOICE, TAB_LIST_CHOICE } from "@/utils/choice";

interface ProfileTabsProps {
  userId: string | undefined;
  profileData: USER;
  isOwner: boolean;
}

const ProfileTabs = ({
  userId,
  profileData,
  isOwner,
}: ProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <Tabs
        defaultValue="posts"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-4">
          {TAB_LIST_CHOICE.map((tab: CHOICE) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          <ProfileDetails
            activeTab={activeTab as "posts" | "about" | "friends" | "photos"}
            profileData={profileData}
            userId={userId}
            isOwner={isOwner}
          />
        </div>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
