import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Users } from "lucide-react";
import FriendRequestTab from "./components/tabs/FriendRequestTab";
import FriendSuggestTab from "./components/tabs/FriendSuggestTab";
import { useNavigate, useLocation, useParams } from "react-router-dom";

export default function FriendPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tab } = useParams();

  const activeTab = tab === "suggestions" ? "suggestions" : "requests";

  useEffect(() => {
    if (
      tab !== "suggestions" &&
      tab !== "requests" &&
      location.pathname !== "/friends/requests"
    ) {
      navigate("/friends/requests", { replace: true });
    }
  }, [tab, location.pathname, navigate]);

  const handleTabChange = (value: string) => {
    navigate(`/friends/${value}`);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-900 dark:text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <Tabs
          defaultValue="requests"
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Friends</h1>
            <TabsList className="grid grid-cols-2 w-auto">
              <TabsTrigger value="requests" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                <span>Friend Requests</span>
              </TabsTrigger>

              <TabsTrigger
                value="suggestions"
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>People you may know</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="requests" className="mt-2">
            <FriendRequestTab />
          </TabsContent>

          <TabsContent value="suggestions" className="mt-2">
            <FriendSuggestTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}