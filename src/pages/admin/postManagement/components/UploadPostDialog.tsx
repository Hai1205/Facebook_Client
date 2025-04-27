import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingSpinner from "@/components/ui/loading";
import { Disc, Save } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/useAuthStore";
import { POST } from "@/utils/interface";
import { usePostStore } from "@/stores/usePostStore";

type UploadPostDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPostUploaded: (updatedPost: POST) => void;
};

const UploadPostDialog = ({
  isOpen,
  onOpenChange,
  onPostUploaded,
}: UploadPostDialogProps) => {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [postData, setPostData] = useState({
    title: "",
  });
  const [posts, setPosts] = useState<POST[]>([]);

  const { createPost } = usePostStore();
  const { userAuth } = useAuthStore();

  // const handleChange = (field: keyof typeof postData, value: string) => {
  //   setPostData((prev) => ({ ...prev, [field]: value }));
  // };

  const handleUploadPost = async () => {
    if (!userAuth) {
      return;
    }

    const formData = new FormData();
    formData.append("title", postData.title || "");
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    const songIds = posts.map((post) => post.id);
    formData.append("songIds", JSON.stringify(songIds));

    setIsLoading(true);
    const res = await createPost(userAuth?.id as string, formData);
    setIsLoading(false);

    if (!res) {
      return;
    }

    onPostUploaded(res);
    handleClose();
  };

  const handleClose = () => {
    onOpenChange(false);
    setThumbnail(null);
    setPosts([]);
    setPostData({
      title: "",
    });
  };

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnail(file);
    }
  };

  // const changePosts = (post: POST, isAdding: boolean) => {
  //   setPosts((prevPosts) => {
  //     if (isAdding) {
  //       return [...prevPosts, post];
  //     } else {
  //       return prevPosts.filter((p) => p.id !== post.id);
  //     }
  //   });
  // };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-[600px] transform overflow-hidden rounded-2xl bg-[#121212] p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  Upload A New Post
                </Dialog.Title>

                <ScrollArea className="max-h-[70vh] mt-4">
                  <div className="grid gap-4 py-4 px-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-center col-span-1 row-span-3">
                        <div className="relative w-full h-40 border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center bg-[#282828]">
                          <Avatar className="rounded-md object-cover w-full h-full">
                            <AvatarImage
                              src={
                                thumbnail
                                  ? URL.createObjectURL(thumbnail)
                                  : "/placeholder.svg"
                              }
                              alt={thumbnail?.name || ""}
                            />

                            <AvatarFallback className="absolute inset-0 flex items-center justify-center text-8xl font-bold !rounded-none">
                              <Disc className="h-10 w-10" />
                            </AvatarFallback>
                          </Avatar>

                          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="bg-[#1DB954] text-white hover:bg-[#1ed760]"
                              onClick={() =>
                                document
                                  .getElementById("thumbnail-input")
                                  ?.click()
                              }
                            >
                              Change
                            </Button>

                            <input
                              id="thumbnail-input"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleThumbnailChange}
                            />
                          </div>
                        </div>
                      </div>

                      <Label htmlFor="edit-album-title" className="text-white">
                        Post content
                      </Label>
                    </div>
                  </div>
                </ScrollArea>

                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="border-gray-700 text-white hover:bg-red-500 hover:text-white"
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleUploadPost}
                    className="bg-[#1DB954] hover:bg-[#1ed760] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UploadPostDialog;
