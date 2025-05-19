interface MediaContentProps {
  medias: string[];
  mediaTypes: string[];
  openMediaViewer: (index: number) => void;
  getMediaGridLayout: () => string;
}

export const MediaContent = ({
  medias,
  mediaTypes,
  openMediaViewer,
  getMediaGridLayout,
}: MediaContentProps) => {
  return (
    <div className={`grid ${getMediaGridLayout()} gap-1 mb-4 max-h-[500px]`}>
      {medias
        .slice(0, Math.min(4, medias.length))
        .map((url: string, index: number) => (
          <div
            key={index}
            className={`relative cursor-pointer overflow-hidden ${
              medias.length === 3 && index === 0 ? "col-span-2 row-span-2" : ""
            }`}
            onClick={() => openMediaViewer(index)}
          >
            {mediaTypes[index] === "IMAGE" ? (
              <img
                src={url}
                alt={`post_media_${index}`}
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
            {medias.length > 4 && index === 3 && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  +{medias.length - 4}
                </span>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};
