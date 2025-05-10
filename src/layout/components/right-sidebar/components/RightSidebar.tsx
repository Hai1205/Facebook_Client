import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FriendRequestSection } from "./sections/FriendRequestSection";
import { BirthdaySection } from "./sections/BirthdaySection";
import { GroupConversationSection } from "./sections/GroupConversationSection";
import { ContactSection } from "./sections/ContactSection";
import { mockGroupConversations } from "@/utils/fakeData";
import { useCallback, useEffect, useState } from "react";
import { FRIEND_REQUEST, GROUP_CONVERSATION, USER } from "@/utils/interface";
import { getUsersWithBirthdayToday } from "@/lib/utils";
import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { RESPOND_STATUS } from "@/utils/types";

export default function RightSidebar() {
  const { responseFriendRequest, getUserFriendsRequests } = useUserStore();
  const { userAuth } = useAuthStore();

  const [friendRequests, setFriendRequests] = useState<FRIEND_REQUEST[]>([]);
  const [birthdays, setBirthdays] = useState<USER[]>([]);
  const [contacts, setContacts] = useState<USER[]>([]);
  const [groupConversations, setGroupConversations] = useState<
    GROUP_CONVERSATION[]
  >([]);

  const fetchUserFriendsRequests = useCallback(async () => {
    const res = await getUserFriendsRequests(userAuth?.id as string);

    if (res) {
      setFriendRequests(res.slice(0, 2));
    }
  }, [getUserFriendsRequests, userAuth]);

  useEffect(() => {
    const fetchData = async () => {
      fetchUserFriendsRequests();
      setBirthdays(getUsersWithBirthdayToday(userAuth?.friends as USER[]));
      setContacts(userAuth?.friends as USER[]);
      setGroupConversations(mockGroupConversations);
    };

    fetchData();
  }, [fetchUserFriendsRequests, userAuth]);

  const handleRespondRequest = useCallback(
    async (status: RESPOND_STATUS, targetUserId: string) => {
      const formData = new FormData();
      formData.append("status", status);

      await responseFriendRequest(
        userAuth?.id as string,
        targetUserId,
        formData
      );
    },
    [responseFriendRequest, userAuth]
  );

  const handleAccept = async (FR: FRIEND_REQUEST) => {
    setFriendRequests(friendRequests.filter((request) => request.id !== FR?.id));
    await handleRespondRequest("ACCEPT", FR?.from?.id as string);
  };

  const handleDelete = async (FR: FRIEND_REQUEST) => {
    setFriendRequests(friendRequests.filter((request) => request.id !== FR?.id));
    await handleRespondRequest("REJECT", FR?.from?.id as string);
  };

  const hasData =
    friendRequests.length > 0 ||
    birthdays.length > 0 ||
    contacts.length > 0 ||
    groupConversations.length > 0;

  const sections = [];

  if (friendRequests.length > 0) {
    sections.push({
      type: "friendRequests",
      content: (
        <FriendRequestSection
          requests={friendRequests}
          onAccept={handleAccept}
          onDelete={handleDelete}
        />
      ),
    });
  }

  if (birthdays.length > 0) {
    sections.push({
      type: "birthdays",
      content: <BirthdaySection birthdays={birthdays} />,
    });
  }

  if (contacts.length > 0) {
    sections.push({
      type: "contacts",
      content: <ContactSection contacts={contacts} />,
    });
  }

  if (groupConversations.length > 0) {
    sections.push({
      type: "groupConversations",
      content: <GroupConversationSection groups={groupConversations} />,
    });
  }

  return (
    <ScrollArea className="h-[89vh] overflow-hidden flex-1 p-3 space-y-3">
      <div className="p-4 space-y-6">
        {hasData ? (
          <>
            {sections.map((section, index) => (
              <div key={section.type}>
                {index > 0 && <Separator className="bg-gray-800 mb-6" />}

                {section.content}
              </div>
            ))}
          </>
        ) : (
          <div className="text-gray-400 text-center">No data</div>
        )}
      </div>
    </ScrollArea>
  );
}
