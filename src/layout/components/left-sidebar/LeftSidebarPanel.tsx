import { Panel, PanelResizeHandle } from "react-resizable-panels";
import { ScrollArea } from "@/components/ui/scroll-area";
import LeftSideBar from "../left-sidebar/components/LeftSidebar";

const LeftSidebarPanel = () => {
  return (
    <>
      <Panel
        defaultSize={15}
        minSize={15}
        maxSize={15}
        order={1}
        collapsible={true}
      >
        <ScrollArea className="h-full border-r border-gray-800">
          <LeftSideBar />
        </ScrollArea>
      </Panel>
      <ResizeHandle />
    </>
  );
};

const ResizeHandle = ({ className = "" }) => (
  <PanelResizeHandle
    className={`w-1.5 bg-gray-800 hover:bg-[#1877F2] active:bg-blue-600 transition-colors ${className}`}
  >
    <div className="h-full w-full cursor-ew-resize flex items-center justify-center">
      <div className="h-8 w-0.5 bg-gray-600 rounded-full" />
    </div>
  </PanelResizeHandle>
);

export default LeftSidebarPanel;
