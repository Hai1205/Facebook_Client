import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import Header from "./components/navbar/Header";
import { PanelGroup } from "react-resizable-panels";
import MainContentPanel from "./components/MainContentPanel";
import MobileLayout from "./MobileLayout";
import RightSidebarPanel from "./components/right-sidebar/RightSidebarPanel";
import LeftSidebarPanel from "./components/left-sidebar/LeftSidebarPanel";
import notificationSocket from "@/utils/socket/NotificationSocketService";

const Layout = () => {
  const { isAuth, userAuth } = useAuthStore();
  const [isMobile, setIsMobile] = useState(false);
  const prevAuthState = useRef(isAuth);

  // Track screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Theo dõi thay đổi trạng thái đăng nhập để khởi tạo hoặc ngắt kết nối socket
  useEffect(() => {
    // Khi người dùng đăng nhập
    if (isAuth && userAuth?.id) {
      console.log("Khởi tạo kết nối socket cho người dùng:", userAuth.id);
      notificationSocket.init(userAuth.id);
    }
    // Khi người dùng đăng xuất (isAuth từ true sang false)
    else if (prevAuthState.current && !isAuth) {
      console.log("Ngắt kết nối socket do người dùng đăng xuất");
      notificationSocket.disconnect();
    }

    // Cập nhật giá trị của ref để theo dõi thay đổi trạng thái
    prevAuthState.current = isAuth;
  }, [isAuth, userAuth]);

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
