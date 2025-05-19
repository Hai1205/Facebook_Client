import { CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { POST } from "@/utils/interface";
import { TablePostSkeleton } from "./TablePostSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, Eye, MoreHorizontal, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { formatDateInDDMMYYY, formatNumberStyle } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PostsEmptyState } from "@/layout/components/EmptyState";

interface PostTableProps {
  posts: POST[];
  isLoading: boolean;
  handleViewPost: (post: POST) => void;
  handleDeletePost: (post: POST) => void;
}

export const PostTable = ({
  posts,
  isLoading,
  handleViewPost,
  handleDeletePost,
}: PostTableProps) => {
  const privacyStyles = {
    PUBLIC: "text-green-500 border-green-500",
    PRIVATE: "text-orange-500 border-orange-500",
  };

  const statusStyles = {
    ACTIVE: "text-green-500 border-green-500",
    PENDING: "text-yellow-500 border-yellow-500",
    LOCK: "text-red-500 border-red-500",
  };

  return (
    <ScrollArea className="h-[calc(100vh-220px)] w-full rounded-xl">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">User</TableHead>

              <TableHead className="text-center">Privacy</TableHead>

              <TableHead className="text-center">Status</TableHead>

              <TableHead className="text-center">Engagement</TableHead>

              <TableHead className="text-center">Upload Date</TableHead>

              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <TablePostSkeleton />
                </TableCell>
              </TableRow>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Link to={`/profile/${post?.user?.id}`}>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={post?.user?.avatarPhotoUrl}
                            alt={post?.user?.fullName}
                          />

                          <AvatarFallback className="text-white">
                            {post?.user?.fullName?.substring(0, 2) || "FU"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col">
                          <p className="text-s font-bold flex items-center">
                            <span className="font-medium hover:underline text-white">
                              {post?.user?.fullName || "Facebook User"}
                            </span>

                            {post?.user?.celebrity && (
                              <BadgeCheck className="ml-2 h-4 w-4 text-[#1877F2]" />
                            )}
                          </p>

                          <span className="text-sm text-muted-foreground hover:underline">
                            {post?.user?.email}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={privacyStyles[post.privacy]}
                    >
                      {post.privacy}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={statusStyles[post.status]}
                    >
                      {post.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <span className="mr-2 text-white">
                        👍 {formatNumberStyle(post.likes.length)}
                      </span>
                      <span className="text-white">
                        💬 {formatNumberStyle(post.comments.length)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center text-white">
                    {formatDateInDDMMYYY(post.createdAt as string)}
                  </TableCell>

                  <TableCell className="text-center text-white">
                    <div className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>

                          <DropdownMenuItem
                            onClick={() => handleViewPost(post)}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4 cursor-pointer" />
                            {" View"}
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeletePost(post)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            {" Delete"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
                  <PostsEmptyState message="No posts have been added yet. Create an post to get started." />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </ScrollArea>
  );
};
