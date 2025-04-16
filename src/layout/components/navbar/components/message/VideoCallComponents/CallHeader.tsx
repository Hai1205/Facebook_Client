import { Minus, Maximize2, Minimize2, X } from "lucide-react";
import { User } from "../VideoCallWindow";

interface CallHeaderProps {
  isGroupCall: boolean;
  user: User;
  callStatus: "ringing" | "connected" | "ended";
  callDuration: number;
  formatDuration: (seconds: number) => string;
  handleMinimize: () => void;
  toggleFullScreen: () => void;
  isFullScreen: boolean;
  handleEndCall: () => void;
}

export function CallHeader({
  isGroupCall,
  user,
  callStatus,
  callDuration,
  formatDuration,
  handleMinimize,
  toggleFullScreen,
  isFullScreen,
  handleEndCall,
}: CallHeaderProps) {
  return (
    <div className="p-3 flex items-center justify-between bg-gray-800 border-b border-gray-700">
      <div className="flex items-center">
        <h3 className="text-lg font-semibold">
          {isGroupCall ? "Group video call" : "Video call with " + user.name}
        </h3>

        {callStatus === "connected" && (
          <span className="ml-3 text-sm text-green-500">
            {formatDuration(callDuration)}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleMinimize}
          className="p-1.5 rounded-full hover:bg-gray-700 text-gray-400"
        >
          <Minus className="h-5 w-5" />
        </button>

        <button
          onClick={toggleFullScreen}
          className="p-1.5 rounded-full hover:bg-gray-700 text-gray-400"
        >
          {isFullScreen ? (
            <Minimize2 className="h-5 w-5" />
          ) : (
            <Maximize2 className="h-5 w-5" />
          )}
        </button>

        <button
          onClick={handleEndCall}
          className="p-1.5 rounded-full hover:bg-gray-700 text-gray-400"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
