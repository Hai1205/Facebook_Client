import { Link } from "react-router-dom";
import { MoreHorizontal, Trash, Pencil, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { USER } from "@/utils/interface";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserEmptyState } from "@/layout/components/EmptyState";
import { formatDateInDDMMYYY } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TableUserSkeleton } from "./TableUserSkeleton";

interface UserTableProps {
  users: USER[];
  isLoading: boolean;
  handleDeleteUser: (user: USER) => void;
  handleEditUser: (user: USER) => void;
  handleResetPassword: (user: USER) => void;
}

export const UserTable = ({
  users,
  isLoading,
  handleDeleteUser,
  handleEditUser,
  handleResetPassword,
}: UserTableProps) => {
  const roleStyles = {
    USER: "text-violet-500 border-violet-500",
    ADMIN: "text-blue-500 border-blue-500",
  };

  const statusStyles = {
    ACTIVE: "text-green-500 border-green-500",
    PENDING: "text-yellow-500 border-yellow-500",
    LOCK: "text-red-500 border-red-500",
  };

  const gendersStyles = {
    MALE: "text-blue-500 border-blue-500",
    FEMALE: "text-pink-500 border-pink-500",
    OTHER: "text-purple-500 border-purple-500",
  };

  return (
    <ScrollArea className="h-[calc(100vh-220px)] w-full rounded-xl">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">User</TableHead>

              <TableHead className="text-center">Gender</TableHead>

              <TableHead className="text-center">Role</TableHead>

              <TableHead className="text-center">Status</TableHead>

              <TableHead className="text-center">Join Date</TableHead>

              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <TableUserSkeleton />
                </TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Link to={`/profile/${user?.id}`}>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={user?.avatarPhotoUrl}
                            alt={user?.fullName || "USER"}
                          />

                          <AvatarFallback className="text-white">
                            {user?.fullName
                              ? user.fullName.substring(0, 2)
                              : "U"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col">
                          <p className="text-s font-bold flex items-center">
                            <span className="font-medium hover:underline text-white">
                              {user?.fullName || "Facebook User"}
                            </span>

                            {user?.celebrity && (
                              <BadgeCheck className="ml-2 h-4 w-4 text-[#1877F2]" />
                            )}
                          </p>

                          <span className="text-sm text-muted-foreground hover:underline">
                            {user?.email}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={gendersStyles[user.gender]}
                    >
                      {user.gender}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge variant="outline" className={roleStyles[user.role]}>
                      {user.role}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={statusStyles[user.status]}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center text-white">
                    {formatDateInDDMMYYY(user.createdAt as string)}
                  </TableCell>

                  <TableCell className="text-right text-white">
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
                          onClick={() => handleEditUser(user)}
                          className="cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4 cursor-pointer" />{" "}
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => handleResetPassword(user)}
                          className="cursor-pointer"
                        >
                          Reset password
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 cursor-pointer"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete user
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>
                  <UserEmptyState />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </ScrollArea>
  );
};
