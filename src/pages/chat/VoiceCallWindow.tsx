import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Phone,
  Minus,
  X,
  User,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCallStore } from "@/stores/useCallStore";
import { USER } from "@/utils/interface";

interface VoiceCallWindowProps {
  user: USER;
  onClose: () => void;
  onMinimize?: () => void;
  isIncoming?: boolean;
}

export function VoiceCallWindow({
  user,
  onClose,
  onMinimize,
  isIncoming = false,
}: VoiceCallWindowProps) {
  const {
    callStatus,
    callDuration,
    isMuted,
    isSpeakerOn,
    isMinimized,
    toggleMute,
    toggleSpeaker,
    acceptCall,
    endCall,
    toggleMinimize,
  } = useCallStore();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    endCall();
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleMinimize = () => {
    toggleMinimize();
    if (onMinimize) onMinimize();
  };

  if (isMinimized) {
    return (
      <div
        className="fixed bottom-4 right-4 bg-gray-800 rounded-full p-2 shadow-lg border border-gray-700 cursor-pointer z-50 flex items-center space-x-2"
        onClick={toggleMinimize}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatarPhotoUrl || "/placeholder.svg"} />
          <AvatarFallback className="bg-blue-600">
            {user.fullName.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="pr-2">
          <p className="text-sm font-medium">{user.fullName}</p>
          <p className="text-xs text-green-500">
            {callStatus === "connected"
              ? formatDuration(callDuration)
              : "Calling..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
        {/* Call header */}
        <div className="p-4 flex items-center justify-between bg-gray-800 border-b border-gray-700">
          <h3 className="text-lg font-semibold">
            {callStatus === "ringing" ? "Incoming call" : "Voice call"}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleMinimize}
              className="p-1.5 rounded-full hover:bg-gray-700 text-gray-400"
            >
              <Minus className="h-5 w-5" />
            </button>
            <button
              onClick={handleEndCall}
              className="p-1.5 rounded-full hover:bg-gray-700 text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Call content */}
        <div className="p-8 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="h-32 w-32 rounded-full bg-gray-700 flex items-center justify-center mb-4 border-4 border-blue-600">
              {user.avatarPhotoUrl ? (
                <Avatar className="h-full w-full">
                  <AvatarImage
                    src={user.avatarPhotoUrl || "/placeholder.svg"}
                  />
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
          {callStatus === "connected" && !isMuted && (
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
          )}
        </div>

        {/* Call controls */}
        <div className="p-6 flex items-center justify-center space-x-6 bg-gray-900">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full ${
              isMuted
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
          >
            {isMuted ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </button>

          <button
            onClick={handleEndCall}
            className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700"
          >
            <Phone className="h-6 w-6 transform rotate-135" />
          </button>

          <button
            onClick={toggleSpeaker}
            className={`p-4 rounded-full ${
              isSpeakerOn
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
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

        {/* Incoming call controls */}
        {isIncoming && callStatus === "ringing" && (
          <div className="p-6 flex items-center justify-center space-x-6 bg-gray-900">
            <button
              onClick={handleEndCall}
              className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              <Phone className="h-6 w-6 transform rotate-135" />
            </button>

            <button
              onClick={acceptCall}
              className="p-4 rounded-full bg-green-600 text-white hover:bg-green-700"
            >
              <Phone className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
