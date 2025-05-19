import { useCallback, useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { usePostStore } from "@/stores/usePostStore";
import ReportDetailsDialog from "./components/ReportDetailsDialog";
import { useSearchParams } from "react-router-dom";
import { FILTER, REPORT } from "@/utils/interface";
import { ReportTable } from "./components/ReportTable";
import { ReportFilter } from "./components/ReportFilter";
import { REPORT_STATUS } from "@/utils/types";
import { TableSearch } from "../userManagement/components/TableSearch";

const initialFilters: FILTER = { status: [], contentType: [] };

export default function ReportManagementPage() {
  const { isLoading, searchReports, resolveReport } = usePostStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const queryString = location.search;

  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedReport, setPost] = useState<REPORT | null>(null);

  const [activeFilters, setActiveFilters] = useState<FILTER>(initialFilters);
  const [reports, setReports] = useState<REPORT[] | []>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (queryString) {
        await searchReports(queryString).then(setReports);
      } else {
        await searchReports("").then(setReports);
      }
    };

    fetchUsers();
  }, [query, queryString, searchParams, searchReports]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams();

      if (searchQuery.trim()) {
        params.set("status", searchQuery.trim());
      }

      setSearchParams(params);
    },
    [searchQuery, setSearchParams]
  );

  const handleViewDetails = (report: (typeof reports)[0]) => {
    setPost(report);
    setIsViewDetailsOpen(true);
  };

  const toggleFilter = (value: string, type: "status" | "contentType") => {
    setActiveFilters((prev) => {
      const updated = { ...prev };
      if (updated[type]?.includes(value)) {
        updated[type] = updated[type].filter((item) => item !== value);
      } else {
        updated[type] = [...(updated[type] || []), value];
      }
      return updated;
    });
  };

  const clearFilters = () => {
    setActiveFilters(initialFilters);
    setSearchQuery("");
    setSearchParams({});
    closeMenuMenuFilters();
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);

    if (activeFilters.status.length > 0) {
      params.set("status", activeFilters.status.join(","));
    } else {
      params.delete("status");
    }

    if (activeFilters.contentType && activeFilters.contentType.length > 0) {
      params.set("contentType", activeFilters.contentType.join(","));
    } else {
      params.delete("contentType");
    }

    setSearchParams(params);
    closeMenuMenuFilters();
  };

  const [openMenuFilters, setOpenMenuFilters] = useState(false);
  const closeMenuMenuFilters = () => setOpenMenuFilters(false);

  useEffect(() => {
    const status = searchParams.get("status");
    const contentType = searchParams.get("contentType");

    const newFilters = { ...initialFilters };

    if (status) {
      newFilters.status = status.split(",");
    }

    if (contentType) {
      newFilters.contentType = contentType.split(",");
    }

    setActiveFilters(newFilters);
  }, [searchParams]);

  const [isResponding, setIsResponding] = useState(false);
  const handleConfirm = async (status: string) => {
    if (!selectedReport) {
      return;
    }

    const formData = new FormData();
    formData.append("status", status);

    setIsResponding(true);
    const res = await resolveReport(selectedReport?.id as string, formData);
    setIsResponding(false);

    if (!res) {
      return;
    }

    setIsViewDetailsOpen(false);

    setReports((reports) => {
      return reports.map((report) => {
        if (report.id === selectedReport.id) {
          return {
            ...report,
            status: status as REPORT_STATUS,
          };
        }
        return report;
      });
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Report Management</h2>
      </div>

      <ReportDetailsDialog
        isOpen={isViewDetailsOpen}
        onOpenChange={() => setIsViewDetailsOpen(false)}
        selectedReport={selectedReport}
        onConfirm={handleConfirm}
        isResponding={isResponding}
      />

      <div className="space-y-4">
        <Card className="bg-zinc-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle />

              <div className="flex items-center gap-2">
                <TableSearch
                  handleSearch={handleSearch}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  placeholder="Search reports..."
                />

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 bg-blue-600 hover:bg-[#166FE5] text-white"
                  onClick={clearFilters}
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>

                <ReportFilter
                  openMenuFilters={openMenuFilters}
                  setOpenMenuFilters={setOpenMenuFilters}
                  activeFilters={activeFilters}
                  toggleFilter={toggleFilter}
                  clearFilters={clearFilters}
                  applyFilters={applyFilters}
                  closeMenuMenuFilters={closeMenuMenuFilters}
                />
              </div>
            </div>
          </CardHeader>

          <ReportTable
            reports={reports}
            isLoading={isLoading}
            handleViewDetails={handleViewDetails}
          />
        </Card>
      </div>
    </div>
  );
}
