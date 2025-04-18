import { Button } from "@/components/ui/button";
import { useCallStore } from "@/stores/useCallStore";
import { USER } from "@/utils/types";
import { CallButton } from "./CallButton";
import { mockUsers } from "@/utils/fakeData";

export function TestCallButton() {
  const { receiveCall } = useCallStore();

  const simulateIncomingCall = () => {
    receiveCall(mockUsers[1], Math.random() > 0.5 ? "video" : "voice");
  };

  return (
    <Button variant="outline" onClick={simulateIncomingCall}>
      Giả lập cuộc gọi đến
    </Button>
  );
}

interface UserCardProps {
  user: USER;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="flex items-center justify-between p-3 border-b">
      <div className="flex items-center space-x-3">{/* User info */}</div>

      <div className="flex items-center space-x-2">
        <CallButton user={user} type="voice" size="sm" />
        <CallButton user={user} type="video" size="sm" />
      </div>
    </div>
  );
}
