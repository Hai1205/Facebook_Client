import { useState, useEffect } from "react";
import { Phone, Video, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCallStore } from "@/stores/useCallStore";

export function IncomingCallNotification() {
  const {
    isCallActive,
    isIncoming,
    callType,
    remoteUser,
    acceptCall,
    endCall,
    groupCall,
  } = useCallStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isCallActive && isIncoming && remoteUser) {
      setIsVisible(true);

      // Tự động ẩn thông báo sau 15 giây nếu không tương tác
      const timer = setTimeout(() => {
        setIsVisible(false);
        endCall();
        // toast({
        //   title: "Cuộc gọi nhỡ",
        //   description: `Bạn đã bỏ lỡ cuộc gọi từ ${remoteUser.name}`,
        //   variant: "destructive",
        // });
      }, 15000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isCallActive, isIncoming, remoteUser, endCall]);

  if (!isVisible || !remoteUser) {
    return null;
  }

  const handleAccept = () => {
    acceptCall();
    setIsVisible(false);
  };

  const handleDecline = () => {
    endCall();
    setIsVisible(false);
    // toast({
    //   title: "Cuộc gọi đã kết thúc",
    //   description: `Bạn đã từ chối cuộc gọi từ ${remoteUser.name}`,
    // });
  };

  return (
    <div className="fixed top-4 right-4 max-w-xs w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={remoteUser.avatarPhotoUrl || "/placeholder.svg"} />
              <AvatarFallback className="bg-blue-600">
                {remoteUser.fullName.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
          </div>

          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              {remoteUser.fullName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
              {groupCall ? "Cuộc gọi nhóm " : ""}
              {callType === "voice" ? "Cuộc gọi thoại" : "Cuộc gọi video"}{" "}
              đến...
            </p>
          </div>

          <button
            onClick={handleDecline}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex justify-center space-x-4">
          <Button
            onClick={handleDecline}
            variant="destructive"
            size="sm"
            className="flex items-center px-4"
          >
            <Phone className="h-4 w-4 mr-2 transform rotate-135" />
            Từ chối
          </Button>

          <Button
            onClick={handleAccept}
            variant="default"
            size="sm"
            className="flex items-center px-4 bg-green-600 hover:bg-green-700"
          >
            {callType === "voice" ? (
              <Phone className="h-4 w-4 mr-2" />
            ) : (
              <Video className="h-4 w-4 mr-2" />
            )}
            Trả lời
          </Button>
        </div>
      </div>
    </div>
  );
}
