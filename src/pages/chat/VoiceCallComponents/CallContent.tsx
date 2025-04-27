import { USER } from "@/utils/interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface CallContentProps {
  user: USER;
  callStatus: "ringing" | "connected" | "ended";
  callDuration: number;
  isMuted: boolean;
  formatDuration: (seconds: number) => string;
}

export function CallContent({
  user,
  callStatus,
  callDuration,
  isMuted,
  formatDuration,
}: CallContentProps) {
  return (
    <div className="p-8 flex flex-col items-center justify-center">
      <div className="relative">
        <div className="h-32 w-32 rounded-full bg-gray-700 flex items-center justify-center mb-4 border-4 border-blue-600">
          {user.avatarPhotoUrl ? (
            <Avatar className="h-full w-full">
              <AvatarImage src={user.avatarPhotoUrl || "/placeholder.svg"} />
              <AvatarFallback className="bg-blue-600 text-4xl">
                {user.fullName.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <User className="h-16 w-16 text-gray-500" />
          )}
        </div>
        <div className="absolute bottom-3 right-3 h-5 w-5 rounded-full bg-green-500 border-2 border-gray-800"></div>
      </div>

      <h2 className="text-xl font-bold mb-1">{user.fullName}</h2>

      {callStatus === "ringing" ? (
        <p className="text-gray-400 animate-pulse">Calling...</p>
      ) : callStatus === "connected" ? (
        <p className="text-green-500">{formatDuration(callDuration)}</p>
      ) : (
        <p className="text-red-500">Call ended</p>
      )}

      {/* Audio visualization (fake) */}
      {callStatus === "connected" && !isMuted && <AudioVisualization />}
    </div>
  );
}

function AudioVisualization() {
  return (
    <div className="flex items-end space-x-1 h-8 my-4">
      {Array.from({ length: 12 }).map((_, i) => {
        const height = Math.floor(Math.random() * 24) + 4;
        return (
          <div
            key={i}
            className="w-1 bg-blue-500 rounded-full animate-pulse"
            style={{
              height: `${height}px`,
              animationDelay: `${i * 0.1}s`,
            }}
          ></div>
        );
      })}
    </div>
  );
}
