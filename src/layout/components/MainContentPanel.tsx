import { Panel } from "react-resizable-panels";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Outlet } from "react-router-dom";

const MainContentPanel = () => {
  return (
    <Panel order={2}>
      <ScrollArea className="h-full">
        <div className="w-full py-4 px-4">
          <Outlet />
        </div>
      </ScrollArea>
    </Panel>
  );
};

export default MainContentPanel;
