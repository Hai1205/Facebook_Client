import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { USER } from "@/utils/interface";
import { useUserStore } from "@/stores/useUserStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingSpinner from "@/components/ui/loading";
import { Image, Save } from "lucide-react";

interface EditCoverPhotoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: USER | null;
}

const EditCoverPhotoDialog = ({
  isOpen,
  onOpenChange,
  user,
}: EditCoverPhotoDialogProps) => {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [previewCover, setPreviewCover] = useState<string>("");
  const { updateCoverPhoto } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCoverFile(null);
      setPreviewCover("");
    } else {
      setPreviewCover(user?.coverPhotoUrl as string);
    }
  }, [isOpen, user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setPreviewCover(URL.createObjectURL(file));
    }
  };

  const handleClose = () => {
    setCoverFile(null);
    setPreviewCover("");
    onOpenChange(false);
  };

  const handleSaveEdit = async () => {
    if (!user) {
      return;
    }

    const formData = new FormData();
    if (coverFile) {
      formData.append("coverPhoto", coverFile);
    }

    setIsLoading(true);
    const res = await updateCoverPhoto(user.id as string, formData);
    setIsLoading(false);

    if (!res) {
      return;
    }
  };

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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#121212] p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  Edit cover photo
                </Dialog.Title>

                <ScrollArea className="h-[25vh] pr-4 mt-4">
                  {user && (
                    <div className="grid gap-4">
                      {/* COVER */}
                      <div className="flex items-center justify-center col-span-1 row-span-3">
                        <div className="relative w-full h-40 overflow-hidden flex items-center justify-center bg-[#282828]">
                          <Avatar className="rounded-none object-cover w-full h-full">
                            <AvatarImage
                              src={
                                previewCover ? previewCover : "/placeholder.svg"
                              }
                              alt={user.fullName}
                            />
                            <AvatarFallback>
                              <Image className="h 20" />
                            </AvatarFallback>
                          </Avatar>

                          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="bg-blue-600 hover:bg-[#166FE5] text-white"
                              onClick={() =>
                                document.getElementById("avatar-input")?.click()
                              }
                            >
                              Change
                            </Button>

                            <input
                              id="avatar-input"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleAvatarChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </ScrollArea>

                {/* Footer */}
                <div className="mt-4 flex justify-end gap-2 pt-4 border-t border-gray-800">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="border-gray-700 text-white hover:bg-red-500 hover:text-white"
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleSaveEdit}
                    className="bg-blue-600 hover:bg-[#166FE5] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save
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

export default EditCoverPhotoDialog;
