import { useMemo, useState } from "react";
import { ChatWindow } from "../ChatWindow";
import { useChatStore } from "@/stores/useChatStore";

export function ChatContainer() {
  const { activeChats, closeChat } = useChatStore();

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

  const { beginValue, distance } = useMemo(() => {
    return {
      beginValue: 600,
      distance: 300,
    };
  }, []);

  return (
    <div className="fixed bottom-0 right-0 z-30">
      {visibleChats.map((user, index) => {
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
