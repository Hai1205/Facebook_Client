import { useState, useRef, useEffect, useMemo } from "react";
import { VideoCallWindow } from "./VideoCallWindow";
import { VoiceCallWindow } from "./VoiceCallWindow";
import { CONVERSATION, MESSAGE, USER } from "@/utils/interface";
import { MESSAGE_TYPE_ENUM, MESSAGE_STATUS_ENUM } from "@/utils/constants";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useMessageStore } from "@/stores/useMessageStore";
import * as webSocketService from "@/utils/service/webSocketService";
import {
  sendMessageWithFiles,
  sendMessageWithImages,
  markMessageAsDeleted,
} from "@/utils/api/chatApi";
import { serverUrl } from "@/lib/utils";
import { ChatHeader } from "./components/ChatHeader";
import { MessageList } from "./components/MessageList";
import { FilePreview } from "./components/FilePreview";
import { InputBar } from "./components/InputBar";

type SENDER = "other" | "me";

interface DisplayMessage {
  id: string;
  content: string;
  sender: SENDER;
  timestamp: Date;
  type?: (typeof MESSAGE_TYPE_ENUM)[keyof typeof MESSAGE_TYPE_ENUM];
  imageUrls?: string[];
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  status?: (typeof MESSAGE_STATUS_ENUM)[keyof typeof MESSAGE_STATUS_ENUM];
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
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isChatBot = useMemo(() => {
    return user?.bio?.workplace === "Chat Bot";
  }, [user]);

  useEffect(() => {
    if (userAuth?.id) {
      webSocketService
        .connectToWebSocket(
          String(userAuth.id),
          serverUrl || "http://localhost:4040"
        )
        .then(() => {
          // console.log("WebSocket connection successful in ChatWindow");
          webSocketService.checkConnection();
        })
        .catch((err) => {
          console.error("WebSocket connection failed:", err);
        });

      const statusCallback = (statusData: any) => {
        if (statusData.userId === user?.id) {
          setIsUserOnline(statusData.online);
        }
      };

      webSocketService.onEvent("status", statusCallback);

      return () => {
        webSocketService.offEvent("status", statusCallback);
      };
    }
  }, [userAuth?.id, user?.id]);

  useEffect(() => {
    const fetchConversation = async () => {
      if (!isChatBot && userAuth?.id && user?.id) {
        try {
          // console.log(
          //   "Finding or creating conversation between",
          //   userAuth?.id,
          //   "and",
          //   user?.id
          // );

          const conversation = await getOrCreateConversation(
            userAuth?.id,
            user?.id
          );

          // console.log("Conversation returned:", conversation);

          if (conversation) {
            setConversation(conversation);

            if (conversation?.id) {
              webSocketService.unsubscribeFromAllTopics();

              // console.log("Subscribing to conversation:", conversation.id);

              webSocketService.subscribeToConversation(
                conversation.id,
                (message) => {
                  // console.log("New message received from WebSocket:", message);
                  // console.log("Sender ID:", message.sender.id);
                  // console.log("Current user ID:", userAuth?.id);

                  const newMessage: DisplayMessage = {
                    id: message.id || Date.now().toString(),
                    content: message.content,
                    sender: (message.sender.id === userAuth.id
                      ? "me"
                      : "other") as SENDER,
                    timestamp: new Date(message.createdAt || Date.now()),
                    type: message.type as (typeof MESSAGE_TYPE_ENUM)[keyof typeof MESSAGE_TYPE_ENUM],
                    imageUrls: message.imageUrls,
                    fileUrl: message.fileUrl,
                    fileName: message.fileName,
                    fileSize: message.fileSize,
                    mimeType: message.mimeType,
                    status:
                      message.status as (typeof MESSAGE_STATUS_ENUM)[keyof typeof MESSAGE_STATUS_ENUM],
                  };

                  // console.log("Adding new message to UI:", newMessage);

                  setMessages((prev) => [
                    ...prev.filter((msg) => msg.id !== newMessage.id),
                    newMessage,
                  ]);
                }
              );

              webSocketService.subscribeToTypingStatus(
                conversation.id,
                (typingData) => {
                  if (typingData.userId === user?.id) {
                    setIsTyping(typingData.isTyping);
                  }
                }
              );

              webSocketService.subscribeToMessageDeletion(
                conversation.id,
                (message) => {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === message.id
                        ? {
                            ...msg,
                            content: "[Message deleted]",
                            status: MESSAGE_STATUS_ENUM.DELETED,
                          }
                        : msg
                    )
                  );
                }
              );

              webSocketService.sendReadReceipt(conversation.id, userAuth.id);
            }
          }
        } catch (error) {
          console.error("Error finding/creating conversation:", error);
        }
      } else if (isChatBot) {
        setMessages([
          {
            id: Date.now().toString(),
            content:
              "Hello! I am Chat Bot. How can I help you today?",
            sender: "other",
            timestamp: new Date(),
          },
        ]);
      }
    };

