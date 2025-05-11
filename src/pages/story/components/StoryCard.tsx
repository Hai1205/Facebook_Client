import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ShowStoryPreview from "./ShowStoryPreview";
import { STORY } from "@/utils/interface";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePostStore } from "@/stores/usePostStore";

interface StoryCardProps {
  isAddStory?: boolean;
  story?: STORY;
  storiesList?: STORY[];
  currentIndex?: number;
}

const StoryCard = ({
  isAddStory = false,
  story,
  storiesList = [],
  currentIndex = 0,
}: StoryCardProps) => {
  const { userAuth } = useAuthStore();
  const { isLoading, createStory } = usePostStore();

  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isNewStory, setIsNewStory] = useState(false);
  const [storyIndex, setStoryIndex] = useState<number>(currentIndex);

  useEffect(() => {
    if (!isNewStory && currentIndex !== undefined) {
      setStoryIndex(currentIndex);
    }
  }, [currentIndex, isNewStory]);

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
    formData.append("privacy", "PUBLIC");
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    const result = await createStory(userAuth?.id as string, formData);
    if (result) {
      resetStoryState();
    }
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
    if (story) {
      setStoryIndex(currentIndex);
      showStory(story);
    }
  };

  const handleAddStoryClick = () => {
    fileInputRef.current?.click();
  };

  const showStory = (storyItem: STORY) => {
    setFilePreview(storyItem?.mediaUrl || "");
    const type = storyItem?.mediaType === "VIDEO" ? "video" : "image";
    setFileType(type);
    setIsNewStory(false);
    setShowPreview(true);
  };

  const handleNextStory = () => {
    if (storiesList && storiesList.length > 0) {
      const nextIndex = storyIndex + 1;
      if (nextIndex < storiesList.length) {
        setStoryIndex(nextIndex);
        showStory(storiesList[nextIndex]);
      } else {
        resetStoryState();
      }
    } else {
      resetStoryState();
    }
  };

  const handlePreviousStory = () => {
    if (storiesList && storiesList.length > 0) {
      const prevIndex = storyIndex - 1;
      if (prevIndex >= 0) {
        setStoryIndex(prevIndex);
        showStory(storiesList[prevIndex]);
      }
    }
  };

  const currentStory = isNewStory ? null : storiesList[storyIndex];

  return (
    <>
      <Card
        className="w-40 h-60 relative overflow-hidden group cursor-pointer rounded-xl"
        onClick={isAddStory ? handleAddStoryClick : handleStoryClick}
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

                  <AvatarFallback className="bg-zinc-800 text-white text-6xl !rounded-none">
                    {userAuth?.fullName?.substring(0, 2) || "FU"}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="h-1/4 w-full bg-white dark:bg-gray-800 flex flex-col items-center justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-10 w-10 rounded-full bg-blue-600 hover:bg-[#166FE5] transition duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddStoryClick();
                  }}
                >
                  <Plus className="h-5 w-5 text-white" />
                </Button>
                <p className="text-xs font-semibold mt-1">Tạo story</p>
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
              {story?.mediaType === "IMAGE" ? (
                <img
                  src={story?.mediaUrl}
                  alt={story?.user?.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={story?.mediaUrl || ""}
                  className="w-full h-full object-cover"
                  preload="metadata"
                  muted
                  playsInline
                />
              )}

              <div className="absolute top-2 left-2 ring-2 ring-blue-500 rounded-full ">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={story?.user?.avatarPhotoUrl}
                    alt={story?.user?.fullName}
                  />

                  <AvatarFallback className="bg-zinc-800 text-white">
                    {story?.user?.fullName.substring(0, 2) || "FU"}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-semibold truncate">
                  {story?.user?.fullName || "Facebook User"}
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
          currentStory={!isNewStory && currentStory ? currentStory : undefined}
          isLoading={isLoading}
          onNext={handleNextStory}
          onPrevious={handlePreviousStory}
        />
      )}
    </>
  );
};

export default StoryCard;
