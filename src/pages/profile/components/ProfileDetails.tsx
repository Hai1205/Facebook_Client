import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Cake,
  GraduationCap,
  Heart,
  Home,
  Mail,
  MapPin,
  Phone,
  Rss,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { formatDateInDDMMYYY } from "@/lib/utils";
import { usePostStore } from "@/stores/usePostStore";
import PostsContent from "./PostContent";
import { COMMENT, POST, USER } from "@/utils/types";
import MutualFriends from "./MutualFriends";
import EditBio from "./EditBio";

interface ProfileDetailsProps {
  activeTab: "posts" | "about" | "friends" | "photos";
  userId: string | undefined;
  profileData: USER;
  isOwner: boolean;
}

const ProfileDetails = ({
  activeTab,
  userId,
  profileData,
  isOwner,
}: ProfileDetailsProps) => {
  const [isEditBioModel, setIsEditBioModel] = useState(false);
  const [likePosts, setLikePosts] = useState(new Set());
  const [userPosts, setUserPosts] = useState<POST[]>([]);

  const { likePost, addCommentToPost, sharePost, getUserPosts } =
    usePostStore();

  const fetchUserPosts = useCallback(async () => {
    if (!userId) {
      return;
    }

    const posts = await getUserPosts(userId);
    if (posts) {
      setUserPosts(posts);
    }
  }, [userId, getUserPosts]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  useEffect(() => {
    const saveLikes = sessionStorage.getItem("likePosts");
    if (saveLikes) {
      setLikePosts(new Set(JSON.parse(saveLikes)));
    }
  }, []);

  const handleLikePost = async (postId: string) => {
    if (!userId) {
      return;
    }

    const updatedLikePost = new Set(likePosts);
    if (updatedLikePost.has(postId)) {
      updatedLikePost.delete(postId);
    } else {
      updatedLikePost.add(postId);
    }
    setLikePosts(updatedLikePost);
    sessionStorage.setItem(
      "likePosts",
      JSON.stringify(Array.from(updatedLikePost))
    );

    await likePost(postId, userId);
    fetchUserPosts();
  };

  const handleCommentPost = async (comment: COMMENT, postId: string) => {
    if (!userId) {
      return;
    }

    await addCommentToPost(postId, userId, comment.text);
    await fetchUserPosts();
  };

  const handleSharePost = async (postId: string) => {
    if (!userId) {
      return;
    }

    await sharePost(postId, userId);
    await fetchUserPosts();
  };

  const tabContent = {
    posts: (
      <div className="flex flex-col lg:flex-row gap-6 ">
        <div className="w-full lg:w-[70%] space-y-6 mb-4">
          {userPosts?.map((post) => (
            <PostsContent
              key={post?.id}
              post={post}
              isLiked={likePosts.has(post?.id)}
              onLike={() => handleLikePost(post?.id)}
              onComment={(comment: COMMENT) =>
                handleCommentPost(comment, post?.id)
              }
              onShare={() => handleSharePost(post?.id)}
            />
          ))}
        </div>

        <div className="w-full lg:w-[30%]">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-gray-300">
                Intro
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {profileData?.bio?.bioText}
              </p>

              <div className="space-y-2 mb-4 dark:text-gray-300">
                <div className="flex items-center">
                  <Home className="w-5 h-5 mr-2" />

                  <span> {profileData?.bio?.liveIn}</span>
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

                  <span> {profileData?.bio?.workplace}</span>
                </div>

                <div className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />

                  <span> {profileData?.bio?.education}</span>
                </div>
              </div>

              <div className="flex items-center mb-4 dark:text-gray-300">
                <Rss className="w-5 h-5 mr-2" />

                <span>Followed by {profileData?.following?.length} people</span>
              </div>

              {isOwner && (
                <Button
                  className="w-full "
                  onClick={() => setIsEditBioModel(true)}
                >
                  Edit Bio
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    ),
    about: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-300">
              About {profileData?.username}
            </h2>

            <div className="space-y-4 dark:text-gray-300">
              <div className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />

                <span>{profileData?.bio?.workplace}</span>
              </div>

              <div className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />

                <span> {profileData?.bio?.education}</span>
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
    ),
    friends: <MutualFriends userId={userId} isOwner={isOwner} />,
    photos: (
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
              {userPosts
                ?.filter(
                  (post) => post?.mediaType === "image" && post?.mediaUrl
                )
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
    ),
  };

  return (
    <div>
      {tabContent[activeTab as keyof typeof tabContent] || null}

      <EditBio
        isOpen={isEditBioModel}
        onClose={() => setIsEditBioModel(false)}
        initialData={profileData?.bio}
        userId={userId}
      />
    </div>
  );
};

export default ProfileDetails;
