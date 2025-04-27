import { useEffect, useState } from "react";
import { mockFriendRequests } from "@/utils/fakeData";
import { FRIEND_REQUEST } from "@/utils/interface";
import FriendRequestCard from "./components/FriendRequestCard";

export default function FriendRequests() {
  const [friendRequests, setFriendRequests] = useState<FRIEND_REQUEST[]>([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      setFriendRequests(mockFriendRequests);
    };

    fetchFriendRequests();
  }, []);

  const handleAccept = (id: string) => {
    setFriendRequests(friendRequests.filter((request) => request.id !== id));
  };

  const handleDelete = (id: string) => {
    setFriendRequests(friendRequests.filter((request) => request.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-lg font-semibold mb-4">Friend Requests</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {friendRequests.map((request) => (
            <FriendRequestCard
              key={request.id}
              request={request}
              onAccept={handleAccept}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
