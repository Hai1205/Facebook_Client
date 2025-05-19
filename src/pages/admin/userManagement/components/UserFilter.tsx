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

interface UserFilterProps {
  openMenuFilters: boolean;
  setOpenMenuFilters: (open: boolean) => void;
  activeFilters: FILTER;
  toggleFilter: (filter: string, value: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  closeMenuMenuFilters: () => void;
}

export const UserFilter = ({
  openMenuFilters,
  setOpenMenuFilters,
  activeFilters,
  toggleFilter,
  clearFilters,
  applyFilters,
  closeMenuMenuFilters,
}: UserFilterProps) => {
  return (
    <DropdownMenu open={openMenuFilters} onOpenChange={closeMenuMenuFilters}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 bg-blue-600 hover:bg-[#166FE5] text-white"
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
                checked={activeFilters?.status?.includes("ACTIVE") || false}
                onCheckedChange={() => toggleFilter("status", "ACTIVE")}
                className="mr-2"
              />

              <label htmlFor="status-active">Active</label>
            </div>

            <div className="flex items-center">
              <Checkbox
                id="status-pending"
                checked={activeFilters?.status?.includes("PENDING") || false}
                onCheckedChange={() => toggleFilter("status", "PENDING")}
                className="mr-2"
              />

              <label htmlFor="status-pending">Pending</label>
            </div>

            <div className="flex items-center">
              <Checkbox
                id="status-lock"
                checked={activeFilters?.status?.includes("LOCK") || false}
                onCheckedChange={() => toggleFilter("status", "LOCK")}
                className="mr-2"
              />

              <label htmlFor="status-lock">Lock</label>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="p-2">
          <h4 className="mb-2 text-sm font-medium">Role</h4>

          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox
                id="role-user"
                checked={activeFilters?.role?.includes("USER") || false}
                onCheckedChange={() => toggleFilter("role", "USER")}
                className="mr-2"
              />

              <label htmlFor="role-user">User</label>
            </div>

            <div className="flex items-center">
              <Checkbox
                id="role-admin"
                checked={activeFilters?.role?.includes("ADMIN") || false}
                onCheckedChange={() => toggleFilter("role", "ADMIN")}
                className="mr-2"
              />
              <label htmlFor="role-admin">Admin</label>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="p-2">
          <h4 className="mb-2 text-sm font-medium">Gender</h4>

          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox
                id="gender-male"
                checked={activeFilters?.gender?.includes("MALE") || false}
                onCheckedChange={() => toggleFilter("gender", "MALE")}
                className="mr-2"
              />

              <label htmlFor="gender-male">Male</label>
            </div>

            <div className="flex items-center">
              <Checkbox
                id="gender-female"
                checked={activeFilters?.gender?.includes("FEMALE") || false}
                onCheckedChange={() => toggleFilter("gender", "FEMALE")}
                className="mr-2"
              />

              <label htmlFor="gender-female">Female</label>
            </div>

            <div className="flex items-center">
              <Checkbox
                id="gender-other"
                checked={activeFilters?.gender?.includes("OTHER") || false}
                onCheckedChange={() => toggleFilter("gender", "OTHER")}
                className="mr-2"
              />

              <label htmlFor="gender-other">Other</label>
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
