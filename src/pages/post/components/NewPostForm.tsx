import { Card, CardContent } from "@/components/ui/card";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ImageIcon, Laugh, Plus, Video, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { usePostStore } from "@/stores/usePostStore";
import { useAuthStore } from "@/stores/useAuthStore";
import Picker from "emoji-picker-react";

interface NewPostFormProps {
  isPostFormOpen: boolean;
  setIsPostFormOpen: (value: boolean) => void;
}

const NewPostForm = ({
  isPostFormOpen,
  setIsPostFormOpen,
}: NewPostFormProps) => {
  const { userAuth } = useAuthStore();
  const { isLoading, createPost } = usePostStore();

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState("");
  const [showImageUpload, setShowImageUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      formData.append("media", selectedFile);
    }
    const result = await createPost(userAuth?.id, formData);

    if (result) {
      setPostContent("");
      setSelectedFile(null);
      setFilePreview(null);
      setIsPostFormOpen(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <Avatar>
            {userAuth?.avatarPhotoUrl ? (
              <AvatarImage
                src={userAuth?.avatarPhotoUrl}
                alt={userAuth?.username}
              />
            ) : (
              <AvatarFallback className="dark:bg-gray-400">
                {userAuth?.username?.substring(0, 2)}
              </AvatarFallback>
            )}
          </Avatar>

          <Dialog open={isPostFormOpen} onOpenChange={setIsPostFormOpen}>
            <DialogTrigger className="w-full">
              <Input
                placeholder={`what's on your mind, ${userAuth?.username}`}
                readOnly
                className="cursor-pointer rounded-full h-12  dark:bg-[rgb(58,59,60)] placeholder:text-gray-500 dark:placeholder:text-gray-400  "
              />
              <Separator className="my-2 dark:bg-slate-400" />

              <div className="flex justify-between ">
                <Button
                  variant="ghost"
                  className="flex items-center justify-center"
                >
                  <ImageIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="dark:text-slate-100">Photo</span>
                </Button>

                <Button
                  variant="ghost"
                  className="flex items-center justify-center"
                >
                  <Video className="h-5 w-5 text-red-500 mr-2" />
                  <span className="dark:text-slate-100">Video</span>
                </Button>

                <Button
                  variant="ghost"
                  className="flex items-center justify-center"
                >
                  <Laugh className="h-5 w-5 text-orange-500 mr-2" />

                  <span className="dark:text-slate-100">Feelings</span>
                </Button>
              </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-center">Create Post</DialogTitle>
              </DialogHeader>

              <Separator />

              <div className="flex items-center space-x-3 py-4">
                <Avatar className="h-10 w-10">
                  {userAuth?.avatarPhotoUrl ? (
                    <AvatarImage
                      src={userAuth?.avatarPhotoUrl}
                      alt={userAuth?.username}
                    />
                  ) : (
                    <AvatarFallback>
                      {userAuth?.username?.substring(0, 2)}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div>
                  <p className="font-semibold">{userAuth?.username}</p>
                </div>
              </div>

              <Textarea
                placeholder={`what's on your mind? ${userAuth?.username}`}
                className="min-h-[100px] text-lg"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />

              <AnimatePresence>
                {(showImageUpload || filePreview) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative mt-4 border-2 border-dashed  border-gray-300 rounded-lg p-8 flex  flex-col items-center justify-center "
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setShowImageUpload(false);
                        setSelectedFile(null);
                        setFilePreview(null);
                      }}
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

                        <p className="text-center  text-gray-500 ">
                          Add Photos/Videos
                        </p>
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

              <div className="bg-gray-200 dark:bg-muted p-4 rounded-lg mt-4 ">
                <p className="font-semibold mb-2">Add Your Post</p>

                <div className="flex space-x-2 ">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowImageUpload(!showImageUpload)}
                  >
                    <ImageIcon className="h-4 w-4 text-green-500 " />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowImageUpload(!showImageUpload)}
                  >
                    <Video className="h-4 w-4 text-red-500 " />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Laugh className="h-4 w-4 text-orange-500 " />
                  </Button>
                </div>
              </div>

              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="relative"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => setShowEmojiPicker(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Picker onEmojiClick={handleEmojiClick} />
                </motion.div>
              )}
              <div className="flex justify-end mt-4">
                <Button className="bg-blue-500 text-white" onClick={handlePost}>
                  {isLoading ? "Saving..." : "Post"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewPostForm;
