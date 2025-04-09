import {
  Bell,
  Home,
  LogOut,
  MessageCircle,
  User,
  Users,
  Video,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/useAuthStore";
import { useOpenStore } from "@/stores/useOpenStore";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const { isSidebarOpen } = useOpenStore();
  const { userAuth, logout } = useAuthStore();

  // const handleNavigation = (path: string) => {
  //   navigate(path);
  //   if (isSidebarOpen) {
  //     toggleSidebar();
  //   }
  // };

  const handleLogout = async () => {
    const result = await logout();
    if (result?.status == "success") {
      navigate("/user-login");
    }
  };

  return (
    <aside
      className={`fixed top-16 left-0 h-full w-64 p-4 transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col z-50 md:z-0 ${
        isSidebarOpen
          ? "translate-x-0 bg-white dark:bg-[rgb(36,37,38)] shadow-lg "
          : " -translate-x-full"
      } ${isSidebarOpen ? "md:hidden" : ""} md:bg-transparent md:shadow-none`}
    >
      <div className="flex flex-col h-full overflow-y-auto">
        {/* navigation menu */}
        <nav className="space-y-4 flex-grow">
          <div className="flex items-center space-x-2 cursor-pointer ">
            <Link to={`/user-profile/${userAuth?.id}`}>
              <Avatar className="h-10 w-10">
                {userAuth?.avatarPhotoUrl ? (
                  <AvatarImage
                    src={userAuth?.avatarPhotoUrl}
                    alt={userAuth?.username}
                  />
                ) : (
                  <AvatarFallback className="dark:bg-gray-400">
                    {userAuth?.fullName.substring(0, 2)}
                  </AvatarFallback>
                )}
              </Avatar>
            </Link>
            <span className="font-semibold">{userAuth?.username}</span>
          </div>
          <Button variant="ghost" className="full justify-start">
            <Link to={"/"}>
              <Home className="mr-4" /> Home
            </Link>
          </Button>
          <Button variant="ghost" className="full justify-start">
            <Link to={"/friends-list"}>
              <Users className="mr-4" /> Friends
            </Link>
          </Button>
          <Button variant="ghost" className="full justify-start">
            <Link to={"/video-feed"}>
              <Video className="mr-4" /> Video
            </Link>
          </Button>
          <Button variant="ghost" className="full justify-start">
            <Link to={`/user-profile/${userAuth?.id}`}>
              <User className="mr-4" /> Profile
            </Link>
          </Button>
          <Button variant="ghost" className="full justify-start">
            <MessageCircle className="mr-4" /> Messages
          </Button>

          <Button variant="ghost" className="full justify-start">
            <Bell className="mr-4" /> Notification
          </Button>
        </nav>

        {/* footer section */}
        <div className="mb-16">
          <Separator className="my-4" />
          <div className="flex items-center space-x-2 mb-4 cursor-pointer ">
            <Link to={`/user-profile/${userAuth?.id}`}>
              <Avatar className="h-10 w-10">
                {userAuth?.avatarPhotoUrl ? (
                  <AvatarImage
                    src={userAuth?.avatarPhotoUrl}
                    alt={userAuth?.username}
                  />
                ) : (
                  <AvatarFallback className="dark:bg-gray-400">
                    {userAuth?.fullName.substring(0, 2)}
                  </AvatarFallback>
                )}
              </Avatar>
            </Link>

            <span className="font-semibold">{userAuth?.username}</span>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <Button
              variant="ghost"
              className="cursor-pointer -ml-4 "
              onClick={handleLogout}
            >
              <LogOut /> <span className="ml-2 font-bold text-md">Logout</span>
            </Button>

            <p>Privacy · Terms · Advertising ·</p>

            <p>· Meta © {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LeftSideBar;
