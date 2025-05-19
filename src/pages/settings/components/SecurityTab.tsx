import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading";
import { Save } from "lucide-react";
import PasswordInput from "@/pages/auth/components/PasswordInput";

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  rePassword: string;
}

interface SecurityTabProps {
  changePasswordData: ChangePasswordData;
  handleSecurityChange: (
    field: keyof ChangePasswordData,
    value: string
  ) => void;
  handleChangePassword: () => void;
  isAuthLoading: boolean;
}

const SecurityTab = ({
  changePasswordData,
  handleSecurityChange,
  handleChangePassword,
  isAuthLoading,
}: SecurityTabProps) => {
  return (
    <TabsContent value="security">
      <Card className="bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-white">Security Settings</CardTitle>
          <CardDescription>
            Manage your account security and authentication methods.
          </CardDescription>
        </CardHeader>

        <CardContent className="h-[366px] space-y-4">
          <PasswordInput
            label="Current Password"
            name="currentPassword"
            placeholder="Current Password"
            value={changePasswordData?.currentPassword || ""}
            onChange={(e) =>
              handleSecurityChange("currentPassword", e.target.value)
            }
          />

          <PasswordInput
            label="New Password"
            name="newPassword"
            placeholder="New Password"
            value={changePasswordData?.newPassword || ""}
            onChange={(e) =>
              handleSecurityChange("newPassword", e.target.value)
            }
          />

          <PasswordInput
            label="Confirm New Password"
            name="rePassword"
            placeholder="Confirm New Password"
            value={changePasswordData?.rePassword || ""}
            onChange={(e) =>
              handleSecurityChange("rePassword", e.target.value)
            }
          />
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleChangePassword}
            disabled={isAuthLoading}
            className="gap-1 text-white bg-blue-600 hover:bg-[#166FE5]"
          >
            {isAuthLoading ? (
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
        </CardFooter>
      </Card>
    </TabsContent>
  );
};

export default SecurityTab;
