import { MediaItem } from "@/pages/post/components/medias/MediaItem";

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
      {medias.slice(0, 4).map((url, index) => {
        const isSpecialLayout = medias.length === 3 && index === 0;
        const className = isSpecialLayout ? "col-span-2 row-span-2" : "";

        const overlay =
          medias.length > 4 && index === 3 ? (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                +{medias.length - 4}
              </span>
            </div>
          ) : undefined;

        return (
          <MediaItem
            key={index}
            url={url}
            type={mediaTypes[index] as "IMAGE" | "VIDEO"}
            index={index}
            onClick={() => openMediaViewer(index)}
            className={className}
            overlay={overlay}
          />
        );
      })}
    </div>
  );
};
