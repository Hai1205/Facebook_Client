import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ExtendOption from "@/pages/post/components/ExtendOption";
import { useAuthStore } from "@/stores/useAuthStore";
import { STORY } from "@/utils/interface";

interface ShowStoryPreviewProps {
  file: string | null;
  fileType: string | null;
  onClose: () => void;
  onPost: () => void;
  isNewStory: boolean;
  currentStory: STORY | undefined;
  isLoading: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  storiesList?: STORY[];
  currentStoryIndex?: number;
}

const ShowStoryPreview = ({
  file,
  fileType,
  onClose,
  onPost,
  isNewStory,
  currentStory,
  isLoading,
  onNext,
  onPrevious,
  storiesList = [],
  currentStoryIndex = 0,
}: ShowStoryPreviewProps) => {
  const { userAuth } = useAuthStore();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const MAX_DURATION = 20;
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const fullName = useMemo(() => {
    return isNewStory
      ? userAuth?.fullName || ""
      : currentStory?.user?.fullName || "";
  }, [currentStory?.user?.fullName, isNewStory, userAuth?.fullName]);

  const avatar = useMemo(() => {
    return isNewStory
      ? userAuth?.avatarPhotoUrl || null
      : currentStory?.user?.avatarPhotoUrl || null;
  }, [
    currentStory?.user?.avatarPhotoUrl,
    isNewStory,
    userAuth?.avatarPhotoUrl,
  ]);

  const storyId = useMemo(() => {
    return !isNewStory && currentStory ? currentStory.id : undefined;
  }, [currentStory, isNewStory]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const preventDrag = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
    };

    document.addEventListener("dragstart", preventDrag as EventListener, {
      passive: false,
    });
    document.addEventListener("touchmove", preventDrag as EventListener, {
      passive: false,
    });
    document.addEventListener("mousedown", preventDrag as EventListener, {
      passive: false,
    });

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("dragstart", preventDrag as EventListener);
      document.removeEventListener("touchmove", preventDrag as EventListener);
      document.removeEventListener("mousedown", preventDrag as EventListener);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && file && isVideoType(fileType)) {
      videoRef.current.load();
    }
  }, [file, fileType]);

  useEffect(() => {
    if (!isNewStory) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      setProgress(0);

      if (!isReportModalOpen) {
        progressIntervalRef.current = setInterval(() => {
          setProgress((prev) => {
            const newProgress = prev + 100 / MAX_DURATION / 10;

            if (newProgress >= 100) {
              clearInterval(progressIntervalRef.current as NodeJS.Timeout);
              if (onNext) {
                onNext();
              } else {
                onClose();
              }
              return 100;
            }

            return newProgress;
          });
        }, 100);
      }

      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
    }
  }, [isNewStory, onClose, onNext, file, isReportModalOpen]);

  const isVideoType = (type: string | null): boolean => {
    if (!type) return false;
    return (
      type.toLowerCase() === "video" ||
      type.toLowerCase() === "video/mp4" ||
      type.toUpperCase() === "VIDEO"
    );
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    if (onPrevious) {
      onPrevious();
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    if (onNext) {
      onNext();
    } else {
      onClose();
    }
  };

  const handleCloseStory = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    onClose();
  };

  const preventInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Theo dõi trạng thái của ReportModal để tạm dừng hoặc tiếp tục tiến trình
  const handleReportModalChange = (isOpen: boolean) => {
    setIsReportModalOpen(isOpen);

    if (!isOpen && !isNewStory) {
      // Reset lại interval khi ReportModal đóng
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      // Tiếp tục tiến trình đếm thời gian
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 100 / MAX_DURATION / 10;

          if (newProgress >= 100) {
            clearInterval(progressIntervalRef.current as NodeJS.Timeout);
            if (onNext) {
              onNext();
            } else {
              onClose();
            }
            return 100;
          }

          return newProgress;
        });
      }, 100);
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 select-none"
      onClick={preventInteraction}
      onContextMenu={preventInteraction}
      onMouseDown={preventInteraction}
      onTouchStart={preventInteraction}
      onTouchMove={preventInteraction}
      onDragStart={preventInteraction}
      style={{ touchAction: "none", userSelect: "none" }}
    >
      <div className="relative w-full max-w-md h-[70vh] flex flex-col bg-zinc-800 rounded-lg overflow-hidden">
        {!isNewStory && (
          <div className="absolute top-0 left-0 right-0 z-10 px-2 pt-2 flex space-x-1">
            {storiesList.length > 1 ? (
              // Nhiều thanh tiến trình cho nhiều story
              storiesList.map((_, index) => (
                <div
                  key={index}
                  className="flex-1 h-1 bg-gray-500 bg-opacity-40 rounded-full overflow-hidden"
                >
                  <div
                    className={`h-full transition-all duration-100 ease-linear ${
                      index < currentStoryIndex
                        ? "bg-white w-full"
                        : index === currentStoryIndex
                        ? "bg-white"
                        : "bg-transparent"
                    }`}
                    style={{
                      width:
                        index === currentStoryIndex
                          ? `${progress}%`
                          : index < currentStoryIndex
                          ? "100%"
                          : "0%",
                    }}
                  />
                </div>
              ))
            ) : (
              // Một thanh tiến trình duy nhất
              <div className="w-full h-1 bg-gray-500 bg-opacity-40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        )}

        <Button
          className="absolute top-4 right-4 z-30 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
          variant="ghost"
          onClick={handleCloseStory}
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="absolute top-4 left-4 z-10 flex items-center">
          <Avatar className="w-10 h-10 mr-2 border-2 border-blue-500 rounded-full">
            <AvatarImage src={avatar as string} alt={fullName} />

            <AvatarFallback className="bg-zinc-800 text-white">
              {fullName.substring(0, 2) || "FU"}
            </AvatarFallback>
          </Avatar>

          <span className="text-gray-700 dark:text-gray-200 font-semibold">
            {fullName || "Facebook User"}
          </span>
        </div>

        {!isNewStory && storyId && userAuth?.id && (
          <div className="absolute top-4 right-14 z-30">
            <ExtendOption
              content={currentStory as STORY}
              contentType="STORY"
              onReportModalChange={handleReportModalChange}
            />
          </div>
        )}

        {!isNewStory && (
          <>
            <div
              className="absolute left-0 top-[50px] bottom-0 w-1/3 z-20 cursor-pointer"
              onClick={handlePrevious}
            />
            <div
              className="absolute right-0 top-[50px] bottom-0 w-1/3 z-20 cursor-pointer"
              onClick={handleNext}
            />
            <div className="absolute left-1/3 right-1/3 top-[50px] bottom-0 z-20 cursor-default" />
          </>
        )}

        <div
          className="flex-grow flex items-center justify-center bg-gray-100 dark:bg-gray-900 select-none"
          onClick={preventInteraction}
          onMouseDown={preventInteraction}
          onTouchStart={preventInteraction}
          onTouchMove={preventInteraction}
          onDragStart={preventInteraction}
        >
          {!isVideoType(fileType) ? (
            <img
              src={file || ""}
              alt="story_preview"
              className="max-w-full max-h-full object-contain pointer-events-none select-none"
              onClick={preventInteraction}
              onDragStart={preventInteraction}
              draggable="false"
            />
          ) : (
            <video
              ref={videoRef}
              src={file || ""}
              controls={false}
              autoPlay
              playsInline
              muted={false}
              loop={false}
              preload="auto"
              className="max-w-full max-h-full object-contain pointer-events-none select-none"
              onClick={preventInteraction}
              draggable="false"
            />
          )}
        </div>

        {isNewStory && (
          <div className="absolute bottom-4 right-2 transform -translate-x-1/2">
            <Button
              onClick={onPost}
              className="bg-[#1877F2] hover:bg-[#166FE5] text-white"
            >
              {isLoading ? "Sharing..." : "Share"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowStoryPreview;
