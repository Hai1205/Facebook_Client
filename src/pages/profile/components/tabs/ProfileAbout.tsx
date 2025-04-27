import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { formatDateInDDMMYYY } from "@/lib/utils";
import { USER } from "@/utils/interface";
import {
  Briefcase,
  Cake,
  GraduationCap,
  Heart,
  Home,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

interface ProfileAboutProps {
  profileData: USER;
}

const ProfileAbout = ({ profileData }: ProfileAboutProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-4"
    >
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-300">
            About {profileData?.fullName}
          </h2>

          <div className="space-y-4 dark:text-gray-300">
            <div className="flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              <span>{profileData?.bio?.workplace}</span>
            </div>

            <div className="flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" />
              <span>{profileData?.bio?.education}</span>
            </div>

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
              <Phone className="w-5 h-5 mr-2" />
              <span>{profileData?.bio?.phone}</span>
            </div>

            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              <span>{profileData?.email}</span>
            </div>

            <div className="flex items-center">
              <Cake className="w-5 h-5 mr-2" />
              <span>
                Birthday: {formatDateInDDMMYYY(profileData?.dateOfBirth)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileAbout;
