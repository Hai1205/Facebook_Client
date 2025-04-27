import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { USER } from "@/utils/interface";

interface MinimizedCallProps {
  user: USER;
  isVideoOn: boolean;
  callStatus: "ringing" | "connected" | "ended";
  callDuration: number;
  formatDuration: (seconds: number) => string;
  isGroupCall: boolean;
  setMinimized: (minimized: boolean) => void;
}

export function MinimizedCall({
  user,
  isVideoOn,
  callStatus,
  callDuration,
  formatDuration,
  isGroupCall,
  setMinimized,
}: MinimizedCallProps) {
  return (
    <div
      className="fixed bottom-4 right-4 bg-gray-800 rounded-lg p-2 shadow-lg border border-gray-700 cursor-pointer z-50 flex items-center"
      onClick={() => setMinimized(false)}
    >
      <div className="relative w-20 h-12 overflow-hidden rounded-md bg-gray-900 mr-2">
        <div className="absolute inset-0 flex items-center justify-center">
          {isVideoOn ? (
            <div className="w-full h-full bg-gray-700">
              <img
                src={
                  user.avatarPhotoUrl || "/placeholder.svg?height=48&width=80"
                }
                alt="Video preview"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatarPhotoUrl || "/placeholder.svg"} />
              <AvatarFallback className="bg-blue-600">
                {user.fullName.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        <div className="absolute bottom-1 right-1">
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium">
          {isGroupCall ? "Group call" : user.fullName}
        </p>

        <p className="text-xs text-green-500">
          {callStatus === "connected"
            ? formatDuration(callDuration)
            : "Calling..."}
        </p>
      </div>
    </div>
  );
}
