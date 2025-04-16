import { Mic, MicOff, Video, VideoOff, Phone, Users } from "lucide-react";

interface CallControlsProps {
  isMuted: boolean;
  setIsMuted: (isMuted: boolean) => void;
  handleEndCall: () => void;
  isVideoOn: boolean;
  setIsVideoOn: (isVideoOn: boolean) => void;
  isGroupCall: boolean;
}

export function CallControls({
  isMuted,
  setIsMuted,
  handleEndCall,
  isVideoOn,
  setIsVideoOn,
  isGroupCall,
}: CallControlsProps) {
  return (
    <div className="p-4 flex items-center justify-center space-x-4 bg-gray-800 border-t border-gray-700">
      <button
        onClick={() => setIsMuted(!isMuted)}
        className={`p-3 rounded-full ${
          isMuted
            ? "bg-red-600 text-white"
            : "bg-gray-700 text-gray-200 hover:bg-gray-600"
        }`}
      >
        {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </button>

      <button
        onClick={handleEndCall}
        className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700"
      >
        <Phone className="h-5 w-5 transform rotate-135" />
      </button>

      <button
        onClick={() => setIsVideoOn(!isVideoOn)}
        className={`p-3 rounded-full ${
          !isVideoOn
            ? "bg-red-600 text-white"
            : "bg-gray-700 text-gray-200 hover:bg-gray-600"
        }`}
      >
        {isVideoOn ? (
          <Video className="h-5 w-5" />
        ) : (
          <VideoOff className="h-5 w-5" />
        )}
      </button>

      {isGroupCall && (
        <button className="p-3 rounded-full bg-gray-700 text-gray-200 hover:bg-gray-600">
          <Users className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
