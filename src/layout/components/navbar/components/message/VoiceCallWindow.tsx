import { useState, useEffect } from "react";
import { MinimizedCall } from "./VoiceCallComponents/MinimizedCall";
import { CallHeader } from "./VoiceCallComponents/CallHeader";
import { CallContent } from "./VoiceCallComponents/CallContent";
import { CallControls } from "./VoiceCallComponents/CallControls";
import { IncomingCallControls } from "./VoiceCallComponents/IncomingCallControls";
import { User } from "@/stores/useCall";

interface VoiceCallWindowProps {
  user: User;
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
  const [callStatus, setCallStatus] = useState<
    "ringing" | "connected" | "ended"
  >(isIncoming ? "ringing" : "connected");
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [minimized, setMinimized] = useState(false);

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

  const acceptCall = () => {
    setCallStatus("connected");
  };

  if (minimized) {
    return (
      <MinimizedCall
        user={user}
        callStatus={callStatus}
        callDuration={callDuration}
        formatDuration={formatDuration}
        setMinimized={setMinimized}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
        <CallHeader
          callStatus={callStatus}
          handleMinimize={handleMinimize}
          handleEndCall={handleEndCall}
        />

        <CallContent
          user={user}
          callStatus={callStatus}
          callDuration={callDuration}
          isMuted={isMuted}
          formatDuration={formatDuration}
        />

        <CallControls
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          isSpeakerOn={isSpeakerOn}
          setIsSpeakerOn={setIsSpeakerOn}
          handleEndCall={handleEndCall}
        />

        {isIncoming && callStatus === "ringing" && (
          <IncomingCallControls
            handleEndCall={handleEndCall}
            acceptCall={acceptCall}
          />
        )}
      </div>
    </div>
  );
}