import { Minus, X } from "lucide-react";

interface CallHeaderProps {
  callStatus: "ringing" | "connected" | "ended";
  handleMinimize: () => void;
  handleEndCall: () => void;
}

export function CallHeader({
  callStatus,
  handleMinimize,
  handleEndCall,
}: CallHeaderProps) {
  return (
    <div className="p-4 flex items-center justify-between bg-gray-800 border-b border-gray-700">
      <h3 className="text-lg font-semibold">
        {callStatus === "ringing" ? "Incoming call" : "Voice call"}
      </h3>
      <div className="flex items-center space-x-2">
        <button
          onClick={handleMinimize}
          className="p-1.5 rounded-full hover:bg-gray-800 text-gray-400"
        >
          <Minus className="h-5 w-5" />
        </button>
        <button
          onClick={handleEndCall}
          className="p-1.5 rounded-full hover:bg-gray-800 text-gray-400"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
