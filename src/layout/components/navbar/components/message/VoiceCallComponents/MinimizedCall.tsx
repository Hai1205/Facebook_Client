import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "../VideoCallWindow";

interface MinimizedCallProps {
  user: User;
  callStatus: "ringing" | "connected" | "ended";
  callDuration: number;
  formatDuration: (seconds: number) => string;
  setMinimized: (value: boolean) => void;
}

export function MinimizedCall({
  user,
  callStatus,
  callDuration,
  formatDuration,
  setMinimized,
}: MinimizedCallProps) {
  return (
    <div
      className="fixed bottom-4 right-4 bg-gray-800 rounded-full p-2 shadow-lg border border-gray-700 cursor-pointer z-50 flex items-center space-x-2"
      onClick={() => setMinimized(false)}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.avatar || "/placeholder.svg"} />
        <AvatarFallback className="bg-blue-600">
          {user.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="pr-2">
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs text-green-500">
          {callStatus === "connected"
            ? formatDuration(callDuration)
            : "Calling..."}
        </p>
      </div>
    </div>
  );
}
