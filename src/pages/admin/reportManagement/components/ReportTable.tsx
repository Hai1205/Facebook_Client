import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { REPORT } from "@/utils/interface";
import { formatDateInDDMMYYY } from "@/lib/utils";
import { ReportsEmptyState } from "@/layout/components/EmptyState";
import { TableReportSkeleton } from "./TableReportSkeleton";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { BadgeCheck } from "lucide-react";

interface ReportTableProps {
    reports: REPORT[];
    isLoading: boolean;
    handleViewDetails: (report: REPORT) => void;
}

export const ReportTable = ({
    reports,
    isLoading,
    handleViewDetails,
}: ReportTableProps) => {
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

    return (          <ScrollArea className="h-[calc(100vh-220px)] w-full  rounded-xl">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Sender</TableHead>

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
              ) : reports.length > 0 ? (
                reports.map((report) => (
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
                              {report?.sender?.fullName?.substring(0, 2) ||
                                "FU"}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex flex-col">
                            <p className="text-s font-bold flex items-center">
                              <span className="font-medium hover:underline text-white">
                                {report?.sender?.fullName ||
                                  "Facebook User"}
                              </span>

                              {report?.sender?.celebrity && (
                                <BadgeCheck className="ml-2 h-4 w-4 text-[#1877F2]" />
                              )}
                            </p>

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
                        className="bg-blue-600 hover:bg-[#166FE5] text-white"
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
      </ScrollArea>)
}

