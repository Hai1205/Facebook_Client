import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePostStore } from "@/stores/usePostStore";
import { COMMENT, POST, STORY, USER } from "@/utils/interface";
import { REPORT_TYPE } from "@/utils/types";
import { Flag, MoreHorizontal, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import ReportModal from "./ReportModal";

interface ExtendOptionProps {
  content: POST | COMMENT | STORY | USER;
  contentType: REPORT_TYPE;
  postId?: string;
  onReportModalChange?: (isOpen: boolean) => void;
}

const ExtendOption = ({
  content,
  contentType,
  postId,
  onReportModalChange,
}: ExtendOptionProps) => {
  const { userAuth } = useAuthStore();
  const { deletePost, deleteComment, deleteStory } = usePostStore();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const contentId = useMemo(() => {
    if (contentType === "USER") {
      return (content as USER)?.id as string;
    }
    
    return (content as POST | COMMENT | STORY)?.id as string;
  }, [content, contentType]);

  const isOwner = useMemo(() => {
    if (contentType === "USER") {
      return (content as USER)?.id as string === userAuth?.id;
    }
    
    return (content as POST | COMMENT | STORY)?.user?.id as string === userAuth?.id;
  }, [content, contentType, userAuth?.id]);

  const handleDelete = async () => {
    if (contentType === "POST") {
      await deletePost((content as POST)?.id as string);
    } else if (contentType === "COMMENT") {
      await deleteComment((content as COMMENT)?.id as string, postId as string);
    } else if (contentType === "STORY") {
      await deleteStory((content as STORY)?.id as string);
    }
  };

  const handleReport = async () => {
    setIsReportModalOpen(true);
    if (onReportModalChange) {
      onReportModalChange(true);
    }
  };

  const handleReportModalOpenChange = (isOpen: boolean) => {
    setIsReportModalOpen(isOpen);
    if (onReportModalChange) {
      onReportModalChange(isOpen);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {userAuth && (
            <Button variant="ghost">
              <MoreHorizontal className="dark:text-white h-4 w-4" />
            </Button>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="bg-zinc-700">
          {userAuth && isOwner && (
            <DropdownMenuItem
              className="text-red-500 cursor-pointer"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {contentType === "USER" ? "Delete Account" : "Delete"}
            </DropdownMenuItem>
          )}

          {userAuth && !isOwner && (
            <DropdownMenuItem className="cursor-pointer" onClick={handleReport}>
              <Flag className="mr-2 h-4 w-4" />
              Report
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ReportModal
        contentId={contentId}
        contentType={contentType}
        isOpen={isReportModalOpen}
        onOpenChange={handleReportModalOpenChange}
      />
    </>
  );
};

export default ExtendOption;
