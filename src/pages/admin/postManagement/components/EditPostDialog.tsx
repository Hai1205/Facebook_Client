import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingSpinner from "@/components/ui/loading";
import { FileText, Save } from "lucide-react";
import { POST } from "@/utils/interface";
import { usePostStore } from "@/stores/usePostStore";

type EditAlbumDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  post: POST | null;
  onPostUpdated?: (updatedPost: POST) => void;
};

const EditAlbumDialog = ({
  isOpen,
  onOpenChange,
  post,
  onPostUpdated,
}: EditAlbumDialogProps) => {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [postData, setPostData] = useState({
    content: post?.content || "",
  });
  // const [posts, setPosts] = useState<POST[]>([]);

  const { updatePost } = usePostStore();

  // useEffect(() => {
  //   if (post) {
  //     setPostData({
  //       content: post.content,
  //     });
  //     setPosts(post.posts || []);
  //     setThumbnail(null);
  //   }
  // }, [post]);

  const handleChange = (field: keyof typeof postData, value: string) => {
    setPostData((prev) => ({ ...prev, [field]: value }));
  };

  if (!post) {
    return null;
  }

  const handleUpdatePost = async () => {
    const formData = new FormData();
    formData.append("content", postData.content || "");
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    // const songIds = posts.map((song) => song.id);
    // formData.append("songIds", JSON.stringify(songIds));

    setIsLoading(true);
    const res = await updatePost(post?.id as string, formData);
    setIsLoading(false);

    if (!res) {
      return;
    }

    if (onPostUpdated) {
      onPostUpdated({ ...post, ...postData });
    }

    handleClose();
  };

  const handleClose = () => {
    onOpenChange(false);
    setThumbnail(null);
  };

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnail(file);
    }
  };

  // const changePosts = (song: Song, isAdding: boolean) => {
  // const changePosts = (song: Song, isAdding: boolean) => {
  //   setPosts((prevSongs) => {
  //     if (isAdding) {
  //       return [...prevSongs, song];
  //     } else {
  //       return prevSongs.filter((s) => s.id !== song.id);
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
                  Edit Post
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-400">
                    Edit details for {post.user.fullName}`s post
                  </p>
                </div>

                <ScrollArea className="max-h-[70vh] mt-4">
                  <div className="grid gap-4 py-4 px-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-center col-span-1 row-span-3">
                        <div className="relative w-full h-40 border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center bg-[#282828]">
                          <div>
                            {/* <div className="font-medium">
                              {post.content.substring(0, 20)}...
                            </div>
                            <div className="text-sm text-muted-foreground">
                              by{" "}
                              {post.user
                                ? post.user.fullName
                                : "Unknown Artist"}
                            </div> */}
                            <FileText />
                          </div>

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

                      <Label htmlFor="edit-post-content" className="text-white">
                        Post content
                      </Label>

                      <Input
                        id="edit-post-content"
                        value={postData.content}
                        onChange={(e) =>
                          handleChange("content", e.target.value)
                        }
                        className="bg-[#282828] text-white border-gray-700 focus:border-[#1DB954] focus:ring-[#1DB954]"
                      />
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
                    onClick={handleUpdatePost}
                    className="bg-[#1DB954] hover:bg-[#1ed760] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Update
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

export default EditAlbumDialog;
