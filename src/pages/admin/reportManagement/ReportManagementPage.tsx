import { useCallback, useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePostStore } from "@/stores/usePostStore";
import ReportDetailsDialog from "./components/ReportDetailsDialog";
import ApproveReportDialog from "./components/ApproveReportDialog";
import RejectReportDialog from "./components/RejectReportDialog";
import { Link, useSearchParams } from "react-router-dom";
import { REPORT } from "@/utils/interface";
import { formatDateInDDMMYYY } from "@/lib/utils";
import { ReportsEmptyState } from "@/layout/components/EmptyState";
import { TableReportSkeleton } from "./components/TableReportSkeleton";
import { mockReports } from "@/utils/fakeData";
import { Badge } from "@/components/ui/badge";
import { REPORT_STATUS } from "@/utils/types";

export interface ReportData {
  rejectionReason: string;
  details: string;
}

const contentTypeStyles = {
  POST: "text-orange-500 border-orange-500",
  STORY: "text-indigo-500 border-indigo-500",
  COMMENT: "text-fuchsia-500 border-fuchsia-500",
  USER: "text-violet-500 border-violet-500",
};

const statusStyles = {
  ACCEPT: "text-green-500 border-green-500",
  PENDING: "text-yellow-500 border-yellow-500",
  REJECT: "text-red-500 border-red-500",
};

export default function ReportManagementPage() {
  const { isLoading, searchReports } = usePostStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const queryString = location.search;

  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [selectedReport, setPost] = useState<REPORT | null>(null);
  const [activeFilters, setActiveFilters] = useState<{ status: string[] }>({
    status: [],
  });
  const [artistApplications, setReports] = useState<REPORT[] | []>(mockReports);

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

  useEffect(() => {
    if (!isRejectDialogOpen && !isApproveDialogOpen) {
      setReportData({
        rejectionReason: "",
        details: "",
      });
    }
  }, [isRejectDialogOpen, isApproveDialogOpen]);

  const [reportData, setReportData] = useState<ReportData>({
    rejectionReason: "",
    details: "",
  });

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

  const handleViewDetails = (report: (typeof artistApplications)[0]) => {
    setPost(report);
    setIsViewDetailsOpen(true);
  };

  const handleApprove = (report: (typeof artistApplications)[0]) => {
    setPost(report);
    setIsApproveDialogOpen(true);
  };

  const handleReject = (report: (typeof artistApplications)[0]) => {
    setPost(report);
    setIsRejectDialogOpen(true);
  };

  const handleReportChange = (field: any, value: string | null) => {
    setReportData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const confirm = async (status: string) => {
    if (!selectedReport) {
      return;
    }

    const formData = new FormData();
    formData.append("details", reportData.details || "");
    formData.append("status", status);
    formData.append("rejectionReason", reportData.rejectionReason || "");

    setIsResponding(true);
    // const res = await responseUpdateUserToArtist(selectedReport?.id, formData);
    setIsResponding(false);

    // if (!res) {
    //   return;
    // }

    setReports((reports) => {
      return reports.map((report) => {
        if (report.id === selectedReport.id) {
          return {
            ...report,
            status: status as REPORT_STATUS,
            details: reportData.details || "",
            rejectionReason:
              status === "reject" ? reportData.rejectionReason : "",
          };
        }
        return report;
      });
    });

    if (status === "reject") {
      setIsRejectDialogOpen(false);
    } else {
      setIsApproveDialogOpen(false);
    }
  };

  const toggleFilter = (value: string) => {
    setActiveFilters((prev) => {
      const updated = { ...prev };
      if (updated.status.includes(value)) {
        updated.status = updated.status.filter((item) => item !== value);
      } else {
        updated.status = [...updated.status, value];
      }
      return updated;
    });
  };

  const clearFilters = () => {
    setActiveFilters({ status: [] });
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

    setSearchParams(params);
    closeMenuMenuFilters();
  };

  const [openMenuFilters, setOpenMenuFilters] = useState(false);
  const closeMenuMenuFilters = () => setOpenMenuFilters(false);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status) {
      setActiveFilters({ status: status.split(",") });
    }
  }, [searchParams]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Report Management</h2>
      </div>

      {/* View Application Details Dialog */}
      <ReportDetailsDialog
        isOpen={isViewDetailsOpen}
        onOpenChange={() => setIsViewDetailsOpen(false)}
        selectedReport={selectedReport}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Approve Application Dialog */}
      <ApproveReportDialog
        isOpen={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
        selectedReport={selectedReport}
        onConfirm={confirm}
        reportData={reportData}
        handleReportChange={handleReportChange}
        isResponding={isResponding}
      />

      {/* Reject Application Dialog */}
      <RejectReportDialog
        isOpen={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        onConfirm={confirm}
        report={selectedReport}
        reportData={reportData}
        handleReportChange={handleReportChange}
        isResponding={isResponding}
      />

      <div className="space-y-4">
        <Card className="bg-zinc-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle />

              <div className="flex items-center gap-2">
                <form
                  onSubmit={handleSearch}
                  className="flex items-center gap-2"
                >
                  <div className="relative w-60">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

                    <Input
                      type="search"
                      placeholder="Search users..."
                      className="w-full pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>

                <DropdownMenu
                  open={openMenuFilters}
                  onOpenChange={closeMenuMenuFilters}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => setOpenMenuFilters((prev) => !prev)}
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
                            id="status-approve"
                            checked={activeFilters.status.includes("approve")}
                            onCheckedChange={() => toggleFilter("approve")}
                            className="mr-2"
                          />

                          <label htmlFor="status-approve">Approve</label>
                        </div>

                        <div className="flex items-center">
                          <Checkbox
                            id="status-pending"
                            checked={activeFilters.status.includes("pending")}
                            onCheckedChange={() => toggleFilter("pending")}
                            className="mr-2"
                          />

                          <label htmlFor="status-pending">Pending</label>
                        </div>

                        <div className="flex items-center">
                          <Checkbox
                            id="status-reject"
                            checked={activeFilters.status.includes("reject")}
                            onCheckedChange={() => toggleFilter("reject")}
                            className="mr-2"
                          />

                          <label htmlFor="status-reject">Reject</label>
                        </div>
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    <div className="p-2 flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                      >
                        Clear Filters
                      </Button>

                      <Button size="sm" onClick={applyFilters}>
                        Apply Filters
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          <ScrollArea className="h-[calc(100vh-220px)] w-full  rounded-xl">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">User</TableHead>

                    <TableHead className="text-center">Type</TableHead>

                    <TableHead className="text-center">Status</TableHead>

                    <TableHead className="text-center">Submit Date</TableHead>

                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <TableReportSkeleton />
                      </TableCell>
                    </TableRow>
                  ) : artistApplications.length > 0 ? (
                    artistApplications.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <Link to={`/profile/${report?.sender?.id}`}>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage
                                  src={report?.sender?.avatarPhotoUrl}
                                  alt={report?.sender?.fullName}
                                />

                                <AvatarFallback className="text-white">
                                  {report?.sender?.fullName?.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex flex-col">
                                <span className="font-medium hover:underline text-white">
                                  {report?.sender?.fullName}
                                </span>

                                <span className="text-sm text-muted-foreground hover:underline">
                                  {report?.sender?.email}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </TableCell>

                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={contentTypeStyles[report.contentType]}
                          >
                            {report.contentType}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={statusStyles[report.status]}
                          >
                            {report.status}
                          </Badge>
                        </TableCell>

                        <TableCell className="flex items-center justify-center gap-1 text-white">
                          {formatDateInDDMMYYY(report.createdAt as string)}
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(report)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <ReportsEmptyState />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
