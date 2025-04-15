import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";
import { USER } from "@/utils/types";
import {
  Bell,
  Home,
  LogOut,
  MessageCircle,
  Search,
  Users,
  Video,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NotificationsDropdown } from "@/layout/components/navbar/components/notification/NotificationsDropdown";
import { MessagesDropdown } from "@/layout/components/navbar/components/message/MessagesDropdown";
import { ChatWindow } from "@/layout/components/navbar/components/message/ChatWindow";
import Loader from "./components/Loader";

const Header = () => {
  const { userAuth, isAuth, logout } = useAuthStore();
  const { isLoading, getAllUser } = useUserStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<USER[]>([]);
  const [filterUsers, setFilterUsers] = useState<USER[]>([]);
  const [activeTab, setActiveTab] = useState("home");
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [activeChats, setActiveChats] = useState<
    { id: string; name: string; avatar: string }[]
  >([]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showMessages) setShowMessages(false);
  };

  const toggleMessages = () => {
    setShowMessages(!showMessages);
    if (showNotifications) setShowNotifications(false);
  };

  const startChat = (user: { id: string; name: string; avatar: string }) => {
    if (!activeChats.find((chat) => chat.id === user.id)) {
      setActiveChats([...activeChats, user]);
    }
    setShowMessages(false);
  };

  const closeChat = (userId: string) => {
    setActiveChats(activeChats.filter((chat) => chat.id !== userId));
  };

  const handleNavigation = (path: string, name: string) => {
    setActiveTab(name);
    navigate(path);
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      navigate("/user-login");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getAllUser();
      if (result) {
        setUsers(result);
      }
    };

    fetchUsers();
  }, [getAllUser]);

  useEffect(() => {
    if (searchQuery) {
      const filterUser = users.filter((user) => {
        return user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilterUsers(filterUser);
      setIsSearchOpen(true);
    } else {
      setFilterUsers([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery, users]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSearchOpen(false);
  };

  const handleUserClick = async (userId: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    navigate(`user-profile/${userId}`);
  };

  const handleSearchClose = (e: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
      setIsSearchOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleSearchClose);
    return () => {
      document.removeEventListener("click", handleSearchClose);
    };
  });

  const navItems = [
    { icon: Home, path: "/", name: "home" },
    { icon: Video, path: "/video-feed", name: "video" },
    ...(isAuth
      ? [{ icon: Users, path: "/friends-list", name: "friends" }]
      : []),
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <header className="bg-black border-b border-gray-800 text-white h-16 fixed top-0 left-0 right-0 z-50 flex items-center px-4">
      <div className="w-full flex justify-between items-center">
        {/* Left: Logo and Search */}
        <div className="flex items-center gap-4">
          {/* Facebook Logo */}
          <Link to="/">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl">
              f
            </div>
          </Link>

          {/* Search Bar */}
          <div className="relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  className="pl-10 w-56 md:w-72 h-10 bg-gray-800 border-none rounded-full text-sm"
                  placeholder="search facebook..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                />
              </div>

              {isSearchOpen && (
                <div className="absolute top-full left-0 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg mt-1 z-50">
                  <div className="p-2">
                    {filterUsers.length > 0 ? (
                      filterUsers.map((user) => (
                        <div
                          className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-md cursor-pointer"
                          key={user?.id}
                          onClick={() => handleUserClick(user?.id || "")}
                        >
                          <Avatar className="h-8 w-8">
                            {user?.avatarPhotoUrl ? (
                              <AvatarImage
                                src={user?.avatarPhotoUrl}
                                alt={user?.fullName}
                              />
                            ) : (
                              <AvatarFallback className="bg-gray-600">
                                {user?.fullName?.substring(0, 2) || "U"}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <span className="text-sm">{user?.fullName}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-400 text-sm">
                        No users found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Center: Navigation Icons (visible on desktop) */}
        <nav className="hidden md:flex items-center justify-center gap-40 absolute left-1/2 transform -translate-x-1/2">
          {navItems.map(({ icon: Icon, path, name }) => (
            <button
              key={name}
              className={`relative p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md ${
                activeTab === name ? "text-blue-500" : ""
              }`}
              onClick={() => handleNavigation(path, name)}
            >
              <Icon className="h-6 w-6" />
              {activeTab === name && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-md" />
              )}
            </button>
          ))}
        </nav>

        {/* Right: User Menu */}
        <div className="flex items-center gap-2">
          {isAuth ? (
            <>
              <div className="relative">
                <Button
                  onClick={toggleNotifications}
                  className={`rounded-full bg-gray-800 text-white hover:bg-gray-700 ${
                    showNotifications
                      ? "bg-blue-500/20 text-blue-500"
                      : "hover:bg-gray-700 text-gray-300"
                  }`}
                >
                  <Bell className="h-5 w-5" />
                </Button>
                {showNotifications && <NotificationsDropdown />}
              </div>

              <div className="relative">
                <Button
                  onClick={toggleMessages}
                  className={`rounded-full bg-gray-800 text-white hover:bg-gray-700 ${
                    showMessages
                      ? "bg-blue-500/20 text-blue-500"
                      : "hover:bg-gray-700 text-gray-300"
                  }`}
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
                {showMessages && <MessagesDropdown onChatStart={startChat} />}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full p-0"
                  >
                    <Avatar className="h-full w-full">
                      {userAuth?.avatarPhotoUrl ? (
                        <AvatarImage
                          src={userAuth?.avatarPhotoUrl}
                          alt={userAuth?.fullName}
                        />
                      ) : (
                        <AvatarFallback className="bg-gray-700">
                          {userAuth?.fullName?.substring(0, 2) || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-gray-800 text-white border-gray-700"
                >
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-gray-700" />

                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-gray-700"
                    onClick={() => navigate(`/profile/${userAuth?.id}`)}
                  >
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-gray-700"
                    onClick={() => navigate("/settings")}
                  >
                    Settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-gray-700" />

                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-gray-700"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/login">
              <Button
                variant="ghost"
                className="rounded-full bg-[#1877F2] text-white hover:bg-[#166FE5]"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Active chat windows */}
      <div className="fixed bottom-0 right-80 flex space-x-2 z-40">
        {activeChats.map((chat) => (
          <ChatWindow
            key={chat.id}
            user={chat}
            onClose={() => closeChat(chat.id)}
          />
        ))}
      </div>
    </header>
  );
};

export default Header;
