import type React from "react";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  X,
  Minus,
  Send,
  Paperclip,
  ImageIcon,
  Smile,
  Phone,
  Video,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VideoCallWindow } from "./VideoCallWindow";
import { VoiceCallWindow } from "./VoiceCallWindow";
import { CONVERSATION, MESSAGE, USER } from "@/utils/interface";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useMessageStore } from "@/stores/useMessageStore";
import { MessageLoader } from "./components/MessageLoader";

type SENDER = "other" | "me";

interface DisplayMessage {
  id: string;
  content: string;
  sender: SENDER;
  timestamp: Date;
}

interface ChatWindowProps {
  user: USER;
  onClose: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

export function ChatWindow({
  user,
  onClose,
  isMinimized,
  onToggleMinimize,
}: ChatWindowProps) {
  const { getOrCreateConversation, getMessages } = useChatStore();
  const { userAuth } = useAuthStore();
  const { generateBotResponse } = useMessageStore();

  const navigate = useNavigate();

  const [conversation, setConversation] = useState<CONVERSATION | null>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [isVoiceCallOpen, setIsVoiceCallOpen] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isChatBot = useMemo(() => {
    return user?.bio?.workplace === "Chat Bot";
  }, [user]);

  useEffect(() => {
    const fetchConversation = async () => {
      if (!isChatBot && userAuth?.id && user?.id) {
        const conversation = await getOrCreateConversation(
          userAuth?.id,
          user?.id
        );
        setConversation(conversation);
      }
    };

    fetchConversation();
  }, [getOrCreateConversation, userAuth?.id, user?.id, isChatBot]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (conversation?.id && userAuth?.id) {
        const response: MESSAGE[] = await getMessages(
          conversation.id,
          userAuth.id
        );
        const result = response.map((msg) => ({
          id: msg.id || Date.now().toString(),
          content: msg.content,
          sender: (msg.sender.id === userAuth.id ? "me" : "user") as SENDER,
          timestamp: new Date(msg.createdAt || Date.now()),
        }));
        setMessages(result);
      }
    };

    fetchMessages();
  }, [conversation?.id, userAuth?.id, getMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleViewProfile = () => {
    if (isChatBot) return;

    navigate(`/profile/${user?.id}`);
  };

  const handleSendMessage = () => {
    if (!input.trim()) {
      return;
    }

    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        content: input.trim(),
        sender: "me",
        timestamp: new Date(),
      },
    ]);

    setInput("");

    if (isChatBot) {
      fetchChatBotResponse(input.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handlePhoneClick = () => {
    setIsVoiceCallOpen(true);
  };

  const handleVideoClick = () => {
    setIsVideoCallOpen(true);
  };

  const fetchChatBotResponse = async (userInput: string) => {
    if (!isChatBot && userInput !== "") return;

    try {
      setIsLoading(true);

      const apiResponseText = await generateBotResponse(userInput);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          content: apiResponseText,
          sender: "other",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col">
      <div
        className={`w-72 bg-gray-800 rounded-t-lg shadow-lg border border-gray-700 transition-all duration-300 absolute bottom-0 ${
          isMinimized ? "h-12" : "h-96"
        }`}
        style={{ zIndex: 40 }}
      >
        {/* Chat header */}
        <div className="p-2 flex items-center justify-between border-b border-gray-700 cursor-pointer">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2" onClick={handleViewProfile}>
              <AvatarImage src={user.avatarPhotoUrl} />
              <AvatarFallback className="bg-blue-600">
                {user.fullName.substring(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-semibold text-sm" onClick={handleViewProfile}>
                {user.fullName}
              </p>

              <p className="text-xs text-green-500">Active now</p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {!isChatBot && (
              <>
                <button
                  className="p-1 rounded-full hover:bg-gray-800 text-gray-400"
                  onClick={handlePhoneClick}
                >
                  <Phone className="h-4 w-4" />
                </button>

                <button
                  className="p-1 rounded-full hover:bg-gray-800 text-gray-400"
                  onClick={handleVideoClick}
                >
                  <Video className="h-4 w-4" />
                </button>
              </>
            )}

            <button
              className="p-1 rounded-full hover:bg-gray-800 text-gray-400"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMinimize();
              }}
            >
              <Minus className="h-4 w-4" />
            </button>

            <button
              className="p-1 rounded-full text-gray-400"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="flex flex-col h-[calc(100%-40px)]">
            {/* Chat messages */}
            <ScrollArea className="flex-1 p-3 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "me" ? "justify-end" : "justify-start"
                  } mb-3`}
                >
                  {message.sender === "other" && (
                    <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                      <AvatarImage src={user.avatarPhotoUrl} />
                      <AvatarFallback className="bg-blue-600">
                        {user.fullName.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className="max-w-[70%]">
                    <div
                      className={`p-2 rounded-lg ${
                        message.sender === "me"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-100"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && <MessageLoader user={user} />}

              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Chat input */}
            <div className="p-3 border-t border-gray-700 mt-auto">
              <div className="flex items-center space-x-2 mb-2">
                <button className="p-1 rounded-full hover:bg-gray-800 text-gray-400">
                  <Paperclip className="h-5 w-5" />
                </button>

                <button className="p-1 rounded-full hover:bg-gray-800 text-gray-400">
                  <ImageIcon className="h-5 w-5" />
                </button>

                <button className="p-1 rounded-full hover:bg-gray-800 text-gray-400">
                  <Smile className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Aa"
                  className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-sm border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim()}
                  className={`p-2 rounded-full ${
                    input.trim()
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400"
                  }`}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {isVideoCallOpen && (
        <VideoCallWindow
          user={user}
          onClose={() => setIsVideoCallOpen(false)}
        />
      )}

      {isVoiceCallOpen && (
        <VoiceCallWindow
          user={user}
          onClose={() => setIsVoiceCallOpen(false)}
        />
      )}
    </div>
  );
}
