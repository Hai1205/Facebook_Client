import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FriendRequestSection } from "./FriendRequestSection";
import { BirthdaySection } from "./BirthdaySection";
import { ContactSection } from "./ContactSection";
import { GroupConversationSection } from "./GroupConversationSection";
import {
  mockGroupConversations,
  mockFriendRequests,
  mockUsers,
} from "@/utils/fakeData";
import { useEffect, useState } from "react";
import { FRIEND_REQUEST, USER } from "@/utils/types";
import { getUsersWithBirthdayToday } from "@/lib/utils";

export default function RightSidebar() {
  const [friendRequests, setFriendRequests] = useState<FRIEND_REQUEST[]>([]);
  const [birthdays, setBirthdays] = useState<USER[]>([]);
  const [contacts, setContacts] = useState<USER[]>([]);
  const [groupConversations, setGroupConversations] = useState<
    {
      id: string;
      name: string;
      participants: number;
      avatarPhotoUrl: string;
      active: boolean;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      setFriendRequests(mockFriendRequests.slice(0, 2));
      setBirthdays(getUsersWithBirthdayToday(mockUsers));
      setContacts(mockUsers);
      setGroupConversations(mockGroupConversations);
    };

    fetchData();
  }, []);

  const handleAccept = (id: string) => {
    setFriendRequests(friendRequests.filter((request) => request.id !== id));
  };

  const handleDelete = (id: string) => {
    setFriendRequests(friendRequests.filter((request) => request.id !== id));
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