    fetchConversation();

    return () => {
      webSocketService.unsubscribeFromAllTopics();
      // console.log("Unsubscribed from all topics when ChatWindow unmounts");
    };
  }, [getOrCreateConversation, userAuth?.id, user?.id, isChatBot]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (conversation?.id && userAuth?.id) {
        const response: MESSAGE[] = await getMessages(
          conversation.id,
          userAuth.id
        );

        console.log("Messages fetched:", response);

        const result = response?.map((msg) => ({
          id: msg.id || Date.now().toString(),
          content: msg.content,
          sender: (msg.sender.id === userAuth.id ? "me" : "other") as SENDER,
          timestamp: new Date(msg.createdAt || Date.now()),
          type: msg.type as (typeof MESSAGE_TYPE_ENUM)[keyof typeof MESSAGE_TYPE_ENUM],
          imageUrls: msg.imageUrls,
          fileUrl: msg.fileUrl,
          fileName: msg.fileName,
          fileSize: msg.fileSize,
          mimeType: msg.mimeType,
          status:
            msg.status as (typeof MESSAGE_STATUS_ENUM)[keyof typeof MESSAGE_STATUS_ENUM],
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

  const ensureWebSocketConnected = async () => {
    if (!webSocketService.isConnected() && userAuth?.id) {
      try {
        await webSocketService.connectToWebSocket(
          String(userAuth.id),
          serverUrl || "http://localhost:4040"
        );
        // console.log("WebSocket connection reestablished");

        if (conversation?.id) {
          // console.log("Re-subscribing to the conversation");
          webSocketService.subscribeToConversation(
            conversation.id,
            (message) => {
              const newMessage: DisplayMessage = {
                id: message.id || Date.now().toString(),
                content: message.content,
                sender: (message.sender.id === userAuth.id
                  ? "me"
                  : "other") as SENDER,
                timestamp: new Date(message.createdAt || Date.now()),
                type: message.type as (typeof MESSAGE_TYPE_ENUM)[keyof typeof MESSAGE_TYPE_ENUM],
                imageUrls: message.imageUrls,
                fileUrl: message.fileUrl,
                fileName: message.fileName,
                fileSize: message.fileSize,
                mimeType: message.mimeType,
                status:
                  message.status as (typeof MESSAGE_STATUS_ENUM)[keyof typeof MESSAGE_STATUS_ENUM],
              };

              setMessages((prev) => [
                ...prev.filter((msg) => msg.id !== newMessage.id),
                newMessage,
              ]);
            }
          );
        }
      } catch (err) {
        console.error("Failed to reconnect WebSocket:", err);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !imageFile && !selectedFile) {
      return;
    }

    try {
      let newMessage: DisplayMessage = {
        id: Date.now().toString(),
        content: input.trim() || "",
        sender: "me",
        timestamp: new Date(),
      };

      if (isChatBot) {
        // Nếu là chat với bot thì xử lý khác
        // 1. Thêm tin nhắn người dùng vào danh sách hiển thị
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // 2. Reset form
        setInput("");
        setImageFile(null);
        setFilePreview(null);
        setSelectedFile(null);

        // 3. Gọi API lấy phản hồi từ bot
        fetchChatBotResponse(input.trim());

        // Kết thúc sớm, không cần xử lý tiếp
        return;
      }

      // Các xử lý khác chỉ áp dụng cho chat giữa người với người
      if (conversation?.id && userAuth?.id) {
        await ensureWebSocketConnected();
      }

      if (imageFile && conversation?.id) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("conversationId", conversation.id);
        formData.append("senderId", userAuth?.id || "");
        formData.append("content", input.trim() || "");

        const response = await sendMessageWithImages(formData);
        if (response) {
          newMessage = {
            ...newMessage,
            type: MESSAGE_TYPE_ENUM.IMAGE,
            imageUrls: [response.imageUrl],
          };
        }
      } else if (selectedFile && conversation?.id) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("conversationId", conversation.id);
        formData.append("senderId", userAuth?.id || "");
        formData.append("content", input.trim() || "");

        const response = await sendMessageWithFiles(formData);
        if (response) {
          newMessage = {
            ...newMessage,
            type: MESSAGE_TYPE_ENUM.FILE,
            fileUrl: response.fileUrl,
            fileName: response.fileName,
            fileSize: response.fileSize,
            mimeType: response.mimeType,
          };
        }
      } else if (conversation?.id) {
        // Xử lý gửi tin nhắn thông thường
        try {
          if (!webSocketService.isConnected() && userAuth?.id) {
            await webSocketService.connectToWebSocket(
              String(userAuth.id || ""),
              serverUrl || "http://localhost:4040"
            );
          }

          const messagePayload = {
            id: newMessage.id,
            conversationId: conversation.id,
            senderId: String(userAuth?.id || ""),
            content: input.trim(),
          };

          const sent = await webSocketService.sendMessage(messagePayload);

          if (!sent) {
            try {
              const response = await fetch(
                `${serverUrl || "http://localhost:4040"}/api/messages`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(
                      "accessToken"
                    )}`,
                  },
                  body: JSON.stringify({
                    senderId: String(userAuth?.id || ""),
                    receiverId: user?.id,
                    conversationId: conversation.id,
                    content: input.trim(),
                  }),
                }
              );

              if (!response.ok) {
                throw new Error(`Error sending message: ${response.status}`);
              }
            } catch (restError) {
              console.error("Error sending message via REST:", restError);
              alert("Failed to send message. Please try again later.");
            }
          }
        } catch (error) {
          console.error("Error sending message:", error);
          alert("Failed to send message. Please try again later.");
        }
      }

      setInput("");
      setImageFile(null);
      setFilePreview(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePhoneClick = () => {
    setIsVoiceCallOpen(true);
  };

  const handleVideoClick = () => {
    setIsVideoCallOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFilePreview(file.name);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setFilePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelFile = () => {
    setImageFile(null);
    setFilePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      if (conversation?.id) {
        await markMessageAsDeleted(conversation.id, messageId);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleDownloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    if (conversation?.id && userAuth?.id) {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      webSocketService.sendTypingStatus(
        conversation.id,
        String(userAuth.id),
        true
      );

      const timeout = setTimeout(() => {
        if (userAuth?.id && conversation?.id) {
          webSocketService.sendTypingStatus(
            conversation.id,
            String(userAuth.id),
            false
          );
        }
      }, 3000);

      setTypingTimeout(timeout);
    }
  };

  const fetchChatBotResponse = async (userInput: string) => {
    if (!isChatBot || userInput === "") return;

    try {
      setIsLoading(true);
      setIsTyping(true);

      const apiResponseText = await generateBotResponse(userInput);

      const botResponseMessage = {
        id: Date.now().toString(),
        content: apiResponseText,
        sender: "other" as SENDER,
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, botResponseMessage]);

      setIsTyping(false);
    } catch (error) {
      console.error("Error in chatbot response flow:", error);
      setIsTyping(false);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          content:
            "Error when generating response from bot. Please try again later.",
          sender: "other" as SENDER,
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
        {/* Chat Header */}
        <ChatHeader
          user={user}
          isUserOnline={isUserOnline}
          onToggleMinimize={onToggleMinimize}
          onClose={onClose}
          handlePhoneClick={handlePhoneClick}
          handleVideoClick={handleVideoClick}
          handleViewProfile={handleViewProfile}
        />

        {!isMinimized && (
          <div className="flex flex-col h-[calc(100%-48px)]">
            {/* Messages */}
            <div className="flex-grow overflow-y-auto">
              <MessageList
                messages={messages}
                isLoading={isLoading}
                isTyping={isTyping}
                messagesEndRef={messagesEndRef}
                handleDeleteMessage={handleDeleteMessage}
                handleDownloadFile={handleDownloadFile}
                user={user}
              />
            </div>

            <div className="mt-auto">
              {/* Preview file to send */}
              {filePreview && (
                <div className="max-h-16 overflow-hidden">
                  <FilePreview
                    filePreview={filePreview}
                    imageFile={imageFile}
                    handleCancelFile={handleCancelFile}
                  />
                </div>
              )}

              {/* Message Input */}
              <InputBar
                input={input}
                handleInputChange={handleInputChange}
                handleKeyPress={handleKeyPress}
                handleSendMessage={handleSendMessage}
                fileInputRef={fileInputRef}
                imageInputRef={imageInputRef}
                handleFileSelect={handleFileSelect}
                handleImageSelect={handleImageSelect}
              />
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
