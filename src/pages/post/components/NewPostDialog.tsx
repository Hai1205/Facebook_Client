import { useRef, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ImageIcon, Laugh, Plus, Video, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { usePostStore } from "@/stores/usePostStore";
import { useAuthStore } from "@/stores/useAuthStore";
import Picker from "emoji-picker-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIVACY_CHOICE } from "@/utils/choices";
import { ScrollArea } from "@/components/ui/scroll-area";
import { POST } from "@/utils/interface";

interface NewPostDialogProps {
  isPostFormOpen?: boolean;
  setIsPostFormOpen: (value: boolean) => void;
  onPostUploaded?: (updatedPost: POST) => void;
}

const NewPostDialog = ({
  isPostFormOpen,
  setIsPostFormOpen,
  onPostUploaded,
}: NewPostDialogProps) => {
  const { userAuth } = useAuthStore();
  const { isLoading, createPost } = usePostStore();

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [postContent, setPostContent] = useState("");
  const [postPrivacy, setPostPrivacy] = useState("PUBLIC");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState("");
  const [showImageUpload, setShowImageUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isPostFormOpen) {
      setPostContent("");
      resetShowFile();
    }
  }, [isPostFormOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleEmojiClick = (emojiObject: any) => {
    setPostContent((prev) => prev + emojiObject.emoji);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileType(file.type);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePost = async () => {
    if (!userAuth) {
      return;
    }

    const formData = new FormData();
    formData.append("content", postContent);
    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    formData.append("privacy", postPrivacy);

    const result = await createPost(userAuth?.id as string, formData);

    if (result) {
      setPostContent("");
      resetShowFile();
      setIsPostFormOpen(false);
    }

    if(onPostUploaded){
      onPostUploaded(result);
    }
  };

  const resetShowFile = () => {
    setShowImageUpload(false);
    setSelectedFile(null);
    setFilePreview(null);
  };

  return (
    <DialogContent className="max-h-[80vh]">
      <ScrollArea className="h-full max-h-[70vh]">
        <DialogHeader>
          <DialogTitle className="text-center">Create Post</DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="flex items-center space-x-3 py-4">
          <Avatar className="h-14 w-14">
            <AvatarImage
              src={userAuth?.avatarPhotoUrl}
              alt={userAuth?.fullName}
            />
            <AvatarFallback className="text-white">
              {userAuth?.fullName?.substring(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <p className="font-semibold">{userAuth?.fullName}</p>

            <Select
              value={postPrivacy}
              onValueChange={(value) => setPostPrivacy(value)}
            >
              <SelectTrigger id="edit-privacy" className="h-6 w-23">
                <SelectValue placeholder="Public" />
              </SelectTrigger>

              <SelectContent className="bg-zinc-800">
                {PRIVACY_CHOICE.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className="flex items-center text-white cursor-pointer"
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Textarea
          placeholder={`what's on your mind? ${userAuth?.fullName}`}
          className="min-h-[160px] max-h-[300px] text-lg"
          value={postContent}
          rows={7}
          onChange={(e) => setPostContent(e.target.value)}
        />

        <AnimatePresence>
          {(showImageUpload || filePreview) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="relative mt-4 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => resetShowFile()}
              >
                <X className="h-4 w-4" />
              </Button>

              {filePreview ? (
                fileType.startsWith("image") ? (
                  <img
                    src={filePreview}
                    alt="preview_img"
                    className="w-full h-auto max-h-[300px] object-cover"
                  />
                ) : (
                  <video
                    controls
                    src={filePreview}
                    className="w-full h-auto max-h-[300px] object-cover"
                  />
                )
              ) : (
                <>
                  <Plus
                    className="h-12 w-12 text-gray-400 mb-2 cursor-pointer"
                    onClick={handleFileClick}
                  />

                  <p className="text-center text-gray-500">Add Photos/Videos</p>
                </>
              )}
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-gray-200 dark:bg-muted p-4 rounded-lg mt-4 flex items-center justify-between">
          <p className="font-semibold mb-0">Add To Your Post</p>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowImageUpload(!showImageUpload)}
            >
              <ImageIcon className="h-4 w-4 text-green-500" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowImageUpload(!showImageUpload)}
            >
              <Video className="h-4 w-4 text-red-500" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Laugh className="h-4 w-4 text-orange-500" />
            </Button>
          </div>

          <div className="flex justify-end">
            <Button
              className="bg-[#1877F2] hover:bg-[#166FE5] text-white"
              onClick={handlePost}
              disabled={isLoading || (!postContent.trim() && !selectedFile)}
            >
              {isLoading ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>

        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute z-50 bg-white rounded-lg shadow-lg"
            style={{
              width: "320px",
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Picker
              onEmojiClick={(emojiData) => {
                handleEmojiClick(emojiData);
              }}
            />
          </div>
        )}
      </ScrollArea>
    </DialogContent>
  );
};

export default NewPostDialog;
