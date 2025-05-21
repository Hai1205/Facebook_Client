import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { USER } from "@/utils/interface";

interface MessageLoaderProps {
  user: USER;
}

export const MessageLoader: React.FC<MessageLoaderProps> = ({ user }) => {
  return (
    <div className="flex justify-start mb-3">
      <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
        <AvatarImage src={user.avatarPhotoUrl} />
        <AvatarFallback className="bg-blue-600">
          {user.fullName.substring(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className="bg-gray-800 p-3 rounded-lg">
        <div className="flex space-x-1">
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};
