import { User, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { USER } from "@/utils/types";

interface CallContentProps {
  callStatus: "ringing" | "connected" | "ended";
  isVideoOn: boolean;
  user: USER;
  isGroupCall: boolean;
  activeParticipants: USER[];
}

export function CallContent({
  callStatus,
  isVideoOn,
  user,
  isGroupCall,
  activeParticipants,
}: CallContentProps) {
  if (callStatus === "connected") {
    return (
      <div className="flex-1 bg-gray-900 relative w-full">
        <div className="h-full w-full relative">
          {/* Remote video (full size) */}
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            {isVideoOn ? (
              <img
                src="/placeholder.svg?height=600&width=800"
                alt="Remote video"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={user.avatarPhotoUrl || "/placeholder.svg"} />
                  <AvatarFallback className="bg-blue-600 text-4xl">
                    {user.fullName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{user.fullName}</h3>
                <p className="text-gray-400">Camera off</p>
              </div>
            )}
          </div>

          {/* Self video (picture-in-picture) */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-600 shadow-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              {isVideoOn ? (
                <img
                  src="/placeholder.svg?height=144&width=192"
                  alt="Your video"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <User className="h-10 w-10 text-gray-400 mb-1" />
                  <p className="text-xs text-gray-400">Your camera is off</p>
                </div>
              )}
            </div>
          </div>

          {/* Group call participants */}
          {isGroupCall && (
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
              {activeParticipants.map((participant, index) => (
                <div
                  key={participant.id}
                  className="bg-gray-800 rounded-lg p-2 flex items-center space-x-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={participant.avatarPhotoUrl || "/placeholder.svg"}
                    />
                    <AvatarFallback className="bg-blue-600">
                      {participant.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {participant.fullName}
                  </span>
                  {index === 0 && (
                    <span className="text-xs bg-blue-600 px-1.5 py-0.5 rounded">
                      Speaking
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } else if (callStatus === "ringing") {
    return (
      <div className="flex-1 bg-gray-900 relative w-full">
        <div className="h-full w-full flex flex-col items-center justify-center">
          <Avatar className="h-32 w-32 mb-4">
            <AvatarImage src={user.avatarPhotoUrl || "/placeholder.svg"} />
            <AvatarFallback className="bg-blue-600 text-4xl">
              {user.fullName.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold mb-2">
            {isGroupCall ? "Group Call" : user.fullName}
          </h2>
          <p className="text-gray-400 text-lg animate-pulse mb-8">Calling...</p>
          {/* Ringing animation */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping"></div>
            <div className="relative h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center">
              <Video className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex-1 bg-gray-900 relative w-full">
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-xl text-red-500">Call ended</p>
        </div>
      </div>
    );
  }
}
