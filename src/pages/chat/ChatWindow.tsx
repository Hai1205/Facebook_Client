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
  MoreVertical,
  Trash,
  Download,
  File as FileIcon,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VideoCallWindow } from "./VideoCallWindow";
import { VoiceCallWindow } from "./VoiceCallWindow";
import { CONVERSATION, MESSAGE, USER } from "@/utils/interface";
import { MESSAGE_TYPE, MESSAGE_STATUS } from "@/utils/types";
import { MESSAGE_TYPE_ENUM, MESSAGE_STATUS_ENUM } from "@/utils/constants";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useMessageStore } from "@/stores/useMessageStore";
import { MessageLoader } from "./components/MessageLoader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as webSocketService from "@/utils/service/webSocketService";
import {
  sendMessageWithFiles,
  sendMessageWithImages,
  markMessageAsDeleted,
} from "@/utils/api/chatApi";

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

  // Kết nối WebSocket khi component được tạo
  useEffect(() => {
    if (userAuth?.id) {
      // Kết nối đến WebSocket
      webSocketService
        .connectToWebSocket(
          String(userAuth.id),
          import.meta.env.VITE_SERVER_URL || "http://localhost:4040"
        )
        .then(() => {
          console.log("Kết nối WebSocket thành công trong ChatWindow");
          webSocketService.checkConnection();
        })
        .catch((err) => {
          console.error("Kết nối WebSocket thất bại:", err);
        });

      // Đăng ký sự kiện theo dõi trạng thái online
      const statusCallback = (statusData: any) => {
        if (statusData.userId === user.id) {
          setIsUserOnline(statusData.online);
        }
      };

      webSocketService.onEvent("status", statusCallback);

      return () => {
        // Hủy đăng ký sự kiện khi component bị hủy
        webSocketService.offEvent("status", statusCallback);
      };
    }
  }, [userAuth?.id, user.id]);

  useEffect(() => {
    const fetchConversation = async () => {
      if (!isChatBot && userAuth?.id && user?.id) {
        try {
          // Thêm log để debug
          console.log(
            "Đang tìm hoặc tạo conversation giữa",
            userAuth?.id,
            "và",
            user?.id
          );

          const conversation = await getOrCreateConversation(
            userAuth?.id,
            user?.id
          );

          console.log("Conversation được trả về:", conversation);

          if (conversation) {
            setConversation(conversation);

            // Đăng ký nhận tin nhắn WebSocket cho cuộc trò chuyện này
            if (conversation?.id) {
              // Hủy đăng ký các subscription cũ trước khi đăng ký mới
              webSocketService.unsubscribeFromAllTopics();

              console.log(
                "Đăng ký nhận tin nhắn cho conversation:",
                conversation.id
              );

              webSocketService.subscribeToConversation(
                conversation.id,
                (message) => {
                  console.log("Nhận tin nhắn mới từ WebSocket:", message);
                  console.log("ID người gửi:", message.sender.id);
                  console.log("ID người dùng hiện tại:", userAuth?.id);

                  const newMessage: DisplayMessage = {
                    id: message.id || Date.now().toString(),
                    content: message.content,
                    sender: (message.sender.id === userAuth.id
                      ? "me"
                      : "other") as SENDER,
                    timestamp: new Date(message.createdAt || Date.now()),
                    type: message.type,
                    imageUrls: message.imageUrls,
                    fileUrl: message.fileUrl,
                    fileName: message.fileName,
                    fileSize: message.fileSize,
                    mimeType: message.mimeType,
                    status: message.status,
                  };

                  console.log("Thêm tin nhắn mới vào UI:", newMessage);

                  setMessages((prev) => [
                    ...prev.filter((msg) => msg.id !== newMessage.id),
                    newMessage,
                  ]);
                }
              );

              // Đăng ký nhận sự kiện đang nhập
              webSocketService.subscribeToTypingStatus(
                conversation.id,
                (typingData) => {
                  if (typingData.userId === user.id) {
                    setIsTyping(typingData.isTyping);
                  }
                }
              );

              // Đăng ký nhận thông báo tin nhắn đã xóa
              webSocketService.subscribeToMessageDeletion(
                conversation.id,
                (message) => {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === message.id
                        ? {
                            ...msg,
                            content: "[Tin nhắn đã bị xóa]",
                            status: MESSAGE_STATUS_ENUM.DELETED,
                          }
                        : msg
                    )
                  );
                }
              );

              // Gửi đánh dấu đã đọc
              webSocketService.sendReadReceipt(conversation.id, userAuth.id);
            }
          }
        } catch (error) {
          console.error("Lỗi khi tìm/tạo conversation:", error);
        }
      }
    };

    fetchConversation();

    // Cleanup function để hủy đăng ký các subscription khi component unmount
    return () => {
      webSocketService.unsubscribeFromAllTopics();
      console.log(
        "Đã hủy đăng ký tất cả các subscription khi unmount ChatWindow"
      );
    };
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
          sender: (msg.sender.id === userAuth.id ? "me" : "other") as SENDER,
          timestamp: new Date(msg.createdAt || Date.now()),
          type: msg.type,
          imageUrls: msg.imageUrls,
          fileUrl: msg.fileUrl,
          fileName: msg.fileName,
          fileSize: msg.fileSize,
          mimeType: msg.mimeType,
          status: msg.status,
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

  // Thêm hàm kiểm tra và kết nối lại WebSocket nếu cần
  const ensureWebSocketConnected = async () => {
    if (!webSocketService.isConnected() && userAuth?.id) {
      try {
        console.log("Kết nối lại WebSocket...");
        await webSocketService.connectToWebSocket(
          String(userAuth.id),
          import.meta.env.VITE_SERVER_URL || "http://localhost:4040"
        );
        console.log("Kết nối lại WebSocket thành công");

        // Đăng ký lại các subscription nếu có conversation
        if (conversation?.id) {
          console.log("Đăng ký lại các subscription sau khi kết nối lại");
          webSocketService.subscribeToConversation(
            conversation.id,
            (message) => {
              // Xử lý tin nhắn mới
              const newMessage: DisplayMessage = {
                id: message.id || Date.now().toString(),
                content: message.content,
                sender: (message.sender.id === userAuth.id
                  ? "me"
                  : "other") as SENDER,
                timestamp: new Date(message.createdAt || Date.now()),
                type: message.type,
                imageUrls: message.imageUrls,
                fileUrl: message.fileUrl,
                fileName: message.fileName,
                fileSize: message.fileSize,
                mimeType: message.mimeType,
                status: message.status,
              };

              setMessages((prev) => [
                ...prev.filter((msg) => msg.id !== newMessage.id),
                newMessage,
              ]);
            }
          );
        }
      } catch (err) {
        console.error("Không thể kết nối lại WebSocket:", err);
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

      // Đảm bảo WebSocket đã kết nối
      if (!isChatBot && conversation?.id && userAuth?.id) {
        // Kết nối lại nếu cần
        await ensureWebSocketConnected();
      }

      // Xử lý gửi tin nhắn với hình ảnh đính kèm
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
      }
      // Xử lý gửi tin nhắn với file đính kèm
      else if (selectedFile && conversation?.id) {
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
      }
      // Gửi tin nhắn văn bản thông thường
      else if (conversation?.id && !isChatBot) {
        console.log("Gửi tin nhắn:", {
          id: newMessage.id,
          conversationId: conversation.id,
          senderId: userAuth?.id,
          content: input.trim(),
        });

        try {
          // Đảm bảo WebSocket đã kết nối trước khi gửi
          if (!webSocketService.isConnected() && userAuth?.id) {
            await webSocketService.connectToWebSocket(
              String(userAuth.id || ""),
              import.meta.env.VITE_SERVER_URL || "http://localhost:4040"
            );
          }

          // Gửi tin nhắn qua WebSocket
          const messagePayload = {
            id: newMessage.id,
            conversationId: conversation.id,
            senderId: String(userAuth?.id || ""),
            content: input.trim(),
          };

          // Gửi tin nhắn qua WebSocket
          const sent = await webSocketService.sendMessage(messagePayload);

          if (!sent) {
            console.log(
              "Không thể gửi tin nhắn qua WebSocket, thử gửi qua REST API"
            );

            // Fallback: Gửi qua REST API nếu WebSocket thất bại
            try {
              const response = await fetch(
                `${
                  import.meta.env.VITE_SERVER_URL || "http://localhost:4040"
                }/api/messages`,
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
                    receiverId: user.id,
                    conversationId: conversation.id,
                    content: input.trim(),
                  }),
                }
              );

              if (!response.ok) {
                throw new Error(`Lỗi gửi tin nhắn: ${response.status}`);
              }

              console.log("Gửi tin nhắn qua REST thành công");
            } catch (restError) {
              console.error("Lỗi khi gửi tin nhắn qua REST:", restError);
              alert("Không thể gửi tin nhắn. Vui lòng thử lại sau.");
            }
          }

          console.log("Gửi tin nhắn thành công");
        } catch (error) {
          console.error("Lỗi gửi tin nhắn:", error);
          alert("Không thể gửi tin nhắn. Vui lòng thử lại sau.");
        }
      }

      setInput("");
      setImageFile(null);
      setFilePreview(null);
      setSelectedFile(null);

      if (isChatBot) {
        fetchChatBotResponse(input.trim());
      }
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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

    // Thông báo đang nhập đến người dùng khác
    if (conversation?.id && userAuth?.id) {
      // Xóa timeout hiện tại nếu có
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      // Gửi trạng thái đang nhập
      webSocketService.sendTypingStatus(
        conversation.id,
        String(userAuth.id),
        true
      );

      // Đặt timeout để gửi trạng thái dừng nhập sau một khoảng thời gian
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

  // Hàm định dạng kích thước file
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Xử lý cuộc trò chuyện với chatbot
  const fetchChatBotResponse = async (userInput: string) => {
    if (!isChatBot || userInput === "") return;

    try {
      setIsLoading(true);

      // Hiển thị trạng thái đang nhập
      setIsTyping(true);

      // Chờ một chút để mô phỏng thời gian phản hồi của bot
      await new Promise((resolve) => setTimeout(resolve, 1500));

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

      setIsTyping(false);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setIsTyping(false);
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
        <div
          className="flex items-center justify-between p-2 bg-gray-900 rounded-t-lg cursor-pointer"
          onClick={handleViewProfile}
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatarPhotoUrl} alt={user?.fullName} />
              <AvatarFallback className="bg-primary">
                {user?.fullName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium text-white">
                {user?.fullName || "Chat User"}
              </div>
              <div className="text-xs text-gray-400">
                {isUserOnline ? "Active now" : "Offline"}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePhoneClick();
              }}
              className="text-gray-400 hover:text-white p-1"
            >
              <Phone size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleVideoClick();
              }}
              className="text-gray-400 hover:text-white p-1"
            >
              <Video size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMinimize();
              }}
              className="text-gray-400 hover:text-white p-1"
            >
              <Minus size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="text-gray-400 hover:text-white p-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1 p-2 h-72 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-2 ${
                    message.sender === "me" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block max-w-[80%] rounded-lg px-3 py-2 ${
                      message.sender === "me"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {/* Nếu là tin nhắn hình ảnh */}
                    {message.type === MESSAGE_TYPE_ENUM.IMAGE &&
                      message.imageUrls &&
                      message.imageUrls.length > 0 && (
                        <div className="mb-1">
                          <img
                            src={message.imageUrls[0]}
                            alt="Attached image"
                            className="rounded-md max-w-full max-h-48 object-contain cursor-pointer"
                            onClick={() =>
                              window.open(message.imageUrls![0], "_blank")
                            }
                          />
                        </div>
                      )}

                    {/* Nếu là tin nhắn file */}
                    {message.type === MESSAGE_TYPE_ENUM.FILE &&
                      message.fileUrl &&
                      message.fileName && (
                        <div className="flex items-center gap-2 my-1 p-2 bg-gray-800 rounded-md">
                          <FileIcon size={20} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {message.fileName}
                            </div>
                            <div className="text-xs opacity-70">
                              {formatFileSize(message.fileSize)}
                            </div>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadFile(
                                      message.fileUrl!,
                                      message.fileName!
                                    );
                                  }}
                                  className="text-gray-300 hover:text-white"
                                >
                                  <Download size={16} />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Download</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}

                    {/* Nội dung tin nhắn */}
                    {message.content && (
                      <div
                        className={`${
                          message.status === MESSAGE_STATUS_ENUM.DELETED
                            ? "italic text-gray-400"
                            : ""
                        }`}
                      >
                        {message.content}
                      </div>
                    )}

                    <div
                      className={`text-xs mt-1 ${
                        message.sender === "me"
                          ? "text-blue-200"
                          : "text-gray-400"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>

                  {/* Thêm action menu cho tin nhắn của mình */}
                  {message.sender === "me" &&
                    message.status !== MESSAGE_STATUS_ENUM.DELETED && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-gray-400 hover:text-white ml-1 align-middle">
                            <MoreVertical size={14} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleDeleteMessage(message.id)}
                            className="text-red-500 cursor-pointer"
                          >
                            <Trash size={14} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                </div>
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
              {isTyping && !isLoading && (
                <div className="flex items-start mb-2">
                  <div className="bg-gray-700 rounded-lg px-3 py-2 text-white">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Preview file to send */}
            {filePreview && (
              <div className="px-2 py-1 border-t border-gray-700 bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    {imageFile ? (
                      <div className="relative h-10 w-10">
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="h-10 w-10 object-cover rounded"
                        />
                      </div>
                    ) : (
                      <>
                        <FileIcon size={16} />
                        <span className="truncate max-w-[150px]">
                          {filePreview}
                        </span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={handleCancelFile}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="p-2 border-t border-gray-700 bg-gray-800">
              <div className="flex items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={imageInputRef}
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <Paperclip size={16} />
                </button>
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <ImageIcon size={16} />
                </button>
                <button className="text-gray-400 hover:text-white p-1">
                  <Smile size={16} />
                </button>
                <button
                  onClick={() => webSocketService.checkConnection()}
                  className="text-blue-400 hover:text-blue-300 mr-1 text-xs"
                  title="Kiểm tra kết nối"
                >
                  {webSocketService.isConnected() ? "●" : "○"}
                </button>
                <button
                  onClick={() =>
                    conversation?.id &&
                    webSocketService.testSubscribe(conversation.id)
                  }
                  className="text-green-400 hover:text-green-300 mr-1 text-xs"
                  title="Test các topic"
                >
                  ⚡
                </button>
                <input
                  type="text"
                  placeholder="Message..."
                  className="flex-1 bg-gray-700 text-white p-2 text-sm rounded-lg mx-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                />
                <button
                  onClick={handleSendMessage}
                  className="text-blue-500 hover:text-blue-400 p-1"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
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
