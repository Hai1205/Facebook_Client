import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Minus,
  Send,
  Paperclip,
  ImageIcon,
  Smile,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatWindowProps {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "me";
  timestamp: Date;
}

export function ChatWindow({ user, onClose }: ChatWindowProps) {
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey there!",
      sender: "user",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "2",
      text: "Hi! How are you?",
      sender: "me",
      timestamp: new Date(Date.now() - 1000 * 60 * 4),
    },
    {
      id: "3",
      text: "I'm good, thanks for asking. What about you?",
      sender: "user",
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
    },
    {
      id: "4",
      text: "I'm good, thanks for asking. What about you?",
      sender: "user",
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
    },
    {
      id: "5",
      text: "I'm good, thanks for asking. What about you?",
      sender: "user",
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
    },
    {
      id: "6",
      text: "I'm good, thanks for asking. What about you?",
      sender: "user",
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          text: input.trim(),
          sender: "me",
          timestamp: new Date(),
        },
      ]);
      setInput("");

      // Simulate a response after a short delay
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: "Thanks for your message! I'll get back to you soon.",
            sender: "user",
            timestamp: new Date(),
          },
        ]);
      }, 1000);
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

  return (
    <div
      className={`w-72 bg-gray-800 rounded-t-lg shadow-lg flex flex-col border border-gray-700 ${
        minimized ? "h-12" : "h-96"
      }`}
    >
      {/* Chat header */}
      <div
        className="p-2 flex items-center justify-between border-b border-gray-700 cursor-pointer"
        onClick={() => setMinimized(!minimized)}
      >
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={user.avatar} />

            <AvatarFallback className="bg-blue-600">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="font-semibold text-sm">{user.name}</p>

            <p className="text-xs text-green-500">Active now</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            className="p-1 rounded-full hover:bg-gray-700 text-gray-400"
            onClick={(e) => {
              e.stopPropagation();
              setMinimized(!minimized);
            }}
          >
            <Minus className="h-4 w-4" />
          </button>

          <button
            className="p-1 rounded-full hover:bg-gray-700 text-gray-400"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Chat messages */}
          <ScrollArea className="overflow-hidden flex-1 p-3 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "user" && (
                  <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-blue-600">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className="max-w-[70%]">
                  <div
                    className={`p-2 rounded-lg ${
                      message.sender === "me"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-100"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>

                  <p className="text-xs text-gray-400 mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Chat input */}
          <div className="p-3 border-t border-gray-700">
            <div className="flex items-center space-x-2 mb-2">
              <button className="p-1 rounded-full hover:bg-gray-700 text-gray-400">
                <Paperclip className="h-5 w-5" />
              </button>

              <button className="p-1 rounded-full hover:bg-gray-700 text-gray-400">
                <ImageIcon className="h-5 w-5" />
              </button>

              <button className="p-1 rounded-full hover:bg-gray-700 text-gray-400">
                <Smile className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Aa"
                className="flex-1 bg-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={handleSendMessage}
                disabled={!input.trim()}
                className={`p-2 rounded-full ${
                  input.trim()
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
