import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USER } from "@/utils/interface";
import { useUserStore } from "@/stores/useUserStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingSpinner from "@/components/ui/loading";
import { Image, Save, UserIcon } from "lucide-react";
import { GENDER_CHOICE, ROLE_CHOICE, STATUS_CHOICE } from "@/utils/choices";

interface EditUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: USER | null;
  onUserUpdated?: (updatedUser: USER) => void;
}

const EditUserDialog = ({
  isOpen,
  onOpenChange,
  user,
  onUserUpdated,
}: EditUserDialogProps) => {
  const [userData, setUserData] = useState<USER | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string>("");
  const { updateUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setUserData(null);
      setAvatarFile(null);
      setPreviewAvatar("");
    } else {
      setUserData(user);
      setPreviewAvatar(user?.avatarPhotoUrl || "");
    }
  }, [isOpen, user]);

  const handleChange = (field: keyof USER, value: string) => {
    setUserData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleClose = () => {
    setUserData(null);
    setAvatarFile(null);
    setPreviewAvatar("");
    onOpenChange(false);
  };

  const handleSaveEdit = async () => {
    if (userData && user) {
      const formData = new FormData();
      formData.append("fullName", userData.fullName);
      formData.append("role", userData.role);
      formData.append("status", userData.status);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      setIsLoading(true);
      const res = await updateUser(user.id as string, formData);
      setIsLoading(false);

      if (!res) {
        return;
      }

      if (onUserUpdated) {
        onUserUpdated({ ...user, ...userData });
      }
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
                  Edit USER
                </Dialog.Title>

                <ScrollArea className="h-[60vh] pr-4 mt-4">
                  {userData && (
                    <div className="grid gap-4">
                      {/* Avatar */}
                      <div className="flex items-center justify-center col-span-1 row-span-3">
                        <div className="relative w-40 h-40 border border-gray-700 rounded-full overflow-hidden flex items-center justify-center bg-[#282828]">
                          <Avatar className="rounded-full object-cover w-full h-full">
                            <AvatarImage
                              src={
                                previewAvatar
                                  ? previewAvatar
                                  : "/placeholder.svg"
                              }
                              alt={userData.fullName}
                            />
                            <AvatarFallback>
                              <UserIcon />
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

                      {/* COVER */}
                      <div className="flex items-center justify-center col-span-1 row-span-3">
                        <div className="relative w-full h-40 overflow-hidden flex items-center justify-center bg-[#282828]">
                          <Avatar className="rounded-none object-cover w-full h-full">
                            <AvatarImage
                              src={
                                previewAvatar
                                  ? previewAvatar
                                  : "/placeholder.svg"
                              }
                              alt={userData.fullName}
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

                      {/* Name & Role */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-fullName">Full Name</Label>

                          <Input
                            id="edit-fullName"
                            value={userData.fullName}
                            onChange={(e) =>
                              handleChange("fullName", e.target.value)
                            }
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="edit-role">Role</Label>

                          <Select
                            value={userData.role}
                            onValueChange={(value) =>
                              handleChange("role", value)
                            }
                          >
                            <SelectTrigger id="edit-role">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>

                            <SelectContent>
                              {ROLE_CHOICE.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gender */}
                  <div className="grid gap-2 mt-3">
                    <Label htmlFor="edit-gender">Gender</Label>

                    <Select
                      value={userData?.gender}
                      onValueChange={(value) => handleChange("gender", value)}
                    >
                      <SelectTrigger id="edit-gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>

                      <SelectContent>
                        {GENDER_CHOICE.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status */}
                  <div className="grid gap-2 mt-3">
                    <Label htmlFor="edit-status">Status</Label>

                    <Select
                      value={userData?.status}
                      onValueChange={(value) => handleChange("status", value)}
                    >
                      <SelectTrigger id="edit-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>

                      <SelectContent>
                        {STATUS_CHOICE.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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

export default EditUserDialog;
