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
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/utils/types";
import { useUserStore } from "@/stores/useUserStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { COUNTRY_CHOICE, STATUS_CHOICE } from "@/utils/tuple";
import LoadingSpinner from "@/components/ui/loading";
import { Save, UserIcon } from "lucide-react";

interface EditUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onUserUpdated: (updatedUser: User) => void;
}

const EditUserDialog = ({
  isOpen,
  onOpenChange,
  user,
  onUserUpdated,
}: EditUserDialogProps) => {
  const [userData, setUserData] = useState<User | null>(null);
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
      setPreviewAvatar(user?.avatarUrl || "");
    }
  }, [isOpen, user]);

  const handleChange = (field: keyof User, value: string) => {
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
      formData.append("country", userData.country);
      formData.append("biography", userData.biography || "");
      formData.append("website", userData.website || "");
      formData.append("instagram", userData.instagram || "");
      formData.append("twitter", userData.twitter || "");
      formData.append("facebook", userData.facebook || "");
      formData.append("youtube", userData.youtube || "");

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      setIsLoading(true);
      const res = await updateUser(user.id, formData);
      setIsLoading(false);

      if (!res) {
        return;
      }

      onUserUpdated({ ...user, ...userData });
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
                  Edit User
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
                              className="bg-[#1DB954] text-white hover:bg-[#1ed760]"
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
                              <SelectItem value="admin">Admin</SelectItem>

                              <SelectItem value="user">User</SelectItem>

                              <SelectItem value="artist">Artist</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Social Links */}
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-website">Website</Label>

                          <Input
                            id="edit-website"
                            value={userData.website || ""}
                            onChange={(e) =>
                              handleChange("website", e.target.value)
                            }
                            placeholder="https://example.com"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="edit-instagram">Instagram</Label>

                          <Input
                            id="edit-instagram"
                            value={userData.instagram || ""}
                            onChange={(e) =>
                              handleChange("instagram", e.target.value)
                            }
                            placeholder="Instagram username"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="edit-twitter">Twitter</Label>

                          <Input
                            id="edit-twitter"
                            value={userData.twitter || ""}
                            onChange={(e) =>
                              handleChange("twitter", e.target.value)
                            }
                            placeholder="Twitter username"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="edit-facebook">Facebook</Label>

                          <Input
                            id="edit-facebook"
                            value={userData.facebook || ""}
                            onChange={(e) =>
                              handleChange("facebook", e.target.value)
                            }
                            placeholder="Facebook username"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="edit-youtube">YouTube</Label>

                          <Input
                            id="edit-youtube"
                            value={userData.youtube || ""}
                            onChange={(e) =>
                              handleChange("youtube", e.target.value)
                            }
                            placeholder="YouTube channel"
                          />
                        </div>
                      </div>

                      {/* Country */}
                      <div className="grid gap-2">
                        <Label htmlFor="edit-country">Country</Label>

                        <Select
                          value={userData.country}
                          onValueChange={(value) =>
                            handleChange("country", value)
                          }
                        >
                          <SelectTrigger id="edit-country">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>

                          <SelectContent>
                            {COUNTRY_CHOICE.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Bio */}
                      <div className="grid gap-2">
                        <Label htmlFor="edit-biography">Bio</Label>

                        <Textarea
                          id="edit-biography"
                          value={userData.biography ?? ""}
                          onChange={(e) =>
                            handleChange("biography", e.target.value)
                          }
                          rows={3}
                        />
                      </div>
                    </div>
                  )}

                  {/* Status */}
                  <div className="grid gap-2">
                    <Label htmlFor="edit-country">Status</Label>

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
                    className="bg-[#1DB954] hover:bg-[#1ed760] text-white"
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
