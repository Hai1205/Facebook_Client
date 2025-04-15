import { Outlet } from "react-router-dom";

const MobileLayout = () => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="w-full py-4 px-4">
        <Outlet />
      </div>
    </div>
  );
};

export default MobileLayout;
