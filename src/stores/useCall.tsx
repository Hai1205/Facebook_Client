import { createContext, useState, useContext, ReactNode } from "react";

type CallType = "voice" | "video" | null;
export interface User {
  id: string;
  name: string;
  avatar: string;
}
interface CallContextType {
  activeCall: {
    type: CallType;
    user: User | null;
    isIncoming: boolean;
  };
  setActiveCall: (type: CallType, user: User | null, isIncoming?: boolean) => void;
  endCall: () => void;
  isInCall: () => boolean;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export function CallProvider({ children }: { children: ReactNode }) {
  const [activeCall, setActiveCallState] = useState<{
    type: CallType;
    user: User | null;
    isIncoming: boolean;
  }>({
    type: null,
    user: null,
    isIncoming: false,
  });

  const setActiveCall = (type: CallType, user: User | null, isIncoming = false) => {
    setActiveCallState({
      type,
      user,
      isIncoming,
    });
  };

  const endCall = () => {
    setActiveCallState({
      type: null,
      user: null,
      isIncoming: false,
    });
  };

  const isInCall = () => {
    return activeCall.type !== null;
  };

  return (
    <CallContext.Provider
      value={{
        activeCall,
        setActiveCall,
        endCall,
        isInCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

export function useCall() {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error("useCall must be used within a CallProvider");
  }
  return context;
} 