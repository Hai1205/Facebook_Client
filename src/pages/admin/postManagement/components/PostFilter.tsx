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

interface PostFilterProps {
  openMenuFilters: boolean;
  setOpenMenuFilters: (open: boolean) => void;
  activeFilters: FILTER;
  toggleFilter: (value: string, type: "status" | "privacy") => void;
  clearFilters: () => void;
  applyFilters: () => void;
  closeMenuMenuFilters: () => void;
}

export const PostFilter = ({
  openMenuFilters,
  setOpenMenuFilters,
  activeFilters,
  toggleFilter,
  clearFilters,
  applyFilters,
  closeMenuMenuFilters,
}: PostFilterProps) => {
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
                id="status-active"
                checked={activeFilters.status.includes("ACTIVE") || false}
                onCheckedChange={() => toggleFilter("ACTIVE", "status")}
                className="mr-2"
              />

              <label htmlFor="status-active">Active</label>
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
                id="status-lock"
                checked={activeFilters.status.includes("LOCK") || false}
                onCheckedChange={() => toggleFilter("LOCK", "status")}
                className="mr-2"
              />

              <label htmlFor="status-lock">Lock</label>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="p-2">
          <h4 className="mb-2 text-sm font-medium">Privacy</h4>

          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox
                id="type-post"
                checked={activeFilters.privacy?.includes("PUBLIC") || false}
                onCheckedChange={() => toggleFilter("PUBLIC", "privacy")}
                className="mr-2"
              />

              <label htmlFor="type-post">Public</label>
            </div>

            <div className="flex items-center">
              <Checkbox
                id="type-story"
                checked={activeFilters.privacy?.includes("PRIVATE") || false}
                onCheckedChange={() => toggleFilter("PRIVATE", "privacy")}
                className="mr-2"
              />

              <label htmlFor="type-story">Private</label>
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
