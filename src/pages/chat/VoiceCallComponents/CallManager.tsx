import { useEffect, useRef } from "react";
import { VideoCallWindow } from "@/pages/chat/VideoCallWindow";
import { VoiceCallWindow } from "@/pages/chat/VoiceCallWindow";
import { useCallStore } from "@/stores/useCallStore";

export function CallManager() {
  const {
    isCallActive,
    callType,
    callStatus,
    remoteUser,
    isIncoming,
    groupCall,
    participants,
    endCall,
    // resetCallState,
    incrementCallDuration,
    toggleMinimize,
  } = useCallStore();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (callStatus === "connected") {
      timerRef.current = setInterval(() => {
        incrementCallDuration();
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [callStatus, incrementCallDuration]);

  useEffect(() => {
    if (callStatus === "ended") {
      const timer = setTimeout(() => {
        // resetCallState();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [callStatus]);

  if (!isCallActive || !remoteUser) {
    return null;
  }

  const handleClose = () => {
    endCall();
  };

  if (callType === "video") {
    return (
      <VideoCallWindow
        user={remoteUser}
        onClose={handleClose}
        onMinimize={toggleMinimize}
        isIncoming={isIncoming}
        isGroupCall={groupCall}
        participants={participants}
      />
    );
  } else if (callType === "voice") {
    return (
      <VoiceCallWindow
        user={remoteUser}
        onClose={handleClose}
        onMinimize={toggleMinimize}
        isIncoming={isIncoming}
      />
    );
  }

  return null;
}
