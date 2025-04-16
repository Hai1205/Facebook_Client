import { Panel, PanelResizeHandle } from "react-resizable-panels";
import { ScrollArea } from "@/components/ui/scroll-area";
import RightSidebar from "./components/RightSidebar";

const RightSidebarPanel = () => {
  return (
    <>
      <ResizeHandle />
      
      <Panel
        defaultSize={20}
        minSize={20}
        maxSize={20}
        order={3}
        collapsible={true}
      >
        <ScrollArea className="h-full border-l border-gray-800">
          <RightSidebar />
        </ScrollArea>
      </Panel>
    </>
  );
};

const ResizeHandle = ({ className = "" }) => (
  <PanelResizeHandle
    className={`w-1.5 bg-gray-800 hover:bg-blue-500 active:bg-blue-600 transition-colors ${className}`}
  >
    <div className="h-full w-full cursor-ew-resize flex items-center justify-center">
      <div className="h-8 w-0.5 bg-gray-600 rounded-full" />
    </div>
  </PanelResizeHandle>
);

export default RightSidebarPanel;
