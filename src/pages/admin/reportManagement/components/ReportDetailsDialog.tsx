import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { REPORT } from "@/utils/interface";

interface ReportDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedReport: REPORT | null;
  onApprove: (report: REPORT) => void;
  onReject: (report: REPORT) => void;
}

const ReportDetailsDialog = ({
  isOpen,
  onOpenChange,
  selectedReport,
  onApprove,
  onReject,
}: ReportDetailsDialogProps) => {
  if (!selectedReport) return null;

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "approve":
  //       return "bg-green-500";
  //     case "pending":
  //       return "bg-yellow-500";
  //     case "reject":
  //       return "bg-red-500";
  //     default:
  //       return "bg-gray-500";
  //   }
  // };

  const isPending = selectedReport.status === "pending";

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => onOpenChange(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-30"
            aria-hidden="true"
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-[#121212] p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-bold text-white">
                  Report Details
                </Dialog.Title>
                <Dialog.Description className="text-white">
                  Review the report from {selectedReport?.user?.email}
                </Dialog.Description>

                <ScrollArea className="h-[calc(85vh-10rem)] overflow-auto">
                  <div className="grid gap-6 py-4 px-1">
                    <div className="flex gap-6">
                      <Avatar className="h-32 w-32">
                        <AvatarImage
                          src={selectedReport?.user?.avatarPhotoUrl}
                          alt={selectedReport?.user?.fullName}
                        />
                        <AvatarFallback>
                          {selectedReport?.user?.fullName?.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          <Link to={`/profile/${selectedReport?.user?.id}`}>
                            {selectedReport?.user?.fullName}
                          </Link>
                        </h2>

                        <p className="text-muted-foreground hover:underline">
                          <Link to={`/profile/${selectedReport?.user?.id}`}>
                            @{selectedReport?.user?.email}
                          </Link>
                        </p>

                        <div className="flex items-center gap-4 mt-3">
                          <User className="h-4 w-4 text-muted-foreground" />

                          <span className="text-sm text-white">
                            {selectedReport?.user?.followers?.length}

                            {selectedReport?.user?.followers?.length !== 1
                              ? " followers"
                              : " follower"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-white">
                          Artist Bio
                        </h3>
                        <p className="text-sm text-white">
                          {selectedReport?.user?.bio?.bioText}
                        </p>

                        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">
                          Report Reason
                        </h3>
                        <p className="text-sm text-white">
                          {selectedReport?.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                <div className="flex justify-between sm:justify-between p-4">
                  <div>
                    {isPending && (
                      <Button
                        variant="destructive"
                        onClick={() => onReject(selectedReport)}
                      >
                        Reject
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                    >
                      Close
                    </Button>

                    {isPending && (
                      <Button
                        onClick={() => onApprove(selectedReport)}
                        className="bg-[#1DB954] hover:bg-green-600 text-white"
                      >
                        Approve
                      </Button>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ReportDetailsDialog;
