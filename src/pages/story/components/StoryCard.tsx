import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ShowStoryPreview from "./ShowStoryPreview";
import { STORY } from "@/utils/interface";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePostStore } from "@/stores/usePostStore";

interface StoryCardProps {
  isAddStory?: boolean;
  stories?: STORY[];
  userIndex?: number;
  isActive?: boolean;
  onStoryStart?: (index: number) => void;
  onStoryEnd?: () => void;
  onNextUserStory?: () => boolean;
  onPreviousUserStory?: () => boolean;
}

const StoryCard = ({
  isAddStory = false,
  stories = [],
  userIndex = 0,
  isActive = false,
  onStoryStart,
  onStoryEnd,
  onNextUserStory,
  onPreviousUserStory,
}: StoryCardProps) => {
  const { userAuth } = useAuthStore();
  const { isLoading, createStory } = usePostStore();

  const currentIndex = useMemo(() => {
    return 0;
  }, []);

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

  const handleStoryClick = useCallback(async () => {
    if (stories[storyIndex]) {
      setStoryIndex(currentIndex);
      showStory(stories[storyIndex]);

      if (onStoryStart) {
        onStoryStart(userIndex);
      }
    }
  }, [currentIndex, onStoryStart, stories, storyIndex, userIndex]);

  useEffect(() => {
    if (isActive && !isAddStory && stories.length > 0 && !showPreview) {
      handleStoryClick();
    }
  }, [handleStoryClick, isActive, isAddStory, showPreview, stories.length]);

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
    if (onStoryEnd) {
      onStoryEnd();
    }
  };

  const resetStoryState = () => {
    setShowPreview(false);
    setSelectedFile(null);
    setFilePreview(null);
    setFileType(null);
    setIsNewStory(false);
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
    if (stories && stories.length > 0) {
      const nextIndex = storyIndex + 1;
      if (nextIndex < stories.length) {
        setStoryIndex(nextIndex);
        showStory(stories[nextIndex]);
      } else {
        // Đã xem hết story trong cụm này, chuyển sang cụm tiếp theo
        if (onNextUserStory && onNextUserStory()) {
          // Đã chuyển sang cụm tiếp theo thành công
          resetStoryState();
        } else {
          // Không còn cụm tiếp theo, đóng preview
          resetStoryState();
          if (onStoryEnd) {
            onStoryEnd();
          }
        }
      }
    } else {
      resetStoryState();
      if (onStoryEnd) {
        onStoryEnd();
      }
    }
  };

  const handlePreviousStory = () => {
    if (stories && stories.length > 0) {
      const prevIndex = storyIndex - 1;
      if (prevIndex >= 0) {
        setStoryIndex(prevIndex);
        showStory(stories[prevIndex]);
      } else {
        // Đã ở story đầu tiên trong cụm, chuyển sang cụm trước đó
        if (onPreviousUserStory && onPreviousUserStory()) {
          // Đã chuyển sang cụm trước đó thành công
          resetStoryState();
        }
      }
    }
  };

  const currentStory = isNewStory ? null : stories[storyIndex];

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
              {stories[storyIndex]?.mediaType === "IMAGE" ? (
                <img
                  src={stories[storyIndex]?.mediaUrl}
                  alt={stories[storyIndex]?.user?.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={stories[storyIndex]?.mediaUrl || ""}
                  className="w-full h-full object-cover"
                  preload="metadata"
                  muted
                  playsInline
                />
              )}

              <div className="absolute top-2 left-2 ring-2 ring-blue-500 rounded-full ">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={stories[storyIndex]?.user?.avatarPhotoUrl}
                    alt={stories[storyIndex]?.user?.fullName}
                  />

                  <AvatarFallback className="bg-zinc-800 text-white">
                    {stories[storyIndex]?.user?.fullName.substring(0, 2) ||
                      "FU"}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-semibold truncate">
                  {stories[storyIndex]?.user?.fullName || "Facebook User"}
                </p>
              </div>

              {stories.length > 1 && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {stories.length}
                </div>
              )}
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
          storiesList={stories}
          currentStoryIndex={storyIndex}
        />
      )}
    </>
  );
};

export default StoryCard;
