import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { POST } from "@/utils/types";

interface ProfilePhotosProps {
  posts: POST[];
}

const ProfilePhotos = ({ posts }: ProfilePhotosProps) => {
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
            Photos
          </h2>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {posts
              ?.filter((post) => post?.mediaType === "image" && post?.mediaUrl)
              .map((post) => (
                <img
                  key={post?.id}
                  src={post?.mediaUrl}
                  alt="user_all_photos"
                  className="w-[200px] h-[150px] object-cover rounded-lg"
                />
              ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfilePhotos;
