import { POST } from "@/utils/interface";

interface VideoContentProps {
    video: POST;
}

export const VideoContent = ({ video }: VideoContentProps) => {
    return (
        <div className="relative aspect-video bg-black mb-4">
          {video?.mediaUrls && (
            <video controls className="w-full h-[500px] mb-4">
              <source src={video?.mediaUrls[0]} type="video/mp4" />
              Your browser does not support the video tag
            </video>
          )}
        </div>
    )
}