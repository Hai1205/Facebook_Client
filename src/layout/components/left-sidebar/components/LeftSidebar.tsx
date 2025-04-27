import {
  Home,
  LogOut,
  Users,
  Video,
  FolderLock,
  BarChart3,
  Flag,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/useAuthStore";
import { Separator } from "@/components/ui/separator";
import { useOpenStore } from "@/stores/useOpenStore";
import { useEffect, useState } from "react";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const { userAuth, isAdmin, isAuth, logout } = useAuthStore();
  const { setActiveTab } = useOpenStore();

  const [nav, setNav] = useState<any[]>([]);

  const isAdminUrl = window.location.pathname.includes("/admin");

  useEffect(() => {
    const navItems = [
      { icon: Home, path: "/", name: "Home" },
      ...(isAdmin
        ? [
            {
              icon: FolderLock,
              path: "/admin/dashboard",
              name: "Admin Dashboard",
            },
          ]
        : []),
      { icon: Video, path: "/video-feed", name: "Video" },
      ...(isAuth
        ? [{ icon: Users, path: "/friend-requests", name: "Friends" }]
        : []),
    ];

    const navAdminItems = [
      { icon: BarChart3, path: "/admin/dashboard", name: "Dashboard" },
      { icon: Users, path: "/admin/user-management", name: "User Management" },
      {
        icon: FileText,
        path: "/admin/post-management",
        name: "Post Management",
      },
      {
        icon: Flag,
        path: "/admin/report-management",
        name: "Report Management",
      },
    ];

    if (isAdmin && isAdminUrl) {
      setNav(navAdminItems);
    } else {
      setNav(navItems);
    }
  }, [isAdmin, isAdminUrl, isAuth]);

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      handleNavigation("/login", "login");
    }
  };

  const handleNavigation = (path: string, name: string) => {
    navigate(path);
    if (!isAdminUrl) {
      setActiveTab(name);
    }
  };

  return (
    <div className="flex flex-col h-full text-white p-4">
      {/* Avatar at top */}
      <div className="ml-2 mb-6 flex items-center gap-2">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={userAuth?.avatarPhotoUrl}
            alt={userAuth?.fullName}
          />

          <AvatarFallback className="bg-gray-700">
            {userAuth?.fullName?.substring(0, 2) || "U"}
            {/* <User className="h-5 w-5" /> */}
          </AvatarFallback>
        </Avatar>

        <span className="text-sm">{userAuth?.fullName || "User"}</span>
      </div>

      {/* Main navigation */}
      <div className="flex flex-col space-y-1 flex-grow gap-4">
        {nav.map(({ icon: Icon, path, name }) => (
          <button
            key={name}
            className={`flex items-center p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md`}
            onClick={() => handleNavigation(path, name)}
          >
            <Icon className="h-6 w-6 mr-2" />
            <span className="text-sm">{name}</span>
          </button>
        ))}
      </div>

      {/* Footer with logout */}
      <div className="mt-auto">
        <Separator className="my-4" />

        <div className="flex items-center mb-2">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage
              src={userAuth?.avatarPhotoUrl}
              alt={userAuth?.fullName}
            />

            <AvatarFallback className="bg-gray-700">
              {userAuth?.fullName?.substring(0, 2) || "U"}
            </AvatarFallback>
          </Avatar>

          <span className="text-sm">{userAuth?.fullName || "User"}</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center py-2 px-2 w-full rounded-md hover:bg-gray-800"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span className="text-sm font-medium">Logout</span>
        </button>

        <div className="text-xs text-gray-400 mt-4">
          <p>Privacy · Terms · Advertising</p>
          <p>· Meta © {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
