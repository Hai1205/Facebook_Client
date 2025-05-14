import { useMemo } from "react";
import { useNotiStore } from "@/stores/useNotiStore";
import NotificationItem from "./NotificationItem";
import { ScrollArea } from "@/components/ui/scroll-area";
export function NotificationsDropdown() {
  const { notifications } = useNotiStore();

  const hasNotifications = useMemo(
    () => notifications.length > 0,
    [notifications]
  );

  return (
    <div className="absolute right-0 mt-2 w-80 bg-zinc-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-50">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Notifications</h3>
        </div>
      </div>

      <ScrollArea className="h-[300px]">
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
      </ScrollArea>
    </div>
  );
}
