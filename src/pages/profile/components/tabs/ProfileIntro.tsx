import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Heart,
  Home,
  MapPin,
  GraduationCap,
  Rss,
} from "lucide-react";
import { USER } from "@/utils/types";

interface ProfileIntroProps {
  profileData: USER;
  isOwner: boolean;
  onEditBio: () => void;
}

const ProfileIntro = ({
  profileData,
  isOwner,
  onEditBio,
}: ProfileIntroProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-300">Intro</h2>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {profileData?.bio?.bioText}
        </p>

        <div className="space-y-2 mb-4 dark:text-gray-300">
          <div className="flex items-center">
            <Home className="w-5 h-5 mr-2" />
            <span>{profileData?.bio?.liveIn}</span>
          </div>

          <div className="flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            <span>{profileData?.bio?.relationship}</span>
          </div>

          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{profileData?.bio?.hometown}</span>
          </div>

          <div className="flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            <span>{profileData?.bio?.workplace}</span>
          </div>

          <div className="flex items-center">
            <GraduationCap className="w-5 h-5 mr-2" />
            <span>{profileData?.bio?.education}</span>
          </div>
        </div>

        <div className="flex items-center mb-4 dark:text-gray-300">
          <Rss className="w-5 h-5 mr-2" />
          <span>Followed by {profileData?.following?.length} people</span>
        </div>

        {isOwner && (
          <Button className="w-full" onClick={onEditBio}>
            Edit Bio
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileIntro;
