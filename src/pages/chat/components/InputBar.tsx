import { ChangeEvent, KeyboardEvent, RefObject } from "react";
import { Paperclip, ImageIcon, Smile, Send } from "lucide-react";

interface InputBarProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (e: KeyboardEvent) => void;
  handleSendMessage: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
  imageInputRef: RefObject<HTMLInputElement>;
  handleFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  handleImageSelect: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function InputBar({
  input,
  handleInputChange,
  handleKeyPress,
  handleSendMessage,
  fileInputRef,
  imageInputRef,
  handleFileSelect,
  handleImageSelect,
}: InputBarProps) {
  return (
    <div className="p-2 border-t border-gray-700 bg-gray-800">
      <div className="flex items-center">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />

        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          className="hidden"
          onChange={handleImageSelect}
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
  );
}
