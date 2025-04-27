import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import Header from "./components/navbar/Header";
import { PanelGroup } from "react-resizable-panels";
import MainContentPanel from "./components/MainContentPanel";
import MobileLayout from "./MobileLayout";
import RightSidebarPanel from "./components/right-sidebar/RightSidebarPanel";
import LeftSidebarPanel from "./components/left-sidebar/LeftSidebarPanel";

const Layout = () => {
  const { isAuth } = useAuthStore();
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
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <Header />

      <div className="flex-1 pt-16 h-[calc(100vh-64px)]">
        {!isMobile ? (
          <PanelGroup direction="horizontal" className="h-full">
            {isAuth && <LeftSidebarPanel />}
            
            <MainContentPanel />

            {isAuth && <RightSidebarPanel />}
          </PanelGroup>
        ) : (
          <MobileLayout />
        )}
      </div>
    </div>
  );
};

export default Layout;
