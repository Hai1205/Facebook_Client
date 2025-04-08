import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import AudioPlayer from "./components/AudioPlayer";
import { SidebarMenuAdmin } from "./components/SideBarMenuAdmin";
import { Header } from "./components/Header";
import { PlaybackControls } from "./components/PlaybackControls";

const AdminLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Track screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* Fixed Header */}
      <Header />

      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 flex h-full overflow-hidden p-2"
      >
        <AudioPlayer />

        {/* Left sidebar */}
        <ResizablePanel
          defaultSize={20}
          minSize={isMobile ? 0 : 10}
          maxSize={25}
          className="bg-zinc-900"
        >
          <SidebarMenuAdmin />
        </ResizablePanel>

        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

        {/* Main content */}
        <ResizablePanel defaultSize={isMobile ? 80 : 60}>
          <div className="h-full overflow-y-auto p-4">
            <Outlet />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Fixed Playback Controls at Bottom */}
      <PlaybackControls />
    </div>
  );
};

export default AdminLayout;
