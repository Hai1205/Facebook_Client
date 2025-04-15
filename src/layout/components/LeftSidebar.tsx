import {
  Home,
  LogOut,
  User,
  Users,
  Video,
  FolderLock,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/useAuthStore";
import { Separator } from "@/components/ui/separator";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const { userAuth, isAdmin, logout } = useAuthStore();

  const handleLogout = async () => {
    const result = await logout();
    if (result?.status == "success") {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col h-full text-white p-4">
      {/* Avatar at top */}
      <div className="ml-2 mb-6">
        <Avatar className="h-10 w-10">
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
      </div>

      {/* Main navigation */}
      <div className="flex flex-col space-y-1 flex-grow">
        {/* Phát triển xong thì tắt !isAdmin */}
        {!isAdmin && (
          <Link
            to="/admin-dashboard"
            className="flex items-center py-3 px-2 rounded-md hover:bg-gray-800"
          >
            <FolderLock className="h-6 w-6 mr-3" />
            <span className="text-sm font-medium">Admin Dashboard</span>
          </Link>
        )}

        <Link
          to="/"
          className="flex items-center py-3 px-2 rounded-md hover:bg-gray-800"
        >
          <Home className="h-6 w-6 mr-3" />
          <span className="text-sm font-medium">Home</span>
        </Link>

        <Link
          to="/friends-list"
          className="flex items-center py-3 px-2 rounded-md hover:bg-gray-800"
        >
          <Users className="h-6 w-6 mr-3" />
          <span className="text-sm font-medium">Friends</span>
        </Link>

        <Link
          to="/video-feed"
          className="flex items-center py-3 px-2 rounded-md hover:bg-gray-800"
        >
          <Video className="h-6 w-6 mr-3" />
          <span className="text-sm font-medium">Video</span>
        </Link>

        <Link
          to={`/profile/${userAuth?.id}`}
          className="flex items-center py-3 px-2 rounded-md hover:bg-gray-800"
        >
          <User className="h-6 w-6 mr-3" />
          <span className="text-sm font-medium">Profile</span>
        </Link>
      </div>

      {/* Footer with logout */}
      <div className="mt-auto">
        <Separator className="my-4" />

        <div className="flex items-center mb-2">
          <Avatar className="h-8 w-8 mr-2">
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
