import {
  Download,
  File as FileIcon,
  MoreVertical,
  Trash,
  Clock,
  Check,
} from "lucide-react";
import { MESSAGE_STATUS_ENUM, MESSAGE_TYPE_ENUM } from "@/utils/constants";
import { MESSAGE_STATUS, MESSAGE_TYPE } from "@/utils/types";
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

type SENDER = "other" | "me";

interface MessageItemProps {
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
  handleDeleteMessage: (messageId: string) => void;
  handleDownloadFile: (fileUrl: string, fileName: string) => void;
}

export function MessageItem({
  id,
  content,
  sender,
  timestamp,
  type,
  imageUrls,
  fileUrl,
  fileName,
  fileSize,
  status,
  handleDeleteMessage,
  handleDownloadFile,
}: MessageItemProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`mb-2 ${sender === "me" ? "text-right" : "text-left"}`}>
      <div
        className={`inline-block max-w-[80%] rounded-lg px-3 py-2 ${
          sender === "me" ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
        }`}
      >
        {/* If message is image */}
        {type === MESSAGE_TYPE_ENUM.IMAGE &&
          imageUrls &&
          imageUrls.length > 0 && (
            <div className="mb-1">
              <img
                src={imageUrls[0]}
                alt="Attached image"
                className="rounded-md max-w-full max-h-48 object-contain cursor-pointer"
                onClick={() => window.open(imageUrls[0], "_blank")}
              />
            </div>
          )}

        {/* If message is file */}
        {type === MESSAGE_TYPE_ENUM.FILE && fileUrl && fileName && (
          <div className="flex items-center gap-2 my-1 p-2 bg-gray-800 rounded-md">
            <FileIcon size={20} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{fileName}</div>
              <div className="text-xs opacity-70">
                {formatFileSize(fileSize)}
              </div>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadFile(fileUrl, fileName);
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

        {/* Message content */}
        {content && (
          <div
            className={`${
              status === MESSAGE_STATUS_ENUM.DELETED
                ? "italic text-gray-400"
                : ""
            }`}
          >
            {content}
          </div>
        )}

        <div
          className={`text-xs mt-1 ${
            sender === "me" ? "text-blue-200" : "text-gray-400"
          }`}
        >
          <span className="mr-1">{formatTime(timestamp)}</span>
          {sender === "me" && (
            <>
              {status === MESSAGE_STATUS_ENUM.SENDING && (
                <Clock size={12} className="inline ml-1" />
              )}
              {status !== MESSAGE_STATUS_ENUM.SENDING &&
                status !== MESSAGE_STATUS_ENUM.DELETED && (
                  <Check size={12} className="inline ml-1" />
                )}
            </>
          )}
        </div>
      </div>

      {/* Add action menu for your messages */}
      {sender === "me" && status !== MESSAGE_STATUS_ENUM.DELETED && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-400 hover:text-white ml-1 align-middle">
              <MoreVertical size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleDeleteMessage(id)}
              className="text-red-500 cursor-pointer"
            >
              <Trash size={14} className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
