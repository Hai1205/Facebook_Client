import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface MediaViewerProps {
  medias: string[];
  currentMediaIndex: number;
  closeMediaViewer: () => void;
  mediaTypes: string[];
  goToPrevMedia: () => void;
  goToNextMedia: () => void;
  setCurrentMediaIndex: (index: number) => void;
}

export const MediaViewer = ({
  medias,
  currentMediaIndex,
  closeMediaViewer,
  mediaTypes,
  goToPrevMedia,
  goToNextMedia,
  setCurrentMediaIndex,
}: MediaViewerProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-gray-800 rounded-full"
          onClick={closeMediaViewer}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="relative w-full max-w-4xl max-h-[90vh] flex items-center justify-center">
        {mediaTypes[currentMediaIndex] === "IMAGE" ? (
          <img
            src={medias[currentMediaIndex]}
            alt={`media_${currentMediaIndex}`}
            className="max-w-full max-h-[90vh] object-contain"
          />
        ) : (
          <video controls autoPlay className="max-w-full max-h-[90vh]">
            <source src={medias[currentMediaIndex]} type="video/mp4" />
            Your browser does not support the video tag
          </video>
        )}
      </div>

      {medias.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 text-white hover:bg-gray-800 rounded-full"
            onClick={goToPrevMedia}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 text-white hover:bg-gray-800 rounded-full"
            onClick={goToNextMedia}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {medias.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentMediaIndex ? "bg-white" : "bg-gray-500"
                }`}
                onClick={() => setCurrentMediaIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
