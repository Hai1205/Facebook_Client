import { useState } from "react";
import { ChatWindow } from "./ChatWindow";
import { USER } from "@/utils/interface";

interface ChatContainerProps {
  activeChats: USER[];
  closeChat: (userId: string) => void;
}

export function ChatContainer({ activeChats, closeChat }: ChatContainerProps) {
  const [minimizedChats, setMinimizedChats] = useState<Record<string, boolean>>(
    {}
  );

  const toggleMinimize = (userId: string) => {
    setMinimizedChats((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const visibleChats = activeChats.slice(0, 4);

  return (
    <div className="fixed bottom-0 right-0 z-10">
      {visibleChats.map((user, index) => {
        const beginValue: number = 600;
        const distance: number = 300;
        const rightPosition: number = beginValue + index * distance;

        return (
          <div
            key={user.id}
            className="absolute bottom-0"
            style={{ right: `${rightPosition}px` }}
          >
            <ChatWindow
              key={user.id}
              user={user}
              onClose={() => closeChat(user.id as string)}
              isMinimized={minimizedChats[user.id as string] || false}
              onToggleMinimize={() => toggleMinimize(user.id as string)}
            />
          </div>
        );
      })}
    </div>
  );
}
