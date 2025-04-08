import { useCallback, useState, useEffect } from "react";
import {
  Search,
  Filter,
} from "lucide-react";
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
import { useUserStore } from "@/stores/useUserStore";
import { ArtistApplication } from "@/utils/types";
import ApplicationDetailsDialog from "./components/ApplicationDetailsDialog";
import ApproveArtistDialog from "./components/ApproveArtistDialog";
import RejectApplicationDialog from "./components/RejectApplicationDialog";
import { ApplicationsEmptyState } from "@/layout/components/EmptyState";
import { Link, useSearchParams } from "react-router-dom";
import { TableSkeleton } from "@/layout/components/TableSkeleton";

export interface ApplicationData {
  rejectionReason: string;
  details: string;
}

export default function ArtistApplicationManagementPage() {
  const { isLoading, getArtistApplications, responseUpdateUserToArtist } =
    useUserStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const queryString = location.search;

  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<ArtistApplication | null>(null);
  const [activeFilters, setActiveFilters] = useState<{ status: string[] }>({
    status: [],
  });
  const [artistApplications, setArtistApplications] = useState<
    ArtistApplication[] | []
  >([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (queryString) {
        await getArtistApplications(queryString).then(setArtistApplications);
      } else {
        await getArtistApplications("").then(setArtistApplications);
      }
    };

    fetchUsers();
  }, [query, queryString, searchParams, getArtistApplications]);

  useEffect(() => {
    if (!isRejectDialogOpen && !isApproveDialogOpen) {
      setApplicationData({
        rejectionReason: "",
        details: "",
      });
    }
  }, [isRejectDialogOpen, isApproveDialogOpen]);

  const [applicationData, setApplicationData] = useState<ApplicationData>({
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

  const handleViewDetails = (application: (typeof artistApplications)[0]) => {
    setSelectedApplication(application);
    setIsViewDetailsOpen(true);
  };

  const handleApprove = (application: (typeof artistApplications)[0]) => {
    setSelectedApplication(application);
    setIsApproveDialogOpen(true);
  };

  const handleReject = (application: (typeof artistApplications)[0]) => {
    setSelectedApplication(application);
    setIsRejectDialogOpen(true);
  };

  const handleApplicationChange = (field: any, value: string | null) => {
    setApplicationData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const confirm = async (status: string) => {
    if (!selectedApplication) {
      return;
    }

    const formData = new FormData();
    formData.append("details", applicationData.details || "");
    formData.append("status", status);
    formData.append("rejectionReason", applicationData.rejectionReason || "");

    setIsResponding(true);
    const res = await responseUpdateUserToArtist(
      selectedApplication?.id,
      formData
    );
    setIsResponding(false);

    if (!res) {
      return;
    }

    setArtistApplications((prevApplications) => {
      return prevApplications.map((application) => {
        if (application.id === selectedApplication.id) {
          return {
            ...application,
            status: status,
            details: applicationData.details || "",
            rejectionReason:
              status === "reject" ? applicationData.rejectionReason : "",
          };
        }
        return application;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approve":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "reject":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
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
        <h2 className="text-3xl font-bold tracking-tight">
          Artist Applications
        </h2>
      </div>

      {/* View Application Details Dialog */}
      <ApplicationDetailsDialog
        isOpen={isViewDetailsOpen}
        onOpenChange={() => setIsViewDetailsOpen(false)}
        selectedApplication={selectedApplication}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Approve Application Dialog */}
      <ApproveArtistDialog
        isOpen={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
        selectedApplication={selectedApplication}
        onConfirm={confirm}
        applicationData={applicationData}
        handleApplicationChange={handleApplicationChange}
        isResponding={isResponding}
      />

      {/* Reject Application Dialog */}
      <RejectApplicationDialog
        isOpen={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        onConfirm={confirm}
        application={selectedApplication}
        applicationData={applicationData}
        handleApplicationChange={handleApplicationChange}
        isResponding={isResponding}
      />

      <div className="space-y-4">
        <Card className="bg-zinc-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Application Management</CardTitle>

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
                      className="h-8 gap-1"
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
          <ScrollArea className="h-[calc(100vh-340px)] w-full  rounded-xl">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">User</TableHead>

                    <TableHead className="text-center">Status</TableHead>

                    <TableHead className="text-center">Followers</TableHead>

                    <TableHead className="text-center">Submit Date</TableHead>

                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <TableSkeleton />
                      </TableCell>
                    </TableRow>
                  ) : artistApplications.length > 0 ? (
                    artistApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <Link to={`/profile/${application?.user?.id}`}>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage
                                  src={application?.user?.avatarUrl}
                                  alt={application?.user?.fullName}
                                />

                                <AvatarFallback>
                                  {application?.user?.fullName?.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex flex-col">
                                <span className="font-medium hover:underline">
                                  {application?.user?.fullName}
                                </span>

                                <span className="text-sm text-muted-foreground hover:underline">
                                  @{application?.user?.username}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </TableCell>

                        <TableCell className="flex items-center justify-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${getStatusColor(
                              application.status
                            )}`}
                          />
                          <span className="capitalize">
                            {application.status}
                          </span>
                        </TableCell>

                        <TableCell className="text-center">
                          {application?.user?.followers.length}
                        </TableCell>

                        <TableCell className="flex items-center justify-center gap-1">
                          {application.submitDate}
                        </TableCell>

                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(application)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <ApplicationsEmptyState />
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
