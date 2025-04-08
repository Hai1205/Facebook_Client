import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Play, Pause, User } from "lucide-react";
import { ArtistApplication } from "@/utils/types";
import formatTime from "@/utils/service/formatTime";
import { Link } from "react-router-dom";
import { usePlayerStore } from "@/stores/usePlayerStore";

interface ApplicationDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedApplication: ArtistApplication | null;
  onApprove: (application: ArtistApplication) => void;
  onReject: (application: ArtistApplication) => void;
}

const ApplicationDetailsDialog = ({
  isOpen,
  onOpenChange,
  selectedApplication,
  onApprove,
  onReject,
}: ApplicationDetailsDialogProps) => {
  const { currentSong, playAlbum, isPlaying, togglePlay } = usePlayerStore();

  if (!selectedApplication) return null;

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

  const isPending = selectedApplication.status === "pending";

  const handlePlayPauseSong = (index: number) => {
    const isCurrentSong =
      currentSong?.id === selectedApplication.songs[index].id;
    if (isCurrentSong) {
      togglePlay();
    } else {
      playAlbum(selectedApplication.songs, index);
    }
  };

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
                  Artist Application Details
                </Dialog.Title>
                <Dialog.Description className="text-white">
                  Review the artist application from{" "}
                  {selectedApplication?.user?.username}
                </Dialog.Description>

                <ScrollArea className="h-[calc(85vh-10rem)] overflow-auto">
                  <div className="grid gap-6 py-4 px-1">
                    <div className="flex gap-6">
                      <Avatar className="h-32 w-32">
                        <AvatarImage
                          src={selectedApplication?.user?.avatarUrl}
                          alt={selectedApplication?.user?.fullName}
                        />
                        <AvatarFallback>
                          {selectedApplication?.user?.fullName?.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          <Link
                            to={`/profile/${selectedApplication?.user?.id}`}
                          >
                            {selectedApplication?.user?.fullName}
                          </Link>
                        </h2>

                        <p className="text-muted-foreground hover:underline">
                          <Link
                            to={`/profile/${selectedApplication?.user?.id}`}
                          >
                            @{selectedApplication?.user?.username}
                          </Link>
                        </p>

                        <div className="flex items-center gap-4 mt-3">
                          <User className="h-4 w-4 text-muted-foreground" />

                          <span className="text-sm text-white">
                            {selectedApplication?.user?.followers?.length}

                            {selectedApplication?.user?.followers?.length !== 1
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
                          {selectedApplication?.user?.biography}
                        </p>

                        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">
                          Achievements
                        </h3>
                        <p className="text-sm text-white">
                          {selectedApplication.achievements}
                        </p>

                        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">
                          Application Reason
                        </h3>
                        <p className="text-sm text-white">
                          {selectedApplication.reason}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-white">
                          Music Samples
                        </h3>
                        <div className="space-y-3">
                          {selectedApplication.songs.map((song, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 rounded-md border"
                            >
                              <div className="flex items-center gap-3">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-full"
                                  onClick={() => handlePlayPauseSong(index)}
                                >
                                  {currentSong?.id === song.id && isPlaying ? (
                                    <Pause className="h-4 w-4" />
                                  ) : (
                                    <Play className="h-4 w-4" />
                                  )}
                                </Button>
                                <div>
                                  <p className="font-medium text-sm text-white">
                                    <Link to={`/song-details/${song.id}`}>
                                      {song.title}
                                    </Link>
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatTime(song.duration)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">
                          Social Media
                        </h3>
                        <div className="space-y-2">
                          {Object.entries(
                            selectedApplication?.user?.website || {}
                          ).map(([platform, link]) => (
                            <div
                              key={platform}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm capitalize text-white">
                                {platform}:
                              </span>
                              <span className="text-sm font-medium text-white">
                                {link}
                              </span>
                            </div>
                          ))}
                        </div>

                        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">
                          Application Info
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white">
                              Submitted:
                            </span>
                            <span className="text-sm font-medium text-white">
                              {selectedApplication.submitDate}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white">Status:</span>
                            <Badge
                              variant="outline"
                              className={`capitalize text-white ${getStatusColor(
                                selectedApplication.status
                              )}`}
                            >
                              {selectedApplication.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                <div className="flex justify-between sm:justify-between p-4">
                  <div>
                    {isPending && (
                      <Button
                        variant="destructive"
                        onClick={() => onReject(selectedApplication)}
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
                        onClick={() => onApprove(selectedApplication)}
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

export default ApplicationDetailsDialog;
