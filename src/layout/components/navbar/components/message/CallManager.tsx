import { useCall } from "@/context/CallContext";
import { VoiceCallWindow } from "./VoiceCallWindow";
import { VideoCallWindow } from "../../../../../../../path=Facebook_Client/src/layout/components/navbar/components/message/VideoCallWindow";

export function CallManager() {
  const { activeCall, endCall } = useCall();

  if (!activeCall.type) return null;

  if (activeCall.type === "voice" && activeCall.user) {
    return (
      <VoiceCallWindow
        user={activeCall.user}
        onClose={endCall}
        isIncoming={activeCall.isIncoming}
      />
    );
  }

  if (activeCall.type === "video" && activeCall.user) {
    return (
      <VideoCallWindow
        user={activeCall.user}
        onClose={endCall}
        isIncoming={activeCall.isIncoming}
      />
    );
  }

  return null;
}
