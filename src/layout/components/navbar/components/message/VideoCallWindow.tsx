import { useState, useEffect, useRef } from "react";
import { CallHeader } from "./VideoCallComponents/CallHeader";
import { CallContent } from "./VideoCallComponents/CallContent";
import { CallControls } from "./VideoCallComponents/CallControls";
import { IncomingCallControls } from "./VideoCallComponents/IncomingCallControls";
import { MinimizedCall } from "./VideoCallComponents/MinimizedCall";
import { User } from "@/stores/useCall";

interface VideoCallWindowProps {
  user: User;
  onClose: () => void;
  onMinimize?: () => void;
  isIncoming?: boolean;
  isGroupCall?: boolean;
  participants?: User[];
}

export function VideoCallWindow({
  user,
  onClose,
  onMinimize,
  isIncoming = false,
  isGroupCall = false,
  participants = [],
}: VideoCallWindowProps) {
  const [callStatus, setCallStatus] = useState<
    "ringing" | "connected" | "ended"
  >(isIncoming ? "ringing" : "connected");
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [activeParticipants, setActiveParticipants] = useState(participants);

  useEffect(() => {
    setActiveParticipants(isGroupCall ? participants : [user]);
  }, [participants, isGroupCall, user]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (callStatus === "connected") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus]);

  useEffect(() => {
    if (isIncoming) {
      const timer = setTimeout(() => {
        setCallStatus("connected");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isIncoming]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    setCallStatus("ended");
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleMinimize = () => {
    setMinimized(true);
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

  if (minimized) {
    return (
      <MinimizedCall
        user={user}
        isVideoOn={isVideoOn}
        callStatus={callStatus}
        callDuration={callDuration}
        formatDuration={formatDuration}
        isGroupCall={isGroupCall}
        setMinimized={setMinimized}
      />
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
        <CallHeader
          isGroupCall={isGroupCall}
          user={user}
          callStatus={callStatus}
          callDuration={callDuration}
          formatDuration={formatDuration}
          handleMinimize={handleMinimize}
          toggleFullScreen={toggleFullScreen}
          isFullScreen={isFullScreen}
          handleEndCall={handleEndCall}
        />

        <CallContent
          callStatus={callStatus}
          isVideoOn={isVideoOn}
          user={user}
          isGroupCall={isGroupCall}
          activeParticipants={activeParticipants}
        />

        <CallControls
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          handleEndCall={handleEndCall}
          isVideoOn={isVideoOn}
          setIsVideoOn={setIsVideoOn}
          isGroupCall={isGroupCall}
        />

        {isIncoming && callStatus === "ringing" && (
          <IncomingCallControls
            handleEndCall={handleEndCall}
            setCallStatus={setCallStatus}
          />
        )}
      </div>
    </div>
  );
}