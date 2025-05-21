import { RefObject } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "./MessageItem";
import { TypingIndicator } from "./TypingIndicator";
import { MessageLoader } from "./MessageLoader";
import { USER } from "@/utils/interface";
import { MESSAGE_STATUS, MESSAGE_TYPE } from "@/utils/types";

type SENDER = "other" | "me";

interface DisplayMessage {
  id: string;
  content: string;
  sender: SENDER;
  timestamp: Date;
  type?: MESSAGE_TYPE;
  imageUrls?: string[];
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  status?: MESSAGE_STATUS;
}

interface MessageListProps {
  messages: DisplayMessage[];
  isLoading: boolean;
  isTyping: boolean;
  messagesEndRef: RefObject<HTMLDivElement>;
  handleDeleteMessage: (messageId: string) => void;
  handleDownloadFile: (fileUrl: string, fileName: string) => void;
  user: USER;
}

export function MessageList({
  messages,
  isLoading,
  isTyping,
  messagesEndRef,
  handleDeleteMessage,
  handleDownloadFile,
  user,
}: MessageListProps) {
  return (
    <ScrollArea className="flex-1 p-2 h-72 overflow-y-auto">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          id={message.id}
          content={message.content}
          sender={message.sender}
          timestamp={message.timestamp}
          type={message.type}
          imageUrls={message.imageUrls}
          fileUrl={message.fileUrl}
          fileName={message.fileName}
          fileSize={message.fileSize}
          status={message.status}
          handleDeleteMessage={handleDeleteMessage}
          handleDownloadFile={handleDownloadFile}
        />
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-start mb-2">
          <div className="bg-gray-700 rounded-lg px-3 py-2 text-white">
            <MessageLoader user={user} />
          </div>
        </div>
      )}

      {/* Typing indicator */}
      {isTyping && !isLoading && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </ScrollArea>
  );
}
