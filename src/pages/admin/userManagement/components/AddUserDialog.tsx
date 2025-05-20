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
import { USER } from "@/utils/interface";
import LoadingSpinner from "@/components/ui/loading";
import { Save } from "lucide-react";
import { GENDER_CHOICE, ROLE_CHOICE } from "@/utils/choices";

interface AddUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: (user: USER) => void;
}

const AddUserDialog = ({
  isOpen,
  onOpenChange,
  onUserAdded,
}: AddUserDialogProps) => {
  const { isLoading, createUser } = useUserStore();

  const [formattedDate, setFormattedDate] = useState<string>("");

  const [userData, setUserData] = useState({
    fullName: "",
    password: "",
    email: "",
    role: "",
    gender: "",
    dateOfBirth: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    fullName: "",
    password: "",
    role: "",
    gender: "",
    dateOfBirth: "",
  });

  const createUserData = (field: keyof typeof userData, value: any) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChange = (field: keyof typeof userData, value: any) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateUser = async () => {
    setErrors({
      email: "",
      fullName: "",
      password: "",
      role: "",
      gender: "",
      dateOfBirth: "",
    });

    let hasError = false;
    const newErrors = {
      email: "",
      fullName: "",
      password: "",
      role: "",
      gender: "",
      dateOfBirth: "",
    };

    if (!userData.email.trim()) {
      newErrors.email = "Email is required";
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
    if (!userData.gender) {
      newErrors.gender = "Gender is required";
      hasError = true;
    }
    if (!userData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append("email", userData.email);
    formData.append("fullName", userData.fullName);
    formData.append("password", userData.password);
    formData.append("gender", userData.gender);
    formData.append("dateOfBirth", userData.dateOfBirth);
    formData.append("role", userData.role);

    const user = await createUser(formData);

    if (user) {
      onUserAdded(user);

      setUserData({
        fullName: "",
        password: "",
        email: "",
        role: "",
        gender: "",
        dateOfBirth: "",
      });

      setFormattedDate("");

      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-[#121212]">
        <DialogHeader>
          <DialogTitle>Add New USER</DialogTitle>

          <DialogDescription>
            Create a new user account in the system.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
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

            {/* Date of birth */}
            <div className="grid gap-2 mt-3">
              <Label htmlFor="edit-date-of-birth">Date of birth</Label>

              <Input
                id="edit-date-of-birth"
                type="date"
                name="date-of-birth"
                className="cursor-pointer"
                value={formattedDate}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setFormattedDate(newDate);
                  handleChange("dateOfBirth", newDate);
                }}
              />
            </div>

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
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      className="text-white cursor-pointer"
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Role */}
            <div className="grid gap-2 mt-3">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={userData?.role}
                onValueChange={(value) => handleChange("role", value)}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>

                <SelectContent>
                  {ROLE_CHOICE.map((item) => (
                    <SelectItem key={item.value} value={item.value} className="text-white cursor-pointer">
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setUserData({
                fullName: "",
                password: "",
                email: "",
                role: "",
                gender: "",
                dateOfBirth: "",
              });

              onOpenChange(false);
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleCreateUser}
            className="bg-[#1877F2] hover:bg-[#166FE5] text-white"
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
