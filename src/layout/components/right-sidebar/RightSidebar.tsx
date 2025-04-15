import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GroupConversationSection } from "./components/GroupConversationSection";
import { BirthdaySection } from "./components/BirthdaySection";
import { FriendRequestSection } from "./components/FriendRequestSection";
import { ContactSection } from "./components/ContactSection";

// Sample data for friend requests
const friendRequests = [
  {
    id: "1",
    fullName: "Alex Johnson",
    mutualFriends: 5,
    avatarPhotoUrl: "/placeholder.svg?height=40&width=40",
    time: "3d",
  },
  {
    id: "2",
    fullName: "Emma Wilson",
    mutualFriends: 2,
    avatarPhotoUrl: "/placeholder.svg?height=40&width=40",
    time: "1w",
  },
];

// Sample data for birthdays
const birthdays = [
  {
    id: "1",
    fullName: "Michael Brown",
    avatarPhotoUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    fullName: "Sophia Garcia",
    avatarPhotoUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    fullName: "Sophia Garcia",
    avatarPhotoUrl: "/placeholder.svg?height=40&width=40",
  },
];

// Sample data for contacts
const contacts = [
  {
    id: "1",
    fullName: "John Doe",
    avatarPhotoUrl: "/placeholder.svg?height=40&width=40",
    online: true,
    active: 0, // 0 means active now
  },
  {
    id: "2",
    fullName: "Jane Smith",
    avatarPhotoUrl: "/placeholder.svg?height=40&width=40",
    online: true,
    active: 5, // minutes
  },
  {
    id: "3",
    fullName: "Mike Johnson",
    avatarPhotoUrl: "/placeholder.svg?height=40&width=40",
    online: true,
    active: 15,
  },
  {
    id: "4",
    fullName: "Sarah Williams",
    avatarPhotoUrl: "/placeholder.svg?height=40&width=40",
    online: true,
    active: 0,
  },
  {
    id: "5",
    fullName: "David Brown",
    avatarPhotoUrl: "/placeholder.svg?height=40&width=40",
    online: true,
    active: 30,
  },
  {
    id: "6",
    fullName: "Emily Davis",
    avatarPhotoUrl: "/placeholder.svg?height=40&width=40",
    online: true,
    active: 0,
  },
  {
    id: "7",
    fullName: "Robert Wilson",
    avatarPhotoUrl: "/placeholder.svg?height=40&width=40",
    online: true,
    active: 10,
  },
];

// Sample data for group conversations
const groupConversations = [
  {
    id: "1",
    name: "Design Team",
    participants: 5,
    avatarPhotoUrl: "/placeholder.svg?height=40&width=40",
    active: true,
  },
  {
    id: "2",
    name: "Weekend Trip Planning",
    participants: 8,
    avatarPhotoUrl: "/placeholder.svg?height=40&width=40",
    active: false,
  },
  {
    id: "3",
    name: "Gaming Squad",
    participants: 4,
    avatarPhotoUrl: "/placeholder.svg?height=40&width=40",
    active: true,
  },
];

export default function RightSidebar() {
  const hasData =
    friendRequests.length > 0 ||
    birthdays.length > 0 ||
    contacts.length > 0 ||
    groupConversations.length > 0;

  const sections = [];

  if (friendRequests.length > 0) {
    sections.push({
      type: "friendRequests",
      content: <FriendRequestSection requests={friendRequests} />,
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
