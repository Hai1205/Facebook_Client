import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GroupConversationSectionProps {
  groups: {
    id: string;
    name: string;
    participants: number;
    avatarPhotoUrl: string;
    active: boolean;
  }[];
}

export const GroupConversationSection = ({
  groups,
}: GroupConversationSectionProps) => (
  <div>
    <h3 className="text-gray-400 font-semibold text-sm mb-3">
      Group Conversations
    </h3>

    <div className="space-y-1">
      {groups.map((group) => (
        <div
          key={group.id}
          className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={group.avatarPhotoUrl || "/placeholder.svg"} />

            <AvatarFallback className="bg-zinc-800">
              {group.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex justify-between items-center flex-1">
            <span className="text-sm font-medium">{group.name}</span>
            {group.active && (
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);
