import { MEDIA_TYPE } from "@/utils/types";

interface MediaItemProps {
    url: string;
    type: MEDIA_TYPE;
    index: number;
    onClick: () => void;
    className?: string;
    overlay?: React.ReactNode;
  }
  
  export const MediaItem = ({
    url,
    type,
    index,
    onClick,
    className = "",
    overlay,
  }: MediaItemProps) => {
    return (
      <div
        className={`relative cursor-pointer overflow-hidden ${className}`}
        onClick={onClick}
      >
        {type === "IMAGE" ? (
          <img
            src={url}
            alt={`media_${index}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="relative w-full h-full">
            <video className="w-full h-full object-cover">
              <source src={url} type="video/mp4" />
            </video>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        )}
  
        {overlay}
      </div>
    );
  };
  