import { Mic, MicOff, Volume2, VolumeX, Phone } from "lucide-react";

interface CallControlsProps {
  isMuted: boolean;
  setIsMuted: (value: boolean) => void;
  isSpeakerOn: boolean;
  setIsSpeakerOn: (value: boolean) => void;
  handleEndCall: () => void;
}

export function CallControls({
  isMuted,
  setIsMuted,
  isSpeakerOn,
  setIsSpeakerOn,
  handleEndCall,
}: CallControlsProps) {
  return (
    <div className="p-6 flex items-center justify-center space-x-6 bg-gray-900">
      <button
        onClick={() => setIsMuted(!isMuted)}
        className={`p-4 rounded-full ${
          isMuted
            ? "bg-red-600 text-white"
            : "bg-gray-800 text-gray-200 hover:bg-gray-600"
        }`}
      >
        {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </button>

      <button
        onClick={handleEndCall}
        className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700"
      >
        <Phone className="h-6 w-6 transform rotate-135" />
      </button>

      <button
        onClick={() => setIsSpeakerOn(!isSpeakerOn)}
        className={`p-4 rounded-full ${
          isSpeakerOn
            ? "bg-gray-800 text-gray-200 hover:bg-gray-600"
            : "bg-red-600 text-white"
        }`}
      >
        {isSpeakerOn ? (
          <Volume2 className="h-6 w-6" />
        ) : (
          <VolumeX className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
