import { useRef, useState, useEffect, useCallback, Fragment } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { ImageIcon, Laugh, Plus, Video, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { usePostStore } from "@/stores/usePostStore";
import { useAuthStore } from "@/stores/useAuthStore";
import Picker from "emoji-picker-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIVACY_CHOICE } from "@/utils/choices";
import { MEDIA_FILE, POST } from "@/utils/interface";
import { Dialog, Transition } from "@headlessui/react";

interface EditPostDialogProps {
  isPostFormOpen?: boolean;
  setIsPostFormOpen: (value: boolean) => void;
  onPostUpdated?: (updatedPost: POST) => void;
  post: POST;
}

const EditPostDialog = ({
  isPostFormOpen,
  setIsPostFormOpen,
  onPostUpdated,
  post,
}: EditPostDialogProps) => {
  const { userAuth } = useAuthStore();
  const { isLoading, updatePost } = usePostStore();

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [postContent, setPostContent] = useState("");
  const [postPrivacy, setPostPrivacy] = useState("PUBLIC");
  const [mediaFiles, setMediaFiles] = useState<MEDIA_FILE[]>([]);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [existingMedia, setExistingMedia] = useState<
    { url: string; type: string }[]
  >([]);

  useEffect(() => {
    if (isPostFormOpen && post) {
      setPostContent(post.content || "");
      setPostPrivacy(post.privacy || "PUBLIC");

      if (post.mediaUrls && post.mediaUrls.length > 0) {
        const media = post.mediaUrls.map((url) => {
          const isImage = url.match(/\.(jpeg|jpg|gif|png)$/i);
          return {
            url,
            type: isImage ? "image" : "video",
          };
        });
        setExistingMedia(media);
        setShowMediaUpload(true);
      }
    }
  }, [isPostFormOpen, post]);

  const resetMedia = useCallback(() => {
    setShowMediaUpload(false);
    setMediaFiles((prevMediaFiles) => {
      prevMediaFiles.forEach((media) => URL.revokeObjectURL(media.preview));
      return [];
    });
    setExistingMedia([]);
  }, []);

  useEffect(() => {
    if (!isPostFormOpen) {
      setPostContent("");
      resetMedia();
    }
  }, [isPostFormOpen, resetMedia]);

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
    const files = e?.target?.files;
    if (files && files.length > 0) {
      const newMediaFiles: MEDIA_FILE[] = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        type: file.type,
      }));

      setMediaFiles((prev) => [...prev, ...newMediaFiles]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const removeExistingMedia = (index: number) => {
    setExistingMedia((prev) => {
      const newMedia = [...prev];
      newMedia.splice(index, 1);
      return newMedia;
    });
  };

  const handlePost = async () => {
    if (!userAuth) {
      return;
    }

    const formData = new FormData();
    formData.append("content", postContent);

    mediaFiles.forEach((mediaFile) => {
      formData.append("files", mediaFile.file);
    });

    existingMedia.forEach((media) => {
      formData.append("keepMediaUrls", media.url);
    });

    formData.append("privacy", postPrivacy);

    const result = await updatePost(post?.id as string, formData);

    if (result) {
      setPostContent("");
      resetMedia();
      setIsPostFormOpen(false);
    }

    if (onPostUpdated) {
      onPostUpdated(result);
    }
  };

  return (
    <Transition appear show={isPostFormOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsPostFormOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md md:max-w-xl lg:max-w-2xl transform overflow-hidden rounded-2xl bg-zinc-900 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="div"
                  className="flex items-center justify-between border-b border-zinc-800 p-4"
                >
                  <h3 className="text-lg font-medium text-white">
                    Update {post?.user?.fullName}'s post
                  </h3>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsPostFormOpen(false)}
                    className="rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </Dialog.Title>

                <div className="h-[80vh] relative">
                  <ScrollArea className="h-full">
                    <div className="p-4">
                      <div className="flex items-center space-x-3 pb-3">
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
                            <SelectTrigger
                              id="edit-privacy"
                              className="h-6 w-23"
                            >
                              <SelectValue placeholder="Public" />
                            </SelectTrigger>

                            <SelectContent className="bg-zinc-800">
                              {PRIVACY_CHOICE.map((item) => (
                                <SelectItem
                                  key={item.value}
                                  value={item.value || post?.privacy}
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
                        rows={3}
                        onChange={(e) => setPostContent(e.target.value)}
                      />
                      <AnimatePresence>
                        {(showMediaUpload ||
                          mediaFiles.length > 0 ||
                          existingMedia.length > 0) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="relative mt-4 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center"
                          >
                            {mediaFiles.length === 0 &&
                            existingMedia.length === 0 ? (
                              <>
                                <Plus
                                  className="h-12 w-12 text-gray-400 mb-2 cursor-pointer"
                                  onClick={handleFileClick}
                                />
                                <p className="text-center text-gray-500">
                                  Add Photos/Videos
                                </p>
                              </>
                            ) : (
                              <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full">
                                  {existingMedia.map((media, index) => (
                                    <div
                                      key={`existing-${index}`}
                                      className="relative aspect-square"
                                    >
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-1 right-1 bg-black bg-opacity-50 z-10 p-1"
                                        onClick={() =>
                                          removeExistingMedia(index)
                                        }
                                      >
                                        <X className="h-3 w-3 text-white" />
                                      </Button>

                                      {media.type === "image" ? (
                                        <img
                                          src={media.url}
                                          alt={`media-${index}`}
                                          className="w-full h-full object-cover rounded-md"
                                        />
                                      ) : (
                                        <div className="relative w-full h-full">
                                          <video
                                            src={media.url}
                                            className="w-full h-full object-cover rounded-md"
                                          />
                                          <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-black bg-opacity-50 rounded-full p-2">
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="white"
                                              >
                                                <path d="M8 5v14l11-7z" />
                                              </svg>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}

                                  {mediaFiles.map((media, index) => (
                                    <div
                                      key={`new-${index}`}
                                      className="relative aspect-square"
                                    >
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-1 right-1 bg-black bg-opacity-50 z-10 p-1"
                                        onClick={() => removeMedia(index)}
                                      >
                                        <X className="h-3 w-3 text-white" />
                                      </Button>

                                      {media.type.startsWith("image") ? (
                                        <img
                                          src={media.preview}
                                          alt={`preview-${index}`}
                                          className="w-full h-full object-cover rounded-md"
                                        />
                                      ) : (
                                        <div className="relative w-full h-full">
                                          <video
                                            src={media.preview}
                                            className="w-full h-full object-cover rounded-md"
                                          />
                                          <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-black bg-opacity-50 rounded-full p-2">
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="white"
                                              >
                                                <path d="M8 5v14l11-7z" />
                                              </svg>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}

                                  <div
                                    className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md aspect-square cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                    onClick={handleFileClick}
                                  >
                                    <Plus className="h-8 w-8 text-gray-400" />
                                  </div>
                                </div>
                              </>
                            )}

                            <input
                              type="file"
                              accept="image/*,video/*"
                              className="hidden"
                              onChange={handleFileChange}
                              ref={fileInputRef}
                              multiple
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
                            onClick={() => setShowMediaUpload(!showMediaUpload)}
                          >
                            <ImageIcon className="h-4 w-4 text-green-500" />
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setShowMediaUpload(!showMediaUpload)}
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
                            disabled={
                              isLoading ||
                              (!postContent.trim() &&
                                mediaFiles.length === 0 &&
                                existingMedia.length === 0)
                            }
                          >
                            {isLoading ? "Updating..." : "Update"}
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
                    </div>
                  </ScrollArea>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditPostDialog;
