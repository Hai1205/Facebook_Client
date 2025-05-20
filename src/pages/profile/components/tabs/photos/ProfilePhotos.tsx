import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { POST } from "@/utils/interface";
import { MediaViewer } from "@/pages/post/components/medias/MediaViewer";
import { useState, useMemo } from "react";
import { MediaItem } from "../../../../post/components/medias/MediaItem";

interface ProfilePhotosProps {
  posts: POST[];
}

const ProfilePhotos = ({ posts }: ProfilePhotosProps) => {
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [selectedPost, setSelectedPost] = useState<POST | null>(null);

  const allMedias = useMemo(() => {
    const medias: { url: string; type: string; postId: string }[] = [];
    posts?.forEach((post) => {
      if (post.mediaUrls?.length && post.id) {
        post.mediaUrls.forEach((url, index) => {
          medias.push({
            url,
            type: post.mediaTypes?.[index] || "IMAGE",
            postId: post.id || "",
          });
        });
      }
    });
    return medias;
  }, [posts]);

  const openMediaViewer = (post: POST, index: number) => {
    setSelectedPost(post);
    setCurrentMediaIndex(index);
    setShowMediaViewer(true);
    document.body.style.overflow = "hidden";
  };

  const closeMediaViewer = () => {
    setShowMediaViewer(false);
    setSelectedPost(null);
    document.body.style.overflow = "auto";
  };

  const goToNextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % allMedias.length);
  };

  const goToPrevMedia = () => {
    setCurrentMediaIndex(
      (prev) => (prev - 1 + allMedias.length) % allMedias.length
    );
  };

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
              ?.filter((post) => post?.mediaUrls?.length > 0)
              .map((post) =>
                post.mediaUrls.map((mediaUrl, index) => (
                  <div
                    key={`${post.id}-${index}`}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                  >
                    <MediaItem
                      url={mediaUrl}
                      type={post.mediaTypes?.[index] || "IMAGE"}
                      index={index}
                      onClick={() => openMediaViewer(post, index)}
                      className="cursor-pointer w-full h-full"
                    />
                  </div>
                ))
              )}
          </div>
        </CardContent>
      </Card>

      {showMediaViewer && selectedPost && (
        <MediaViewer
          medias={allMedias.map((m) => m.url)}
          currentMediaIndex={currentMediaIndex}
          closeMediaViewer={closeMediaViewer}
          mediaTypes={allMedias.map((m) => m.type)}
          goToPrevMedia={goToPrevMedia}
          goToNextMedia={goToNextMedia}
          setCurrentMediaIndex={setCurrentMediaIndex}
        />
      )}
    </motion.div>
  );
};

export default ProfilePhotos;
