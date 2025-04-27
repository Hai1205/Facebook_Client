import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Pencil, Trash, Badge } from "lucide-react";
import { POST, USER } from "@/utils/interface";
import { formatDateInDDMMYYY } from "@/lib/utils";

interface ManagePostsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user?: USER | null;
  handleEditPost: (post: POST) => void;
}

const ManagePostsDialog = ({
  isOpen,
  onOpenChange,
  user,
  handleEditPost,
}: ManagePostsDialogProps) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  const mediaTypeStyles = {
    IMAGE: "text-blue-500 border-blue-500",
    VIDEO: "text-purple-500 border-purple-500",
  };
  
  const privacyStyles = {
    PUBLIC: "text-green-500 border-green-500",
    PRIVATE: "text-gray-500 border-gray-500",
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-[800px] transform overflow-hidden rounded-2xl bg-[#121212] p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  Manage Posts
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-400">
                    {user
                      ? `Manage posts for ${user.fullName}`
                      : "Manage user posts"}
                  </p>
                </div>

                {user && (
                  <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={user.avatarPhotoUrl}
                            alt={user.fullName}
                          />
                          <AvatarFallback>
                            {user.fullName.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-white">
                            {user.fullName}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {user.posts.length}{" "}
                            {user.posts.length > 1 ? "posts" : "post"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Search songs..."
                        className="pl-8 bg-[#282828] text-white border-gray-700"
                      />
                    </div>
                    <ScrollArea className="h-[400px]">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-700">
                            <TableHead className="w-[40px]">
                              Thumbnail
                            </TableHead>

                            <TableHead className="text-center">Title</TableHead>

                            <TableHead className="text-center">
                              Release Date
                            </TableHead>

                            <TableHead className="text-right text-white">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Array.isArray(user.posts) &&
                            user.posts.map((post) => {
                              if (typeof post === "string") return null;
                              return (
                                <TableRow key={post.id}>
                                  <TableCell>
                                    <div>
                                      <div className="font-medium">
                                        {post.content.substring(0, 20)}...
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        by{" "}
                                        {post.user
                                          ? post.user.fullName
                                          : "Unknown Artist"}
                                      </div>
                                    </div>
                                  </TableCell>

                                  <TableCell className="text-center">
                                    <Badge
                                      className={mediaTypeStyles[post.mediaType]}
                                    >
                                      {post.mediaType}
                                    </Badge>
                                  </TableCell>

                                  <TableCell className="text-center">
                                    <Badge
                                      className={privacyStyles[post.privacy]}
                                    >
                                      {post.privacy}
                                    </Badge>
                                  </TableCell>

                                  <TableCell className="text-center">
                                    <div className="flex items-center gap-2">
                                      <span>👍 {post.likes.length}</span>

                                      <span>💬 {post.comments.length}</span>
                                    </div>
                                  </TableCell>

                                  <TableCell className="text-center">
                                    {formatDateInDDMMYYY(
                                      post.createdAt as string
                                    )}
                                  </TableCell>

                                  <TableCell className="text-center">
                                    <div className="flex justify-center">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                          >
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">
                                              Open menu
                                            </span>
                                          </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                          <DropdownMenuLabel>
                                            Actions
                                          </DropdownMenuLabel>

                                          <DropdownMenuItem
                                            onClick={() => handleEditPost(post)}
                                            className="cursor-pointer"
                                          >
                                            <Pencil className="mr-2 h-4 w-4 cursor-pointer" />
                                            {" Edit"}
                                          </DropdownMenuItem>

                                          <DropdownMenuSeparator />

                                          <DropdownMenuItem className="text-red-600">
                                            <Trash className="mr-2 h-4 w-4" />
                                            {" Delete"}
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>
                )}
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="border-gray-700 text-white hover:bg-red-500 hover:text-white"
                  >
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ManagePostsDialog;
