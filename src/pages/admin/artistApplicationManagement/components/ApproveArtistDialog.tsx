import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArtistApplication } from "@/utils/types";
import { ApplicationData } from "../ArtistApplicationManagementPage";
import LoadingSpinner from "@/components/ui/loading";
import { SendHorizontal } from "lucide-react";

interface ApproveArtistDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedApplication: ArtistApplication | null;
  onConfirm: (status: string) => void;
  applicationData: ApplicationData;
  handleApplicationChange: (
    field: keyof ApplicationData,
    value: string
  ) => void;
  isResponding: boolean;
}

export default function ApproveArtistDialog({
  isOpen,
  onOpenChange,
  selectedApplication,
  onConfirm,
  applicationData,
  handleApplicationChange,
  isResponding,
}: ApproveArtistDialogProps) {
  if (!selectedApplication) {
    return null;
  }

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
                  Approve Artist Application
                </Dialog.Title>
                <Dialog.Description className="text-white">
                  Are you sure you want to approve{" "}
                  {selectedApplication?.user?.fullName}'s application?
                </Dialog.Description>

                {selectedApplication && (
                  <div className="py-4">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={selectedApplication.user?.avatarUrl}
                          alt={selectedApplication.user?.fullName}
                        />
                        <AvatarFallback>
                          {selectedApplication.user?.fullName?.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-medium text-white">
                          {selectedApplication.user?.fullName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedApplication.user?.email}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="approval-notes" className="text-white">
                          Approval Notes (Optional)
                        </Label>
                        <Textarea
                          id="approval-notes"
                          placeholder="Add any notes or special instructions for this artist"
                          rows={4}
                          value={applicationData.details}
                          onChange={(e) =>
                            handleApplicationChange("details", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between sm:justify-between p-4">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>

                  <Button
                    onClick={() => onConfirm("approve")}
                    className="bg-[#1DB954] hover:bg-[#1ed760] text-white"
                    disabled={isResponding}
                  >
                    {isResponding ? (
                      <>
                        <LoadingSpinner />
                        Approving...
                      </>
                    ) : (
                      <>
                        <SendHorizontal className="h-4 w-4" />
                        Approve
                      </>
                    )}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
