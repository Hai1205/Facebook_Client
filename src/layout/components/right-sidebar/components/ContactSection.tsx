import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ContactSectionProps {
  contacts: {
    id: string;
    fullName: string;
    avatarPhotoUrl: string;
    online: boolean;
    active: number;
  }[];
}

export const ContactSection = ({ contacts }: ContactSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredContacts = contacts.filter((contact) =>
    contact.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-gray-400 font-semibold text-sm">Contacts</h3>

        <div className="flex space-x-2">
          {!isSearchOpen ? (
              <button
                className="text-gray-400 hover:bg-gray-800 p-1 rounded-full"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
              </button>
          ) : (
            <button
              className="text-gray-400 hover:bg-gray-800 p-1 rounded-full"
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {isSearchOpen && (
        <div className="mb-3">
          <Input
            type="text"
            placeholder="Search contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-800 border-gray-700 text-sm text-gray-200 focus:ring-blue-500 placeholder:text-gray-400"
          />
        </div>
      )}

      <div className="space-y-1">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
            >
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={contact.avatarPhotoUrl || "/placeholder.svg"}
                  />

                  <AvatarFallback className="bg-gray-600">
                    {contact.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {contact.online && (
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-gray-900" />
                )}
              </div>

              <div className="flex justify-between items-center flex-1">
                <span className="text-sm font-medium">{contact.fullName}</span>

                {contact.active === 0 ? (
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                ) : (
                  contact.active <= 10 && (
                    <span className="text-xs text-gray-400">
                      {contact.active}m
                    </span>
                  )
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-center py-2">
            No contact found
          </div>
        )}
      </div>
    </div>
  );
};
