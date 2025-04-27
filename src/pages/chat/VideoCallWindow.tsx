import { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  Minus,
  Maximize2,
  Minimize2,
  X,
  User,
  Users,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCallStore } from "@/stores/useCallStore";
import { USER } from "@/utils/interface";

interface VideoCallWindowProps {
  user: USER;
  onClose: () => void;
  onMinimize?: () => void;
  isIncoming?: boolean;
  isGroupCall?: boolean;
  participants?: USER[];
}

export function VideoCallWindow({
  user,
  onClose,
  onMinimize,
  isIncoming = false,
  isGroupCall = false,
  participants = [],
}: VideoCallWindowProps) {
  const {
    callStatus,
    callDuration,
    isMuted,
    isVideoOn,
    isMinimized,
    toggleMute,
    toggleVideo,
    acceptCall,
    endCall,
    toggleMinimize,
  } = useCallStore();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeParticipants, setActiveParticipants] = useState<USER | USER[]>(
    participants
  );

  useEffect(() => {
    setActiveParticipants(isGroupCall ? participants : [user]);
  }, [participants, isGroupCall, user]);

  const containerRef = useRef<HTMLDivElement>(null);

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

  const toggleFullScreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`
        );
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  if (isMinimized) {
    return (
      <div
        className="fixed bottom-4 right-4 bg-gray-800 rounded-lg p-2 shadow-lg border border-gray-700 cursor-pointer z-50 flex items-center"
        onClick={toggleMinimize}
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

  const containerClasses = isFullScreen
    ? "fixed inset-0 z-50 bg-black"
    : "fixed inset-0 z-50 flex items-center justify-center bg-black/70";

  return (
    <div className={containerClasses} ref={containerRef}>
      <div
        className={`${
          isFullScreen
            ? "w-full h-full"
            : "w-full max-w-4xl h-[80vh] max-h-[600px]"
        } bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-700 flex flex-col`}
      >
        {/* Call header */}
        <div className="p-3 flex items-center justify-between bg-gray-800 border-b border-gray-700">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold">
              {isGroupCall
                ? "Group video call"
                : "Video call with " + user.fullName}
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

        {/* Call content */}
        <div className="flex-1 flex relative overflow-hidden">
          {/* Main video area */}
          <div className={`flex-1 bg-gray-900 relative w-full`}>
            {callStatus === "connected" ? (
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
                        <AvatarImage
                          src={user.avatarPhotoUrl || "/placeholder.svg"}
                        />
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
                        <p className="text-xs text-gray-400">
                          Your camera is off
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Group call participants */}
                {isGroupCall && (
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {Array.isArray(activeParticipants) &&
                      activeParticipants.map(
                        (participant: USER, index: number) => (
                          <div
                            key={participant.id}
                            className="bg-gray-800 rounded-lg p-2 flex items-center space-x-2"
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={
                                  participant.avatarPhotoUrl ||
                                  "/placeholder.svg"
                                }
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
                        )
                      )}
                  </div>
                )}
              </div>
            ) : callStatus === "ringing" ? (
              <div className="h-full w-full flex flex-col items-center justify-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage
                    src={user.avatarPhotoUrl || "/placeholder.svg"}
                  />
                  <AvatarFallback className="bg-blue-600 text-4xl">
                    {user.fullName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold mb-2">
                  {isGroupCall ? "Group Call" : user.fullName}
                </h2>
                <p className="text-gray-400 text-lg animate-pulse mb-8">
                  {isIncoming ? "Incoming video call..." : "Calling..."}
                </p>
                {/* Ringing animation */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping"></div>
                  <div className="relative h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center">
                    <Video className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <p className="text-xl text-red-500">Call ended</p>
              </div>
            )}
          </div>
        </div>

        {/* Call controls */}
        <div className="p-4 flex items-center justify-center space-x-4 bg-gray-800 border-t border-gray-700">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full ${
              isMuted
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
          >
            {isMuted ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={handleEndCall}
            className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700"
          >
            <Phone className="h-5 w-5 transform rotate-135" />
          </button>

          <button
            onClick={toggleVideo}
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

        {/* Incoming call controls */}
        {isIncoming && callStatus === "ringing" && (
          <div className="p-6 flex items-center justify-center space-x-6 bg-gray-800 border-t border-gray-700">
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
              <Video className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
