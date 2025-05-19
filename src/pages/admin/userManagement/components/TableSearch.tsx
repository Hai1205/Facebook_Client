import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TableSearchProps {
    handleSearch: (e: React.FormEvent)=>void;
    searchQuery: string;
    setSearchQuery: (searchQuery: string)=>void;
    placeholder: string;
}

export const TableSearch = ({
    handleSearch,
    searchQuery,
    setSearchQuery,
    placeholder,
}: TableSearchProps) => {
  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2">
      <div className="relative w-60">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

        <Input
          type="search"
          placeholder={`${placeholder}`}
          className="w-full pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </form>
  );
};
