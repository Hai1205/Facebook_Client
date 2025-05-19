import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FILTER } from "@/utils/interface";
import { Filter } from "lucide-react";

interface ReportFilterProps {
  openMenuFilters: boolean;
  setOpenMenuFilters: (open: boolean) => void;
  activeFilters: FILTER;
  toggleFilter: (value: string, type: "status" | "contentType") => void;
  clearFilters: () => void;
  applyFilters: () => void;
  closeMenuMenuFilters: () => void;
}

export const ReportFilter = ({
  openMenuFilters,
  setOpenMenuFilters,
  activeFilters,
  toggleFilter,
  clearFilters,
  applyFilters,
  closeMenuMenuFilters,
}: ReportFilterProps) => {
  return (
    <DropdownMenu open={openMenuFilters} onOpenChange={closeMenuMenuFilters}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 bg-[#1877F2] hover:bg-[#166FE5] text-white"
          onClick={() => setOpenMenuFilters(!openMenuFilters)}
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[250px]">
        <DropdownMenuLabel>Filter by</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className="p-2">
          <h4 className="mb-2 text-sm font-medium">Status</h4>

          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox
                id="status-accept"
                checked={activeFilters.status.includes("ACCEPT") || false}
                onCheckedChange={() => toggleFilter("ACCEPT", "status")}
                className="mr-2"
              />

              <label htmlFor="status-accept">Approve</label>
            </div>

            <div className="flex items-center">
              <Checkbox
                id="status-pending"
                checked={activeFilters.status.includes("PENDING") || false}
                onCheckedChange={() => toggleFilter("PENDING", "status")}
                className="mr-2"
              />

              <label htmlFor="status-pending">Pending</label>
            </div>

            <div className="flex items-center">
              <Checkbox
                id="status-reject"
                checked={activeFilters.status.includes("REJECT") || false}
                onCheckedChange={() => toggleFilter("REJECT", "status")}
                className="mr-2"
              />

              <label htmlFor="status-reject">Reject</label>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="p-2">
          <h4 className="mb-2 text-sm font-medium">Type</h4>

          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox
                id="type-post"
                checked={activeFilters.contentType?.includes("POST") || false}
                onCheckedChange={() => toggleFilter("POST", "contentType")}
                className="mr-2"
              />

              <label htmlFor="type-post">Post</label>
            </div>

            <div className="flex items-center">
              <Checkbox
                id="type-story"
                checked={activeFilters.contentType?.includes("STORY") || false}
                onCheckedChange={() => toggleFilter("STORY", "contentType")}
                className="mr-2"
              />

              <label htmlFor="type-story">Story</label>
            </div>

            <div className="flex items-center">
              <Checkbox
                id="type-comment"
                checked={
                  activeFilters.contentType?.includes("COMMENT") || false
                }
                onCheckedChange={() => toggleFilter("COMMENT", "contentType")}
                className="mr-2"
              />

              <label htmlFor="type-comment">Comment</label>
            </div>

            <div className="flex items-center">
              <Checkbox
                id="type-user"
                checked={activeFilters.contentType?.includes("USER") || false}
                onCheckedChange={() => toggleFilter("USER", "contentType")}
                className="mr-2"
              />

              <label htmlFor="type-user">User</label>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="p-2 flex justify-between">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>

          <Button
            size="sm"
            onClick={applyFilters}
            className="bg-[#1877F2] hover:bg-[#166FE5] text-white"
          >
            Apply Filters
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
