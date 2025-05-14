import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { USER } from "@/utils/interface";

interface MessageLoaderProps {
  user: USER;
}

export const MessageLoader = ({ user }: MessageLoaderProps) => {
  return (
    <div className="flex justify-start mb-3">
      <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
        <AvatarImage src={user.avatarPhotoUrl} />
        <AvatarFallback className="bg-blue-600">
          {user.fullName.substring(0, 2)}
        </AvatarFallback>
      </Avatar>

      <div className="max-w-[70%]">
        <div className="p-2 rounded-lg bg-gray-800 text-gray-100">
          <div className="flex items-center">
            <div className="flex space-x-1 mt-2">
              <span
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
              <span
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "600ms" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
