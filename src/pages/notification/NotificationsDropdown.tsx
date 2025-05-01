import { useEffect, useState, useMemo } from "react";
import { NOTIFICATION } from "@/utils/interface";
import { useNotiStore } from "@/stores/useNotiStore";
import { useAuthStore } from "@/stores/useAuthStore";
import NotificationItem from "./NotificationItem";

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<NOTIFICATION[]>([]);
  const { getUserNotifications } = useNotiStore();
  const { userAuth } = useAuthStore();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (userAuth) {
        const notifications = await getUserNotifications(userAuth.id as string);
        setNotifications(notifications);
      }
    };

    fetchNotifications();
  }, [getUserNotifications, userAuth]);

  const hasNotifications = useMemo(
    () => notifications.length > 0,
    [notifications]
  );

  return (
    <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-50">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <button className="text-blue-500 text-sm hover:underline">
            Mark all as read
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {hasNotifications ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))
        ) : (
          <div className="p-3 text-center text-gray-400">
            No notifications yet
          </div>
        )}
      </div>

      {hasNotifications && (
        <div className="p-3 text-center border-t border-gray-700">
          <button className="text-blue-500 text-sm hover:underline">
            See all notifications
          </button>
        </div>
      )}
    </div>
  );
}
