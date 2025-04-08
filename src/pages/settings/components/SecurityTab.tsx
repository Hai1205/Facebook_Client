import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading";
import { Save } from "lucide-react";

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
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Manage your account security and authentication methods.
          </CardDescription>
        </CardHeader>

        <CardContent className="h-[280px] space-y-4">
          <div className="space-y-1">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={changePasswordData?.currentPassword || ""}
              onChange={(e) =>
                handleSecurityChange("currentPassword", e.target.value)
              }
              placeholder="Enter current password"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={changePasswordData?.newPassword || ""}
              onChange={(e) =>
                handleSecurityChange("newPassword", e.target.value)
              }
              placeholder="Enter new password"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={changePasswordData?.rePassword || ""}
              onChange={(e) =>
                handleSecurityChange("rePassword", e.target.value)
              }
              placeholder="Enter confirm password"
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleChangePassword}
            disabled={isAuthLoading}
            className="gap-1"
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
