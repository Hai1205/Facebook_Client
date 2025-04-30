import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { capitalizeEachWord } from "@/lib/utils";
import { REPORT } from "@/utils/interface";
import LoadingSpinner from "@/components/ui/loading";

interface ReportDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedReport: REPORT | null;
  onConfirm: (status: string) => void;
  isResponding: boolean;
}

const ReportDetailsDialog = ({
  isOpen,
  onOpenChange,
  selectedReport,
  onConfirm,
  isResponding,
}: ReportDetailsDialogProps) => {
  if (!selectedReport) return null;

  const isPending = selectedReport.status === "PENDING";

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
                  Review the report from{" "}
                  <span className="font-bold">
                    {selectedReport?.sender?.fullName || "Facebook User"}
                  </span>
                </Dialog.Description>

                <ScrollArea className="h-[calc(85vh-10rem)] overflow-auto">
                  <div className="grid gap-6 py-4 px-1">
                    <div className="flex gap-6">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={selectedReport?.sender?.avatarPhotoUrl}
                          alt={selectedReport?.sender?.fullName}
                        />
                        <AvatarFallback className="text-3xl">
                          {selectedReport?.sender?.fullName?.substring(0, 2) ||
                            "FU"}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          <Link to={`/profile/${selectedReport?.sender?.id}`}>
                            {selectedReport?.sender?.fullName ||
                              "Facebook User"}
                          </Link>
                        </h2>

                        <p className="text-muted-foreground hover:underline">
                          <Link to={`/profile/${selectedReport?.sender?.id}`}>
                            {selectedReport?.sender?.email}
                          </Link>
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">
                          Report Type
                        </h3>

                        <p className="text-sm text-white">
                          {capitalizeEachWord(selectedReport?.contentType)}
                        </p>
                      </div>

                      <div>
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
                        onClick={() => onConfirm("REJECT")}
                      >
                        {isResponding ? (
                          <>
                            <LoadingSpinner />
                            Rejecting...
                          </>
                        ) : (
                          <>
                            {/* <SendHorizontal className="h-4 w-4" /> */}
                            Reject
                          </>
                        )}
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
                        onClick={() => onConfirm("ACCEPT")}
                        className="bg-[#1877F2] hover:bg-[#166FE5] text-white"
                      >
                        {isResponding ? (
                          <>
                            <LoadingSpinner />
                            Accepting...
                          </>
                        ) : (
                          <>
                            {/* <SendHorizontal className="h-4 w-4" /> */}
                            Accept
                          </>
                        )}
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
