import { useLocation, useNavigate } from "react-router-dom";
import { BarChart3, Users, Music, Disc3, FileUser } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SidebarMenuAdmin() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: any) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 py-2 mt-2">
        <h2 className="text-xs font-semibold text-muted-foreground">MENU</h2>
      </div>

      <nav className="grid gap-1 px-2 group">
        <Button
          variant={
            isActive("/admin") && !isActive("/admin/search")
              ? "secondary"
              : "ghost"
          }
          className="justify-start gap-2 h-10"
          onClick={() => navigate("/admin")}
        >
          <BarChart3 className="h-4 w-4" />
          Dashboard
        </Button>

        <Button
          variant={isActive("/admin/user-management") ? "secondary" : "ghost"}
          className="justify-start gap-2 h-10"
          onClick={() => navigate("/admin/user-management")}
        >
          <Users className="h-4 w-4" />
          Users
        </Button>

        <Button
          variant={isActive("/admin/album-management") ? "secondary" : "ghost"}
          className="justify-start gap-2 h-10"
          onClick={() => navigate("/admin/album-management")}
        >
          <Disc3 className="h-4 w-4" />
          Albums
        </Button>

        <Button
          variant={isActive("/admin/song-management") ? "secondary" : "ghost"}
          className="justify-start gap-2 h-10"
          onClick={() => navigate("/admin/song-management")}
        >
          <Music className="h-4 w-4" />
          Songs
        </Button>

        <Button
          variant={
            isActive("/admin/artist-application-management")
              ? "secondary"
              : "ghost"
          }
          className="justify-start gap-2 h-10"
          onClick={() => navigate("/admin/artist-application-management")}
        >
          <FileUser className="h-4 w-4" />
          Artist Applications
        </Button>
      </nav>
    </div>
  );
}
