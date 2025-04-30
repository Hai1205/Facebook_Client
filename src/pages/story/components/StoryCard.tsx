import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import ShowStoryPreview from "./ShowStoryPreview";
import { STORY } from "@/utils/interface";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePostStore } from "@/stores/usePostStore";

interface StoryCardProps {
  isAddStory?: boolean;
  story?: STORY;
}

const StoryCard = ({ isAddStory = false, story }: StoryCardProps) => {
  const { userAuth } = useAuthStore();
  const { isLoading, createStory } = usePostStore();

  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isNewStory, setIsNewStory] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileType(file.type.startsWith("video") ? "video" : "image");
      setFilePreview(URL.createObjectURL(file));
      setIsNewStory(true);
      setShowPreview(true);
    }
    e.target.value = "";
  };

  const handleCreateStoryPost = async () => {
    if (!userAuth) {
      return null;
    }

    const formData = new FormData();
    if (selectedFile) {
      formData.append("media", selectedFile);
    }
    await createStory(userAuth?.id as string, formData);
    resetStoryState();
  };

  const handleClosePreview = () => {
    resetStoryState();
  };

  const resetStoryState = () => {
    setShowPreview(false);
    setSelectedFile(null);
    setFilePreview(null);
    setFileType(null);
    setIsNewStory(false);
  };

  const handleStoryClick = () => {
    setFilePreview(story?.mediaUrl || "");
    setFileType(story?.mediaType || "");
    setIsNewStory(false);
    setShowPreview(true);
  };

  return (
    <>
      <Card
        className="w-40 h-60 relative overflow-hidden group cursor-pointer rounded-xl"
        onClick={isAddStory ? undefined : handleStoryClick}
      >
        <CardContent className="p-0 h-full">
          {isAddStory ? (
            <div className="w-full h-full flex flex-col">
              <div className="h-3/4 w-full relative border-b">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage
                    src={userAuth?.avatarPhotoUrl}
                    alt={userAuth?.fullName}
                    className="object-cover"
                  />

                  <AvatarFallback className="bg-gray-700 !rounded-none">
                    {userAuth?.fullName?.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="h-1/4 w-full bg-white dark:bg-gray-800 flex flex-col items-center justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-10 w-10 rounded-full bg-blue-600 hover:bg-[#166FE5] transition duration-200"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus className="h-5 w-5 text-white" />
                </Button>
                <p className="text-xs font-semibold mt-1">Create Story</p>
              </div>

              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <>
              {story?.mediaType === "image" ? (
                <img
                  src={story?.mediaUrl}
                  alt={story?.user?.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={story?.mediaUrl || ""}
                  className="w-full h-full object-cover"
                />
              )}

              <div className="absolute top-2 left-2 ring-2 ring-blue-500 rounded-full ">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={story?.user?.avatarPhotoUrl}
                    alt={story?.user?.fullName}
                  />

                  <AvatarFallback className="bg-gray-700">
                    {story?.user?.fullName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-semibold truncate">
                  {story?.user?.fullName}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {showPreview && (
        <ShowStoryPreview
          file={filePreview}
          fileType={fileType}
          onClose={handleClosePreview}
          onPost={handleCreateStoryPost}
          isNewStory={isNewStory}
          fullName={
            isNewStory ? userAuth?.fullName || "" : story?.user?.fullName || ""
          }
          avatar={
            isNewStory
              ? userAuth?.avatarPhotoUrl || null
              : story?.user?.avatarPhotoUrl || null
          }
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default StoryCard;
