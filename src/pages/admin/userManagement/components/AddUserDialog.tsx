import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useUserStore } from "@/stores/useUserStore";
import { User } from "@/utils/types";
import LoadingSpinner from "@/components/ui/loading";
import { Save, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AddUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: (user: User) => void;
}

const AddUserDialog = ({
  isOpen,
  onOpenChange,
  onUserAdded,
}: AddUserDialogProps) => {
  const { isLoading, createUser } = useUserStore();

  const [avatar, setAvatar] = useState<File | null>(null);

  const [userData, setUserData] = useState({
    username: "",
    fullName: "",
    password: "",
    email: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
    role: "",
    avatar: "",
  });

  const createUserData = (field: keyof typeof userData, value: any) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateUser = async () => {
    setErrors({
      email: "",
      username: "",
      fullName: "",
      password: "",
      role: "",
      avatar: "",
    });

    let hasError = false;
    const newErrors = {
      email: "",
      username: "",
      fullName: "",
      password: "",
      role: "",
      avatar: "",
    };

    if (!avatar) {
      newErrors.avatar = "Avatar is required";
      hasError = true;
    }
    if (!userData.email.trim()) {
      newErrors.email = "Email is required";
      hasError = true;
    }
    if (!userData.username.trim()) {
      newErrors.username = "Username is required";
      hasError = true;
    }
    if (!userData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      hasError = true;
    }
    if (!userData.password.trim()) {
      newErrors.password = "Password is required";
      hasError = true;
    }
    if (!userData.role) {
      newErrors.role = "Role is required";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append("username", userData.username);
    formData.append("fullName", userData.fullName);
    formData.append("password", userData.password);
    formData.append("email", userData.email);
    formData.append("role", userData.role);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    const user = await createUser(formData);

    if (user) {
      onUserAdded(user);

      setUserData({
        username: "",
        fullName: "",
        password: "",
        email: "",
        role: "",
      });

      setAvatar(null);

      onOpenChange(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatar(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-[#121212]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>

          <DialogDescription>
            Create a new user account in the system.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center col-span-1 row-span-3">
            <div className="relative w-40 h-40 border border-gray-700 rounded-full overflow-hidden flex items-center justify-center bg-[#282828]">
              <Avatar className="rounded-full object-cover w-full h-full">
                <AvatarImage
                  src={
                    avatar ? URL.createObjectURL(avatar) : "/placeholder.svg"
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
            {errors.avatar && (
              <span className="text-sm text-red-500">{errors.avatar}</span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={userData?.email}
              onChange={(e) => createUserData("email", e.target.value)}
            />
            {errors.email && (
              <span className="text-sm text-red-500">{errors.email}</span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="username"
              placeholder="Enter username"
              value={userData?.username}
              onChange={(e) => createUserData("username", e.target.value)}
            />
            {errors.username && (
              <span className="text-sm text-red-500">{errors.username}</span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="fullName"
              placeholder="Enter full name"
              value={userData?.fullName}
              onChange={(e) => createUserData("fullName", e.target.value)}
            />
            {errors.fullName && (
              <span className="text-sm text-red-500">{errors.fullName}</span>
            )}

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={userData?.password}
                onChange={(e) => createUserData("password", e.target.value)}
              />
              {errors.password && (
                <span className="text-sm text-red-500">{errors.password}</span>
              )}
            </div>

            <Label htmlFor="role">Role</Label>
            <Select
              value={userData?.role}
              onValueChange={(value) => createUserData("role", value)}
            >
              <SelectTrigger id="role" className="cursor-pointer">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem
                  value="user"
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                >
                  User
                </SelectItem>
                <SelectItem
                  value="artist"
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                >
                  Artist
                </SelectItem>
                <SelectItem
                  value="admin"
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                >
                  Admin
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <span className="text-sm text-red-500">{errors.role}</span>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setUserData({
                username: "",
                fullName: "",
                password: "",
                email: "",
                role: "",
              });

              onOpenChange(false);
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleCreateUser}
            className="bg-[#1DB954] hover:bg-[#1ed760] text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
